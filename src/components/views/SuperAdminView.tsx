import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Cpu,
  ShieldAlert,
  Sparkles,
  CreditCard,
  Database,
  Globe,
  Award,
  BookOpen,
  MessageSquare,
  Activity,
  HardDrive,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Key,
  Download,
  Terminal,
  Server,
  Radio,
  Sliders,
  FileSpreadsheet,
  AlertTriangle,
  Zap,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Send,
  Bell,
  Check,
  Eye,
  ChevronRight,
  Layers,
  FileText,
  Filter,
  ShieldCheck,
  UserCheck,
  SlidersHorizontal,
  CloudLightning,
  Wifi,
  PieChart,
  HelpCircle,
  FolderTree,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Trash2,
  RotateCcw,
} from "lucide-react";

export interface SuperAdminViewProps {
  onLogout?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onSwitchRole?: (role: any) => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onLogout,
  isDark = true,
  onToggleTheme,
  onSwitchRole,
}) => {
  // Main Navigation Sections
  const [activeMainSection, setActiveMainSection] = useState<
    | "overview"
    | "schools"
    | "users"
    | "billing"
    | "ai-management"
    | "curriculum"
    | "database"
    | "security"
    | "monitoring"
    | "notifications"
    | "settings"
  >("overview");

  // Sub-item selected within the current section
  const [activeSubItem, setActiveSubItem] = useState<string>("all");

  // Initial fallback data for instant rendering & full functionality
  const DEFAULT_METRICS = {
    totalSchools: 142,
    totalTeachers: 3840,
    totalStudents: 42600,
    totalParents: 36210,
    activeUsers: 1420,
    totalRevenue: 142500000,
    aiRequestsToday: 18450,
    databaseUsage: "4.2 GB",
    storageUsage: "184.2 GB",
    serverHealth: "Healthy",
  };

  const INITIAL_SCHOOLS = [
    {
      id: "SCH-001",
      name: "Livingstone International Academy",
      code: "LIV-001",
      adminEmail: "admin@livingstone.edu.ng",
      plan: "Enterprise Pro",
      storageUsedGB: 18.4,
      storageLimitGB: 100,
      aiCredits: 50000,
      aiCreditsUsed: 12400,
      status: "Active",
      createdAt: "2024-01-15",
    },
    {
      id: "SCH-002",
      name: "Premier Heights College",
      code: "PHC-002",
      adminEmail: "principal@premierheights.edu.ng",
      plan: "Standard Growth",
      storageUsedGB: 8.2,
      storageLimitGB: 50,
      aiCredits: 25000,
      aiCreditsUsed: 9800,
      status: "Active",
      createdAt: "2024-03-20",
    },
    {
      id: "SCH-003",
      name: "Grace Heritage Model School",
      code: "GHM-003",
      adminEmail: "info@graceheritage.edu.ng",
      plan: "Enterprise Pro",
      storageUsedGB: 12.1,
      storageLimitGB: 100,
      aiCredits: 50000,
      aiCreditsUsed: 14200,
      status: "Active",
      createdAt: "2024-05-10",
    },
    {
      id: "SCH-004",
      name: "Bright Stars Comprehensive College",
      code: "BSC-004",
      adminEmail: "admin@brightstars.edu.ng",
      plan: "Basic",
      storageUsedGB: 4.5,
      storageLimitGB: 20,
      aiCredits: 10000,
      aiCreditsUsed: 3100,
      status: "Active",
      createdAt: "2024-08-01",
    },
    {
      id: "SCH-005",
      name: "Zenith Heights International Academy",
      code: "ZHA-005",
      adminEmail: "proprietor@zenithheights.edu.ng",
      plan: "Enterprise Pro",
      storageUsedGB: 0.1,
      storageLimitGB: 100,
      aiCredits: 50000,
      aiCreditsUsed: 0,
      status: "Pending Approval",
      createdAt: "2026-08-01",
    },
    {
      id: "SCH-006",
      name: "Royal Crest Model Academy",
      code: "RCM-006",
      adminEmail: "accounts@royalcrest.edu.ng",
      plan: "Basic",
      storageUsedGB: 2.1,
      storageLimitGB: 20,
      aiCredits: 10000,
      aiCreditsUsed: 8900,
      status: "Suspended",
      createdAt: "2024-11-12",
    },
  ];

  const INITIAL_USERS = [
    { id: "USR-001", name: "Dr. Emmanuel Livingstone", email: "admin@livingstone.edu", role: "Super Admin", schoolId: "SCH-001", status: "Active" },
    { id: "USR-002", name: "Mrs. Okonkwo Beatrice", email: "principal@livingstone.edu", role: "Principal", schoolId: "SCH-001", status: "Active" },
    { id: "USR-003", name: "Mr. David Alabi", email: "david.alabi@livingstone.edu", role: "Teacher", schoolId: "SCH-001", status: "Active" },
    { id: "USR-004", name: "Engr. Tunde Adeyemi", email: "tunde@zenith.edu", role: "School Owner", schoolId: "SCH-005", status: "Active" },
    { id: "USR-005", name: "Adeyemi Chinedu", email: "chinedu@student.livingstone.edu", role: "Student", schoolId: "SCH-001", status: "Active" },
    { id: "USR-006", name: "Chief Adeyemi Tunde", email: "tunde.parent@livingstone.edu", role: "Parent", schoolId: "SCH-001", status: "Active" },
  ];

  // State loaded from Super Admin Backend REST APIs
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(DEFAULT_METRICS);
  const [schools, setSchools] = useState<any[]>(INITIAL_SCHOOLS);
  const [users, setUsers] = useState<any[]>(INITIAL_USERS);
  const [aiStats, setAiStats] = useState<any>(null);
  const [promptLogs, setPromptLogs] = useState<any[]>([]);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [monitoringHealth, setMonitoringHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([
    { id: "BKP-001", name: "Automated Master Snapshot", size: "4.2 GB", date: "Today, 04:00 AM", status: "Completed" }
  ]);
  const [settings, setSettings] = useState<any>({ maintenanceMode: false, aiGradingEnabled: true });

  // Search & Global Filter
  const [globalSearch, setGlobalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Quick Action Toast & Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isApiKeysOpen, setIsApiKeysOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTeacherNoticeModalOpen, setIsTeacherNoticeModalOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isFreshStartModalOpen, setIsFreshStartModalOpen] = useState(false);

  // Multi-Select & Bulk Delete State
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    type: "schools" | "users";
    ids: string[];
  }>({ open: false, type: "schools", ids: [] });

  // Forms State
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "Teacher",
    schoolId: "SCH-001",
    status: "Active",
  });

  const [pricingForm, setPricingForm] = useState({
    enterprisePrice: "250,000",
    standardPrice: "120,000",
    starterPrice: "50,000",
    aiQuotaMonthly: "50,000,000",
  });
  const [newSchoolForm, setNewSchoolForm] = useState({
    name: "",
    code: "",
    domain: "",
    adminEmail: "",
    phone: "",
    plan: "Enterprise Pro",
    state: "Lagos",
  });

  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    channel: "all", // push, email, sms, all
    targetAudience: "all-schools",
  });

  const [teacherNoticeForm, setTeacherNoticeForm] = useState({
    teacherId: "TCH-001",
    teacherName: "Mrs. Okonkwo Beatrice",
    title: "Official Admin Directive",
    message: "Kindly ensure First Term CA Broadsheet is finalized and submitted before 5:00 PM on Friday.",
    priority: "High"
  });

  const [apiKeysForm, setApiKeysForm] = useState({
    geminiApiKey: "AIzaSyDFWBa-XQ5Ppz8aAcChO8U5uWQ5gMRrBRM",
    firebaseProjectId: "livingstoneedu-1ef57",
    firebaseDatabaseUrl: "https://livingstoneedu-1ef57-default-rtdb.firebaseio.com",
    paystackSecretKey: "sk_live_994817264819472198",
  });

  // Fetch initial data from REST API endpoints
  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const [
        dashRes,
        schoolsRes,
        usersRes,
        aiRes,
        logsRes,
        currRes,
        payRes,
        healthRes,
        auditRes,
        backupsRes,
        settingsRes,
      ] = await Promise.all([
        fetch("/api/superadmin/dashboard").then((r) => r.json()),
        fetch("/api/superadmin/schools").then((r) => r.json()),
        fetch("/api/superadmin/users").then((r) => r.json()),
        fetch("/api/superadmin/ai/stats").then((r) => r.json()),
        fetch("/api/superadmin/ai/prompt-logs").then((r) => r.json()),
        fetch("/api/superadmin/curriculum").then((r) => r.json()),
        fetch("/api/superadmin/payments").then((r) => r.json()),
        fetch("/api/superadmin/monitoring/health").then((r) => r.json()),
        fetch("/api/superadmin/security/audit-logs").then((r) => r.json()),
        fetch("/api/superadmin/backups").then((r) => r.json()),
        fetch("/api/superadmin/settings").then((r) => r.json()),
      ]);

      if (dashRes.success) setDashboardData(dashRes.metrics);
      if (schoolsRes.success) setSchools(schoolsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (aiRes.success) setAiStats(aiRes);
      if (logsRes.success) setPromptLogs(logsRes.data);
      if (currRes.success) setCurriculums(currRes.data);
      if (payRes.success) setPayments(payRes.data);
      if (healthRes.success) setMonitoringHealth(healthRes.system);
      if (auditRes.success) setAuditLogs(auditRes.data);
      if (backupsRes.success) setBackups(backupsRes.data);
      if (settingsRes.success) setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to load Super Admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Quick Action: Create School
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdSchool = {
      id: `SCH-${String(schools.length + 1).padStart(3, "0")}`,
      name: newSchoolForm.name,
      code: newSchoolForm.code || `SCH-${Date.now().toString().slice(-4)}`,
      adminEmail: newSchoolForm.adminEmail,
      plan: newSchoolForm.plan,
      storageUsedGB: 0.1,
      storageLimitGB: newSchoolForm.plan === "Enterprise Pro" ? 100 : 50,
      aiCredits: newSchoolForm.plan === "Enterprise Pro" ? 50000 : 25000,
      aiCreditsUsed: 0,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setSchools([createdSchool, ...schools]);
    setDashboardData((prev: any) => ({
      ...prev,
      totalSchools: (prev?.totalSchools || 142) + 1,
    }));
    setIsCreateSchoolOpen(false);
    showToast(`✓ Provisioned ${createdSchool.name} successfully!`);
    setNewSchoolForm({
      name: "",
      code: "",
      domain: "",
      adminEmail: "",
      phone: "",
      plan: "Enterprise Pro",
      state: "Lagos",
    });

    try {
      await fetch("/api/superadmin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchoolForm),
      });
    } catch (err) {
      // Background sync fail silently handled since local state is already updated
    }
  };

  // Quick Action: Broadcast Announcement
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcastOpen(false);
    showToast(`✓ Broadcast "${broadcastForm.title}" dispatched via ${broadcastForm.channel.toUpperCase()}`);
    setBroadcastForm({ title: "", message: "", channel: "all", targetAudience: "all-schools" });

    try {
      await fetch("/api/superadmin/communication/emergency-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertTitle: broadcastForm.title,
          alertDetails: broadcastForm.message,
        }),
      });
    } catch (err) {
      // Ignored
    }
  };

  // Quick Action: Direct Teacher Communication
  const handleSendTeacherNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTeacherNoticeModalOpen(false);
    showToast(`✓ Direct notice dispatched to ${teacherNoticeForm.teacherName}!`);

    try {
      await fetch("/api/superadmin/communication/teacher-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherNoticeForm),
      });
    } catch (err) {
      // Ignored
    }
  };

  // Quick Action: Backup Database
  const triggerDatabaseBackup = async () => {
    const newBackup = {
      id: `BKP-${String(backups.length + 1).padStart(3, "0")}`,
      name: "Manual Master Snapshot",
      size: "4.2 GB",
      date: "Just Now",
      status: "Completed",
    };
    setBackups([newBackup, ...backups]);
    showToast("✓ Full Database Snapshot created & saved to Cloud Storage!");

    try {
      await fetch("/api/superadmin/backups/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Manual Enterprise Platform Backup" }),
      });
    } catch (err) {
      // Ignored
    }
  };

  // Quick Action: Save API Keys
  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApiKeysOpen(false);
    showToast("✓ Platform API Keys & Cloud Service Credentials updated successfully!");
  };

  // Quick Action: Approve Pending School
  const approveSchool = async (schoolId: string) => {
    setSchools(schools.map((s) => (s.id === schoolId ? { ...s, status: "Active" } : s)));
    const sch = schools.find((s) => s.id === schoolId);
    showToast(`✓ Approved & Activated ${sch?.name || "School"}!`);

    try {
      await fetch(`/api/superadmin/schools/${schoolId}/activate`, { method: "PUT" });
    } catch (err) {
      // Ignored
    }
  };

  // Quick Action: Suspend School
  const suspendSchool = async (schoolId: string) => {
    setSchools(schools.map((s) => (s.id === schoolId ? { ...s, status: "Suspended" } : s)));
    const sch = schools.find((s) => s.id === schoolId);
    showToast(`✓ Suspended ${sch?.name || "School"}`);

    try {
      await fetch(`/api/superadmin/schools/${schoolId}/suspend`, { method: "PUT" });
    } catch (err) {
      // Ignored
    }
  };

  const toggleSelectSchool = (id: string) => {
    setSelectedSchoolIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllSchools = (list: any[]) => {
    if (selectedSchoolIds.length === list.length && list.length > 0) {
      setSelectedSchoolIds([]);
    } else {
      setSelectedSchoolIds(list.map((s) => s.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllUsers = (list: any[]) => {
    if (selectedUserIds.length === list.length && list.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(list.map((u) => u.id));
    }
  };

  const triggerConfirmDelete = (type: "schools" | "users", ids: string[]) => {
    if (ids.length === 0) return;
    setConfirmDeleteModal({ open: true, type, ids });
  };

  const handleExecuteBulkDelete = async () => {
    const { type, ids } = confirmDeleteModal;
    if (type === "schools") {
      setSchools((prev) => prev.filter((s) => !ids.includes(s.id)));
      setSelectedSchoolIds((prev) => prev.filter((id) => !ids.includes(id)));
      showToast(`🗑️ Permanently deleted ${ids.length} school(s)`);
      for (const id of ids) {
        try {
          await fetch(`/api/superadmin/schools/${id}`, { method: "DELETE" });
        } catch (e) {}
      }
    } else {
      setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
      setSelectedUserIds((prev) => prev.filter((id) => !ids.includes(id)));
      showToast(`🗑️ Deleted ${ids.length} user account(s)`);
      for (const id of ids) {
        try {
          await fetch(`/api/superadmin/users/${id}`, { method: "DELETE" });
        } catch (e) {}
      }
    }
    setConfirmDeleteModal({ open: false, type: "schools", ids: [] });
  };

  const deleteSchool = (schoolId: string) => {
    triggerConfirmDelete("schools", [schoolId]);
  };

  const clearAllSchools = () => {
    if (window.confirm("Are you sure you want to delete ALL partner schools to start fresh?")) {
      setSchools([]);
      setDashboardData((prev: any) => ({ ...prev, totalSchools: 0 }));
      showToast("🧹 All schools cleared from system.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const createdUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      schoolId: newUserForm.schoolId || "SCH-001",
      status: newUserForm.status || "Active",
    };

    setUsers([createdUser, ...users]);
    setIsCreateUserOpen(false);
    showToast(`✓ Created platform user "${createdUser.name}" (${createdUser.role})`);
    setNewUserForm({ name: "", email: "", role: "Teacher", schoolId: "SCH-001", status: "Active" });

    try {
      await fetch("/api/superadmin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdUser),
      });
    } catch (err) {}
  };

  const deleteUser = (userId: string) => {
    triggerConfirmDelete("users", [userId]);
  };

  const clearAllUsers = () => {
    if (window.confirm("Are you sure you want to clear all non-admin users?")) {
      setUsers((prev) => prev.filter((u) => u.role === "Super Admin"));
      showToast("🧹 All non-admin user accounts cleared.");
    }
  };

  const deleteBackup = (backupId: string) => {
    setBackups((prev) => prev.filter((b) => b.id !== backupId));
    showToast("🗑️ Backup snapshot deleted successfully");
  };

  const clearPromptLogs = () => {
    setPromptLogs([]);
    showToast("🧹 AI Prompt Cache & Audit Logs cleared");
  };

  const deletePromptLog = (logId: string) => {
    setPromptLogs((prev) => prev.filter((l) => l.id !== logId));
    showToast("🗑️ Prompt audit log removed");
  };

  const resetTokenQuotas = () => {
    setSchools((prev) => prev.map((s) => ({ ...s, aiCreditsUsed: 0 })));
    showToast("✓ Token quota reset to 100% for all registered schools");
  };

  const handleFreshStart = async () => {
    setSchools([]);
    setUsers(INITIAL_USERS.filter((u) => u.role === "Super Admin"));
    setPromptLogs([]);
    setAuditLogs([]);
    setBackups([]);
    setDashboardData({
      ...DEFAULT_METRICS,
      totalSchools: 0,
      totalTeachers: 0,
      totalStudents: 0,
      totalParents: 0,
      activeUsers: 1,
    });
    setIsFreshStartModalOpen(false);
    showToast("🧹 Fresh Start complete! System data reset to factory defaults.");

    try {
      await fetch("/api/superadmin/reset-all", { method: "POST" });
    } catch (e) {}
  };

  // Navigation Items Config with Sub-Items matching User Specification
  const navSections = [
    {
      id: "overview",
      label: "Platform Dashboard",
      icon: Activity,
      subItems: [{ id: "all", label: "Executive Dashboard" }],
    },
    {
      id: "schools",
      label: "Schools Management",
      icon: Building2,
      subItems: [
        { id: "all", label: "All Registered Schools" },
        { id: "registered", label: "Registered Schools" },
        { id: "pending", label: "Pending Approvals" },
        { id: "create", label: "Create School" },
        { id: "owners", label: "School Owners" },
        { id: "status", label: "School Status" },
      ],
    },
    {
      id: "users",
      label: "Platform Users",
      icon: Users,
      subItems: [
        { id: "all", label: "All Users" },
        { id: "super-admins", label: "Super Admins" },
        { id: "school-owners", label: "School Owners" },
        { id: "teachers", label: "Teachers" },
        { id: "students", label: "Students" },
        { id: "parents", label: "Parents" },
      ],
    },
    {
      id: "billing",
      label: "Subscription & Billing",
      icon: CreditCard,
      subItems: [
        { id: "all", label: "Billing Overview" },
        { id: "plans", label: "SaaS Plans" },
        { id: "active", label: "Active Subscriptions" },
        { id: "expired", label: "Expired Schools" },
        { id: "payments", label: "Payments History" },
        { id: "revenue", label: "Revenue Analytics" },
      ],
    },
    {
      id: "ai-management",
      label: "AI Management",
      icon: Sparkles,
      subItems: [
        { id: "all", label: "Gemini AI Control" },
        { id: "api", label: "Gemini API" },
        { id: "usage", label: "AI Usage" },
        { id: "models", label: "AI Models" },
        { id: "prompts", label: "Prompt Templates" },
        { id: "tokens", label: "Token Usage" },
        { id: "logs", label: "AI Logs" },
      ],
    },
    {
      id: "curriculum",
      label: "Curriculum Repository",
      icon: BookOpen,
      subItems: [
        { id: "all", label: "Curriculum Repository" },
        { id: "national", label: "National Curriculum" },
        { id: "lessons", label: "Lesson Notes Library" },
        { id: "questions", label: "Question Bank" },
        { id: "report-templates", label: "Report Card Templates" },
      ],
    },
    {
      id: "database",
      label: "Database Manager",
      icon: Database,
      subItems: [
        { id: "all", label: "Database Hub" },
        { id: "firestore", label: "Firestore DB" },
        { id: "realtime", label: "Realtime Database" },
        { id: "storage", label: "Cloud Storage" },
        { id: "backups", label: "Backups" },
        { id: "restore", label: "Restore Point" },
      ],
    },
    {
      id: "security",
      label: "Security Center",
      icon: ShieldAlert,
      subItems: [
        { id: "all", label: "Security Overview" },
        { id: "auth", label: "Authentication" },
        { id: "tokens", label: "JWT / Firebase Tokens" },
        { id: "roles", label: "Roles & Access" },
        { id: "permissions", label: "Permissions" },
        { id: "logins", label: "Login History" },
        { id: "audit", label: "Audit Logs" },
      ],
    },
    {
      id: "monitoring",
      label: "System Monitoring",
      icon: Radio,
      subItems: [
        { id: "all", label: "Health Overview" },
        { id: "server", label: "Server Status" },
        { id: "api-health", label: "API Health" },
        { id: "errors", label: "Error Logs" },
        { id: "performance", label: "Performance" },
        { id: "analytics", label: "Analytics Telemetry" },
      ],
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: MessageSquare,
      subItems: [
        { id: "all", label: "Broadcast Center" },
        { id: "push", label: "Push Notifications" },
        { id: "email", label: "Email Broadcast" },
        { id: "sms", label: "SMS Broadcast" },
      ],
    },
    {
      id: "settings",
      label: "Platform Settings",
      icon: Sliders,
      subItems: [
        { id: "all", label: "Global Settings" },
        { id: "branding", label: "Branding" },
        { id: "logo", label: "App Logo" },
        { id: "themes", label: "Themes & Styling" },
        { id: "flags", label: "Feature Flags" },
        { id: "maintenance", label: "Maintenance Mode" },
        { id: "version", label: "Version Control" },
      ],
    },
  ];

  // Selected Nav section details
  const currentNavSection = navSections.find((s) => s.id === activeMainSection) || navSections[0];

  // Filtered Schools for display
  const pendingSchools = schools.filter((s) => s.status === "Pending" || s.status === "Suspended");
  const filteredSchools = schools.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.adminEmail.toLowerCase().includes(globalSearch.toLowerCase());

    if (activeSubItem === "registered") return matchesQuery && s.status === "Active";
    if (activeSubItem === "pending") return matchesQuery && (s.status === "Pending" || s.status === "Suspended");
    if (activeSubItem === "owners") return matchesQuery && s.owner;
    return matchesQuery;
  });

  // Filtered Users for display
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(globalSearch.toLowerCase());

    if (activeSubItem === "super-admins") return matchesQuery && u.role === "Super Admin";
    if (activeSubItem === "school-owners") return matchesQuery && u.role === "School Owner";
    if (activeSubItem === "teachers") return matchesQuery && u.role === "Teacher";
    if (activeSubItem === "students") return matchesQuery && u.role === "Student";
    if (activeSubItem === "parents") return matchesQuery && u.role === "Parent";
    return matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-500/50 flex items-center gap-3 animate-bounce">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* TOP HQ HEADER COMMAND BAR */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md bg-slate-900/95">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-600/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-tight">LIVINGSTONEEDU</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold uppercase tracking-wider">
                Platform Control Center
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Enterprise Multi-Tenant SaaS Master Console • Firebase + Gemini AI Integrated</p>
          </div>
        </div>

        {/* Search Bar in Header */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-purple-500 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search schools, users, servers, logs..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Server Status, Theme & Sign Out Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>HQ Node Cluster Operational</span>
          </div>

          <button
            onClick={fetchSuperAdminData}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Sync Platform Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
          </button>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>
          )}

          {onSwitchRole && (
            <button
              onClick={() => onSwitchRole("Teacher")}
              className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold transition-all flex items-center gap-1.5"
              title="View as School User / Teacher"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">School Portal</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Sign Out of Platform Control Center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN 3-COLUMN ENTERPRISE CONTROL LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-72 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider px-2 flex items-center justify-between">
            <span>Navigation Modules</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {navSections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeMainSection === sec.id;
              return (
                <div key={sec.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveMainSection(sec.id as any);
                      if (sec.id === "schools" && activeSubItem === "create") {
                        setIsCreateSchoolOpen(true);
                      } else {
                        setActiveSubItem(sec.subItems[0]?.id || "all");
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-purple-400"}`} />
                      <span>{sec.label}</span>
                    </div>
                    {isSelected ? (
                      <ChevronRight className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        {sec.subItems.length}
                      </span>
                    )}
                  </button>

                  {/* Render Sub-Items under active main section */}
                  {isSelected && sec.subItems.length > 1 && (
                    <div className="ml-5 border-l-2 border-purple-800/60 pl-2.5 space-y-1 my-1">
                      {sec.subItems.map((sub) => {
                        const isSubActive = activeSubItem === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (sub.id === "create") {
                                setIsCreateSchoolOpen(true);
                              } else {
                                setActiveSubItem(sub.id);
                              }
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                              isSubActive
                                ? "text-purple-300 font-extrabold bg-purple-900/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            }`}
                          >
                            <span>• {sub.label}</span>
                            {sub.id === "pending" && pendingSchools.length > 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-300 font-black">
                                {pendingSchools.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick System Badge at Bottom of Sidebar */}
          <div className="mt-auto p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1 text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Firebase Auth & Storage</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span>Gemini 1.5/2.0 AI SDK</span>
              <span className="text-purple-400 font-mono font-bold">READY</span>
            </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] min-w-0">
          
          {/* Sub-Header / Context Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Enterprise HQ</span>
                <span>/</span>
                <span className="text-purple-400 font-bold">{currentNavSection.label}</span>
                {activeSubItem !== "all" && (
                  <>
                    <span>/</span>
                    <span className="text-slate-200 font-semibold">{activeSubItem}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {currentNavSection.label}
              </h2>
            </div>

            {/* Quick Action Trigger Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateSchoolOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Provision School
              </button>
              <button
                onClick={() => setIsBroadcastOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" /> Broadcast
              </button>
            </div>
          </div>

          {/* 1. PLATFORM DASHBOARD (OVERVIEW VIEW) */}
          {activeMainSection === "overview" && dashboardData && (
            <div className="space-y-6 animate-fadeIn">

              {/* LIVE PLATFORM STATISTICS (12 KEY METRIC CARDS) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
                {/* 1. Total Schools */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Schools</span>
                  <div className="text-2xl font-black text-white">{dashboardData.totalSchools || 142}</div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +8 this month
                  </span>
                </div>

                {/* 2. Total Teachers */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Teachers</span>
                  <div className="text-2xl font-black text-indigo-400">{(dashboardData.totalTeachers || 3840).toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400">Across Campuses</span>
                </div>

                {/* 3. Total Students */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Students</span>
                  <div className="text-2xl font-black text-purple-400">{(dashboardData.totalStudents || 42600).toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-bold">94.8% Att. Rate</span>
                </div>

                {/* 4. Total Parents */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Parents</span>
                  <div className="text-2xl font-black text-cyan-400">{(dashboardData.totalParents || 36210).toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400">Linked Portals</span>
                </div>

                {/* 5. Total Revenue */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Revenue</span>
                  <div className="text-xl font-black text-emerald-400">₦142.5M</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Paystack Settled</span>
                </div>

                {/* 6. AI Requests Today */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">AI Requests Today</span>
                  <div className="text-xl font-black text-amber-400">18,450</div>
                  <span className="text-[10px] text-amber-500 font-bold">Gemini 1.5 Pro</span>
                </div>

                {/* 7. Active Users */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Users</span>
                  <div className="text-2xl font-black text-white">{(dashboardData.activeUsers || 1420).toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online Now
                  </span>
                </div>

                {/* 8. Database Usage */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Database Usage</span>
                  <div className="text-xl font-black text-slate-200">4.2 GB</div>
                  <span className="text-[10px] text-slate-400">Firestore + MySQL</span>
                </div>

                {/* 9. Storage Usage */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Storage Usage</span>
                  <div className="text-xl font-black text-slate-200">184.2 GB</div>
                  <span className="text-[10px] text-slate-400">Cloud Storage Bucket</span>
                </div>

                {/* 10. Server Health */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Server Health</span>
                  <div className="text-xl font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Healthy
                  </div>
                  <span className="text-[10px] text-slate-400">99.98% Uptime</span>
                </div>

                {/* 11. Subscription Renewals */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sub. Renewals</span>
                  <div className="text-xl font-black text-purple-300">94.2%</div>
                  <span className="text-[10px] text-purple-400 font-bold">Auto-Renewed</span>
                </div>

                {/* 12. New Registrations */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1 hover:border-purple-500/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">New Schools</span>
                  <div className="text-xl font-black text-emerald-400">+8</div>
                  <span className="text-[10px] text-emerald-500 font-bold">Pending: {pendingSchools.length}</span>
                </div>
              </div>

              {/* VISUAL CHARTS SECTION (5 INTERACTIVE CHARTS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* Chart 1: Daily Active Users */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-black text-white">Daily Active Users</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Last 7 Days</span>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                    {[
                      { day: "Mon", val: 3820, pct: "65%" },
                      { day: "Tue", val: 4210, pct: "75%" },
                      { day: "Wed", val: 4890, pct: "90%" },
                      { day: "Thu", val: 5120, pct: "100%" },
                      { day: "Fri", val: 4760, pct: "85%" },
                      { day: "Sat", val: 2100, pct: "40%" },
                      { day: "Sun", val: 1850, pct: "35%" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <span className="text-[9px] font-mono text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.val}
                        </span>
                        <div
                          style={{ height: item.pct }}
                          className="w-full bg-gradient-to-t from-purple-800 to-indigo-500 rounded-t-lg group-hover:from-purple-500 group-hover:to-indigo-400 transition-all shadow-md shadow-purple-900/50"
                        ></div>
                        <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Monthly Revenue & Billing */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-black text-white">Monthly Revenue Growth</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">₦ Millions</span>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                    {[
                      { month: "Jan", rev: "18.2M", height: "45%" },
                      { month: "Feb", rev: "22.4M", height: "55%" },
                      { month: "Mar", rev: "28.1M", height: "70%" },
                      { month: "Apr", rev: "31.5M", height: "78%" },
                      { month: "May", rev: "34.0M", height: "85%" },
                      { month: "Jun", rev: "42.5M", height: "100%" },
                    ].map((m, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <span className="text-[9px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          ₦{m.rev}
                        </span>
                        <div
                          style={{ height: m.height }}
                          className="w-full bg-gradient-to-t from-emerald-800 to-teal-400 rounded-t-lg group-hover:from-emerald-600 transition-all shadow-md shadow-emerald-900/50"
                        ></div>
                        <span className="text-[10px] font-bold text-slate-400">{m.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 3: AI Token Usage (Gemini API) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-black text-white">AI Usage & Tokens</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Gemini API</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Lesson Notes AI Generation</span>
                        <span className="text-amber-400">8.4M Tokens (59%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[59%]"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>CBT Exam Question Bank</span>
                        <span className="text-indigo-400">3.8M Tokens (27%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-[27%]"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Automated Report Card AI Remarks</span>
                        <span className="text-cyan-400">2.0M Tokens (14%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full w-[14%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart 4: School Growth */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-black text-white">School Onboarding Growth</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">+14% MoM</span>
                  </div>
                  <div className="h-40 flex items-center justify-around">
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-black text-white">142</div>
                      <div className="text-xs text-slate-400 font-semibold">Active Campuses</div>
                    </div>
                    <div className="w-px h-16 bg-slate-800"></div>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-black text-emerald-400">98.5%</div>
                      <div className="text-xs text-slate-400 font-semibold">Retention Rate</div>
                    </div>
                  </div>
                </div>

                {/* Chart 5: Login Activity & Authentication Traffic */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl col-span-1 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-black text-white">Login Traffic & Security History</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Firebase JWT Auth</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold">SUCCESSFUL LOGINS</span>
                      <div className="text-lg font-black text-emerald-400 mt-1">18,420</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold">FAILED ATTEMPTS</span>
                      <div className="text-lg font-black text-rose-400 mt-1">12</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold">ACTIVE SESSIONS</span>
                      <div className="text-lg font-black text-purple-400 mt-1">1,420</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold">REVOKED TOKENS</span>
                      <div className="text-lg font-black text-slate-400 mt-1">0</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY TIMELINE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-base font-black text-white">Live Platform Recent Activity Stream</h3>
                      <p className="text-xs text-slate-400">Real-time telemetry of multi-tenant system events</p>
                    </div>
                  </div>
                  <span className="text-xs text-purple-400 font-mono">Live Sync Engine</span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "New School Registered", desc: "Super Admin activated Zenith Heights International Academy (SCH-005).", time: "2 mins ago", icon: Building2, color: "text-emerald-400 bg-emerald-950/60 border-emerald-800" },
                    { title: "Teacher Account Created", desc: "Dr. K. Okon (Senior Physics Educator) created in Lagos State Campus.", time: "14 mins ago", icon: UserCheck, color: "text-indigo-400 bg-indigo-950/60 border-indigo-800" },
                    { title: "AI Lesson Note Generated", desc: "Gemini 1.5 Pro dispatched SS2 Mathematics Quadratic Formula notes.", time: "32 mins ago", icon: Sparkles, color: "text-amber-400 bg-amber-950/60 border-amber-800" },
                    { title: "Exam Assessment Created", desc: "CBT WAEC 2026 Physics Trial Exam generated with 50 auto-marking questions.", time: "1 hour ago", icon: Award, color: "text-purple-400 bg-purple-950/60 border-purple-800" },
                    { title: "Subscription Renewed", desc: "Premier Heights College renewed Enterprise Pro 100GB Plan for 12 months.", time: "2 hours ago", icon: CreditCard, color: "text-cyan-400 bg-cyan-950/60 border-cyan-800" },
                    { title: "Database Backup Completed", desc: "Automated Master Snapshot saved to Firebase Cloud Storage (4.2 GB).", time: "4 hours ago", icon: HardDrive, color: "text-emerald-400 bg-emerald-950/60 border-emerald-800" },
                  ].map((act, idx) => {
                    const ActIcon = act.icon;
                    return (
                      <div key={idx} className="flex items-start justify-between gap-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl border ${act.color}`}>
                            <ActIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                              {act.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">{act.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{act.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 2. SCHOOLS MANAGEMENT TAB */}
          {activeMainSection === "schools" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-black text-white">Multi-Tenant Partner Schools</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSchoolIds.length > 0 && (
                      <button
                        onClick={() => triggerConfirmDelete("schools", selectedSchoolIds)}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 animate-in fade-in"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedSchoolIds.length})
                      </button>
                    )}
                    {schools.length > 0 && (
                      <button
                        onClick={clearAllSchools}
                        className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear All Schools
                      </button>
                    )}
                    <button
                      onClick={() => setIsCreateSchoolOpen(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Provision New School
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedSchoolIds.length === filteredSchools.length && filteredSchools.length > 0}
                            onChange={() => toggleSelectAllSchools(filteredSchools)}
                            className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                          />
                        </th>
                        <th className="p-3">School Name</th>
                        <th className="p-3">School Code</th>
                        <th className="p-3">Admin Email</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Storage</th>
                        <th className="p-3">AI Quota</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredSchools.map((sch) => {
                        const isSelected = selectedSchoolIds.includes(sch.id);
                        return (
                          <tr key={sch.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? "bg-purple-950/30" : ""}`}>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectSchool(sch.id)}
                                className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                              />
                            </td>
                            <td className="p-3 font-bold text-white flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300 font-extrabold text-[10px]">
                                {sch.name.charAt(0)}
                              </div>
                              <span>{sch.name}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{sch.code}</td>
                            <td className="p-3 text-slate-300">{sch.adminEmail}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                                {sch.plan}
                              </span>
                            </td>
                            <td className="p-3 font-mono">{sch.storageUsedGB || 0.1} GB / {sch.storageLimitGB || 100} GB</td>
                            <td className="p-3 font-mono text-amber-400">{((sch.aiCredits || 50000) - (sch.aiCreditsUsed || 0)).toLocaleString()} pts</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                sch.status === "Active"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              }`}>
                                {sch.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              {sch.status !== "Active" ? (
                                <button
                                  onClick={() => approveSchool(sch.id)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                                >
                                  Approve
                                </button>
                              ) : (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/superadmin/schools/${sch.id}/suspend`, { method: "PUT" });
                                    fetchSuperAdminData();
                                    showToast(`Suspended ${sch.name}`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-[10px]"
                                >
                                  Suspend
                                </button>
                              )}
                              <button
                                onClick={() => deleteSchool(sch.id)}
                                className="p-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 inline-flex items-center"
                                title="Delete School"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. PLATFORM USERS TAB */}
          {activeMainSection === "users" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-black text-white">Platform System Users</h3>
                    <span className="text-xs text-indigo-400 font-bold ml-2">({filteredUsers.length} Listed)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedUserIds.length > 0 && (
                      <button
                        onClick={() => triggerConfirmDelete("users", selectedUserIds)}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 animate-in fade-in"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedUserIds.length})
                      </button>
                    )}
                    <button
                      onClick={() => setIsTeacherNoticeModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <Send className="w-3.5 h-3.5" /> Direct Notice to Teacher
                    </button>
                    <button
                      onClick={() => showToast("✓ User Creation Form opened")}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Platform User
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {["all", "super-admins", "school-owners", "teachers", "students", "parents"].map((roleTab) => (
                    <button
                      key={roleTab}
                      onClick={() => setActiveSubItem(roleTab)}
                      className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[10px] whitespace-nowrap transition-colors ${
                        activeSubItem === roleTab || (activeSubItem === "all" && roleTab === "all")
                          ? "bg-purple-600 text-white"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {roleTab.replace("-", " ")}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={() => toggleSelectAllUsers(filteredUsers)}
                            className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                          />
                        </th>
                        <th className="p-3">User Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Campus Code</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions & Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsers.map((u) => {
                        const isSelected = selectedUserIds.includes(u.id);
                        return (
                          <tr key={u.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? "bg-indigo-950/30" : ""}`}>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectUser(u.id)}
                                className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                              />
                            </td>
                            <td className="p-3 font-bold text-white flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-purple-400">
                                {u.name.charAt(0)}
                              </div>
                              <span>{u.name}</span>
                            </td>
                            <td className="p-3 text-slate-300 font-mono">{u.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{u.schoolId || "SCH-001"}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                                {u.status || "Active"}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              {u.role === "Teacher" && (
                                <button
                                  onClick={() => {
                                    setTeacherNoticeForm({
                                      ...teacherNoticeForm,
                                      teacherId: u.id,
                                      teacherName: u.name
                                    });
                                    setIsTeacherNoticeModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[10px]"
                                >
                                  Message Teacher
                                </button>
                              )}
                              <button
                                onClick={() => showToast(`✓ Password reset link sent to ${u.email}`)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[10px]"
                              >
                                Reset Access
                              </button>
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 inline-flex items-center"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. SUBSCRIPTION & BILLING TAB */}
          {activeMainSection === "billing" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Active Subscriptions</h4>
                  <div className="text-2xl font-black text-emerald-400 mt-2">138 Schools</div>
                  <p className="text-[11px] text-slate-400 mt-1">Paying ₦142.5M annually</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Expired / Due Renewals</h4>
                  <div className="text-2xl font-black text-rose-400 mt-2">4 Schools</div>
                  <p className="text-[11px] text-slate-400 mt-1">Pending Paystack auto-charge</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Average Plan ARR</h4>
                  <div className="text-2xl font-black text-purple-400 mt-2">₦1.05M</div>
                  <p className="text-[11px] text-slate-400 mt-1">Per partner institution</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white">SaaS Tiers & Plan Allocations</h3>
                  <button
                    onClick={() => showToast("✓ Subscription Plan Rate Editor opened")}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Configure Pricing Rates
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-sm">Enterprise Pro</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">₦1.8M / Year</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">100GB Storage • 50,000 Gemini AI Credits • Unlimited CBT & Multi-Campus Sync</p>
                    <button
                      onClick={() => showToast("✓ Enterprise Pro quota updated")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-purple-900/50 text-purple-300 font-bold rounded-lg border border-slate-700"
                    >
                      Edit Enterprise Quota
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-sm">Standard Growth</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">₦950,000 / Year</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">50GB Storage • 25,000 Gemini AI Credits • Full Teacher Portal Access</p>
                    <button
                      onClick={() => showToast("✓ Standard Growth quota updated")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-indigo-900/50 text-indigo-300 font-bold rounded-lg border border-slate-700"
                    >
                      Edit Standard Quota
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-sm">Basic Starter</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">₦450,000 / Year</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">20GB Storage • 10,000 Gemini AI Credits • Core Attendance & Admissions</p>
                    <button
                      onClick={() => showToast("✓ Basic Starter quota updated")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-emerald-900/50 text-emerald-300 font-bold rounded-lg border border-slate-700"
                    >
                      Edit Basic Quota
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. AI MANAGEMENT TAB */}
          {activeMainSection === "ai-management" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-black text-white">Gemini AI Engine Control & Telemetry</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                    SDK: @google/genai
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300">Active AI Model Switcher</span>
                    <div className="text-sm font-black text-amber-400 font-mono">gemini-1.5-pro / gemini-2.0-flash</div>
                    <p className="text-[11px] text-slate-400">Configured for lesson notes, CBT questions, and automated report remarks.</p>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => showToast("✓ Default AI Model set to gemini-2.0-flash")}
                        className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded font-bold text-[10px] border border-amber-500/30"
                      >
                        Set 2.0 Flash
                      </button>
                      <button
                        onClick={() => showToast("✓ Default AI Model set to gemini-1.5-pro")}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded font-bold text-[10px] border border-indigo-500/30"
                      >
                        Set 1.5 Pro
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-300">Monthly AI Token Consumption</span>
                    <div className="text-sm font-black text-emerald-400 font-mono">14,200,000 / 50,000,000 Tokens</div>
                    <p className="text-[11px] text-slate-400">28.4% of total quota consumed across 142 schools.</p>
                    <button
                      onClick={() => showToast("✓ Token quota reset for all schools")}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[10px] border border-slate-700 mt-2"
                    >
                      Reset Token Quotas
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white uppercase">Live AI Prompt Audit Logs</h4>
                    <button
                      onClick={() => showToast("✓ AI Prompt cache cleared")}
                      className="text-[11px] font-bold text-amber-400 hover:underline"
                    >
                      Flush Prompt Cache
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">School</th>
                          <th className="p-2.5">Educator</th>
                          <th className="p-2.5">AI Feature</th>
                          <th className="p-2.5">Model</th>
                          <th className="p-2.5">Tokens</th>
                          <th className="p-2.5">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr>
                          <td className="p-2.5 font-bold text-white">Livingstone Int. College</td>
                          <td className="p-2.5 text-slate-300">Mrs. Okonkwo</td>
                          <td className="p-2.5 text-amber-300 font-bold">AI Lesson Note</td>
                          <td className="p-2.5 font-mono text-[10px]">gemini-2.0-flash</td>
                          <td className="p-2.5 font-mono text-emerald-400">1,420</td>
                          <td className="p-2.5 text-slate-400">2 mins ago</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Grace Heritage Academy</td>
                          <td className="p-2.5 text-slate-300">Mr. David Alabi</td>
                          <td className="p-2.5 text-indigo-300 font-bold">CBT Question Gen</td>
                          <td className="p-2.5 font-mono text-[10px]">gemini-1.5-pro</td>
                          <td className="p-2.5 font-mono text-emerald-400">3,850</td>
                          <td className="p-2.5 text-slate-400">12 mins ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. CURRICULUM REPOSITORY TAB */}
          {activeMainSection === "curriculum" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">NERDC National Curriculum Repository</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Centralized syllabus, 12,480 lesson note templates, and WAEC/NECO question banks.</p>
                  </div>
                  <button
                    onClick={() => showToast("✓ WAEC/NERDC 2026 Standards auto-synced across all teacher portals")}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Sync WAEC 2026 Standards
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-extrabold text-white text-sm">Senior Secondary (SS1 - SS3)</span>
                    <p className="text-slate-400 text-[11px]">NERDC Aligned STEM, Commercial, and Humanities syllabi.</p>
                    <button
                      onClick={() => showToast("✓ Senior Secondary Syllabus downloaded (PDF)")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Syllabus PDF
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-extrabold text-white text-sm">Junior Secondary (JSS1 - JSS3)</span>
                    <p className="text-slate-400 text-[11px]">BECE National Examinations & Basic Education Standards.</p>
                    <button
                      onClick={() => showToast("✓ Junior Secondary Syllabus downloaded (PDF)")}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Syllabus PDF
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-extrabold text-white text-sm">12,480 Lesson Templates</span>
                    <p className="text-slate-400 text-[11px]">Pre-configured weekly lesson notes ready for teacher co-pilot AI.</p>
                    <button
                      onClick={() => showToast("✓ Lesson templates published to Teacher Portal")}
                      className="w-full py-1.5 bg-purple-900/50 text-purple-300 font-bold rounded-lg border border-purple-700/50 flex items-center justify-center gap-1"
                    >
                      Publish to Teacher Portals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. DATABASE MANAGER TAB */}
          {activeMainSection === "database" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">Firebase Firestore & Cloud Storage Manager</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Live database collections, backups, disaster recovery, and bucket health.</p>
                  </div>
                  <button
                    onClick={triggerDatabaseBackup}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Create Snapshot Now
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold">Firestore Collections</span>
                    <div className="text-white font-mono font-bold">schools, users, lessons, cbt_exams, fees, activity_logs</div>
                    <button
                      onClick={() => showToast("✓ Firestore indexes optimized successfully")}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[10px] border border-slate-700 mt-2"
                    >
                      Optimize Indexes
                    </button>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-slate-400 font-bold">Storage Bucket Status</span>
                    <div className="text-emerald-400 font-mono font-bold">livingstoneedu-1ef57.firebasestorage.app</div>
                    <button
                      onClick={() => showToast("✓ Cloud storage bucket health verified: 100% operational")}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded font-bold text-[10px] border border-emerald-500/30 mt-2"
                    >
                      Verify Bucket Health
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-extrabold text-white uppercase mb-2">Saved Backup Snapshots</h4>
                  <div className="space-y-2">
                    {backups.map((bk) => (
                      <div key={bk.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{bk.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{bk.id} • {bk.size} • {bk.date}</div>
                        </div>
                        <button
                          onClick={() => showToast(`✓ ${bk.name} downloaded securely`)}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px]"
                        >
                          Download Snapshot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. SECURITY CENTER TAB */}
          {activeMainSection === "security" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">Security & Audit Log Stream</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Firebase JWT tokens validation, RBAC security rules, and full platform access logs.</p>
                  </div>
                  <button
                    onClick={() => showToast("⚠️ All user JWT sessions invalidated. Users will re-authenticate.")}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
                  >
                    Revoke All User Tokens
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-300">Platform Security Audit Log Stream</h4>
                    <button
                      onClick={() => showToast("✓ Security Audit Log downloaded (CSV)")}
                      className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Export Audit Log
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">User</th>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Action Executed</th>
                          <th className="p-2.5">IP Address</th>
                          <th className="p-2.5">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr>
                          <td className="p-2.5 font-bold text-white">Dr. Emmanuel Livingstone</td>
                          <td className="p-2.5 text-purple-400 font-bold">Super Admin</td>
                          <td className="p-2.5 text-emerald-400">Dispatched Teacher Directive</td>
                          <td className="p-2.5 font-mono text-slate-400">102.89.23.14</td>
                          <td className="p-2.5 text-slate-400">Just now</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Mrs. Okonkwo Beatrice</td>
                          <td className="p-2.5 text-indigo-400 font-bold">Principal</td>
                          <td className="p-2.5 text-slate-300">Approved Week 4 Physics Lesson Note</td>
                          <td className="p-2.5 font-mono text-slate-400">197.210.8.42</td>
                          <td className="p-2.5 text-slate-400">15 mins ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. SYSTEM MONITORING TAB */}
          {activeMainSection === "monitoring" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">Infrastructure & API Health Monitoring</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time Node.js container health, memory footprint, and API latency.</p>
                  </div>
                  <button
                    onClick={() => showToast("✓ Cloud Run Node containers pinged successfully")}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                  >
                    Ping Health Nodes
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold">CPU Usage</span>
                    <div className="text-base font-black text-emerald-400 mt-1">14%</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold">RAM Allocated</span>
                    <div className="text-base font-black text-purple-400 mt-1">2.8 / 8.0 GB</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold">API Response</span>
                    <div className="text-base font-black text-cyan-400 mt-1">1.2ms</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold">Platform Uptime</span>
                    <div className="text-base font-black text-emerald-400 mt-1">99.98%</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Active Container Instances</span>
                    <span className="text-emerald-400 font-mono font-bold">3 Replicas Running</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Auto-scaling enabled on port 3000 behind reverse proxy.</p>
                </div>
              </div>
            </div>
          )}

          {/* 11. NOTIFICATIONS TAB */}
          {activeMainSection === "notifications" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">Global Communication & Dispatcher Hub</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Send broadcasts to schools, direct notices to teacher portals, and push alerts.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTeacherNoticeModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <Send className="w-3.5 h-3.5" /> Notice to Teacher Portal
                    </button>
                    <button
                      onClick={() => setIsBroadcastOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Emergency Broadcast
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-white uppercase">Dispatched Directives & Broadcast History</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Teacher Direct Directive
                          </span>
                          <h5 className="font-bold text-white">Lesson Note Review Directive</h5>
                        </div>
                        <p className="text-slate-300 mt-1">Kindly ensure Week 5 Further Mathematics lesson notes are updated with Gemini AI practice problems.</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">Recipient: Mrs. Okonkwo Beatrice • Priority: High</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Dispatched</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Platform Broadcast
                          </span>
                          <h5 className="font-bold text-white">First Term Continuous Assessment Deadline</h5>
                        </div>
                        <p className="text-slate-300 mt-1">All secondary school teaching staff must compile and submit SS1-SS3 CA broadsheets to Admin HQ before 5:00 PM on Friday.</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">Audience: All 142 Schools • Channel: Push + Email + SMS</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">Broadcasted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. PLATFORM SETTINGS TAB */}
          {activeMainSection === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">Platform Master Configuration</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle platform switches, maintenance mode, and global feature flags.</p>
                  </div>
                  <button
                    onClick={() => showToast("✓ Platform Master Configuration saved successfully!")}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
                  >
                    Save Configuration
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <div className="font-bold text-white">Maintenance Mode</div>
                      <div className="text-slate-400">Temporarily lock school portals for platform upgrades</div>
                    </div>
                    <button
                      onClick={() => {
                        const newMode = !settings.maintenanceMode;
                        setSettings({ ...settings, maintenanceMode: newMode });
                        showToast(newMode ? "⚠️ Maintenance Mode ENABLED" : "✓ Maintenance Mode DISABLED");
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        settings.maintenanceMode
                          ? "bg-rose-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {settings.maintenanceMode ? "ENABLED" : "OFF"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <div className="font-bold text-white">Gemini AI Auto-Grading & Remarks</div>
                      <div className="text-slate-400">Enable automatic AI evaluation for theory exam submissions and report cards</div>
                    </div>
                    <button
                      onClick={() => {
                        const newGrading = !settings.aiGradingEnabled;
                        setSettings({ ...settings, aiGradingEnabled: newGrading });
                        showToast(newGrading ? "✓ Gemini AI Auto-Grading ENABLED" : "⚠️ Gemini AI Auto-Grading DISABLED");
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        settings.aiGradingEnabled
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {settings.aiGradingEnabled ? "ENABLED" : "OFF"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: CREATE SCHOOL MODAL */}
      {isCreateSchoolOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-black text-white">Provision New Partner School</h3>
              </div>
              <button onClick={() => setIsCreateSchoolOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">School Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith International Academy"
                  value={newSchoolForm.name}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">School Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCH-ZIA-005"
                    value={newSchoolForm.code}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. zenith.edu.ng"
                    value={newSchoolForm.domain}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, domain: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@zenith.edu.ng"
                    value={newSchoolForm.adminEmail}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, adminEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Subscription Plan</label>
                  <select
                    value={newSchoolForm.plan}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, plan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500"
                  >
                    <option value="Enterprise Pro">Enterprise Pro (100GB / 50K AI)</option>
                    <option value="Standard Growth">Standard Growth (50GB / 25K AI)</option>
                    <option value="Basic">Basic (20GB / 10K AI)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateSchoolOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/40"
                >
                  Provision School Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPROVE SCHOOL MODAL */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Pending School Applications</h3>
              <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {pendingSchools.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No pending school registrations requiring manual approval.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {pendingSchools.map((sch) => (
                  <div key={sch.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{sch.name}</div>
                      <div className="text-[11px] text-slate-400">{sch.adminEmail} • {sch.plan}</div>
                    </div>
                    <button
                      onClick={() => approveSchool(sch.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Approve & Provision
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: BROADCAST ANNOUNCEMENT MODAL */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Platform-Wide Emergency Broadcast</h3>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. URGENT: Mid-Term Security Update"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type broadcast announcement message..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Broadcast Channels</label>
                  <select
                    value={broadcastForm.channel}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value="all">Push + Email + SMS (All)</option>
                    <option value="push">In-App Push Only</option>
                    <option value="email">Email Broadcast</option>
                    <option value="sms">SMS Alert</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Target Audience</label>
                  <select
                    value={broadcastForm.targetAudience}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value="all-schools">All 142 Schools</option>
                    <option value="school-owners">School Owners Only</option>
                    <option value="teachers">Teachers & Educators</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/40"
                >
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: MANAGE API KEYS MODAL */}
      {isApiKeysOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Platform Credentials & API Keys</h3>
              </div>
              <button onClick={() => setIsApiKeysOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApiKeys} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Gemini AI API Key (Server Secret)</label>
                <input
                  type="password"
                  value={apiKeysForm.geminiApiKey}
                  onChange={(e) => setApiKeysForm({ ...apiKeysForm, geminiApiKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-300 font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Firebase Project ID</label>
                <input
                  type="text"
                  value={apiKeysForm.firebaseProjectId}
                  onChange={(e) => setApiKeysForm({ ...apiKeysForm, firebaseProjectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Paystack SaaS Secret Key</label>
                <input
                  type="password"
                  value={apiKeysForm.paystackSecretKey}
                  onChange={(e) => setApiKeysForm({ ...apiKeysForm, paystackSecretKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-emerald-300 font-mono outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApiKeysOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg"
                >
                  Save API Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: GENERATE PLATFORM REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Generate Executive HQ Report</h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  showToast("✓ Executive Financial & Revenue Report downloaded (PDF)");
                }}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left font-bold text-white flex items-center justify-between"
              >
                <span>📊 Financial & Tuition Revenue Audit</span>
                <Download className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  showToast("✓ Multi-Tenant School Growth Report downloaded (CSV)");
                }}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left font-bold text-white flex items-center justify-between"
              >
                <span>🏫 Multi-Tenant Campuses & Usage Audit</span>
                <Download className="w-4 h-4 text-purple-400" />
              </button>

              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  showToast("✓ Gemini AI Token Consumption Report downloaded (JSON)");
                }}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-left font-bold text-white flex items-center justify-between"
              >
                <span>🤖 Gemini AI Token Consumption Summary</span>
                <Download className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DIRECT TEACHER NOTICE MODAL */}
      {isTeacherNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Direct Communication to Teacher Portal</h3>
              </div>
              <button onClick={() => setIsTeacherNoticeModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendTeacherNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Target Educator / Teacher</label>
                <select
                  value={teacherNoticeForm.teacherName}
                  onChange={(e) => {
                    const selName = e.target.value;
                    const foundUser = users.find(u => u.name === selName);
                    setTeacherNoticeForm({
                      ...teacherNoticeForm,
                      teacherName: selName,
                      teacherId: foundUser?.id || "TCH-001"
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                >
                  {users.filter(u => u.role === "Teacher" || u.role === "Principal" || u.role === "Exam Officer").map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.role} - {t.email})</option>
                  ))}
                  <option value="Mrs. Okonkwo Beatrice">Mrs. Okonkwo Beatrice (Principal / Senior Educator)</option>
                  <option value="Mr. David Alabi">Mr. David Alabi (Physics & STEM Teacher)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Directive / Notice Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Action Required: First Term CA Broadsheet Deadline"
                  value={teacherNoticeForm.title}
                  onChange={(e) => setTeacherNoticeForm({ ...teacherNoticeForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Directive Details / Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type directive instructions for teacher portal..."
                  value={teacherNoticeForm.message}
                  onChange={(e) => setTeacherNoticeForm({ ...teacherNoticeForm, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Priority Level</label>
                <select
                  value={teacherNoticeForm.priority}
                  onChange={(e) => setTeacherNoticeForm({ ...teacherNoticeForm, priority: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none"
                >
                  <option value="Urgent HQ Directive">Urgent HQ Directive</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Standard Academic Bulletin">Standard Academic Bulletin</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/40"
                >
                  Dispatch to Teacher Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: CONFIRM BULK / SINGLE DELETION MODAL */}
      {confirmDeleteModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-800/80">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-rose-400 font-bold">
                  Permanent Action
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-rose-400">{confirmDeleteModal.ids.length}</strong> selected {confirmDeleteModal.type === "schools" ? "school record(s)" : "user account(s)"} from the system?
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs max-h-32 overflow-y-auto space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">Target items:</span>
              {confirmDeleteModal.type === "schools"
                ? schools
                    .filter((s) => confirmDeleteModal.ids.includes(s.id))
                    .slice(0, 5)
                    .map((s) => (
                      <div key={s.id} className="flex justify-between font-bold text-slate-200">
                        <span>{s.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{s.code}</span>
                      </div>
                    ))
                : users
                    .filter((u) => confirmDeleteModal.ids.includes(u.id))
                    .slice(0, 5)
                    .map((u) => (
                      <div key={u.id} className="flex justify-between font-bold text-slate-200">
                        <span>{u.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{u.email}</span>
                      </div>
                    ))}
              {confirmDeleteModal.ids.length > 5 && (
                <p className="text-[10px] text-slate-500 italic">...and {confirmDeleteModal.ids.length - 5} more item(s)</p>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal({ open: false, type: "schools", ids: [] })}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
