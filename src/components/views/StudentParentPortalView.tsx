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
  Check
} from "lucide-react";
import { UserRole } from "../../types";

interface StudentParentPortalViewProps {
  currentRole?: UserRole;
}

export function StudentParentPortalView({ currentRole }: StudentParentPortalViewProps) {
  // Mode: 'student' | 'parent'
  const [activePortalRole, setActivePortalRole] = useState<"student" | "parent">("student");
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "profile"
    | "results"
    | "assignments"
    | "cbt"
    | "fees"
    | "ai-tutor"
    | "timetable"
    | "downloads"
  >("dashboard");

  // Multi-child parent state
  const [childrenList, setChildrenList] = useState<any[]>([
    { studentId: "STD-2026-001", name: "Adeyemi Chinedu", class: "SS2 Gold", admissionNo: "LIV/2026/001" },
    { studentId: "STD-2026-004", name: "Adeyemi Bisi", class: "JSS1 Silver", admissionNo: "LIV/2026/004" }
  ]);
  const [selectedChildId, setSelectedChildId] = useState<string>("STD-2026-001");

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [resultsData, setResultsData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [cbtExams, setCbtExams] = useState<any[]>([]);
  const [feeInvoice, setFeeInvoice] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // AI Tutor / Guidance Chat State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: "user" | "ai"; message: string }[]>([
    {
      sender: "ai",
      message:
        "Hello! I am your LIVINGSTONEEDU Gemini AI Assistant. Ask me anything about WAEC/JAMB preparation, step-by-step math solutions, or academic guidance!"
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchPortalData();
  }, [activePortalRole, selectedChildId]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/60 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                LIVINGSTONEEDU PORTAL
              </span>
              <span className="text-xs text-slate-400">Multi-Tenant School ID: SCH-001</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {activePortalRole === "student" ? "Student Academic Hub" : "Parent Command Center"}
            </h1>
            <p className="text-sm text-slate-300">
              Livingstone International College • Session 2026/2027 • First Term
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Switch Role Mode */}
            <div className="bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl flex items-center">
              <button
                onClick={() => setActivePortalRole("student")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activePortalRole === "student"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-4 h-4" />
                Student Mode
              </button>
              <button
                onClick={() => setActivePortalRole("parent")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activePortalRole === "parent"
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-4 h-4" />
                Parent Mode
              </button>
            </div>

            {/* Parent Child Switcher */}
            {activePortalRole === "parent" && (
              <div className="bg-slate-900/90 border border-teal-500/30 p-2 rounded-xl flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-semibold text-slate-300">Child:</span>
                <select
                  value={selectedChildId}
                  onChange={e => setSelectedChildId(e.target.value)}
                  className="bg-slate-800 text-xs font-bold text-teal-300 px-3 py-1.5 rounded-lg border border-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {childrenList.map(c => (
                    <option key={c.studentId} value={c.studentId}>
                      {c.name} ({c.class})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Permission Notice Banner */}
      {activePortalRole === "student" && (
        <div className="bg-slate-900/90 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong className="text-emerald-400 font-bold">Student Account (Read-Only Mode):</strong> You can view your profile, attendance, results, timetable, submit homework, and take CBT exams. Academic management and record edits are handled in the Teacher Dashboard.
            </span>
          </div>
        </div>
      )}

      {/* Main Tab Navigation Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "dashboard"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          Bio Profile & Medical
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "results"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          Academic Broadsheet
        </button>

        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "assignments"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Homework & Assignments
        </button>

        <button
          onClick={() => setActiveTab("cbt")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "cbt"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          CBT Online Test Engine
        </button>

        <button
          onClick={() => setActiveTab("fees")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "fees"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Fees & Payments
        </button>

        <button
          onClick={() => setActiveTab("ai-tutor")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ai-tutor"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Gemini AI {activePortalRole === "student" ? "Study Tutor" : "Parent Guide"}
        </button>

        <button
          onClick={() => setActiveTab("timetable")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "timetable"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Timetable & Calendar
        </button>

        <button
          onClick={() => setActiveTab("downloads")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "downloads"
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Download className="w-4 h-4" />
          Download Center
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading Livingstone Portal Data...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Student Name
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {activePortalRole === "student"
                        ? profileData?.name || "Adeyemi Chinedu"
                        : activeChild.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono">
                      Class: {profileData?.class || activeChild.class}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Term Attendance
                    </span>
                    <h3 className="text-lg font-bold text-white">95.4%</h3>
                    <p className="text-xs text-slate-400">62 / 65 Days Present</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Academic Ranking
                    </span>
                    <h3 className="text-lg font-bold text-white">2nd / 42</h3>
                    <p className="text-xs text-purple-400 font-semibold">Average: 84.89% (A1)</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Fee Status
                    </span>
                    <h3 className="text-lg font-bold text-amber-400">
                      ₦{(feeInvoice?.outstandingBalance || 100000).toLocaleString()}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {feeInvoice?.status || "Partially Paid"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Content: Timetable & Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Timetable & Pending Homework */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Today's Schedule */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        Today's Timetable & Classroom Schedule
                      </h2>
                      <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                        Wednesday
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(dashboardData?.todayTimetable || []).map((slot: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between hover:border-emerald-500/40 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg font-mono">
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
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        Pending Homework & Class Projects
                      </h2>
                      <button
                        onClick={() => setActiveTab("assignments")}
                        className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {assignments.map(asg => (
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
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Announcements & AI Quick Ask */}
                <div className="space-y-6">
                  {/* Announcements */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-400" />
                      School Announcements
                    </h2>

                    <div className="space-y-3">
                      {(dashboardData?.schoolAnnouncements || []).map((ann: any) => (
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

                  {/* Quick AI Tutor Teaser */}
                  <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Gemini AI Tutor</h3>
                        <p className="text-xs text-slate-300">Ask any WAEC / JAMB question</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("ai-tutor")}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      Open AI Assistant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & MEDICAL */}
          {activeTab === "profile" && profileData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-center">
                <div className="relative inline-block mx-auto">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-3xl font-black text-white border-4 border-slate-800 shadow-xl mx-auto">
                    {profileData.name.charAt(0)}
                  </div>
                  <span className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 rounded-full text-slate-950 border-2 border-slate-900">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-1">
                    Admission No: {profileData.admissionNo}
                  </p>
                  <span className="inline-block px-3 py-1 mt-2 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {profileData.class} • {profileData.arm}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">House</span>
                    <p className="text-xs font-semibold text-slate-200">{profileData.house}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Gender</span>
                    <p className="text-xs font-semibold text-slate-200">{profileData.gender}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Blood Group</span>
                    <p className="text-xs font-semibold text-rose-400">{profileData.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Genotype</span>
                    <p className="text-xs font-semibold text-emerald-400">{profileData.genotype}</p>
                  </div>
                </div>
              </div>

              {/* Medical & Guardian Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Medical Information */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-400" />
                    Medical Profile & Health Notes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs text-slate-500">Known Allergies</span>
                      <p className="text-sm font-bold text-rose-400">
                        {profileData.medicalInfo?.allergies || "None"}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs text-slate-500">Asthmatic Status</span>
                      <p className="text-sm font-bold text-emerald-400">
                        {profileData.medicalInfo?.asthmatic ? "Yes (Inhaler)" : "No"}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-xs text-slate-500">Special Notes</span>
                      <p className="text-xs font-semibold text-slate-300">
                        {profileData.medicalInfo?.specialNotes || "Standard"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Guardian & Emergency Contacts
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <span className="text-xs text-slate-500">Father / Primary Guardian</span>
                      <h4 className="text-sm font-bold text-white">
                        {profileData.guardianDetails?.fatherName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {profileData.guardianDetails?.primaryPhone}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <span className="text-xs text-slate-500">Mother / Secondary Guardian</span>
                      <h4 className="text-sm font-bold text-white">
                        {profileData.guardianDetails?.motherName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                        {profileData.guardianDetails?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESULTS & REPORT CARD */}
          {activeTab === "results" && resultsData && (
            <div className="space-y-6">
              {/* Header Summary Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    {resultsData.term}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">
                    Academic Result Broadsheet • {resultsData.studentName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Position: <span className="text-emerald-400 font-bold">{resultsData.positionInClass}</span> • Overall Total: {resultsData.overallTotal} / {resultsData.maximumPossible} • Average: {resultsData.average}%
                  </p>
                </div>

                <button
                  onClick={() => {
                    fetch("/api/student/report-card/pdf")
                      ? alert("Downloading Official Livingstone Report Card PDF Package...")
                      : null;
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 self-start md:self-auto"
                >
                  <Download className="w-4 h-4" />
                  Download Verified PDF Report Card
                </button>
              </div>

              {/* Subject Results Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Subject Performance Breakdown</h3>
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

              {/* Remarks & Psychomotor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Teacher & Principal Assessment</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-slate-500 font-bold">Class Teacher Remark:</span>
                      <p className="text-slate-200 italic">{resultsData.teacherRemarks}</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-slate-500 font-bold">Principal's Final Remark:</span>
                      <p className="text-emerald-300 italic font-semibold">{resultsData.principalRemarks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Affective & Psychomotor Ratings</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                      <span className="text-slate-400">Punctuality</span>
                      <span className="font-bold text-emerald-400">5 / 5</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                      <span className="text-slate-400">Cleanliness</span>
                      <span className="font-bold text-emerald-400">5 / 5</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                      <span className="text-slate-400">Honesty</span>
                      <span className="font-bold text-emerald-400">5 / 5</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                      <span className="text-slate-400">Leadership</span>
                      <span className="font-bold text-emerald-400">4 / 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Homework & Assignment Tracker</h2>
                  <p className="text-xs text-slate-400">Submit homework and view teacher feedback</p>
                </div>
              </div>

              <div className="space-y-4">
                {assignments.map(asg => (
                  <div key={asg.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow"
                          >
                            Submit Solution
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Feedback if graded */}
                    {asg.submissions?.length > 0 && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-400">Teacher Evaluation & Score:</span>
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
                      placeholder="Type your step-by-step solution or answer here..."
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
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

          {/* TAB 5: CBT ONLINE TEST */}
          {activeTab === "cbt" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    CBT Online Test Player
                  </h2>
                  <p className="text-xs text-slate-400">Timed computerized testing engine</p>
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
                        {e.questions.length} Questions • Auto-Marked Objectives
                      </p>

                      <button
                        onClick={() => handleStartCbt(e)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Start CBT Examination
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                  {/* Timer Bar */}
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

                  {/* CBT Questions List */}
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
                                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
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
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow flex items-center justify-center gap-2"
                      >
                        {cbtSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Submit CBT Test
                      </button>
                    </div>
                  ) : (
                    /* CBT Results View */
                    <div className="space-y-6 text-center py-6">
                      <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <Award className="w-10 h-10" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-white">CBT Exam Submitted!</h3>
                        <p className="text-sm text-slate-400 mt-1">Score: {cbtResult.percentage} ({cbtResult.totalScore} / {cbtResult.maxScore} Marks)</p>
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

          {/* TAB 6: FEES & PAYMENTS */}
          {activeTab === "fees" && feeInvoice && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Invoice #{feeInvoice.id}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">School Fee Breakdown & Payment Ledger</h2>
                  <p className="text-xs text-slate-400">Term: {feeInvoice.term} • Outstanding: ₦{feeInvoice.outstandingBalance.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Online via Paystack / Flutterwave
                </button>
              </div>

              {/* Items Breakdown Table */}
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
                          className="w-full p-3 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400">Payment Gateway</label>
                        <select
                          value={payMethod}
                          onChange={e => setPayMethod(e.target.value)}
                          className="w-full p-3 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
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

          {/* TAB 7: GEMINI AI TUTOR & PARENT GUIDE */}
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

              {/* Chat Log Window */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2">
                {aiChatLogs.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        m.sender === "user"
                          ? "bg-emerald-600 text-white"
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

              {/* Input Area */}
              <div className="flex items-center gap-2 border-t border-slate-800 pt-3">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAiSend()}
                  placeholder={
                    activePortalRole === "student"
                      ? "Ask a WAEC practice question or math problem..."
                      : "Ask about child performance or school policy..."
                  }
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

          {/* TAB 8: TIMETABLE */}
          {activeTab === "timetable" && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-400" />
                Class Timetable & School Academic Calendar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs text-amber-400 font-bold">Aug 5, 2026</span>
                  <h4 className="text-sm font-bold text-white">Mid-Term CA Examinations</h4>
                  <p className="text-xs text-slate-400">All subject continuous assessment tests begin across SS1 - SS3.</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs text-emerald-400 font-bold">Aug 12, 2026</span>
                  <h4 className="text-sm font-bold text-white">Inter-House Sports Finals</h4>
                  <p className="text-xs text-slate-400">Main athletics track competition at National Stadium field.</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs text-purple-400 font-bold">Aug 20, 2026</span>
                  <h4 className="text-sm font-bold text-white">PTA General Assembly & Exhibition</h4>
                  <p className="text-xs text-slate-400">Parent-Teacher conference and STEM robotics exhibition.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: DOWNLOAD CENTER */}
          {activeTab === "downloads" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Download Center</h2>
                  <p className="text-xs text-slate-400">Access report card PDFs, receipts, and circulars</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {downloads.map(dl => (
                  <div key={dl.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {dl.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{dl.title}</h4>
                      <p className="text-xs text-slate-500 font-mono">{dl.size} • {dl.date}</p>
                    </div>

                    <button
                      onClick={() => alert(`Downloading ${dl.title}...`)}
                      className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/30"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
