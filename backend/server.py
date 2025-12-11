from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Status Enum
class LeadStatus(str, Enum):
    UPDATE_STATUS = "Update Status"
    INTEREST = "Interest"
    NOT_INTEREST = "Not Interest"
    WILL_CALL_BACK = "Will Call Back"
    FIRST_CALL_NO_RESPOND = "1st Call No Respond"
    SECOND_CALL_NO_RESPOND = "2nd Call No Respond"
    THIRD_CALL_NO_RESPOND = "3rd Call No Respond"
    SWITCHOFF = "Switchoff"
    COMPLETED = "Completed"

# Category Enum
class BusinessCategory(str, Enum):
    SUPERMARKET = "Supermarket"
    CLINIC = "Clinic"
    BAKERY = "Bakery"
    PET_SHOP = "Pet Shop"
    RESTAURANT = "Restaurant"
    CAFE = "Cafe"
    PHARMACY = "Pharmacy"
    SALON = "Salon"
    GYM = "Gym"
    HOTEL = "Hotel"
    REAL_ESTATE = "Real Estate"
    AUTOMOBILE = "Automobile"
    ELECTRONICS = "Electronics"
    CLOTHING = "Clothing"
    JEWELRY = "Jewelry"
    FURNITURE = "Furniture"
    HARDWARE = "Hardware"
    STATIONERY = "Stationery"
    TRAVEL = "Travel Agency"
    EDUCATION = "Education"
    HOSPITAL = "Hospital"
    DENTAL = "Dental Clinic"
    OPTICAL = "Optical"
    LAUNDRY = "Laundry"
    PRINTING = "Printing"
    CATERING = "Catering"
    EVENT = "Event Management"
    PHOTOGRAPHY = "Photography"
    INTERIOR = "Interior Design"
    CONSTRUCTION = "Construction"

# Define Models
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    category: Optional[str] = None
    location: Optional[str] = None
    has_website: bool = False
    mobile_number: str
    status: LeadStatus = LeadStatus.UPDATE_STATUS
    comment: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class LeadCreate(BaseModel):
    business_name: str = Field(..., min_length=1, description="Business name is required")
    category: Optional[str] = None
    location: Optional[str] = None
    has_website: bool = False
    mobile_number: str = Field(..., min_length=1, description="Mobile number is required")
    status: LeadStatus = LeadStatus.UPDATE_STATUS
    comment: Optional[str] = None

class LeadUpdate(BaseModel):
    business_name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    has_website: Optional[bool] = None
    mobile_number: Optional[str] = None
    status: Optional[LeadStatus] = None
    comment: Optional[str] = None

class LeadStats(BaseModel):
    total: int
    interest: int
    not_interest: int
    will_call_back: int
    no_respond: int
    switchoff: int

# Routes
@api_router.get("/")
async def root():
    return {"message": "AmruthAI CRM API"}

# Get all leads
@api_router.get("/leads", response_model=List[Lead])
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    return leads

# Get lead stats
@api_router.get("/leads/stats", response_model=LeadStats)
async def get_lead_stats():
    total = await db.leads.count_documents({})
    interest = await db.leads.count_documents({"status": LeadStatus.INTEREST.value})
    not_interest = await db.leads.count_documents({"status": LeadStatus.NOT_INTEREST.value})
    will_call_back = await db.leads.count_documents({"status": LeadStatus.WILL_CALL_BACK.value})
    
    no_respond = await db.leads.count_documents({
        "status": {"$in": [
            LeadStatus.FIRST_CALL_NO_RESPOND.value,
            LeadStatus.SECOND_CALL_NO_RESPOND.value,
            LeadStatus.THIRD_CALL_NO_RESPOND.value
        ]}
    })
    
    switchoff = await db.leads.count_documents({"status": LeadStatus.SWITCHOFF.value})
    
    return LeadStats(
        total=total,
        interest=interest,
        not_interest=not_interest,
        will_call_back=will_call_back,
        no_respond=no_respond,
        switchoff=switchoff
    )

# Create a new lead
@api_router.post("/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate):
    lead = Lead(**lead_data.model_dump())
    doc = lead.model_dump()
    await db.leads.insert_one(doc)
    return lead

# Update a lead
@api_router.put("/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, lead_update: LeadUpdate):
    update_data = {k: v for k, v in lead_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.leads.update_one(
        {"id": lead_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    updated_lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return Lead(**updated_lead)

# Delete a lead
@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"id": lead_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Lead deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
