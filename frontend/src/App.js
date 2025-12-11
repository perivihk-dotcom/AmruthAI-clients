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
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATUS_OPTIONS = [
  "Update Status",
  "Interest",
  "Not Interest",
  "Will Call Back",
  "1st Call No Respond",
  "2nd Call No Respond",
  "3rd Call No Respond",
  "Switchoff",
  "Completed",
];

const CATEGORY_OPTIONS = [
  "Supermarket",
  "Clinic",
  "Bakery",
  "Pet Shop",
  "Restaurant",
  "Cafe",
  "Pharmacy",
  "Salon",
  "Gym",
  "Hotel",
  "Real Estate",
  "Automobile",
  "Electronics",
  "Clothing",
  "Jewelry",
  "Furniture",
  "Hardware",
  "Stationery",
  "Travel Agency",
  "Education",
  "Hospital",
  "Dental Clinic",
  "Optical",
  "Laundry",
  "Printing",
  "Catering",
  "Event Management",
  "Photography",
  "Interior Design",
  "Construction",
];

const getStatusClass = (status) => {
  switch (status) {
    case "Update Status":
      return "bg-blue-600 text-white";
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
    case "Completed":
      return "bg-purple-600 text-white";
    default:
      return "bg-zinc-700 text-white";
  }
};

const getRowBgClass = (status) => {
  switch (status) {
    case "Update Status":
      return "bg-blue-900/70 border-l-4 border-l-blue-500";
    case "Interest":
      return "bg-green-900/70 border-l-4 border-l-green-400";
    case "Not Interest":
      return "bg-red-900/70 border-l-4 border-l-red-400";
    case "Will Call Back":
      return "bg-yellow-900/70 border-l-4 border-l-yellow-400";
    case "1st Call No Respond":
      return "bg-zinc-700/70 border-l-4 border-l-zinc-500";
    case "2nd Call No Respond":
      return "bg-zinc-700/80 border-l-4 border-l-zinc-500";
    case "3rd Call No Respond":
      return "bg-zinc-800/90 border-l-4 border-l-zinc-600";
    case "Switchoff":
      return "bg-zinc-900 border-l-4 border-l-zinc-700";
    case "Completed":
      return "bg-purple-900/70 border-l-4 border-l-purple-500";
    default:
      return "bg-zinc-800/70";
  }
};

const getCardBgClass = (status) => {
  switch (status) {
    case "Update Status":
      return "bg-blue-950/60 border-blue-600";
    case "Interest":
      return "bg-green-950/60 border-green-500";
    case "Not Interest":
      return "bg-red-950/60 border-red-500";
    case "Will Call Back":
      return "bg-yellow-950/60 border-yellow-400";
    case "1st Call No Respond":
      return "bg-zinc-800/60 border-zinc-600";
    case "2nd Call No Respond":
      return "bg-zinc-800/70 border-zinc-700";
    case "3rd Call No Respond":
      return "bg-zinc-800/80 border-zinc-800";
    case "Switchoff":
      return "bg-zinc-900/90 border-zinc-700";
    case "Completed":
      return "bg-purple-950/60 border-purple-500";
    default:
      return "bg-zinc-800/50 border-zinc-700";
  }
};

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div
    data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
    className="stat-card bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-2 rounded-xl"
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [websiteFilter, setWebsiteFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    location: "",
    has_website: false,
    mobile_number: "",
    status: "Update Status",
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 15;

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

  // Format mobile number: remove leading 0, keep only digits, validate 10 digits
  const formatMobileNumber = (value) => {
    let digits = value.replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    return digits.slice(0, 10);
  };

  // Check if mobile number already exists
  const isDuplicateMobile = (mobile, excludeId = null) => {
    return leads.some(
      (lead) => lead.mobile_number === mobile && lead.id !== excludeId
    );
  };

  const handleCreateLead = async () => {
    if (!formData.business_name || !formData.mobile_number) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.mobile_number.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    if (isDuplicateMobile(formData.mobile_number)) {
      toast.error("This mobile number already exists");
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
    if (!formData.business_name || !formData.mobile_number) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.mobile_number.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    if (isDuplicateMobile(formData.mobile_number, currentLead.id)) {
      toast.error("This mobile number already exists");
      return;
    }
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
      category: "",
      location: "",
      has_website: false,
      mobile_number: "",
      status: "Update Status",
      comment: "",
    });
  };

  const openEditDialog = (lead) => {
    setCurrentLead(lead);
    setFormData({
      business_name: lead.business_name,
      category: lead.category || "",
      location: lead.location || "",
      has_website: lead.has_website,
      mobile_number: lead.mobile_number,
      status: lead.status,
      comment: lead.comment || "",
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
    const matchesCategory =
      categoryFilter === "all" || lead.category === categoryFilter;
    const matchesWebsite =
      websiteFilter === "all" ||
      (websiteFilter === "yes" && lead.has_website) ||
      (websiteFilter === "no" && !lead.has_website);
    return matchesSearch && matchesStatus && matchesCategory && matchesWebsite;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, websiteFilter]);

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
            <h1 className="text-2xl font-bold text-white">AmruthAI</h1>
          </div>
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
        <section className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  data-testid="search-input"
                  type="text"
                  placeholder="Search business or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  data-testid="status-filter"
                  className="w-full sm:w-44 bg-zinc-900 border-zinc-800 text-white"
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

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  data-testid="category-filter"
                  className="w-full sm:w-44 bg-zinc-900 border-zinc-800 text-white"
                >
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                  <SelectItem value="all" className="text-white hover:bg-zinc-800">
                    All Categories
                  </SelectItem>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-zinc-800"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Website Filter */}
              <Select value={websiteFilter} onValueChange={setWebsiteFilter}>
                <SelectTrigger
                  data-testid="website-filter"
                  className="w-full sm:w-36 bg-zinc-900 border-zinc-800 text-white"
                >
                  <SelectValue placeholder="Website" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all" className="text-white hover:bg-zinc-800">
                    All
                  </SelectItem>
                  <SelectItem value="yes" className="text-white hover:bg-zinc-800">
                    Has Website
                  </SelectItem>
                  <SelectItem value="no" className="text-white hover:bg-zinc-800">
                    No Website
                  </SelectItem>
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
          </div>
        </section>

        {/* Table Section - Desktop */}
        <section className="hidden md:block border border-zinc-800 bg-zinc-900 overflow-x-auto rounded-xl">
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
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider min-w-[180px]">
                    Business Name
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-32">
                    Category
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-20 text-center">
                    Location
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-20 text-center">
                    Website
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-36">
                    Mobile
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-16 text-center">
                    WhatsApp
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-40">
                    Status
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider min-w-[150px]">
                    Comment
                  </TableHead>
                  <TableHead className="text-zinc-400 font-semibold uppercase text-xs tracking-wider w-24 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead, index) => (
                  <TableRow
                    key={lead.id}
                    data-testid={`lead-row-${lead.id}`}
                    className={`border-zinc-800 ${getRowBgClass(lead.status)}`}
                  >
                    <TableCell className="font-mono font-medium text-zinc-400 text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-bold text-white">
                      {lead.business_name}
                    </TableCell>
                    <TableCell className="text-zinc-200 text-sm font-medium">
                      {lead.category ? (
                        <span className="inline-flex items-center gap-1">
                          <Tag className="w-3 h-3 text-yellow-400" />
                          {lead.category}
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-normal">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {lead.location ? (
                        <a
                          href={lead.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-yellow-400 hover:text-yellow-300"
                        >
                          <MapPin className="w-5 h-5" />
                        </a>
                      ) : (
                        <MapPin className="w-5 h-5 text-zinc-600 mx-auto" />
                      )}
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
                    <TableCell className="font-mono font-medium text-zinc-200">
                      <a
                        href={`tel:${lead.mobile_number}`}
                        className="hover:text-yellow-400"
                      >
                        {lead.mobile_number}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <a
                        href={`https://wa.me/${lead.mobile_number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-green-500 hover:text-green-400"
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                      </a>
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
                          )} font-medium text-xs rounded-md`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 p-1 rounded-lg shadow-xl">
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className={`rounded-md my-1 cursor-pointer focus:outline-none ${getStatusClass(status)}`}
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={lead.comment || ""}
                        onChange={(e) => {
                          const newComment = e.target.value;
                          axios.put(`${API}/leads/${lead.id}`, { comment: newComment })
                            .then(() => fetchLeads())
                            .catch(() => toast.error("Failed to update comment"));
                        }}
                        placeholder="Add comment..."
                        className="bg-zinc-800 border-zinc-700 text-white text-sm h-8"
                      />
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
          
          {/* Pagination for Desktop */}
          {!loading && filteredLeads.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
              <div className="text-sm text-zinc-400">
                Page {currentPage} of {totalPages} ({filteredLeads.length} leads)
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-yellow-400 text-black hover:bg-yellow-500 h-8 w-8"
                              : "border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 w-8"
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Card View - Mobile */}
        <section className="md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-zinc-500">Loading...</div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border border-zinc-800 bg-zinc-900 rounded-xl">
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
            <div className="space-y-4">
              {paginatedLeads.map((lead, index) => (
                <div
                  key={lead.id}
                  data-testid={`lead-card-${lead.id}`}
                  className={`p-4 rounded-xl border-l-4 ${getCardBgClass(lead.status)}`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-mono text-sm">#{startIndex + index + 1}</span>
                      <h3 className="font-semibold text-white text-lg">{lead.business_name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(lead)}
                        className="text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(lead)}
                        className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-3">
                    {/* Category */}
                    {lead.category && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-yellow-400" />
                        <span className="text-zinc-300 text-sm">{lead.category}</span>
                      </div>
                    )}

                    {/* Mobile Number & WhatsApp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-zinc-500" />
                        <a 
                          href={`tel:${lead.mobile_number}`} 
                          className="font-mono text-zinc-300 hover:text-yellow-400"
                        >
                          {lead.mobile_number}
                        </a>
                      </div>
                      <a
                        href={`https://wa.me/${lead.mobile_number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-green-500 hover:text-green-400 text-sm"
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                      </a>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${lead.location ? 'text-yellow-400' : 'text-zinc-600'}`} />
                      {lead.location ? (
                        <a
                          href={lead.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-300 hover:text-yellow-400 text-sm truncate max-w-[200px]"
                        >
                          View Location
                        </a>
                      ) : (
                        <span className="text-zinc-600 text-sm">No location</span>
                      )}
                    </div>

                    {/* Website Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${lead.has_website ? 'text-yellow-400' : 'text-zinc-600'}`} />
                        <span className="text-zinc-400 text-sm">Has Website</span>
                      </div>
                      <Switch
                        checked={lead.has_website}
                        onCheckedChange={(checked) => handleWebsiteToggle(lead.id, checked)}
                        className="data-[state=checked]:bg-yellow-400"
                      />
                    </div>

                    {/* Status */}
                    <div className="pt-2">
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                      >
                        <SelectTrigger
                          className={`w-full border-0 ${getStatusClass(lead.status)} font-medium text-sm rounded-md`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 p-1 rounded-lg shadow-xl">
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className={`rounded-md my-1 cursor-pointer focus:outline-none ${getStatusClass(status)}`}
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Comment */}
                    <div className="pt-2">
                      <Input
                        value={lead.comment || ""}
                        onChange={(e) => {
                          const newComment = e.target.value;
                          axios.put(`${API}/leads/${lead.id}`, { comment: newComment })
                            .then(() => fetchLeads())
                            .catch(() => toast.error("Failed to update comment"));
                        }}
                        placeholder="Add comment..."
                        className="bg-zinc-800 border-zinc-700 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lead Count & Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-zinc-500 text-sm">
            Showing {startIndex + 1}-{Math.min(startIndex + ROWS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length} leads
            {filteredLeads.length !== leads.length && ` (filtered from ${leads.length})`}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => (
                    <span key={page} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="text-zinc-500 px-1">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page 
                          ? "bg-yellow-400 text-black hover:bg-yellow-500 h-8 w-8" 
                          : "border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 w-8"
                        }
                      >
                        {page}
                      </Button>
                    </span>
                  ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                Last
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent
          data-testid="add-lead-dialog"
          className="bg-zinc-900 border-zinc-800 text-white rounded-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-400">
              Add New Lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
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
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger
                  data-testid="input-category"
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-zinc-800"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Location (Google Maps Link)
              </label>
              <Input
                data-testid="input-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="https://maps.google.com/..."
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
                  setFormData({ ...formData, mobile_number: formatMobileNumber(e.target.value) })
                }
                placeholder="10 digit number"
                maxLength={10}
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
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Comment</label>
              <Input
                data-testid="input-comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Add a comment..."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
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
          className="bg-zinc-900 border-zinc-800 text-white rounded-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-400">
              Edit Lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
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
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger
                  data-testid="edit-category"
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-zinc-800"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Location (Google Maps Link)
              </label>
              <Input
                data-testid="edit-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="https://maps.google.com/..."
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
                  setFormData({ ...formData, mobile_number: formatMobileNumber(e.target.value) })
                }
                placeholder="10 digit number"
                maxLength={10}
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
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Comment</label>
              <Input
                data-testid="edit-comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Add a comment..."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
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
          className="bg-zinc-900 border-zinc-800 text-white rounded-xl"
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
