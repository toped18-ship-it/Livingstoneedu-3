import React, { useState, useEffect } from "react";
import { lookupCurriculumTopic } from "../../data/curriculumData";
import { WebsiteBuilderView } from "./WebsiteBuilderView";
import { TeachersView } from "./TeachersView";
import { downloadTextFile, buildBroadsheetCsv } from "../../lib/downloads";
import { useLiveData, useGlobalRefresh } from "../../lib/liveStore";
import { Logo } from "../Logo";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  Users,
  Award,
  AlertCircle,
  Plus,
  Search,
  Download,
  Send,
  Printer,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Paperclip,
  Share2,
  Check,
  X,
  Copy,
  FolderOpen,
  Upload,
  RefreshCw,
  BarChart2,
  UserCheck,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  Cpu,
  UserPlus,
  FileSpreadsheet,
  User,
  Phone,
  Mail,
  Lock,
  CheckSquare,
  Layers,
  Bell,
  PieChart,
  Filter,
  ArrowUpRight,
  Sliders,
  ShieldAlert,
  Globe,
  Wallet,
  GraduationCap,
  Building,
  PiggyBank,
  Clipboard,
  History,
  School,
  Briefcase,
  Settings,
  Database,
  Shield,
  FileKey,
  Globe as GlobeIcon,
  CreditCard,
  FileBadge,
  Clock8,
  BookDown,
  Wifi,
  Target,
  Edit,
  Trash2,
  Info,
  FileInput,
  BarChart3,
} from "lucide-react";

interface SchoolPortalProps {
  currentRole?: string;
  userSession?: any;
}

type SchoolPortalSection =
  | "dashboard"
  | "school-profile"
  | "teachers-staff"
  | "student-management"
  | "admissions"
  | "curriculum"
  | "lesson-library"
  | "ai-lesson-library"
  | "examinations"
  | "reports"
  | "finance"
  | "communication"
  | "website-builder"
  | "school-website"
  | "subscription"
  | "roles-permissions"
  | "audit-logs"
  | "system-settings";

const SIDEBAR_ITEMS: { id: SchoolPortalSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "school-profile", label: "School Profile", icon: School },
  { id: "teachers-staff", label: "Teachers & Staff Management", icon: UserCheck },
  { id: "student-management", label: "Student Management", icon: Users },
  { id: "admissions", label: "Admissions", icon: UserPlus },
  { id: "curriculum", label: "Curriculum Management", icon: BookOpen },
  { id: "lesson-library", label: "Master Lesson Note Library", icon: FileText },
  { id: "ai-lesson-library", label: "AI Lesson Library", icon: Sparkles },
  { id: "examinations", label: "Examination Management", icon: Cpu },
  { id: "reports", label: "Report Card Management", icon: FileSpreadsheet },
  { id: "finance", label: "Finance", icon: PiggyBank },
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "website-builder", label: "Website Builder", icon: Globe },
  { id: "school-website", label: "School Website Management", icon: GlobeIcon },
  { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
  { id: "roles-permissions", label: "Roles & Permissions", icon: Shield },
  { id: "audit-logs", label: "Audit Logs", icon: History },
  { id: "system-settings", label: "System Settings", icon: Settings },
];

export function SchoolPortalView({ currentRole = "Principal", userSession }: SchoolPortalProps) {
  const [activeSection, setActiveSection] = useState<SchoolPortalSection>("dashboard");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "student-management" | "teachers-staff" | "academic-management" | "classroom-management" | "reports" | "ai-tools" | "website-builder" | "school-fees"
  >("dashboard");
  const [studentSubTab, setStudentSubTab] = useState<
    "directory" | "admission" | "profiles" | "academic-records" | "attendance" | "promotion" | "report-cards" | "discipline"
  >("directory");

  const [academicSubTab, setAcademicSubTab] = useState<
    "lesson-notes" | "scheme" | "assignments" | "exam-generator" | "question-bank" | "cbt" | "marking"
  >("lesson-notes");

  const [classroomSubTab, setClassroomSubTab] = useState<"classes" | "timetable" | "subject-allocation" | "register" | "announcements">("classes");
  const [reportsSubTab, setReportsSubTab] = useState<"report-cards" | "class-performance" | "student-analytics" | "ca-exam-reports">("report-cards");
  const [aiSubTab, setAiSubTab] = useState<"planner" | "exam-gen" | "question-gen" | "marking-assistant" | "insights" | "copilot">("copilot");

  // Dashboard & Classroom Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("SS2 Gold");
  const [attendanceRecords, setAttendanceRecords] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);

  // Admission Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGender, setNewStudentGender] = useState("Male");
  const [newStudentClass, setNewStudentClass] = useState("SS2 Gold");
  const [newStudentParent, setNewStudentParent] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  // Lesson Note State
  const [lessonNotes, setLessonNotes] = useState<any[]>([]);
  const [noteSubject, setNoteSubject] = useState("Mathematics");
  const [noteClass, setNoteClass] = useState("SS 2");
  const [noteWeek, setNoteWeek] = useState("Week 4");
  const [noteTopic, setNoteTopic] = useState("Quadratic Equations & Roots Analysis");
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [generatedNoteText, setGeneratedNoteText] = useState("");

  // School Fee Structure State
  const [feeItems, setFeeItems] = useState<any[]>([
    { description: "School Fee", amount: 150000 },
    { description: "Lesson Fee", amount: 50000 },
    { description: "Exam Fee", amount: 35000 },
    { description: "Hostel Fee (For Boarders)", amount: 80000 },
    { description: "Transport Fee", amount: 30000 },
    { description: "P.T.A Fee", amount: 20000 },
    { description: "Craft Fee (For Those Who Pay)", amount: 20000 }
  ]);
  const [feeInvoiceSummary, setFeeInvoiceSummary] = useState<any>(null);
  const [feeSaving, setFeeSaving] = useState(false);

  // Exam Generator State
  const [exams, setExams] = useState<any[]>([]);
  const [examSubject, setExamSubject] = useState("Mathematics");
  const [examClass, setExamClass] = useState("SS2");
  const [examType, setExamType] = useState("First Term Mid-Term CA Test");
  const [numObj, setNumObj] = useState(20);
  const [numTheory, setNumTheory] = useState(2);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [generatedExamResult, setGeneratedExamResult] = useState<any>(null);

  // CA & Report Card State
  const [caEntries, setCaEntries] = useState<any[]>([]);
  const [selectedStudentForCa, setSelectedStudentForCa] = useState<string>("STD-2026-001");
  const [assignmentScore, setAssignmentScore] = useState<number>(18);
  const [testScore, setTestScore] = useState<number>(16);
  const [projectScore, setProjectScore] = useState<number>(9);
  const [examScore, setExamScore] = useState<number>(58);
  const [teacherRemark, setTeacherRemark] = useState<string>("");
  const [behaviourPunctuality, setBehaviourPunctuality] = useState("Excellent");
  const [behaviourNeatness, setBehaviourNeatness] = useState("Good");
  const [behaviourDiscipline, setBehaviourDiscipline] = useState("Compliant");

  // Homework state
  const [assignments, setAssignments] = useState<any[]>([
    {
      id: "HW-001",
      title: "Algebraic Graphing & Quadratics Exercise",
      subject: "Mathematics",
      class: "SS2 Gold",
      dueDate: "2026-08-05",
      submissionsCount: 28,
      totalStudents: 32,
      status: "Active"
    },
    {
      id: "HW-002",
      title: "Newton's Laws of Motion Problem Set",
      subject: "Physics",
      class: "SS2 Silver",
      dueDate: "2026-08-08",
      submissionsCount: 15,
      totalStudents: 30,
      status: "Active"
    }
  ]);

  // Promotions State
  const [promotionsList, setPromotionsList] = useState<any[]>([
    { id: "STD-2026-001", name: "Adeyemi Chinedu", currentClass: "SS2 Gold", nextClass: "SS3 Gold", gpa: "3.85", status: "Approved by Principal", remarks: "Outstanding Academic Rigor" },
    { id: "STD-2026-002", name: "Fatima Abubakar", currentClass: "JSS3 Diamond", nextClass: "SS1 Gold", gpa: "3.92", status: "Approved by Principal", remarks: "BECE Distinction Candidate" },
    { id: "STD-2026-003", name: "Eze Chukwuemeka", currentClass: "SS1 Silver", nextClass: "SS2 Silver", gpa: "3.45", status: "Pending Principal Approval", remarks: "Good Progress" },
    { id: "STD-2026-004", name: "Adeyemi Bisi", currentClass: "JSS1 Silver", nextClass: "JSS2 Silver", gpa: "3.60", status: "Pending Principal Approval", remarks: "Recommended for Promotion" }
  ]);

  // Discipline & Behaviour State
  const [disciplineLogs, setDisciplineLogs] = useState<any[]>([
    { id: "DISC-001", studentName: "Adeyemi Chinedu", class: "SS2 Gold", type: "Commendation", note: "Represented school in Regional Science Olympiad.", date: "2026-07-28", teacher: "Mrs. Okonkwo" },
    { id: "DISC-002", studentName: "Eze Chukwuemeka", class: "SS1 Silver", type: "Punctuality Warning", note: "Arrived 15 minutes late for morning assembly.", date: "2026-07-29", teacher: "Mrs. Okonkwo" }
  ]);

  // AI Co-Pilot & Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your LIVINGSTONEEDU AI Assistant. I can generate lesson plans, design exam papers, create marking rubrics, suggest remedial tasks, or analyze student weak points. How can I assist you today?"
    }
  ]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const liveStudents = useLiveData<any>("students").data;
  const liveTeachers = useLiveData<any>("teachers").data;
  const liveAttendance = useLiveData<any>("attendanceRegister").data;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // School name
  const [schoolName, setSchoolName] = useState("Destiny Way International Group of Schools");
  useEffect(() => {
    if (userSession?.schoolName) {
      setSchoolName(userSession.schoolName);
    }
  }, [userSession]);

  // --- Firebase RTDB immediate sync: load fee structure ---
  useEffect(() => {
    let mounted = true;
    fetch("/api/teacher/fees/items")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json.success) {
          setFeeInvoiceSummary(json.invoice);
          if (Array.isArray(json.invoice?.items) && json.invoice.items.length) {
            setFeeItems(json.invoice.items);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // --- Curriculum topic auto-fill ---
  useEffect(() => {
    const curriculum = lookupCurriculumTopic(noteClass, noteSubject, "First Term", noteWeek);
    if (curriculum && curriculum.topic) {
      setNoteTopic(curriculum.topic);
    }
  }, [noteClass, noteSubject, noteWeek]);

  const isPrincipalOrAdmin =
    currentRole === "Principal" ||
    currentRole === "Vice Principal" ||
    currentRole === "School Owner" ||
    currentRole === "Admin" ||
    currentRole === "Super Administrator" ||
    currentRole === "Proprietor" ||
    currentRole === "Proprietress" ||
    currentRole === "Registrar" ||
    currentRole === "Admission Officer" ||
    currentRole === "ICT Administrator" ||
    currentRole === "School Administrator";

  useEffect(() => {
    fetchDashboard();
    fetchStudents();
    fetchLessonNotes();
    fetchExams();
    fetchCaData();
  }, []);

  useGlobalRefresh(() => {
    fetchDashboard();
    fetchStudents();
    fetchLessonNotes();
    fetchExams();
    fetchCaData();
  });

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/teacher/dashboard");
      const json = await res.json();
      if (json.success) {
        setDashboardData(json.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/teacher/students?className=${selectedClass}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
        const initialAttendance: any = {};
        json.data.forEach((s: any) => {
          initialAttendance[s.id] = "Present";
        });
        setAttendanceRecords(initialAttendance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLessonNotes = async () => {
    try {
      const res = await fetch("/api/teacher/lesson-notes");
      const json = await res.json();
      if (json.success) setLessonNotes(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/teacher/exams");
      const json = await res.json();
      if (json.success) setExams(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCaData = async () => {
    try {
      const res = await fetch("/api/teacher/ca");
      const json = await res.json();
      if (json.success) setCaEntries(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  const updateFeeItem = (index: number, field: "description" | "amount", value: any) => {
    setFeeItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: field === "amount" ? Number(value) : value } : it))
    );
  };
  const addFeeItem = () => setFeeItems((prev) => [...prev, { description: "", amount: 0 }]);
  const removeFeeItem = (index: number) => setFeeItems((prev) => prev.filter((_, i) => i !== index));

  const handlePostFees = async () => {
    const cleaned = feeItems
      .filter((it) => it && typeof it.description === "string" && it.description.trim() !== "")
      .map((it) => ({ description: it.description.trim(), amount: Math.max(0, Number(it.amount) || 0) }));
    if (!cleaned.length) {
      showToast("Add at least one fee description and amount before posting.");
      return;
    }
    setFeeSaving(true);
    try {
      const res = await fetch("/api/teacher/fees/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cleaned })
      }).then((r) => r.json());
      if (res.success) {
        setFeeItems(cleaned);
        setFeeInvoiceSummary(res.invoice);
        showToast(res.message || "Fee structure posted to the student portal!");
      } else {
        showToast(res.message || "Could not post fee structure.");
      }
    } catch (e) {
      showToast("Network error posting fee structure.");
    } finally {
      setFeeSaving(false);
    }
  };

  const handleTakeAttendance = async () => {
    const recordsPayload = students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceRecords[s.id] || "Present",
      remark: "Taken via School Portal"
    }));

    try {
      const res = await fetch("/api/teacher/attendance/take", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className: selectedClass, records: recordsPayload })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Attendance submitted for ${selectedClass}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStudentAdmission = () => {
    if (!newStudentName.trim()) return;
    const newId = `STD-2026-${String(students.length + 10).padStart(3, "0")}`;
    const newAdmissionNo = `LIV/2026/${String(students.length + 10).padStart(3, "0")}`;
    const newRecord = {
      id: newId,
      admissionNo: newAdmissionNo,
      name: newStudentName,
      gender: newStudentGender,
      class: newStudentClass,
      parentName: newStudentParent || "Chief Adeyemi",
      phone: newStudentPhone || "+234 803 123 4567",
      email: newStudentEmail || "parent@livingstone.edu",
      gpa: "3.50",
      attendanceRate: "98%"
    };
    setStudents((prev) => [newRecord, ...prev]);
    setNewStudentName("");
    setNewStudentParent("");
    setNewStudentPhone("");
    setNewStudentEmail("");
    showToast(`Student ${newStudentName} admitted into ${newStudentClass} successfully!`);
    setStudentSubTab("directory");
  };

  const handleGenerateAiNote = async () => {
    setIsGeneratingNote(true);
    try {
      const res = await fetch("/api/teacher/lesson-notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: noteSubject,
          classLevel: noteClass,
          topic: noteTopic,
          week: noteWeek,
          term: "First Term"
        })
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedNoteText(json.data.content);
        fetchLessonNotes();
        showToast("AI Lesson Note generated and saved as Draft!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleGenerateAiExam = async () => {
    setIsGeneratingExam(true);
    try {
      const res = await fetch("/api/teacher/exams/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: examSubject,
          classLevel: examClass,
          examType,
          numObjective: numObj,
          numTheory: numTheory
        })
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedExamResult(json.data);
        fetchExams();
        showToast("AI Examination paper created with Marking Scheme!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingExam(false);
    }
  };

  const handleSaveCa = async () => {
    try {
      const res = await fetch("/api/teacher/ca/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentForCa,
          assignmentScore,
          test1Score: testScore,
          projectScore,
          examScore
        })
      });
      const json = await res.json();
      if (json.success) {
        fetchCaData();
        showToast(`CA Entry saved for ${selectedStudentForCa}. Score: ${json.data.finalTotal}% (${json.data.grade})`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiRemarkGenerate = async () => {
    try {
      const res = await fetch("/api/teacher/report-cards/remarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: "Adeyemi Chinedu", totalScore: 88 })
      });
      const json = await res.json();
      if (json.success) {
        setTeacherRemark(json.remark);
        showToast("AI Teacher Remark generated!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAiMessage = async () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiPrompt("");
    setAiChatLogs((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsAiReplying(true);

    try {
      const res = await fetch("/api/teacher/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const json = await res.json();
      if (json.success) {
        setAiChatLogs((prev) => [...prev, { sender: "ai", text: json.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiReplying(false);
    }
  };

  const togglePromotionStatus = (id: string) => {
    setPromotionsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === "Approved by Principal"
              ? "Pending Principal Approval"
              : "Approved by Principal";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    showToast("Promotion approval status updated!");
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [showSectionSearch, setShowSectionSearch] = useState("");
  const filteredSidebar = SIDEBAR_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(showSectionSearch.toLowerCase())
  );

  const renderAdminPlaceholder = (label: string, icon: React.ElementType, description: string) => {
    const Icon = icon;
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{label}</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
          {description}
        </p>
        <button
          onClick={() => setActiveSection("dashboard")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 mx-auto"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Assigned Classes</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">3 Classes</div>
                <div className="text-xs text-slate-500 font-medium">SS2 Gold, SS2 Silver, SS3 Emerald</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Today's Attendance</span>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">93.7%</div>
                <div className="text-xs text-emerald-600 font-semibold">30 Present / 1 Absent / 1 Late</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Lesson Notes Status</span>
                  <FileCheck className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {dashboardData?.lessonNotesStats?.approved || 1} Approved
                </div>
                <div className="text-xs text-amber-600 font-medium">1 Pending Vice Principal Sign-off</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Active CBT & Exams</span>
                  <Cpu className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">2 Examinations</div>
                <div className="text-xs text-blue-600 font-medium">SS2 Mid-Term Algebra Scheduled</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Today's Teaching Schedule (Wednesday)
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {(dashboardData?.todaysTimetable || []).length} Periods
                  </span>
                </div>

                <div className="space-y-3">
                  {dashboardData?.todaysTimetable?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {item.period.split(" ")[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.subject}</div>
                          <div className="text-xs text-slate-500">{item.class} • {item.room}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                        {item.period}
                      </span>
                    </div>
                  ))}
                  {(!dashboardData?.todaysTimetable || dashboardData.todaysTimetable.length === 0) && (
                    <div className="text-center py-8 text-slate-400 text-sm">No classes scheduled for today.</div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-5 h-5" />
                    Gemini AI Co-Pilot Prompt
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generate instant marking schemes, WAEC practice questions, or remedial exercises for assigned students.
                  </p>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Generate 5 theory practice questions on Quadratic Equations for SS2 Gold..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={() => {
                    handleSendAiMessage();
                  }}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Ask Gemini Assistant
                </button>
              </div>
            </div>
          </div>
        );

      case "school-profile":
        return renderAdminPlaceholder(
          "School Profile",
          School,
          "Manage your school's basic information, contact details, logo, and branding settings."
        );

      case "teachers-staff":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
            <TeachersView />
          </div>
        );

      case "student-management":
        setStudentSubTab("directory");
        return renderStudentManagement();

      case "admissions":
        setStudentSubTab("admission");
        return renderStudentManagement();

      case "curriculum":
        setAcademicSubTab("lesson-notes");
        return renderAcademicOperations();

      case "lesson-library":
        setAcademicSubTab("lesson-notes");
        return renderAcademicOperations();

      case "ai-lesson-library":
        return renderAdminPlaceholder(
          "AI Lesson Library",
          Sparkles,
          "Browse and manage AI-generated lesson plans organized by subject, term, and class level."
        );

      case "examinations":
        setAcademicSubTab("exam-generator");
        return renderAcademicOperations();

      case "reports":
        return renderReportsAnalytics();

      case "finance":
        return renderFinance();

      case "communication":
        setAiSubTab("copilot");
        return renderAiTools();

      case "website-builder":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
            <WebsiteBuilderView currentRole={currentRole as any} />
          </div>
        );

      case "school-website":
        return renderAdminPlaceholder(
          "School Website Management",
          Globe,
          "Configure school website pages, SEO settings, domain mapping, and public portal visibility."
        );

      case "subscription":
        return renderAdminPlaceholder(
          "Subscription & Billing",
          CreditCard,
          "Manage your subscription plan, billing history, payment methods, and upcoming renewals."
        );

      case "roles-permissions":
        return renderAdminPlaceholder(
          "Roles & Permissions",
          Shield,
          "Define role-based access control. Assign permissions to administrators, teachers, and staff."
        );

      case "audit-logs":
        return renderAdminPlaceholder(
          "Audit Logs",
          History,
          "View all administrative actions, login history, and system changes with timestamps."
        );

      case "system-settings":
        return renderAdminPlaceholder(
          "System Settings",
          Settings,
          "Configure school-wide settings, academic sessions, grading scales, and platform preferences."
        );

      default:
        return renderDashboard();
    }
  };

  // === Render helpers for sections with existing content ===

  function renderStudentManagement() {
    return (
      <div className="space-y-6">
        {/* Sub-navigation bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: "directory", label: "Student Directory", icon: Users },
            { id: "admission", label: "Student Admission", icon: UserPlus },
            { id: "profiles", label: "Profiles & Parent Contact", icon: User },
            { id: "academic-records", label: "Academic Records & CA", icon: Award },
            { id: "attendance", label: "Daily Attendance", icon: CheckCircle2 },
            { id: "promotion", label: "Student Promotion", icon: GraduationCap },
            { id: "report-cards", label: "Report Cards & Remarks", icon: FileText },
            { id: "discipline", label: "Behaviour & Discipline", icon: ShieldAlert }
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = studentSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setStudentSubTab(sub.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* SUB-TAB: STUDENT DIRECTORY */}
        {studentSubTab === "directory" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Student Directory</h2>
                <p className="text-xs text-slate-500">Search and view all enrolled students for {schoolName}.</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student or admission no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Parent Name & Contact</th>
                    <th className="p-3">GPA</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-emerald-700">{st.admissionNo}</td>
                      <td className="p-3 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3 font-semibold text-slate-700">{st.class}</td>
                      <td className="p-3 text-slate-600">{st.gender}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{st.parentName}</div>
                        <div className="text-[10px] text-slate-500">{st.phone}</div>
                      </td>
                      <td className="p-3 font-bold text-emerald-800 font-mono">{st.gpa || "3.85"}</td>
                      <td className="p-3 font-bold text-teal-700 font-mono">{st.attendanceRate || "98%"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudentDetail(st);
                            setStudentSubTab("profiles");
                          }}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: STUDENT ADMISSION */}
        {studentSubTab === "admission" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Student Admission & Registration</h2>
                <p className="text-xs text-slate-500">Register new students into school classes with parent contact setup.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Admission Officer Access
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Student Full Name *</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Adebayo Blessing"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Gender *</label>
                <select value={newStudentGender} onChange={(e) => setNewStudentGender(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Assigned Class *</label>
                <select value={newStudentClass} onChange={(e) => setNewStudentClass(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold">
                  <option value="SS2 Gold">SS2 Gold</option>
                  <option value="SS2 Silver">SS2 Silver</option>
                  <option value="JSS3 Diamond">JSS3 Diamond</option>
                  <option value="JSS1 Silver">JSS1 Silver</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Parent / Guardian Full Name</label>
                <input type="text" value={newStudentParent} onChange={(e) => setNewStudentParent(e.target.value)} placeholder="e.g. Chief Adebayo Samuel" className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Parent Phone Number</label>
                <input type="text" value={newStudentPhone} onChange={(e) => setNewStudentPhone(e.target.value)} placeholder="+234 803 999 0000" className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Parent Email Address</label>
                <input type="email" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} placeholder="adebayo@gmail.com" className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900" />
              </div>
            </div>

            <button
              onClick={handleAddStudentAdmission}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Complete Student Admission
            </button>
          </div>
        )}

        {/* SUB-TAB: PROFILES & PARENT CONTACT */}
        {studentSubTab === "profiles" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">Student Profiles & Guardian Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((st) => (
                <div key={st.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {st.admissionNo}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {st.class}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{st.name}</h3>
                    <p className="text-xs text-slate-500">Gender: {st.gender} • Status: Active Enrolled</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600" /> Parent: {st.parentName}
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {st.phone}
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" /> {st.email}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => showToast(`Contacting guardian of ${st.name}...`)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Contact Parent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB: PROMOTION */}
        {studentSubTab === "promotion" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Student Academic Promotion Engine</h2>
                <p className="text-xs text-slate-500">Review class promotion list. Promotion finalization requires Principal or Admin sign-off.</p>
              </div>
              {isPrincipalOrAdmin ? (
                <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-full border border-purple-300">
                  👑 Principal Approval Override Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
                  🔒 Teacher Recommendation Mode (Requires Principal Approval)
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Current Class</th>
                    <th className="p-3">Target Class</th>
                    <th className="p-3">Cumulative GPA</th>
                    <th className="p-3">Promotion Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {promotionsList.map((prom) => (
                    <tr key={prom.id}>
                      <td className="p-3 font-mono font-bold text-emerald-700">{prom.id}</td>
                      <td className="p-3 font-bold text-slate-900">{prom.name}</td>
                      <td className="p-3 text-slate-600">{prom.currentClass}</td>
                      <td className="p-3 font-bold text-purple-700">{prom.nextClass}</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">{prom.gpa}</td>
                      <td className="p-3 font-bold">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          prom.status.includes("Approved")
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {prom.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => togglePromotionStatus(prom.id)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                        >
                          Toggle Approval
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: DISCIPLINE */}
        {studentSubTab === "discipline" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Student Behaviour & Discipline Remarks</h2>
                <p className="text-xs text-slate-500">Log commendations, disciplinary observations, and conduct notes.</p>
              </div>
              <button
                onClick={() => {
                  setDisciplineLogs((prev) => [
                    {
                      id: `DISC-00${prev.length + 1}`,
                      studentName: "Fatima Abubakar",
                      class: "JSS3 Diamond",
                      type: "Commendation",
                      note: "Assisted class teacher in organising Mathematics workshop.",
                      date: "2026-07-30",
                      teacher: "Mrs. Okonkwo"
                    },
                    ...prev
                  ]);
                  showToast("New behaviour record logged!");
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Log Behaviour Note
              </button>
            </div>

            <div className="space-y-3">
              {disciplineLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span>{log.studentName}</span>
                      <span className="text-xs text-slate-500">({log.class})</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${log.type.includes("Commendation") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{log.note}</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    <div>{log.date}</div>
                    <div className="text-[10px] text-slate-500">{log.teacher}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallbacks for academic records / attendance / report cards sub-tabs */}
        {(studentSubTab === "academic-records" || studentSubTab === "attendance" || studentSubTab === "report-cards") && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Student {studentSubTab.replace("-", " ").toUpperCase()} Panel
            </h2>
            <p className="text-xs text-slate-600">
              This academic management view is fully active and syncs directly with class broadsheets and official report cards.
            </p>
            <button
              onClick={() => setActiveSection("reports")}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Go to Report Card & BroadSheet Generator
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderAcademicOperations() {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: "lesson-notes", label: "AI Lesson Notes", icon: BookOpen },
            { id: "scheme", label: "Scheme of Work", icon: Calendar },
            { id: "assignments", label: "Homework & Assignments", icon: FileText },
            { id: "exam-generator", label: "AI Exam Generator", icon: GraduationCap },
            { id: "question-bank", label: "Question Bank", icon: FolderOpen },
            { id: "cbt", label: "CBT Management", icon: Cpu },
            { id: "marking", label: "Marking & Grading", icon: Award }
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = academicSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setAcademicSubTab(sub.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* AI LESSON NOTES */}
        {academicSubTab === "lesson-notes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                <Brain className="w-5 h-5 text-emerald-600" />
                AI Lesson Note Creator
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-bold text-slate-700">Subject</label><input type="text" value={noteSubject} onChange={(e) => setNoteSubject(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <div><label className="text-xs font-bold text-slate-700">Class Level</label><input type="text" value={noteClass} onChange={(e) => setNoteClass(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <div><label className="text-xs font-bold text-slate-700">Topic</label><input type="text" value={noteTopic} onChange={(e) => setNoteTopic(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <div><label className="text-xs font-bold text-slate-700">Syllabus Week</label><input type="text" value={noteWeek} onChange={(e) => setNoteWeek(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <button onClick={handleGenerateAiNote} disabled={isGeneratingNote} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 disabled:opacity-50">
                  {isGeneratingNote ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating NERDC Compliant Note...</> : <><Sparkles className="w-4 h-4" /> Generate Lesson Note with Gemini</>}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">Lesson Notes Directory & Drafts</h3>
                <div className="space-y-3">
                  {lessonNotes.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{note.topic}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${note.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {note.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{note.subject} • {note.class} • {note.week} ({note.term})</div>
                      <div className="flex items-center gap-2 pt-2">
                        <button onClick={() => setGeneratedNoteText(note.content)} className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700">View Content</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {generatedNoteText && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-sm">Lesson Note Content Preview</span>
                    <button
                      onClick={() => {
                        const topicLine = generatedNoteText.split("\n")[0] || "LessonNote";
                        downloadTextFile(`LessonNote-${topicLine.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 40)}.txt`, generatedNoteText);
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {generatedNoteText}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI EXAM GENERATOR */}
        {academicSubTab === "exam-generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                AI Exam & Marking Guide Creator
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-bold text-slate-700">Subject</label><input type="text" value={examSubject} onChange={(e) => setExamSubject(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <div><label className="text-xs font-bold text-slate-700">Class Level</label><input type="text" value={examClass} onChange={(e) => setExamClass(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <div><label className="text-xs font-bold text-slate-700">Exam Type</label><input type="text" value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900" /></div>
                <button onClick={handleGenerateAiExam} disabled={isGeneratingExam} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 disabled:opacity-50">
                  {isGeneratingExam ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate Exam Paper
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">Generated Exams Bank</h3>
                {exams.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{ex.examType} - {ex.subject}</div>
                      <div className="text-xs text-slate-500">Class: {ex.class} • {ex.durationMinutes} Mins</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">{ex.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CBT & MARKING FALLBACK */}
        {(academicSubTab === "scheme" || academicSubTab === "question-bank" || academicSubTab === "cbt" || academicSubTab === "marking") && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Academic Operations: {academicSubTab.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-600">
              Active academic module linked with school syllabus, CBT engine, and automated WAEC grading schemes.
            </p>
          </div>
        )}
      </div>
    );
  }

  function renderReportsAnalytics() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-emerald-600" />
            Terminal CA & Score Record Entry
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-bold text-slate-700">Select Student</label>
              <select value={selectedStudentForCa} onChange={(e) => setSelectedStudentForCa(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold">
                <option value="STD-2026-001">Adeyemi Chinedu (SS2 Gold)</option>
                <option value="STD-2026-002">Fatima Abubakar (JSS3 Diamond)</option>
                <option value="STD-2026-003">Eze Chukwuemeka (SS1 Silver)</option>
              </select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-slate-700">Assignment (Max 20)</label><input type="number" value={assignmentScore} onChange={(e) => setAssignmentScore(Number(e.target.value))} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-700">CA Test (Max 20)</label><input type="number" value={testScore} onChange={(e) => setTestScore(Number(e.target.value))} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-slate-700">Project (Max 10)</label><input type="number" value={projectScore} onChange={(e) => setProjectScore(Number(e.target.value))} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900" /></div>
              <div><label className="text-xs font-bold text-slate-700">Terminal Exam (Max 70)</label><input type="number" value={examScore} onChange={(e) => setExamScore(Number(e.target.value))} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900" /></div>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={handleSaveCa} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow">Save Score & Update Broadsheet</button>
              <button onClick={handleAiRemarkGenerate} className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate AI Teacher Remark
              </button>
            </div>
            {teacherRemark && <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-slate-800"><span className="font-bold block text-amber-900 mb-1">AI Teacher Remark:</span>"{teacherRemark}"</div>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-extrabold text-slate-900 text-base">Class Broadsheet & Report Cards</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { if (!caEntries.length) { showToast("No broadsheet data to export yet."); return; } downloadTextFile(`ClassBroadsheet-${new Date().toISOString().slice(0, 10)}.csv`, buildBroadsheetCsv(caEntries), "text/csv;charset=utf-8"); showToast("Class broadsheet exported as CSV!"); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export Broadsheet</button>
                <button onClick={() => { showToast("Opening print dialog..."); window.print(); }} className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 flex items-center gap-1.5"><Printer className="w-3.5 h-3.5" /> Print Report Cards</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr className="bg-slate-100 text-slate-700 font-bold">
                  <th className="p-2.5">Student</th><th className="p-2.5">Subject</th><th className="p-2.5">CA (30%)</th><th className="p-2.5">Exam (70%)</th><th className="p-2.5">Total (100%)</th><th className="p-2.5">Grade</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {caEntries.map((c) => (
                    <tr key={c.id}>
                      <td className="p-2.5 font-bold text-slate-900">{c.studentName}</td>
                      <td className="p-2.5 text-slate-600">{c.subject}</td>
                      <td className="p-2.5 font-mono">{c.totalCaScore}</td>
                      <td className="p-2.5 font-mono">{c.examScore}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700">{c.finalTotal}%</td>
                      <td className="p-2.5 font-bold"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{c.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderFinance() {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100 border border-white/20">
              <Wallet className="w-3.5 h-3.5" /> Bursary & Fee Ledger
            </span>
            <h2 className="text-2xl font-extrabold">School Fee Structure Manager</h2>
            <p className="text-emerald-100 text-sm">
              Enter fee items and post them to the student fee ledger. Students see the updated invoice instantly.
            </p>
            {feeInvoiceSummary && (
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">{feeInvoiceSummary.id}</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">{feeInvoiceSummary.term}</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">{feeInvoiceSummary.studentName} • {feeInvoiceSummary.class}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div><h3 className="font-extrabold text-slate-900 text-base">Fee Items</h3><p className="text-xs text-slate-500">Each item below appears as a line on the student fee invoice.</p></div>
            <button onClick={addFeeItem} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Fee Item</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-slate-100 text-slate-700 font-bold">
                <th className="p-2.5">S/N</th><th className="p-2.5">Description</th><th className="p-2.5 w-40">Amount (₦)</th><th className="p-2.5 w-16"></th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {feeItems.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-2.5">
                      <input type="text" value={it.description} onChange={(e) => updateFeeItem(idx, "description", e.target.value)} placeholder="e.g. School Fee" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </td>
                    <td className="p-2.5">
                      <input type="number" min="0" value={it.amount} onChange={(e) => updateFeeItem(idx, "amount", e.target.value)} placeholder="0" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </td>
                    <td className="p-2.5 text-right">
                      <button onClick={() => removeFeeItem(idx)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors" title="Remove item"><X className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {!feeItems.length && (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400 text-xs">No fee items yet. Click "Add Fee Item" to begin.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50 font-bold text-slate-900">
                  <td className="p-2.5" colSpan={2}>Total Fees per Term</td>
                  <td className="p-2.5 font-mono text-emerald-700">₦{feeItems.reduce((sum, it) => sum + (Math.max(0, Number(it.amount) || 0)), 0).toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">Posting overwrites the current invoice items and resets payments on the student ledger.</p>
            <button onClick={handlePostFees} disabled={feeSaving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2">
              {feeSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {feeSaving ? "Posting to Student Portal..." : "Post to Student Portal"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderAiTools() {
    const aiTabs = [
      { id: "planner", label: "AI Planner", icon: Calendar },
      { id: "exam-gen", label: "Exam Generator", icon: GraduationCap },
      { id: "question-gen", label: "Question Generator", icon: HelpCircle },
      { id: "marking-assistant", label: "Marking Assistant", icon: Award },
      { id: "insights", label: "Analytics Insights", icon: PieChart },
      { id: "copilot", label: "Co-Pilot Chat", icon: Brain }
    ];

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">LIVINGSTONEEDU AI Assistant</h2>
            <p className="text-xs text-slate-500">AI Lesson Planner, Question Generator, Marking Assistant & Co-Pilot.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none mb-4">
          {aiTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = aiSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAiSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-slate-900 text-amber-400 border border-slate-800 shadow"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {aiSubTab === "copilot" && (
          <>
            <div className="h-96 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {aiChatLogs.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    chat.sender === "user"
                      ? "bg-emerald-600 text-white font-medium shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isAiReplying && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl p-3 text-xs flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-500" /> Gemini AI Assistant is drafting response...
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button onClick={handleSendAiMessage} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2">
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </>
        )}

        {aiSubTab !== "copilot" && (
          <div className="text-center py-12 text-slate-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">The {aiTabs.find((t) => t.id === aiSubTab)?.label} module is being prepared for your school.</p>
          </div>
        )}
      </div>
    );
  }

  const renderDashboard = renderSectionContent;

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {/* URL Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span className="text-sky-500 dark:text-sky-400">●</span>
          <span className="font-semibold">p.schoolhub.tech</span>
          <span className="text-slate-400 dark:text-slate-500">/</span>
          <span className="font-semibold text-slate-500 dark:text-slate-400">school</span>
          <span className="ml-auto flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 dark:text-emerald-400">Connected</span>
          </span>
        </div>

        {/* Organization Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white border-b border-emerald-700/60">
          <div className="flex items-center gap-4">
            <Logo variant="icon" size="md" />
            <div>
              <h1 className="text-lg font-black text-white">{schoolName}</h1>
              <p className="text-xs text-emerald-200">School Administration Portal • Session: 2026/2027 Term: First Term</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: {currentRole}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
              <Bell className="w-3.5 h-3.5" /> 5 unread
            </div>
          </div>
        </div>

        {/* Main Content Area with Internal Sidebar */}
        <div className="flex flex-1 min-h-0">
          {/* Internal Sidebar */}
          <div className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={showSectionSearch}
                  onChange={(e) => setShowSectionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto">
              {filteredSidebar.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setShowSectionSearch("");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold rounded-xl mx-2 transition-all ${
                      isActive
                        ? "bg-emerald-600/10 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  if (window.location.pathname) {
                    window.location.href = window.location.pathname + "?portal=dashboard";
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                Back to Admin Dashboard
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
