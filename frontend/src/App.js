import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CheckCircle2,
  Phone,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Search,
  Globe,
  PhoneOff,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATUS_OPTIONS = [
  "Interest",
  "Not Interest",
  "Will Call Back",
  "1st Call No Respond",
  "2nd Call No Respond",
  "3rd Call No Respond",
  "Switchoff",
];

const getStatusClass = (status) => {
  switch (status) {
    case "Interest":
      return "bg-green-500 text-black";
    case "Not Interest":
      return "bg-red-500 text-black";
    case "Will Call Back":
      return "bg-yellow-400 text-black";
    case "1st Call No Respond":
      return "bg-zinc-600 text-white";
    case "2nd Call No Respond":
      return "bg-zinc-700 text-white";
    case "3rd Call No Respond":
      return "bg-zinc-800 text-zinc-400";
    case "Switchoff":
      return "bg-zinc-900 text-zinc-500 border border-zinc-700";
    default:
      return "bg-zinc-700 text-white";
  }
};

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div
    data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
    className="stat-card bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-2"
  >
    <div className="flex items-center justify-between">
      <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
    <span className="text-4xl font-bold font-mono">{value}</span>
  </div>
);

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    interest: 0,
    not_interest: 0,
    will_call_back: 0,
    no_respond: 0,
    switchoff: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [formData, setFormData] = useState({
    business_name: "",
    has_website: false,
    mobile_number: "",
    status: "1st Call No Respond",
  });
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/leads/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchLeads(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchLeads, fetchStats]);

  const handleCreateLead = async () => {
    if (!formData.business_name || !formData.mobile_number) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await axios.post(`${API}/leads`, formData);
      toast.success("Lead created successfully");
      setIsAddDialogOpen(false);
      resetForm();
      await Promise.all([fetchLeads(), fetchStats()]);
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead");
    }
  };

  const handleUpdateLead = async () => {
    if (!currentLead) return;
    try {
      await axios.put(`${API}/leads/${currentLead.id}`, formData);
      toast.success("Lead updated successfully");
      setIsEditDialogOpen(false);
      setCurrentLead(null);
      resetForm();
      await Promise.all([fetchLeads(), fetchStats()]);
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const handleDeleteLead = async () => {
    if (!currentLead) return;
    try {
      await axios.delete(`${API}/leads/${currentLead.id}`);
      toast.success("Lead deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentLead(null);
      await Promise.all([fetchLeads(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(`${API}/leads/${leadId}`, { status: newStatus });
      toast.success("Status updated");
      await Promise.all([fetchLeads(), fetchStats()]);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleWebsiteToggle = async (leadId, hasWebsite) => {
    try {
      await axios.put(`${API}/leads/${leadId}`, { has_website: hasWebsite });
      toast.success("Website status updated");
      await fetchLeads();
    } catch (error) {
      console.error("Error updating website status:", error);
      toast.error("Failed to update website status");
    }
  };

  const resetForm = () => {
    setFormData({
      business_name: "",
      has_website: false,
      mobile_number: "",
      status: "1st Call No Respond",
    });
  };

  const openEditDialog = (lead) => {
    setCurrentLead(lead);
    setFormData({
      business_name: lead.business_name,
      has_website: lead.has_website,
      mobile_number: lead.mobile_number,
      status: lead.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (lead) => {
    setCurrentLead(lead);
    setIsDeleteDialogOpen(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile_number.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-zinc-950" data-testid="app-container">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://customer-assets.emergentagent.com/job_6da2ad34-9c61-4bc8-b958-ad69f62b139d/artifacts/njufdp1h_ChatGPT%20Image%20Dec%209%2C%202025%2C%2001_17_24%20PM.png"
              alt="AmruthAI Logo"
              className="w-10 h-10 object-contain"
              data-testid="logo"
            />
            <h1 className="text-2xl font-bold text-yellow-400">AmruthAI</h1>
          </div>
          <span className="text-zinc-500 text-sm">Business Leads CRM</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6">
        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            label="Total Leads"
            value={stats.total}
            icon={Users}
            colorClass="text-white"
          />
          <StatCard
            label="Interested"
            value={stats.interest}
            icon={CheckCircle2}
            colorClass="text-green-500"
          />
          <StatCard
            label="Not Interested"
            value={stats.not_interest}
            icon={XCircle}
            colorClass="text-red-500"
          />
          <StatCard
            label="Callbacks"
            value={stats.will_call_back}
            icon={Phone}
            colorClass="text-yellow-400"
          />
          <StatCard
            label="No Response"
            value={stats.no_respond}
            icon={Phone}
            colorClass="text-zinc-500"
          />
          <StatCard
            label="Switched Off"
            value={stats.switchoff}
            icon={PhoneOff}
            colorClass="text-zinc-600"
          />
        </section>

        {/* Controls Section */}
        <section className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                data-testid="search-input"
                type="text"
                placeholder="Search business or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 w-full sm:w-72"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                data-testid="status-filter"
                className="w-full sm:w-48 bg-zinc-900 border-zinc-800 text-white"
              >
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-white hover:bg-zinc-800">
                  All Statuses
                </SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="text-white hover:bg-zinc-800"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add Lead Button */}
          <Button
            data-testid="add-lead-btn"
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </section>

        {/* Table Section */}
        <section className="border border-zinc-800 bg-zinc-900 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-zinc-500">Loading...</div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Users className="w-12 h-12 text-zinc-700" />
              <p className="text-zinc-500">No leads found</p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
                className="bg-yellow-400 text-black hover:bg-yellow-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first lead
              </Button>
            </div>
          ) : (
            <Table className="leads-table" data-testid="leads-table">
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-16 text-center">
                    S.No
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider min-w-[200px]">
                    Business Name
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-24 text-center">
                    Website
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-40">
                    Mobile Number
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-48">
                    Status
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-24 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow
                    key={lead.id}
                    data-testid={`lead-row-${lead.id}`}
                    className="border-zinc-800"
                  >
                    <TableCell className="font-mono text-zinc-500 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      {lead.business_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          data-testid={`website-switch-${lead.id}`}
                          checked={lead.has_website}
                          onCheckedChange={(checked) =>
                            handleWebsiteToggle(lead.id, checked)
                          }
                          className="data-[state=checked]:bg-yellow-400"
                        />
                        {lead.has_website ? (
                          <Globe className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Globe className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-zinc-300">
                      {lead.mobile_number}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) =>
                          handleStatusChange(lead.id, value)
                        }
                      >
                        <SelectTrigger
                          data-testid={`status-select-${lead.id}`}
                          className={`w-full border-0 ${getStatusClass(
                            lead.status
                          )} font-medium text-xs`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="text-white hover:bg-zinc-800"
                            >
                              <span
                                className={`inline-block px-2 py-0.5 text-xs ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          data-testid={`edit-btn-${lead.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(lead)}
                          className="text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          data-testid={`delete-btn-${lead.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(lead)}
                          className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        {/* Lead Count */}
        <div className="mt-4 text-zinc-500 text-sm">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </main>

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent
          data-testid="add-lead-dialog"
          className="bg-zinc-900 border-zinc-800 text-white"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-400">
              Add New Lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Business Name *
              </label>
              <Input
                data-testid="input-business-name"
                value={formData.business_name}
                onChange={(e) =>
                  setFormData({ ...formData, business_name: e.target.value })
                }
                placeholder="Enter business name"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Mobile Number *
              </label>
              <Input
                data-testid="input-mobile-number"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                placeholder="+91 XXXXX XXXXX"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Has Website?</label>
              <Switch
                data-testid="input-has-website"
                checked={formData.has_website}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, has_website: checked })
                }
                className="data-[state=checked]:bg-yellow-400"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger
                  data-testid="input-status"
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-white hover:bg-zinc-800"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              data-testid="submit-add-lead"
              onClick={handleCreateLead}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
            >
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          data-testid="edit-lead-dialog"
          className="bg-zinc-900 border-zinc-800 text-white"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-400">
              Edit Lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Business Name *
              </label>
              <Input
                data-testid="edit-business-name"
                value={formData.business_name}
                onChange={(e) =>
                  setFormData({ ...formData, business_name: e.target.value })
                }
                placeholder="Enter business name"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Mobile Number *
              </label>
              <Input
                data-testid="edit-mobile-number"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                placeholder="+91 XXXXX XXXXX"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Has Website?</label>
              <Switch
                data-testid="edit-has-website"
                checked={formData.has_website}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, has_website: checked })
                }
                className="data-[state=checked]:bg-yellow-400"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger
                  data-testid="edit-status"
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-white hover:bg-zinc-800"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              data-testid="submit-edit-lead"
              onClick={handleUpdateLead}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          data-testid="delete-lead-dialog"
          className="bg-zinc-900 border-zinc-800 text-white"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">
              Delete Lead
            </DialogTitle>
          </DialogHeader>
          <p className="text-zinc-300 py-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {currentLead?.business_name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              data-testid="confirm-delete-lead"
              onClick={handleDeleteLead}
              className="bg-red-500 text-white hover:bg-red-600 font-semibold"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
