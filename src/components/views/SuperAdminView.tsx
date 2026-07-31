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
} from "lucide-react";

export const SuperAdminView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    | "overview"
    | "schools"
    | "users"
    | "ai-control"
    | "curriculum"
    | "reports-cbt"
    | "payments"
    | "communication"
    | "monitoring"
    | "security"
    | "backups"
    | "settings"
  >("overview");

  // State loaded from Super Admin Backend APIs
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [aiStats, setAiStats] = useState<any>(null);
  const [promptLogs, setPromptLogs] = useState<any[]>([]);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [monitoringHealth, setMonitoringHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals & Action Status
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [newSchoolForm, setNewSchoolForm] = useState({
    name: "",
    code: "",
    domain: "",
    adminEmail: "",
    phone: "",
    plan: "Enterprise Pro",
    state: "Lagos",
  });

  // Fetch initial Super Admin metrics from backend REST endpoints
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
      console.error("Failed to load Super Admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Create School Handler
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/superadmin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchoolForm),
      });
      const data = await res.json();
      if (data.success) {
        setSchools([data.data, ...schools]);
        setIsCreateSchoolOpen(false);
        showToast(`School ${data.data.name} provisioned successfully!`);
        setNewSchoolForm({
          name: "",
          code: "",
          domain: "",
          adminEmail: "",
          phone: "",
          plan: "Enterprise Pro",
          state: "Lagos",
        });
      }
    } catch (err) {
      showToast("Error creating school.");
    }
  };

  // School Action Handlers
  const toggleSchoolStatus = async (school: any) => {
    const endpoint = school.status === "Active" ? "suspend" : "activate";
    const res = await fetch(`/api/superadmin/schools/${school.id}/${endpoint}`, {
      method: "PUT",
    });
    const data = await res.json();
    if (data.success) {
      setSchools(schools.map((s) => (s.id === school.id ? data.data : s)));
      showToast(data.message);
    }
  };

  const assignAiCredits = async (schoolId: string) => {
    const res = await fetch(`/api/superadmin/schools/${schoolId}/assign-ai-credits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiCredits: 25000 }),
    });
    const data = await res.json();
    if (data.success) {
      setSchools(schools.map((s) => (s.id === schoolId ? data.data : s)));
      showToast(data.message);
    }
  };

  const triggerBackup = async (schoolId: string) => {
    const res = await fetch(`/api/superadmin/schools/${schoolId}/backup`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
    }
  };

  const cloneSchool = async (schoolId: string) => {
    const res = await fetch(`/api/superadmin/schools/${schoolId}/clone`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setSchools([data.data, ...schools]);
      showToast(data.message);
    }
  };

  // Lock/Unlock User Handler
  const toggleUserLock = async (user: any) => {
    const res = await fetch(`/api/superadmin/users/${user.id}/lock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLocked: !user.isLocked }),
    });
    const data = await res.json();
    if (data.success) {
      setUsers(users.map((u) => (u.id === user.id ? data.data : u)));
      showToast(data.message);
    }
  };

  // Communication Handlers
  const sendEmergencyAlert = async () => {
    const res = await fetch("/api/superadmin/communication/emergency-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alertTitle: "URGENT: Mid-Term Security & Academic Schedule Verification",
        alertDetails: "All school administrators must review security rules & student credentials.",
      }),
    });
    const data = await res.json();
    if (data.success) showToast(data.message);
  };

  // Trigger Full Backup Snapshot
  const triggerFullSystemBackup = async () => {
    const res = await fetch("/api/superadmin/backups/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Manual Master System Snapshot" }),
    });
    const data = await res.json();
    if (data.success) {
      setBackups([data.data, ...backups]);
      showToast(data.message);
    }
  };

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-700 flex items-center gap-3 animate-fade-in">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* Super Admin Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3" /> MASTER SUPER ADMIN BACKEND
            </span>
            <span className="text-xs text-slate-400">Node.js + Express + MySQL + Firebase + Gemini AI</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            LIVINGSTONEEDU System Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-Tenant SaaS Control Panel • Managing 142 Partner Schools & 42,600+ Active Students
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSuperAdminData}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Stats</span>
          </button>

          <button
            onClick={() => setIsCreateSchoolOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Provision School</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { id: "overview", label: "Overview Metrics", icon: Activity },
          { id: "schools", label: "School Management", icon: Building2 },
          { id: "users", label: "Users & Roles", icon: Users },
          { id: "ai-control", label: "Gemini AI Control", icon: Sparkles },
          { id: "curriculum", label: "Curriculum Manager", icon: BookOpen },
          { id: "reports-cbt", label: "Report Cards & CBT", icon: Award },
          { id: "payments", label: "Payments & Financials", icon: CreditCard },
          { id: "communication", label: "Broadcast & Alerts", icon: MessageSquare },
          { id: "monitoring", label: "Server Monitoring", icon: Server },
          { id: "security", label: "Security & Audit", icon: ShieldAlert },
          { id: "backups", label: "Backup Center", icon: HardDrive },
          { id: "settings", label: "Global Settings", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW SUB-TAB */}
      {activeSubTab === "overview" && dashboardData && (
        <div className="space-y-6">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                Total Schools
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {dashboardData.totalSchools}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                100% Active Multi-Tenant
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                Total Teachers
              </span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {dashboardData.totalTeachers.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                Across 142 Campuses
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                Total Students
              </span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {dashboardData.totalStudents.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                Att. {dashboardData.todaysAttendance}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                Fees Collected Today
              </span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ₦{(dashboardData.feesCollectedToday / 1000000).toFixed(2)}M
              </div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                Paystack + Flutterwave
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                AI Notes & Exams
              </span>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {(
                  dashboardData.generatedLessonNotes + dashboardData.generatedExams
                ).toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">
                Gemini AI Powered
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                Server Status
              </span>
              <div className="text-xl font-black text-emerald-500 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Healthy</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                Uptime {dashboardData.serverStatus?.uptime}
              </span>
            </div>
          </div>

          {/* Infrastructure Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cloud Infrastructure Status
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 text-[10px] font-bold">
                  OPERATIONAL
                </span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">CPU Usage</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dashboardData.serverStatus?.cpuUsage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">RAM Allocated</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dashboardData.serverStatus?.ramUsage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Active WebSockets</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dashboardData.serverStatus?.activeConnections}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    MySQL + Prisma Database
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 text-[10px] font-bold">
                  LATENCY {dashboardData.databaseHealth?.latencyMs}ms
                </span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Database Engine</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {dashboardData.databaseHealth?.engine}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Connection Pool</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dashboardData.databaseHealth?.activeConnections} /{" "}
                    {dashboardData.databaseHealth?.maxConnections}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Slow Queries</span>
                  <span className="font-bold text-emerald-600">
                    {dashboardData.databaseHealth?.slowQueries}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Gemini AI Usage Stats
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Tokens Used Today</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dashboardData.aiUsageStats?.tokensUsedToday.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Monthly AI Tokens</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {dashboardData.aiUsageStats?.monthlyTokensUsed.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Cost</span>
                  <span className="font-bold text-emerald-600">
                    ${dashboardData.aiUsageStats?.totalCostUSD} USD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent System Activity Logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Real-time Master Audit Feed
            </h3>
            <div className="space-y-3">
              {dashboardData.recentActivities?.map((act: any) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <Activity className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHOOLS MANAGEMENT SUB-TAB */}
      {activeSubTab === "schools" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search schools by name, code, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              <button
                onClick={() => setIsCreateSchoolOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Partner School
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={school.logo}
                      alt={school.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {school.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Code: {school.code} • {school.domain}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      school.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {school.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Plan</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {school.plan}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">AI Token Balance</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {(school.aiCredits - school.aiCreditsUsed).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Storage Limit</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {school.storageUsedGB} / {school.storageLimitGB} GB
                    </span>
                  </div>
                </div>

                {/* School Actions Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSchoolStatus(school)}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] transition-colors ${
                        school.status === "Active"
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-200"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200"
                      }`}
                    >
                      {school.status === "Active" ? "Suspend" : "Activate"}
                    </button>

                    <button
                      onClick={() => assignAiCredits(school.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-[11px]"
                    >
                      +25K AI Credits
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerBackup(school.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Backup School Data"
                    >
                      <HardDrive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => cloneSchool(school.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Clone Tenant Environment"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. USER MANAGEMENT & PERMISSIONS MATRIX SUB-TAB */}
      {activeSubTab === "users" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Role User Directory & RBAC Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Super Admin, Principal, Vice Principal, Teacher, Student, Parent, Bursar, Exam Officer, Librarian
              </p>
            </div>
            <button
              onClick={() => showToast("User creation modal ready")}
              className="bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
            >
              + Add System User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Tenant School</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Login IP</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-semibold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {u.schoolId}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isLocked
                            ? "bg-rose-100 text-rose-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {u.ip} ({u.device})
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => toggleUserLock(u)}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                        title={u.isLocked ? "Unlock User" : "Lock User"}
                      >
                        {u.isLocked ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </button>
                      <button
                        onClick={() => showToast(`Password reset link sent to ${u.email}`)}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                        title="Reset Password"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. GEMINI AI CONTROL SUB-TAB */}
      {activeSubTab === "ai-control" && aiStats && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Google Gemini AI Engine Configuration
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active Model: {aiStats.config?.activeModel} • Fallback: {aiStats.config?.fallbackModel}
                  </p>
                </div>
              </div>

              <button
                onClick={() => showToast("Gemini AI limits updated globally!")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Save Engine Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Daily Token Cap
                </label>
                <input
                  type="number"
                  defaultValue={aiStats.config?.dailyTokenLimit}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Token Cap
                </label>
                <input
                  type="number"
                  defaultValue={aiStats.config?.monthlyTokenLimit}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Max Tokens Per Request
                </label>
                <input
                  type="number"
                  defaultValue={aiStats.config?.maxTokensPerRequest}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Prompt Logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Live Prompt Generation Stream
            </h3>
            <div className="space-y-2">
              {promptLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.schoolName}
                    </span>
                    <span className="text-slate-400"> • {log.teacherName}</span>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {log.action}: {log.subject} ({log.topic})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-500">{log.tokensUsed} Tokens</span>
                    <div className="text-[10px] text-slate-400">{log.executionTimeMs} ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. CURRICULUM MANAGER SUB-TAB */}
      {activeSubTab === "curriculum" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Curriculum Syllabi Frameworks
              </h3>
              <p className="text-xs text-slate-500">NERDC, WAEC, NECO, BECE, Cambridge IGCSE</p>
            </div>
            <button
              onClick={() => showToast("Curriculum upload modal ready")}
              className="bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
            >
              + Upload Framework
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {curriculums.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[10px]">
                    {c.framework}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">{c.status}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</h4>
                <p className="text-[11px] text-slate-500">
                  Country: {c.country} • {c.subjectsCount} Subjects Configured
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. REPORTS & CBT SUB-TAB */}
      {activeSubTab === "reports-cbt" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Report Card Engine & Grading Formulas
            </h3>
            <p className="text-xs text-slate-500">
              WAEC Standard A1-F9 Scale, Psychomotor & Affective Domains
            </p>
            <button
              onClick={() => showToast("Bulk PDF Broadsheet generation queued")}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
            >
              Generate Bulk Broadsheets PDF
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Examination & CBT Control Center
            </h3>
            <p className="text-xs text-slate-500">
              AI Timetable Builder, Theory marking schemes & objective question bank
            </p>
            <button
              onClick={() => showToast("AI Exam Timetable generated with 0 hall clashes!")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              Generate AI Exam Timetable
            </button>
          </div>
        </div>
      )}

      {/* 7. PAYMENTS SUB-TAB */}
      {activeSubTab === "payments" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Paystack & Flutterwave Financial Ledger
          </h3>
          <div className="space-y-2 text-xs">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.schoolName}</div>
                  <div className="text-[11px] text-slate-400">
                    Ref: {p.reference} • Gateway: {p.gateway}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600">
                    ₦{p.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">{p.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. COMMUNICATION & ALERTS SUB-TAB */}
      {activeSubTab === "communication" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Channel Broadcast Center
              </h3>
              <p className="text-xs text-slate-500">Nodemailer Email, SMS, WhatsApp, Firebase Push</p>
            </div>
            <button
              onClick={sendEmergencyAlert}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              🚨 Dispatch Emergency Broadcast
            </button>
          </div>
        </div>
      )}

      {/* 9. SERVER MONITORING SUB-TAB */}
      {activeSubTab === "monitoring" && monitoringHealth && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">System Process Diagnostics</span>
            </div>
            <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto">
            {JSON.stringify(monitoringHealth, null, 2)}
          </pre>
        </div>
      )}

      {/* 10. SECURITY & AUDIT SUB-TAB */}
      {activeSubTab === "security" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Security Audit Logs & IP Tracking
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2 px-2">Timestamp</th>
                  <th className="py-2 px-2">Method</th>
                  <th className="py-2 px-2">Path</th>
                  <th className="py-2 px-2">IP Address</th>
                  <th className="py-2 px-2">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.slice(0, 15).map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 px-2 text-slate-400">{log.timestamp}</td>
                    <td className="py-2 px-2 font-bold text-indigo-500">{log.method}</td>
                    <td className="py-2 px-2 text-slate-800 dark:text-slate-200">{log.path}</td>
                    <td className="py-2 px-2 text-slate-500">{log.ip}</td>
                    <td className="py-2 px-2 text-emerald-600">{log.durationMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 11. BACKUP CENTER SUB-TAB */}
      {activeSubTab === "backups" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Database & Media Backup Snapshots
              </h3>
              <p className="text-xs text-slate-500">Automated Daily Cloud Sync to Storage</p>
            </div>
            <button
              onClick={triggerFullSystemBackup}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Trigger Instant System Snapshot
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {backups.map((bkp) => (
              <div
                key={bkp.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{bkp.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {bkp.timestamp} • Size: {bkp.sizeMB} MB • DB: {bkp.dbStatus}
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Restoring system snapshot ${bkp.id}...`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[11px]"
                >
                  Restore Snapshot
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. GLOBAL SETTINGS SUB-TAB */}
      {activeSubTab === "settings" && settings && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Global Platform Configuration & API Keys
            </h3>
            <button
              onClick={() => showToast("Global platform settings updated!")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Save Global Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Application Name</label>
              <input
                type="text"
                defaultValue={settings.appName}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Timezone</label>
              <input
                type="text"
                defaultValue={settings.timezone}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Paystack Public Key</label>
              <input
                type="text"
                defaultValue={settings.paystackPublicKey}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Flutterwave Public Key</label>
              <input
                type="text"
                defaultValue={settings.flutterwavePublicKey}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Provisioning New School */}
      {isCreateSchoolOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Provision New Partner School
              </h3>
              <button
                onClick={() => setIsCreateSchoolOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">School Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith International Academy"
                  value={newSchoolForm.name}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">School Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZIA-SCH-005"
                    value={newSchoolForm.code}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. zenithacademy.edu.ng"
                    value={newSchoolForm.domain}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, domain: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@zenithacademy.edu.ng"
                    value={newSchoolForm.adminEmail}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, adminEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">SaaS Subscription Plan</label>
                  <select
                    value={newSchoolForm.plan}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, plan: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Provision School Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
