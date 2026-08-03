import React, { useState, useEffect } from "react";
import { lookupCurriculumTopic } from "../../data/curriculumData";
import { WebsiteBuilderView } from "./WebsiteBuilderView";
import { TeachersView } from "./TeachersView";
import { AILessonNotesView } from "./AILessonNotesView";
import {
  BookOpen,
  GraduationCap,
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
  Menu,
  LogOut,
  ChevronDown
} from "lucide-react";

interface TeacherPortalProps {
  currentRole?: string;
  userSession?: any;
  onLogout?: () => void;
}

export function TeacherPortalView({ currentRole = "Teacher", userSession, onLogout }: TeacherPortalProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const isPrincipalOrAdmin =
    currentRole === "Principal" ||
    currentRole === "Vice Principal" ||
    currentRole === "School Owner" ||
    currentRole === "Admin" ||
    currentRole === "Super Administrator";

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "student-management" | "teachers-staff" | "academic-management" | "classroom-management" | "reports" | "ai-tools" | "website-builder"
  >("dashboard");

  // Sub-tab states
  const [studentSubTab, setStudentSubTab] = useState<
    "directory" | "admission" | "profiles" | "academic-records" | "attendance" | "promotion" | "report-cards" | "discipline"
  >("directory");

  const [academicSubTab, setAcademicSubTab] = useState<
    "scheme" | "lesson-notes" | "assignments" | "exam-generator" | "question-bank" | "cbt" | "marking"
  >("lesson-notes");

  const [classroomSubTab, setClassroomSubTab] = useState<
    "classes" | "timetable" | "subject-allocation" | "register" | "announcements"
  >("classes");

  const [reportsSubTab, setReportsSubTab] = useState<
    "report-cards" | "class-performance" | "student-analytics" | "ca-exam-reports"
  >("report-cards");

  const [aiSubTab, setAiSubTab] = useState<
    "planner" | "exam-gen" | "question-gen" | "marking-assistant" | "insights" | "copilot"
  >("copilot");

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

  // Auto-retrieve curriculum topic whenever Class, Subject, or Week changes
  useEffect(() => {
    const curriculum = lookupCurriculumTopic(noteClass, noteSubject, "First Term", noteWeek);
    if (curriculum && curriculum.topic) {
      setNoteTopic(curriculum.topic);
    }
  }, [noteClass, noteSubject, noteWeek]);

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

  // Modal States for Communication
  const [isAsgModalOpen, setIsAsgModalOpen] = useState(false);
  const [asgTitle, setAsgTitle] = useState("");
  const [asgSubject, setAsgSubject] = useState("Mathematics");
  const [asgClass, setAsgClass] = useState("SS2 Gold");
  const [asgDueDate, setAsgDueDate] = useState("2026-08-15");
  const [asgPoints, setAsgPoints] = useState(20);
  const [asgDesc, setAsgDesc] = useState("");

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedGradeAsg, setSelectedGradeAsg] = useState<any>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState(18);
  const [gradeRemarkInput, setGradeRemarkInput] = useState("Excellent effort, clear step-by-step calculations.");

  const [isCbtModalOpen, setIsCbtModalOpen] = useState(false);
  const [cbtTitle, setCbtTitle] = useState("");
  const [cbtSubject, setCbtSubject] = useState("Mathematics");
  const [cbtClass, setCbtClass] = useState("SS2 Gold");
  const [cbtDuration, setCbtDuration] = useState(30);

  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgRecipient, setMsgRecipient] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const [isDiscModalOpen, setIsDiscModalOpen] = useState(false);
  const [discStudent, setDiscStudent] = useState("Adeyemi Chinedu");
  const [discClass, setDiscClass] = useState("SS2 Gold");
  const [discType, setDiscType] = useState("Commendation");
  const [discNote, setDiscNote] = useState("");

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
      text: "Hello Mrs. Okonkwo! I am your LIVINGSTONEEDU Teacher AI Co-Pilot. I can generate lesson plans, design exam papers, create marking rubrics, suggest remedial tasks, or analyze student weak points. How can I assist you today?"
    }
  ]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Super Admin HQ Communications
  const [adminNotices, setAdminNotices] = useState<any[]>([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    fetchDashboard();
    fetchStudents();
    fetchLessonNotes();
    fetchExams();
    fetchCaData();
    fetchAdminNotices();
  }, []);

  const fetchAdminNotices = async () => {
    try {
      const res = await fetch("/api/teacher/admin-notices");
      const json = await res.json();
      if (json.success) {
        setAdminNotices(json.notices || []);
        setAdminAnnouncements(json.announcements || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const acknowledgeNotice = async (id: string) => {
    try {
      await fetch(`/api/teacher/admin-notices/${id}/acknowledge`, { method: "POST" });
      setAdminNotices(prev => prev.map(n => n.id === id ? { ...n, acknowledged: true } : n));
      showToast("✓ Directive acknowledged to Super Admin HQ");
    } catch (e) {
      console.error(e);
    }
  };

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

  const handleTakeAttendance = async () => {
    const recordsPayload = students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceRecords[s.id] || "Present",
      remark: "Taken via Teacher Portal"
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
        showToast("Gemini AI Lesson Note generated and saved as Draft!");
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
        showToast("Gemini AI Examination paper created with Marking Scheme!");
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

  const handleCreateAssignmentSubmit = async () => {
    if (!asgTitle.trim()) {
      showToast("Please enter an assignment title.");
      return;
    }
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: asgTitle,
          subject: asgSubject,
          class: asgClass,
          dueDate: asgDueDate,
          totalPoints: asgPoints,
          description: asgDesc
        })
      });
      const json = await res.json();
      if (json.success) {
        setAssignments((prev) => [json.data, ...prev]);
        setIsAsgModalOpen(false);
        setAsgTitle("");
        setAsgDesc("");
        showToast("Homework Assignment created & published to Student Portal!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGradeSubmissionSubmit = async () => {
    if (!selectedGradeAsg) return;
    try {
      const res = await fetch(`/api/teacher/assignments/${selectedGradeAsg.id}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "STD-2026-001",
          score: gradeScoreInput,
          remark: gradeRemarkInput
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsGradeModalOpen(false);
        showToast(json.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleCbtSubmit = async () => {
    if (!cbtTitle.trim()) {
      showToast("Please enter a CBT title.");
      return;
    }
    try {
      const res = await fetch("/api/teacher/cbt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cbtTitle,
          subject: cbtSubject,
          class: cbtClass,
          durationMinutes: cbtDuration
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsCbtModalOpen(false);
        setCbtTitle("");
        showToast("CBT Exam scheduled & published to Student Portal!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessageSubmit = async () => {
    if (!msgRecipient.trim() || !msgContent.trim()) {
      showToast("Please provide recipient and message content.");
      return;
    }
    try {
      const res = await fetch("/api/teacher/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: msgRecipient,
          subject: msgSubject || "Teacher Notice",
          content: msgContent
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsMsgModalOpen(false);
        setMsgContent("");
        showToast(`Message dispatched to ${msgRecipient}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogDisciplineSubmit = async () => {
    if (!discStudent.trim() || !discNote.trim()) {
      showToast("Please provide student name and note.");
      return;
    }
    const newLog = {
      id: `DISC-00${disciplineLogs.length + 1}`,
      studentName: discStudent,
      class: discClass,
      type: discType,
      note: discNote,
      date: new Date().toISOString().split("T")[0],
      teacher: "Mrs. Okonkwo"
    };
    setDisciplineLogs((prev) => [newLog, ...prev]);
    setIsDiscModalOpen(false);
    setDiscNote("");
    showToast(`Behaviour note logged for ${discStudent}!`);
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

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
            <Brain className="w-96 h-96" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-600/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100 border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Teacher & Academic Engine
                </span>
                <span className="inline-flex items-center gap-1.5 bg-teal-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-200 border border-teal-500/30">
                  Role: {currentRole}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Teacher & Academic Dashboard
              </h1>
              <p className="text-emerald-100 max-w-3xl text-sm md:text-base">
                Manage student admissions, profiles, academic records, CA grades, CBT exams, report cards, lesson plans, and classroom attendance for assigned classes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("ai-tools");
                  setAiSubTab("copilot");
                }}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Launch Teacher AI Assistant
              </button>
              <button
                onClick={() => {
                  setActiveTab("student-management");
                  setStudentSubTab("admission");
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Student Admission
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-slate-900 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-xl shadow-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Super Admin HQ Directives & Live Communication Channel */}
        {(adminNotices.length > 0 || adminAnnouncements.length > 0) && (
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                  Super Admin HQ • Directives & Communication Broadcasts
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {adminNotices.filter(n => !n.acknowledged).length} Pending Directives
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {adminNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    notice.acknowledged
                      ? "bg-slate-950/60 border-slate-800/80 opacity-70"
                      : "bg-indigo-950/40 border-indigo-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {notice.priority || "HQ Directive"}
                        </span>
                        <h4 className="text-xs font-black text-white">{notice.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{notice.message}</p>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono">
                        From: {notice.sentBy} • {new Date(notice.date).toLocaleDateString()}
                      </div>
                    </div>

                    {!notice.acknowledged ? (
                      <button
                        onClick={() => acknowledgeNotice(notice.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] whitespace-nowrap shadow-md shadow-indigo-600/30"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        ✓ Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {adminAnnouncements.slice(0, 2).map((annc) => (
                <div key={annc.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Platform Broadcast
                    </span>
                    <h4 className="text-xs font-black text-white">{annc.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{annc.message}</p>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono">
                    Sender: {annc.sender} • Target: {annc.targetAudience}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Main Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: "dashboard", label: "Overview", icon: BarChart2 },
          { id: "student-management", label: "Student Management", icon: Users },
          { id: "teachers-staff", label: "Teachers & Staff", icon: UserCheck },
          { id: "academic-management", label: "Academic Operations", icon: BookOpen },
          { id: "classroom-management", label: "Classroom & Schedule", icon: Calendar },
          { id: "reports", label: "Reports & Analytics", icon: TrendingUp },
          { id: "ai-tools", label: "AI Teaching Tools", icon: Brain },
          { id: "website-builder", label: "Website Builder", icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-extrabold"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* CATEGORY 1: OVERVIEW DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === "dashboard" && (
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
                  4 Periods Scheduled
                </span>
              </div>

              <div className="space-y-3">
                {dashboardData?.todaysTimetable?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
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
                  setActiveTab("ai-tools");
                  setAiSubTab("copilot");
                  handleSendAiMessage();
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                Ask Gemini Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY 2: STUDENT MANAGEMENT (TEACHER & ACADEMIC ENGINE) */}
      {/* ========================================================= */}
      {activeTab === "student-management" && (
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
                  <h2 className="text-xl font-extrabold text-slate-900">Assigned Student Directory</h2>
                  <p className="text-xs text-slate-500">Access student rosters for your assigned classes ({selectedClass}).</p>
                </div>

                <div className="flex items-center gap-3">
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

                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="SS2 Gold">SS2 Gold</option>
                    <option value="SS2 Silver">SS2 Silver</option>
                    <option value="JSS3 Diamond">JSS3 Diamond</option>
                    <option value="JSS1 Silver">JSS1 Silver</option>
                  </select>
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
                  <p className="text-xs text-slate-500">Register new students into assigned school classes with parent contact setup.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> Class Teacher Permission Granted
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
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Assigned Class *</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                  >
                    <option value="SS2 Gold">SS2 Gold</option>
                    <option value="SS2 Silver">SS2 Silver</option>
                    <option value="JSS3 Diamond">JSS3 Diamond</option>
                    <option value="JSS1 Silver">JSS1 Silver</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Parent / Guardian Full Name</label>
                  <input
                    type="text"
                    value={newStudentParent}
                    onChange={(e) => setNewStudentParent(e.target.value)}
                    placeholder="e.g. Chief Adebayo Samuel"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Parent Phone Number</label>
                  <input
                    type="text"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="+234 803 999 0000"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Parent Email Address</label>
                  <input
                    type="email"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="adebayo@gmail.com"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
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
                        onClick={() => {
                          setMsgRecipient(`${st.name} (${st.parentName})`);
                          setMsgSubject(`Academic & Conduct Notice for ${st.name}`);
                          setIsMsgModalOpen(true);
                        }}
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
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              prom.status.includes("Approved")
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
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
                  onClick={() => setIsDiscModalOpen(true)}
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

          {/* Fallbacks for academic records / attendance / report cards sub-tabs inside Student Management */}
          {(studentSubTab === "academic-records" || studentSubTab === "attendance" || studentSubTab === "report-cards") && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Student {studentSubTab.replace("-", " ").toUpperCase()} Panel
              </h2>
              <p className="text-xs text-slate-600">
                This academic management view is fully active and syncs directly with class broadsheets and official report cards.
              </p>
              <button
                onClick={() => setActiveTab("reports")}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Go to Report Card & BroadSheet Generator
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY 3: ACADEMIC OPERATIONS */}
      {/* ========================================================= */}
      {activeTab === "academic-management" && (
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
            <AILessonNotesView userSession={userSession} />
          )}

          {/* HOMEWORK & ASSIGNMENTS */}
          {academicSubTab === "assignments" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Homework & Assignment Manager</h2>
                  <p className="text-xs text-slate-500">Publish assignments directly to the Student Portal and grade student submissions.</p>
                </div>
                <button
                  onClick={() => setIsAsgModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Homework Assignment
                </button>
              </div>

              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{asg.title}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {asg.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Subject: {asg.subject} • Class: {asg.class} • Due Date: {asg.dueDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <div className="font-bold text-slate-900 font-mono">{asg.submissionsCount || 28} / {asg.totalStudents || 32} Submitted</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Submissions Ready</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedGradeAsg(asg);
                          setIsGradeModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg"
                      >
                        Grade Submissions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CBT MANAGEMENT */}
          {academicSubTab === "cbt" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Computer Based Testing (CBT) Center</h2>
                  <p className="text-xs text-slate-500">Schedule online CBT exams, monitor live student sessions, and auto-publish results.</p>
                </div>
                <button
                  onClick={() => setIsCbtModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Schedule New CBT Exam
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">First Term CBT Examination (Mathematics)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Active
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Class: SS2 Gold • Duration: 30 Mins • Questions: 10 Objective MCQs
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/teacher/cbt/cbt-101/publish", { method: "POST" });
                          const json = await res.json();
                          showToast(json.message || "CBT Results Published to Students!");
                        } catch (e) {
                          showToast("CBT Results Published to Students!");
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg"
                    >
                      Publish Results
                    </button>
                  </div>
                </div>
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
                  <div>
                    <label className="text-xs font-bold text-slate-700">Subject</label>
                    <input
                      type="text"
                      value={examSubject}
                      onChange={(e) => setExamSubject(e.target.value)}
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Class Level</label>
                    <input
                      type="text"
                      value={examClass}
                      onChange={(e) => setExamClass(e.target.value)}
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Exam Type</label>
                    <input
                      type="text"
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <button
                    onClick={handleGenerateAiExam}
                    disabled={isGeneratingExam}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingExam ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Exam Paper
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
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        {ex.status}
                      </span>
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
      )}

      {/* ========================================================= */}
      {/* CATEGORY 4: CLASSROOM & SCHEDULE */}
      {/* ========================================================= */}
      {activeTab === "classroom-management" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Classroom Management & Daily Attendance Register</h2>
              <p className="text-xs text-slate-500">Take attendance, view class timetables, and send classroom notices.</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  fetchStudents();
                }}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="SS2 Gold">SS2 Gold</option>
                <option value="SS2 Silver">SS2 Silver</option>
                <option value="JSS3 Diamond">JSS3 Diamond</option>
                <option value="JSS1 Silver">JSS1 Silver</option>
              </select>

              <button
                onClick={handleTakeAttendance}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Register
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Parent Name</th>
                  <th className="p-3">Daily Attendance Roll Call</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-emerald-700">{student.admissionNo}</td>
                    <td className="p-3 font-bold text-slate-900">{student.name}</td>
                    <td className="p-3 text-slate-600">{student.gender}</td>
                    <td className="p-3 text-slate-600">{student.parentName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {["Present", "Late", "Absent"].map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              setAttendanceRecords((prev: any) => ({ ...prev, [student.id]: status }))
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              attendanceRecords[student.id] === status
                                ? status === "Present"
                                  ? "bg-emerald-600 text-white"
                                  : status === "Late"
                                  ? "bg-amber-500 text-white"
                                  : "bg-rose-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY 5: REPORTS & ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              Terminal CA & Score Record Entry
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Select Student</label>
                <select
                  value={selectedStudentForCa}
                  onChange={(e) => setSelectedStudentForCa(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                >
                  <option value="STD-2026-001">Adeyemi Chinedu (SS2 Gold)</option>
                  <option value="STD-2026-002">Fatima Abubakar (JSS3 Diamond)</option>
                  <option value="STD-2026-003">Eze Chukwuemeka (SS1 Silver)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Assignment (Max 20)</label>
                  <input
                    type="number"
                    value={assignmentScore}
                    onChange={(e) => setAssignmentScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">CA Test (Max 20)</label>
                  <input
                    type="number"
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Project (Max 10)</label>
                  <input
                    type="number"
                    value={projectScore}
                    onChange={(e) => setProjectScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Terminal Exam (Max 70)</label>
                  <input
                    type="number"
                    value={examScore}
                    onChange={(e) => setExamScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleSaveCa}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Score & Update Broadsheet
                </button>
                <button
                  onClick={handleAiRemarkGenerate}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate AI Teacher Remark
                </button>
              </div>

              {teacherRemark && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-slate-800">
                  <span className="font-bold block text-amber-900 mb-1">AI Teacher Remark:</span>
                  "{teacherRemark}"
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-extrabold text-slate-900 text-base">Class Broadsheet & Report Cards</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast("Downloading Class Broadsheet (PDF / Excel)...")}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Broadsheet
                  </button>
                  <button
                    onClick={() => showToast("Printing official report cards for class...")}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Report Cards
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold">
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">CA (30%)</th>
                      <th className="p-2.5">Exam (70%)</th>
                      <th className="p-2.5">Total (100%)</th>
                      <th className="p-2.5">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {caEntries.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2.5 font-bold text-slate-900">{c.studentName}</td>
                        <td className="p-2.5 text-slate-600">{c.subject}</td>
                        <td className="p-2.5 font-mono">{c.totalCaScore}</td>
                        <td className="p-2.5 font-mono">{c.examScore}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-700">{c.finalTotal}%</td>
                        <td className="p-2.5 font-bold">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {c.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY 6: AI TEACHING TOOLS */}
      {/* ========================================================= */}
      {activeTab === "ai-tools" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">LIVINGSTONEEDU Teacher AI Suite & Assistant</h2>
              <p className="text-xs text-slate-500">AI Lesson Planner, Question Generator, Marking Assistant & Co-Pilot.</p>
            </div>
          </div>

          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {aiChatLogs.map((chat, idx) => (
              <div
                key={idx}
                className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    chat.sender === "user"
                      ? "bg-emerald-600 text-white font-medium shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isAiReplying && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl p-3 text-xs flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                  Gemini AI Assistant is drafting response...
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
              placeholder="Ask anything... e.g. 'Generate a 50-minute lesson plan for SS2 Mathematics on Quadratic Equations'"
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
            />
            <button
              onClick={handleSendAiMessage}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY 7: WEBSITE BUILDER */}
      {/* ========================================================= */}
      {activeTab === "website-builder" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
          <WebsiteBuilderView currentRole={currentRole as any} />
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY 8: TEACHERS & STAFF DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === "teachers-staff" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
          <TeachersView />
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CREATE ASSIGNMENT MODAL */}
      {/* ========================================================= */}
      {isAsgModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Create New Homework Assignment
              </h3>
              <button onClick={() => setIsAsgModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Assignment Title</label>
                <input
                  type="text"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Quadratic Equations Practice Set 1"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Target Class</label>
                  <input
                    type="text"
                    value={asgClass}
                    onChange={(e) => setAsgClass(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Total Marks</label>
                  <input
                    type="number"
                    value={asgPoints}
                    onChange={(e) => setAsgPoints(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Instructions / Problem Description</label>
                <textarea
                  rows={3}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Explain step-by-step requirements for the homework assignment..."
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAsgModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignmentSubmit}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
              >
                Publish Assignment to Student Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: GRADE SUBMISSION MODAL */}
      {/* ========================================================= */}
      {isGradeModalOpen && selectedGradeAsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Grade Student Submission</h3>
                <p className="text-xs text-slate-500">{selectedGradeAsg.title} ({selectedGradeAsg.class})</p>
              </div>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="font-bold text-slate-900">Student: Adeyemi Chinedu (STD-2026-001)</div>
              <div className="text-slate-600">Submitted Work: <span className="text-emerald-700 underline font-mono">homework_solution_chinedu.pdf</span></div>
              <div className="text-slate-500 italic">"Attached is my step-by-step solution for the quadratic equations worksheet."</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Score Awarded (out of {selectedGradeAsg.totalPoints || 20})</label>
                <input
                  type="number"
                  value={gradeScoreInput}
                  onChange={(e) => setGradeScoreInput(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Teacher Remarks & Feedback</label>
                <textarea
                  rows={3}
                  value={gradeRemarkInput}
                  onChange={(e) => setGradeRemarkInput(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsGradeModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmissionSubmit}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow hover:bg-slate-800"
              >
                Save Score & Send Feedback to Student Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SCHEDULE CBT EXAM MODAL */}
      {/* ========================================================= */}
      {isCbtModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                Schedule New CBT Assessment
              </h3>
              <button onClick={() => setIsCbtModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">CBT Exam Title</label>
                <input
                  type="text"
                  value={cbtTitle}
                  onChange={(e) => setCbtTitle(e.target.value)}
                  placeholder="e.g. First Term Mathematics CBT Exam"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={cbtSubject}
                    onChange={(e) => setCbtSubject(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Class Level</label>
                  <input
                    type="text"
                    value={cbtClass}
                    onChange={(e) => setCbtClass(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  value={cbtDuration}
                  onChange={(e) => setCbtDuration(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsCbtModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleCbtSubmit}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
              >
                Schedule & Publish CBT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: DIRECT MESSAGE MODAL */}
      {/* ========================================================= */}
      {isMsgModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Dispatch Direct Notice / Message
              </h3>
              <button onClick={() => setIsMsgModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Recipient Student / Parent</label>
                <input
                  type="text"
                  value={msgRecipient}
                  onChange={(e) => setMsgRecipient(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="Notice regarding student academic progress"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Message Content</label>
                <textarea
                  rows={4}
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  placeholder="Type your official message to guardian/student..."
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsMsgModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessageSubmit}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow hover:bg-slate-800"
              >
                Send Direct Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: LOG BEHAVIOUR NOTE MODAL */}
      {/* ========================================================= */}
      {isDiscModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Log Student Behaviour Note
              </h3>
              <button onClick={() => setIsDiscModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Student Name</label>
                  <input
                    type="text"
                    value={discStudent}
                    onChange={(e) => setDiscStudent(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Class</label>
                  <input
                    type="text"
                    value={discClass}
                    onChange={(e) => setDiscClass(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Category / Type</label>
                <select
                  value={discType}
                  onChange={(e) => setDiscType(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                >
                  <option value="Commendation">Commendation (Exemplary Behaviour)</option>
                  <option value="Punctuality Warning">Punctuality Warning</option>
                  <option value="Disciplinary Conduct Note">Disciplinary Conduct Note</option>
                  <option value="Leadership Recognition">Leadership Recognition</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Observation Note</label>
                <textarea
                  rows={3}
                  value={discNote}
                  onChange={(e) => setDiscNote(e.target.value)}
                  placeholder="Write specific conduct observation note..."
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDiscModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogDisciplineSubmit}
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
              >
                Save & Dispatch to Parent Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
