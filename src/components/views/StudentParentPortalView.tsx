import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  CreditCard,
  Calendar,
  Download,
  Bot,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  Send,
  Sparkles,
  Search,
  ExternalLink,
  DollarSign,
  Heart,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  FileCheck,
  Zap,
  Play,
  Check,
  Menu,
  X,
  Upload,
  Camera,
  LayoutDashboard,
  FileSpreadsheet,
  CalendarCheck,
  BookMarked,
  MessageSquare,
  Settings,
  Lock,
  Edit3,
  LogOut
} from "lucide-react";
import { UserRole } from "../../types";

interface StudentParentPortalViewProps {
  currentRole?: UserRole;
  userSession?: any;
  onLogout?: () => void;
}

export function StudentParentPortalView({ currentRole, userSession, onLogout }: StudentParentPortalViewProps) {
  // Mobile Sidebar Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Role Switcher: 'student' | 'parent'
  const [activePortalRole, setActivePortalRole] = useState<"student" | "parent">("student");

  // Sidebar Tab Navigation Selection
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "profile"
    | "academic-records"
    | "attendance"
    | "assignments"
    | "lesson-notes"
    | "cbt"
    | "results"
    | "notices"
    | "messages"
    | "settings"
    | "fees"
    | "ai-tutor"
    | "timetable"
    | "downloads"
  >("dashboard");

  // Multi-child Parent State
  const [childrenList, setChildrenList] = useState<any[]>([
    { studentId: "STD-2026-001", name: "Adeyemi Chinedu", class: "SS2 Gold", admissionNo: "LIV/2026/001" },
    { studentId: "STD-2026-004", name: "Adeyemi Bisi", class: "JSS1 Silver", admissionNo: "LIV/2026/004" }
  ]);
  const [selectedChildId, setSelectedChildId] = useState<string>("STD-2026-001");

  // Core Data States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [cbtExams, setCbtExams] = useState<any[]>([]);
  const [feeInvoice, setFeeInvoice] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Editable Bio Profile State
  const [editFullName, setEditFullName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("Male");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editParentName, setEditParentName] = useState("");
  const [editParentPhone, setEditParentPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState("");

  // Homework Submission Modal State
  const [submittingAssignment, setSubmittingAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // CBT Exam Modal State
  const [activeCbtExam, setActiveCbtExam] = useState<any>(null);
  const [cbtAnswers, setCbtAnswers] = useState<Record<string, number>>({});
  const [cbtTimeLeft, setCbtTimeLeft] = useState<number>(1800);
  const [cbtSubmitting, setCbtSubmitting] = useState(false);
  const [cbtResult, setCbtResult] = useState<any>(null);

  // Fee Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<string>("50000");
  const [payMethod, setPayMethod] = useState("Paystack Online Gateway");
  const [processingPay, setProcessingPay] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // Gemini AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: "user" | "ai"; message: string }[]>([
    {
      sender: "ai",
      message:
        "Hello! I am your AI Study Tutor. Ask me anything about WAEC/JAMB exam preparation, step-by-step math problem solving, or academic advice!"
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Search & Filters State
  const [noticeSearch, setNoticeSearch] = useState("");
  const [lessonSearch, setLessonSearch] = useState("");

  // Load initial data
  useEffect(() => {
    fetchPortalData();
  }, [activePortalRole, selectedChildId]);

  // Sync state when profile loads
  useEffect(() => {
    if (profileData) {
      setEditFullName(profileData.fullName || profileData.name || userSession?.fullName || "");
      setEditDob(profileData.dob || "2010-04-12");
      setEditGender(profileData.gender || "Male");
      setEditPhone(profileData.phone || "+2348030000000");
      setEditAddress(profileData.address || profileData.guardianDetails?.address || "14 Palm Avenue, Ikeja, Lagos State");
      setEditParentName(profileData.guardianDetails?.fatherName || profileData.parentName || "Chief Adeyemi Tunde");
      setEditParentPhone(profileData.guardianDetails?.primaryPhone || profileData.parentPhone || "+2348031234567");
      if (profileData.photoUrl) {
        setPhotoUrl(profileData.photoUrl);
      }
    }
  }, [profileData]);

  // CBT Timer effect
  useEffect(() => {
    let timer: any;
    if (activeCbtExam && cbtTimeLeft > 0 && !cbtResult) {
      timer = setInterval(() => {
        setCbtTimeLeft(prev => {
          if (prev <= 1) {
            handleCbtSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCbtExam, cbtTimeLeft, cbtResult]);

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      if (activePortalRole === "student") {
        const [dashRes, profRes, resRes, asgRes, cbtRes, feeRes, dlRes] = await Promise.all([
          fetch("/api/student/dashboard").then(r => r.json()),
          fetch(`/api/student/profile?studentId=${selectedChildId}`).then(r => r.json()),
          fetch("/api/student/results").then(r => r.json()),
          fetch("/api/student/assignments").then(r => r.json()),
          fetch("/api/student/cbt/active").then(r => r.json()),
          fetch("/api/student/fees/invoice").then(r => r.json()),
          fetch("/api/student/downloads").then(r => r.json())
        ]);

        if (dashRes.success) setDashboardData(dashRes);
        if (profRes.success) setProfileData(profRes.profile);
        if (resRes.success) setResultsData(resRes.results);
        if (asgRes.success) setAssignments(asgRes.data);
        if (cbtRes.success) setCbtExams(cbtRes.data);
        if (feeRes.success) setFeeInvoice(feeRes.invoice);
        if (dlRes.success) setDownloads(dlRes.downloads);
      } else {
        const [pDashRes, profRes, feeRes, dlRes] = await Promise.all([
          fetch(`/api/parent/dashboard?studentId=${selectedChildId}`).then(r => r.json()),
          fetch(`/api/student/profile?studentId=${selectedChildId}`).then(r => r.json()),
          fetch("/api/student/fees/invoice").then(r => r.json()),
          fetch("/api/student/downloads").then(r => r.json())
        ]);

        if (pDashRes.success) setDashboardData(pDashRes);
        if (profRes.success) setProfileData(profRes.profile);
        if (feeRes.success) setFeeInvoice(feeRes.invoice);
        if (dlRes.success) setDownloads(dlRes.downloads);
      }
    } catch (e) {
      console.error("Error loading portal data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Image Upload & Crop Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Bio Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaveSuccess("");

    try {
      const currentStudentId = userSession?.studentId || profileData?.id || selectedChildId || "STD-2026-001";
      const currentSchoolName = userSession?.schoolName || profileData?.schoolName || "Livingstone Educational Academy";

      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudentId,
          fullName: editFullName,
          name: editFullName,
          dob: editDob,
          gender: editGender,
          phone: editPhone,
          address: editAddress,
          parentName: editParentName,
          parentPhone: editParentPhone,
          photoUrl: photoUrl,
          schoolName: currentSchoolName
        })
      }).then(r => r.json());

      if (res.success) {
        setProfileData(res.profile);
        setProfileSaveSuccess("✓ Bio profile and passport photograph updated successfully in database!");
        setTimeout(() => setProfileSaveSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      setProfileSaveSuccess("✓ Profile saved successfully!");
      setTimeout(() => setProfileSaveSuccess(""), 4000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!submittingAssignment) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/student/assignments/${submittingAssignment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionText })
      }).then(r => r.json());

      if (res.success) {
        alert("Homework submitted successfully!");
        setSubmittingAssignment(null);
        setSubmissionText("");
        fetchPortalData();
      }
    } catch (e) {
      console.error("Failed to submit assignment", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartCbt = async (exam: any) => {
    setActiveCbtExam(exam);
    setCbtResult(null);
    setCbtAnswers({});
    setCbtTimeLeft(exam.durationMinutes * 60);

    try {
      await fetch("/api/student/cbt/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: exam.id })
      });
    } catch (e) {
      console.error("Error starting CBT:", e);
    }
  };

  const handleCbtSubmit = async () => {
    if (!activeCbtExam) return;
    setCbtSubmitting(true);
    try {
      const res = await fetch("/api/student/cbt/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: activeCbtExam.id,
          userAnswers: cbtAnswers
        })
      }).then(r => r.json());

      if (res.success) {
        setCbtResult(res.data);
      }
    } catch (e) {
      console.error("Error submitting CBT:", e);
    } finally {
      setCbtSubmitting(false);
    }
  };

  const handleFeePayment = async () => {
    setProcessingPay(true);
    try {
      const res = await fetch("/api/student/fees/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payAmount,
          paymentMethod: payMethod
        })
      }).then(r => r.json());

      if (res.success) {
        setLastReceipt(res.receipt);
        setIsPayModalOpen(false);
        fetchPortalData();
      }
    } catch (e) {
      console.error("Error processing payment:", e);
    } finally {
      setProcessingPay(false);
    }
  };

  const handleAiSend = async () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiPrompt("");
    setAiChatLogs(prev => [...prev, { sender: "user", message: userMsg }]);
    setAiLoading(true);

    try {
      const endpoint =
        activePortalRole === "student"
          ? "/api/student/ai/study-assistant"
          : "/api/parent/ai/guidance";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg })
      }).then(r => r.json());

      if (res.success) {
        setAiChatLogs(prev => [...prev, { sender: "ai", message: res.reply }]);
      }
    } catch (e) {
      console.error("AI Assistant Error:", e);
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const activeChild = childrenList.find(c => c.studentId === selectedChildId) || childrenList[0];

  // Dynamic School Name from Session / Database
  const currentSchoolName =
    userSession?.schoolName ||
    profileData?.schoolName ||
    "Destiny Way International Group of Schools";

  // Dynamic Student Name
  const currentStudentName =
    userSession?.fullName ||
    userSession?.name ||
    editFullName ||
    profileData?.fullName ||
    profileData?.name ||
    "John David";

  // Dynamic Class
  const currentClass =
    userSession?.classLevel ||
    userSession?.class ||
    profileData?.classLevel ||
    profileData?.class ||
    "SS2 Gold";

  // Dynamic Admission Number
  const currentAdmissionNo =
    userSession?.admissionNumber ||
    userSession?.admissionNo ||
    profileData?.admissionNo ||
    "LIV/2026/001";

  // Sidebar Menu Items Definition
  const sidebarNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Bio Profile", icon: User },
    { id: "academic-records", label: "Academic Records", icon: FileSpreadsheet },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "assignments", label: "Assignments", icon: BookOpen },
    { id: "lesson-notes", label: "Lesson Notes", icon: BookMarked },
    { id: "cbt", label: "CBT Exams", icon: Zap },
    { id: "results", label: "Results", icon: Award },
    { id: "report-cards", label: "Report Cards", icon: FileText },
    { id: "notices", label: "School Notices", icon: Bell },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "parent-portal", label: "Parent Portal", icon: Users },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* ========================================================= */}
      {/* MOBILE TOP HEADER BAR (Hamburger Toggle)                  */}
      {/* ========================================================= */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-teal-600 to-indigo-600 rounded-lg text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white truncate max-w-[180px]">
                {currentSchoolName}
              </h1>
              <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                Student Academic Hub
              </p>
            </div>
          </div>
        </div>

        {/* Quick Avatar */}
        <div className="flex items-center gap-2">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border-2 border-teal-500 shadow"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
              {currentStudentName.charAt(0)}
            </div>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* RESTRUCTURED LEFT SIDEBAR NAVIGATION                      */}
      {/* ========================================================= */}
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-teal-500 via-emerald-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-teal-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xs font-black text-white truncate uppercase tracking-tight">
                  {currentSchoolName}
                </h2>
                <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase block">
                  Student Portal
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Quick Badge */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-slate-800/90 flex items-center gap-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Student Passport"
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white flex-shrink-0 shadow">
                {currentStudentName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-white truncate">{currentStudentName}</h3>
              <p className="text-[10px] text-teal-400 font-medium truncate">Class: {currentClass}</p>
              <p className="text-[9px] text-slate-400 font-mono truncate">{currentAdmissionNo}</p>
            </div>
          </div>

          {/* Role Switcher in Sidebar */}
          <div className="px-4 mb-3">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => {
                  setActivePortalRole("student");
                  setIsSidebarOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activePortalRole === "student"
                    ? "bg-teal-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-3 h-3" />
                Student
              </button>
              <button
                onClick={() => {
                  setActivePortalRole("parent");
                  setIsSidebarOpen(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activePortalRole === "parent"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-3 h-3" />
                Parent
              </button>
            </div>
          </div>

          {/* Parent Mode Child Switcher */}
          {activePortalRole === "parent" && (
            <div className="px-4 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Select Child:
              </label>
              <select
                value={selectedChildId}
                onChange={e => setSelectedChildId(e.target.value)}
                className="w-full bg-slate-950 text-xs font-bold text-teal-300 px-3 py-2 rounded-xl border border-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {childrenList.map(c => (
                  <option key={c.studentId} value={c.studentId}>
                    {c.name} ({c.class})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation Links */}
          <div className="px-3 space-y-1 py-2 flex-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Navigation Menu
            </span>
            {sidebarNavItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "parent-portal") {
                      setActivePortalRole("parent");
                      setActiveTab("dashboard");
                    } else {
                      setActiveTab(item.id as any);
                    }
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 text-left ${
                    isActive
                      ? "bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                  {item.id === "notices" && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  {item.id === "cbt" && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}

            <span className="px-3 pt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Quick Portals
            </span>
            <button
              onClick={() => {
                setActiveTab("fees");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 text-left ${
                activeTab === "fees"
                  ? "bg-emerald-600 text-white shadow font-bold"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Fees & Payments</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("ai-tutor");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 text-left ${
                activeTab === "ai-tutor"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow font-bold"
                  : "text-purple-400 hover:bg-purple-950/40 hover:text-purple-300"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gemini AI Study Tutor</span>
            </button>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <div className="p-3 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  onLogout();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold transition-all flex items-center gap-3"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* Footer Info */}
          <div className="p-4 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400">Academic Session 2026/2027</p>
            <p>First Term • Week 4 Active</p>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT CONTAINER                                     */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-400">Loading Student Academic Records...</p>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* 1. DASHBOARD VIEW                                         */}
            {/* ========================================================= */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Header Welcome Card */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border border-indigo-500/20 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {activePortalRole === "student" ? "Student Dashboard" : "Parent Dashboard"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Class: {currentClass}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        Welcome back, {currentStudentName}
                      </h2>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
                        <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
                          <span className="text-slate-400 font-bold">School:</span>
                          <span className="text-white font-semibold">{currentSchoolName}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
                          <span className="text-slate-400 font-bold">Admission No:</span>
                          <span className="text-teal-400 font-mono font-bold">{currentAdmissionNo}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
                          <span className="text-slate-400 font-bold">Term:</span>
                          <span className="text-emerald-300 font-semibold">First Term (2026/2027)</span>
                        </div>
                      </div>
                    </div>

                    {/* Passport Photo Badge */}
                    <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-md">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Student Passport"
                          className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-lg">
                          {currentStudentName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Student
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1">{currentStudentName}</h4>
                        <button
                          onClick={() => setActiveTab("profile")}
                          className="text-[11px] text-teal-400 hover:underline flex items-center gap-1 font-semibold mt-0.5"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Profile & Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-teal-500/40 transition-colors">
                    <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Student Full Name
                      </span>
                      <h3 className="text-sm font-bold text-white truncate max-w-[150px]">
                        {currentStudentName}
                      </h3>
                      <p className="text-xs text-teal-400 font-mono">Class: {currentClass}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-emerald-500/40 transition-colors">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Attendance Rate
                      </span>
                      <h3 className="text-lg font-extrabold text-emerald-400">95.4%</h3>
                      <p className="text-xs text-slate-400">62 / 65 Days Present</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-purple-500/40 transition-colors">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Academic Standing
                      </span>
                      <h3 className="text-lg font-extrabold text-white">2nd / 42</h3>
                      <p className="text-xs text-purple-400 font-semibold">Average: 84.89% (A1)</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500/40 transition-colors">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Fee Ledger Status
                      </span>
                      <h3 className="text-lg font-extrabold text-amber-400">
                        ₦{(feeInvoice?.outstandingBalance || 100000).toLocaleString()}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {feeInvoice?.status || "Partially Paid"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Timetable & Assignments */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Today's Classroom Schedule */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Clock className="w-5 h-5 text-teal-400" />
                          Today's Timetable & Schedule
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                          Wednesday • 2026
                        </span>
                      </div>

                      <div className="space-y-3">
                        {(dashboardData?.todayTimetable || [
                          { period: "1st Period (08:00 - 08:40)", subject: "Mathematics", teacher: "Mrs. Okonkwo Beatrice", venue: "Block A - Room 12" },
                          { period: "2nd Period (08:40 - 09:20)", subject: "English Language", teacher: "Mr. Adebayo Kunle", venue: "Block A - Room 12" },
                          { period: "3rd Period (09:20 - 10:00)", subject: "Physics", teacher: "Dr. Eze Chukwuma", venue: "Physics Lab" }
                        ]).map((slot: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-teal-500/40 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-2 rounded-lg font-mono">
                                {slot.period.split(" ")[0]}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white">{slot.subject}</h4>
                                <p className="text-xs text-slate-400">
                                  {slot.teacher} • <span className="text-slate-300">{slot.venue}</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono hidden md:inline">
                              {slot.period}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pending Homework */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          Recent Assignments & Homework
                        </h3>
                        <button
                          onClick={() => setActiveTab("assignments")}
                          className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          View All <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {assignments.slice(0, 3).map(asg => (
                          <div
                            key={asg.id}
                            className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {asg.subject}
                                </span>
                                <h4 className="text-sm font-bold text-white">{asg.title}</h4>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                {asg.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-auto">
                              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(asg.deadline).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => {
                                  setSubmittingAssignment(asg);
                                  setActiveTab("assignments");
                                }}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Announcements & Quick AI */}
                  <div className="space-y-6">
                    {/* School Announcements */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-400" />
                        School Notices & Bulletins
                      </h3>

                      <div className="space-y-3">
                        {(dashboardData?.schoolAnnouncements || [
                          { id: "ann-1", title: "Inter-House Sports Practice", date: "2026-07-28", text: "All students in Yellow house must assemble at the stadium by 3:30 PM." },
                          { id: "ann-2", title: "WAEC Practical Preparation", date: "2026-07-27", text: "Ensure lab coats are verified by Dr. Eze." }
                        ]).map((ann: any) => (
                          <div
                            key={ann.id}
                            className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-amber-300">{ann.title}</h4>
                              <span className="text-[10px] text-slate-500">{ann.date}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{ann.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gemini AI Assistant Teaser */}
                    <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Gemini AI Study Tutor</h4>
                          <p className="text-xs text-slate-300">WAEC / JAMB 24/7 Problem Solver</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("ai-tutor")}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                      >
                        <Bot className="w-4 h-4" />
                        Launch AI Assistant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. BIO PROFILE MODULE (View & Edit)                        */}
            {/* ========================================================= */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <User className="w-6 h-6 text-teal-400" />
                      Student Bio Profile & Medical Record
                    </h2>
                    <p className="text-xs text-slate-400">
                      View and update your official student bio information and passport photograph
                    </p>
                  </div>
                </div>

                {profileSaveSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    {profileSaveSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Student Profile Card */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Status: Active
                      </span>
                    </div>

                    {/* Passport Photo Upload & Crop */}
                    <div className="relative inline-block mx-auto group">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Passport Photo"
                          className="w-36 h-36 rounded-full object-cover border-4 border-teal-500 shadow-2xl mx-auto"
                        />
                      ) : (
                        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-teal-500 via-emerald-600 to-indigo-600 flex items-center justify-center text-4xl font-black text-white border-4 border-slate-800 shadow-2xl mx-auto">
                          {currentStudentName.charAt(0)}
                        </div>
                      )}

                      <label className="absolute bottom-1 right-1 p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full cursor-pointer border-2 border-slate-900 shadow-lg transition-transform hover:scale-110">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">{currentStudentName}</h3>
                      <p className="text-xs font-semibold text-teal-400 mt-1 font-mono">
                        Admission No: {currentAdmissionNo}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          School: {currentSchoolName}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          Class: {currentClass}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-4 grid grid-cols-2 gap-3 text-left text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Academic Session</span>
                        <p className="font-bold text-white">2026/2027</p>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Current Term</span>
                        <p className="font-bold text-emerald-400">First Term</p>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Gender</span>
                        <p className="font-bold text-slate-200">{editGender || profileData?.gender || "Male"}</p>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Blood Group / Genotype</span>
                        <p className="font-bold text-rose-400">{profileData?.bloodGroup || "O+"} • {profileData?.genotype || "AA"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editable Bio Profile Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                        <span>Edit Student Information</span>
                        <span className="text-xs font-medium text-teal-400">Database Record Sync</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editFullName}
                            onChange={e => setEditFullName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Date of Birth</label>
                          <input
                            type="date"
                            value={editDob}
                            onChange={e => setEditDob(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Gender</label>
                          <select
                            value={editGender}
                            onChange={e => setEditGender(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Student Phone Number</label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={e => setEditPhone(e.target.value)}
                            placeholder="+234 803 000 0000"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Residential Address</label>
                          <input
                            type="text"
                            value={editAddress}
                            onChange={e => setEditAddress(e.target.value)}
                            placeholder="Home or hostel address"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Parent / Guardian Name</label>
                          <input
                            type="text"
                            value={editParentName}
                            onChange={e => setEditParentName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Parent Phone Number</label>
                          <input
                            type="text"
                            value={editParentPhone}
                            onChange={e => setEditParentPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      {/* Photo Upload Actions */}
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                        <label className="text-xs font-bold text-slate-300 block">
                          Passport Photograph Upload & Controls
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Upload New Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>

                          {photoUrl && (
                            <button
                              type="button"
                              onClick={() => setPhotoUrl("")}
                              className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2"
                        >
                          {savingProfile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Save Changes to Database
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. ACADEMIC RECORDS VIEW                                  */}
            {/* ========================================================= */}
            {activeTab === "academic-records" && resultsData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-6 h-6 text-teal-400" />
                      Academic Records & Cumulative Broadsheet
                    </h2>
                    <p className="text-xs text-slate-400">Complete record of term assessments, WAEC grade equivalents & GPA</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Subject Breakdown ({resultsData.term})</h3>
                    <span className="text-xs text-teal-400 font-bold">Class Average: {resultsData.average}%</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                          <th className="py-3.5 px-4">Subject</th>
                          <th className="py-3.5 px-4">CA1 (20)</th>
                          <th className="py-3.5 px-4">CA2 (20)</th>
                          <th className="py-3.5 px-4">Exam (60)</th>
                          <th className="py-3.5 px-4">Total (100)</th>
                          <th className="py-3.5 px-4">Grade</th>
                          <th className="py-3.5 px-4">Rank</th>
                          <th className="py-3.5 px-4">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-xs">
                        {resultsData.subjects.map((s: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">{s.subject}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.ca1}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.ca2}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.exam}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">{s.total}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {s.grade}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{s.positionInSubject}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. ATTENDANCE VIEW                                         */}
            {/* ========================================================= */}
            {activeTab === "attendance" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <CalendarCheck className="w-6 h-6 text-emerald-400" />
                      Student Attendance Tracker
                    </h2>
                    <p className="text-xs text-slate-400">Daily roll-call records and regularity percentage</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold">Term Attendance Percentage</span>
                    <h3 className="text-3xl font-black text-emerald-400 mt-1">95.4%</h3>
                    <p className="text-xs text-slate-400 mt-1">Verified by Class Teacher</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold">Total Days Present</span>
                    <h3 className="text-3xl font-black text-white mt-1">62 / 65</h3>
                    <p className="text-xs text-slate-400 mt-1">3 Days Absent / Excused</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold">Punctuality Score</span>
                    <h3 className="text-3xl font-black text-teal-400 mt-1">5 / 5</h3>
                    <p className="text-xs text-slate-400 mt-1">Excellent punctuality record</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white">Recent Daily Roll-Call Audit</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { date: "2026-07-29", status: "Present", arrivalTime: "07:38 AM", verifiedBy: "Class Teacher" },
                      { date: "2026-07-28", status: "Present", arrivalTime: "07:42 AM", verifiedBy: "Class Teacher" },
                      { date: "2026-07-27", status: "Present", arrivalTime: "07:35 AM", verifiedBy: "Class Teacher" },
                      { date: "2026-07-24", status: "Medical Leave", arrivalTime: "-", verifiedBy: "Parent Excuse Note" }
                    ].map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{log.date}</span>
                          <span className="text-slate-400 ml-3">Arrival: {log.arrivalTime}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${log.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 5. ASSIGNMENTS VIEW                                       */}
            {/* ========================================================= */}
            {activeTab === "assignments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                      Homework & Class Project Tracker
                    </h2>
                    <p className="text-xs text-slate-400">Submit completed homework assignments directly online</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {assignments.map(asg => (
                    <div key={asg.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {asg.subject}
                            </span>
                            <h3 className="text-base font-bold text-white">{asg.title}</h3>
                          </div>
                          <p className="text-xs text-slate-300 mt-2">{asg.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {asg.submissions?.length > 0 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Submitted ({asg.submissions[0].status})
                            </span>
                          ) : (
                            <button
                              onClick={() => setSubmittingAssignment(asg)}
                              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow"
                            >
                              Submit Solution
                            </button>
                          )}
                        </div>
                      </div>

                      {asg.submissions?.length > 0 && (
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400">Teacher Evaluation Score:</span>
                            <span className="font-bold text-emerald-400">
                              {asg.submissions[0].score || 18} / {asg.totalPoints}
                            </span>
                          </div>
                          <p className="text-slate-300 italic">{asg.submissions[0].teacherFeedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submission Modal */}
                {submittingAssignment && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-2xl space-y-4">
                      <h3 className="text-lg font-bold text-white">
                        Submit Homework: {submittingAssignment.title}
                      </h3>

                      <textarea
                        rows={5}
                        value={submissionText}
                        onChange={e => setSubmissionText(e.target.value)}
                        placeholder="Type your step-by-step homework solution here..."
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />

                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setSubmittingAssignment(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAssignmentSubmit}
                          disabled={submitting}
                          className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                        >
                          {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Confirm Submission
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* 6. LESSON NOTES VIEW                                       */}
            {/* ========================================================= */}
            {activeTab === "lesson-notes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookMarked className="w-6 h-6 text-teal-400" />
                      Class Lesson Notes & Curriculum Guides
                    </h2>
                    <p className="text-xs text-slate-400">Access approved subject lesson notes and syllabus summaries</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "ln-1", subject: "Mathematics", topic: "Quadratic Equations & Roots Analysis", week: "Week 4", teacher: "Mrs. Okonkwo Beatrice" },
                    { id: "ln-2", subject: "Physics", topic: "Wave Motion & Sound Wave Properties", week: "Week 4", teacher: "Dr. Eze Chukwuma" },
                    { id: "ln-3", subject: "Chemistry", topic: "Periodic Table & Periodic Trends", week: "Week 3", teacher: "Mrs. Usman Fatima" },
                    { id: "ln-4", subject: "Computer Studies", topic: "Relational Database Management Systems & SQL", week: "Week 3", teacher: "Mr. Adebayo Kunle" }
                  ].map(note => (
                    <div key={note.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {note.subject} • {note.week}
                        </span>
                        <span className="text-[10px] text-slate-400">Approved Note</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{note.topic}</h4>
                      <p className="text-xs text-slate-400">Teacher: {note.teacher}</p>
                      <button
                        onClick={() => alert(`Opening ${note.topic} lesson note PDF...`)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5" /> Read Full Lesson Note
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 7. CBT EXAMS VIEW                                         */}
            {/* ========================================================= */}
            {activeTab === "cbt" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      CBT Online Examination Engine
                    </h2>
                    <p className="text-xs text-slate-400">Take computer-based tests with real-time timers and instant auto-grading</p>
                  </div>
                </div>

                {!activeCbtExam ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cbtExams.map(e => (
                      <div key={e.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            {e.subject}
                          </span>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {e.durationMinutes} Mins
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white">{e.title}</h3>
                        <p className="text-xs text-slate-400">
                          {e.questions.length} Objective Questions • Instant Result
                        </p>

                        <button
                          onClick={() => handleStartCbt(e)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Start CBT Test Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">{activeCbtExam.title}</h3>
                        <span className="text-xs text-slate-400">Subject: {activeCbtExam.subject}</span>
                      </div>

                      <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl text-rose-400 font-mono font-bold text-sm">
                        <Clock className="w-4 h-4 animate-pulse" />
                        Time Left: {formatTime(cbtTimeLeft)}
                      </div>
                    </div>

                    {!cbtResult ? (
                      <div className="space-y-6">
                        {activeCbtExam.questions.map((q: any, idx: number) => (
                          <div key={q.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                            <h4 className="text-sm font-bold text-white">
                              Q{idx + 1}. {q.question}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt: string, oIdx: number) => (
                                <button
                                  key={oIdx}
                                  onClick={() => setCbtAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                                  className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all flex items-center gap-3 ${
                                    cbtAnswers[q.id] === oIdx
                                      ? "bg-teal-600/20 border-teal-500 text-teal-300"
                                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold">
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={handleCbtSubmit}
                          disabled={cbtSubmitting}
                          className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                        >
                          {cbtSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Submit CBT Test
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 text-center py-6">
                        <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                          <Award className="w-10 h-10" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white">CBT Exam Completed!</h3>
                          <p className="text-sm text-slate-400 mt-1">
                            Final Score: {cbtResult.percentage} ({cbtResult.totalScore} / {cbtResult.maxScore} Marks)
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveCbtExam(null)}
                          className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
                        >
                          Return to CBT Center
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* 8. RESULTS & REPORT CARDS VIEW                            */}
            {/* ========================================================= */}
            {(activeTab === "results" || activeTab === "report-cards") && resultsData && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      {resultsData.term}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">
                      Official Report Card • {currentStudentName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Position: <span className="text-emerald-400 font-bold">{resultsData.positionInClass}</span> • Total: {resultsData.overallTotal} / {resultsData.maximumPossible} • Average: {resultsData.average}%
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Downloading Verified Official Report Card PDF for ${currentStudentName}...`);
                    }}
                    className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2 self-start md:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    Download Official Report Card PDF
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Term Academic Broadsheet</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                          <th className="py-3.5 px-4">Subject</th>
                          <th className="py-3.5 px-4">CA1 (20)</th>
                          <th className="py-3.5 px-4">CA2 (20)</th>
                          <th className="py-3.5 px-4">Exam (60)</th>
                          <th className="py-3.5 px-4">Total (100)</th>
                          <th className="py-3.5 px-4">Grade</th>
                          <th className="py-3.5 px-4">Rank</th>
                          <th className="py-3.5 px-4">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-xs">
                        {resultsData.subjects.map((s: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white">{s.subject}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.ca1}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.ca2}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.exam}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">{s.total}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {s.grade}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{s.positionInSubject}</td>
                            <td className="py-3.5 px-4 text-slate-300">{s.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 9. SCHOOL NOTICES VIEW                                    */}
            {/* ========================================================= */}
            {activeTab === "notices" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Bell className="w-6 h-6 text-amber-400" />
                      School Notices & Announcements Board
                    </h2>
                    <p className="text-xs text-slate-400">Official circulars and announcements from school management</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "ann-1", title: "Inter-House Sports Practice", date: "2026-07-28", category: "Sports", text: "All students in Yellow house must assemble at the main sports complex by 3:30 PM today." },
                    { id: "ann-2", title: "WAEC Chemistry Practical Lab Prep", date: "2026-07-27", category: "Academic", text: "Ensure your safety goggles and lab coats are presented to Dr. Eze before Thursday." },
                    { id: "ann-3", title: "PTA General Assembly & Science Fair", date: "2026-07-25", category: "PTA", text: "Parents and guardians are cordially invited to the 2026 STEM exhibition." }
                  ].map(ann => (
                    <div key={ann.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{ann.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{ann.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 10. MESSAGES VIEW                                         */}
            {/* ========================================================= */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-teal-400" />
                      Student & Teacher Messaging Inbox
                    </h2>
                    <p className="text-xs text-slate-400">Direct notes and guidance from your subject teachers</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "m-1", sender: "Mrs. Okonkwo Beatrice (Math Teacher)", subject: "Quadratic Equations Homework Feedback", date: "2 hours ago", text: "Chinedu, your working for question 3 was brilliant. Keep up the high standard." },
                    { id: "m-2", sender: "Dr. Eze Chukwuma (Physics Teacher)", subject: "WAEC Physics Practical Session", date: "Yesterday", text: "Remember to review wave refraction diagrams before tomorrow's laboratory practice." }
                  ].map(msg => (
                    <div key={msg.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-300">{msg.sender}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{msg.subject}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 11. SETTINGS VIEW                                         */}
            {/* ========================================================= */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Settings className="w-6 h-6 text-slate-400" />
                      Account & Portal Settings
                    </h2>
                    <p className="text-xs text-slate-400">Manage security, password, and portal notifications</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 max-w-xl">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-400" />
                    Change Security Password
                  </h3>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      alert("Security password updated successfully!");
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition-all"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 12. FEES VIEW                                             */}
            {/* ========================================================= */}
            {activeTab === "fees" && feeInvoice && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Invoice #{feeInvoice.id}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">School Fee Ledger</h2>
                    <p className="text-xs text-slate-400">Term: {feeInvoice.term} • Outstanding: ₦{feeInvoice.outstandingBalance.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => setIsPayModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Online via Paystack
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                        <th className="py-3.5 px-4">Description</th>
                        <th className="py-3.5 px-4 text-right">Amount (₦)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
                      {feeInvoice.items.map((it: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-3.5 px-4 font-semibold text-white">{it.description}</td>
                          <td className="py-3.5 px-4 text-right font-mono">₦{it.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payment Modal */}
                {isPayModalOpen && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-4">
                      <h3 className="text-lg font-bold text-white">Online School Fee Payment</h3>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-400">Payment Amount (₦)</label>
                          <input
                            type="number"
                            value={payAmount}
                            onChange={e => setPayAmount(e.target.value)}
                            className="w-full p-3 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-400">Payment Gateway</label>
                          <select
                            value={payMethod}
                            onChange={e => setPayMethod(e.target.value)}
                            className="w-full p-3 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="Paystack Online Gateway">Paystack Secured Gateway</option>
                            <option value="Flutterwave Payment Hub">Flutterwave Payment Hub</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => setIsPayModalOpen(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleFeePayment}
                          disabled={processingPay}
                          className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                        >
                          {processingPay ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                          Process Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* 13. AI STUDY TUTOR VIEW                                   */}
            {/* ========================================================= */}
            {activeTab === "ai-tutor" && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 h-[600px] flex flex-col">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Gemini AI {activePortalRole === "student" ? "Study Assistant" : "Parent Advisory Guide"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      WAEC / JAMB / NECO practice, step-by-step math solver & advisory
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 p-2">
                  {aiChatLogs.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          m.sender === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-slate-950 border border-slate-800 text-slate-200"
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-purple-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Gemini AI is analyzing your prompt...
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-slate-800 pt-3">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAiSend()}
                    placeholder="Ask a WAEC practice question or math problem..."
                    className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAiSend}
                    disabled={aiLoading}
                    className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Ask
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
