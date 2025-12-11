import requests
import sys
import json
from datetime import datetime

class AmruthAICRMTester:
    def __init__(self, base_url="https://client-manager-177.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_lead_id = None

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    self.log_test(name, True)
                    return True, response_data
                except:
                    self.log_test(name, True, "No JSON response")
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_details = response.json()
                    error_msg += f" - {error_details}"
                except:
                    error_msg += f" - {response.text[:100]}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            error_msg = f"Request failed: {str(e)}"
            self.log_test(name, False, error_msg)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_leads_empty(self):
        """Test getting leads when database might be empty"""
        success, response = self.run_test("Get Leads (Initial)", "GET", "leads", 200)
        if success:
            print(f"   Found {len(response)} existing leads")
        return success

    def test_get_stats_initial(self):
        """Test getting stats"""
        success, response = self.run_test("Get Stats (Initial)", "GET", "leads/stats", 200)
        if success:
            expected_fields = ['total', 'interest', 'not_interest', 'will_call_back', 'no_respond', 'switchoff']
            missing_fields = [field for field in expected_fields if field not in response]
            if missing_fields:
                self.log_test("Stats Fields Validation", False, f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_test("Stats Fields Validation", True)
        return success

    def test_create_lead(self):
        """Test creating a new lead"""
        test_lead = {
            "business_name": f"Test Business {datetime.now().strftime('%H%M%S')}",
            "has_website": True,
            "mobile_number": "+91 9876543210",
            "status": "Interest"
        }
        
        success, response = self.run_test("Create Lead", "POST", "leads", 200, test_lead)
        if success and 'id' in response:
            self.created_lead_id = response['id']
            print(f"   Created lead with ID: {self.created_lead_id}")
            
            # Validate response fields
            required_fields = ['id', 'business_name', 'has_website', 'mobile_number', 'status', 'created_at']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                self.log_test("Create Lead Response Validation", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Create Lead Response Validation", True)
        
        return success

    def test_get_leads_after_create(self):
        """Test getting leads after creating one"""
        success, response = self.run_test("Get Leads (After Create)", "GET", "leads", 200)
        if success and self.created_lead_id:
            # Check if our created lead is in the list
            lead_found = any(lead['id'] == self.created_lead_id for lead in response)
            if lead_found:
                self.log_test("Created Lead in List", True)
            else:
                self.log_test("Created Lead in List", False, "Created lead not found in leads list")
        return success

    def test_update_lead(self):
        """Test updating the created lead"""
        if not self.created_lead_id:
            self.log_test("Update Lead", False, "No lead ID available for update")
            return False
        
        update_data = {
            "business_name": "Updated Test Business",
            "status": "Will Call Back"
        }
        
        success, response = self.run_test(
            "Update Lead", 
            "PUT", 
            f"leads/{self.created_lead_id}", 
            200, 
            update_data
        )
        
        if success:
            # Verify the update worked
            if response.get('business_name') == update_data['business_name'] and \
               response.get('status') == update_data['status']:
                self.log_test("Update Lead Validation", True)
            else:
                self.log_test("Update Lead Validation", False, "Updated fields don't match")
        
        return success

    def test_get_stats_after_operations(self):
        """Test getting stats after CRUD operations"""
        success, response = self.run_test("Get Stats (After Operations)", "GET", "leads/stats", 200)
        if success:
            print(f"   Stats: Total={response.get('total')}, Interest={response.get('interest')}")
        return success

    def test_delete_lead(self):
        """Test deleting the created lead"""
        if not self.created_lead_id:
            self.log_test("Delete Lead", False, "No lead ID available for deletion")
            return False
        
        success, response = self.run_test(
            "Delete Lead", 
            "DELETE", 
            f"leads/{self.created_lead_id}", 
            200
        )
        
        return success

    def test_get_nonexistent_lead(self):
        """Test getting a non-existent lead"""
        fake_id = "non-existent-id-12345"
        success, response = self.run_test(
            "Get Non-existent Lead", 
            "PUT", 
            f"leads/{fake_id}", 
            404,
            {"status": "Interest"}
        )
        return success

    def test_invalid_create_lead(self):
        """Test creating lead with invalid data"""
        invalid_lead = {
            "business_name": "",  # Empty name
            "mobile_number": ""   # Empty mobile
        }
        
        # This should fail validation
        success, response = self.run_test(
            "Create Invalid Lead", 
            "POST", 
            "leads", 
            422,  # Validation error
            invalid_lead
        )
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting AmruthAI CRM Backend API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            self.test_api_root,
            self.test_get_leads_empty,
            self.test_get_stats_initial,
            self.test_create_lead,
            self.test_get_leads_after_create,
            self.test_update_lead,
            self.test_get_stats_after_operations,
            self.test_delete_lead,
            self.test_get_nonexistent_lead,
            self.test_invalid_create_lead
        ]
        
        for test_func in tests:
            try:
                test_func()
            except Exception as e:
                self.log_test(test_func.__name__, False, f"Test execution error: {str(e)}")
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Print failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = AmruthAICRMTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())