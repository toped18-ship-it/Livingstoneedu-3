import React, { useState, useEffect } from "react";
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
  Cpu
} from "lucide-react";

interface TeacherPortalProps {
  currentRole?: string;
}

export function TeacherPortalView({ currentRole = "Teacher" }: TeacherPortalProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "classroom" | "lesson-notes" | "scheme" | "assignments" | "exams" | "cbt" | "ca-reports" | "analytics" | "ai-copilot" | "messages"
  >("dashboard");

  // Dashboard state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Classroom state
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("SS2 Gold");
  const [attendanceRecords, setAttendanceRecords] = useState<any>({});

  // Lesson Note State
  const [lessonNotes, setLessonNotes] = useState<any[]>([]);
  const [noteSubject, setNoteSubject] = useState("Mathematics");
  const [noteClass, setNoteClass] = useState("SS2 Gold");
  const [noteTopic, setNoteTopic] = useState("Quadratic Equations & Roots Analysis");
  const [noteWeek, setNoteWeek] = useState("Week 4");
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [generatedNoteText, setGeneratedNoteText] = useState("");

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

  // AI Co-Pilot State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello Mrs. Okonkwo! I am your LIVINGSTONEEDU Teacher AI Co-Pilot. I can generate lesson plans, design exam papers, suggest teaching methods for complex topics, or format WAEC-standard marking guides. How can I assist you today?"
    }
  ]);
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Action status toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Brain className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-600/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Verified Teacher Backend Active
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Teacher Portal Engine
            </h1>
            <p className="text-emerald-100 max-w-2xl text-sm md:text-base">
              Welcome back, <span className="font-bold underline text-white">Mrs. Okonkwo Beatrice</span>. Access AI Lesson Generators, CBT Exams, Automated Attendance, WAEC Broadsheets & Student Analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab("ai-copilot")}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Launch Teacher AI Assistant
            </button>
            <button
              onClick={() => handleGenerateAiNote()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              Quick Lesson Note
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: "dashboard", label: "Overview", icon: BarChart2 },
          { id: "classroom", label: "Classroom & Attendance", icon: Users },
          { id: "lesson-notes", label: "AI Lesson Notes", icon: BookOpen },
          { id: "scheme", label: "Scheme of Work", icon: Calendar },
          { id: "assignments", label: "Assignments", icon: FileText },
          { id: "exams", label: "AI Exam & Question Bank", icon: GraduationCap },
          { id: "cbt", label: "CBT Management", icon: Cpu },
          { id: "ca-reports", label: "CA & Report Cards", icon: Award },
          { id: "analytics", label: "Performance Analytics", icon: TrendingUp },
          { id: "ai-copilot", label: "AI Co-Pilot", icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
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

          {/* Timetable & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Timetable */}
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

            {/* AI Assistant Quick Widget */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-5 h-5" />
                  Gemini AI Co-Pilot Prompt
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Need an instant marking scheme, extra WAEC practice questions, or remedial exercises for struggling students?
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
                  setActiveTab("ai-copilot");
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

      {/* TAB CONTENT: CLASSROOM & ATTENDANCE */}
      {activeTab === "classroom" && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Classroom Management & Daily Attendance</h2>
              <p className="text-xs text-slate-500">Take roll call, edit attendance records, and review student details.</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Select Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  fetchStudents();
                }}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <optgroup label="Primary Classes">
                  <option value="Primary 1 Gold">Primary 1 Gold</option>
                  <option value="Primary 2 Silver">Primary 2 Silver</option>
                  <option value="Primary 3 Bronze">Primary 3 Bronze</option>
                  <option value="Primary 4 Gold">Primary 4 Gold</option>
                  <option value="Primary 5 Silver">Primary 5 Silver</option>
                  <option value="Primary 6 Diamond">Primary 6 Diamond</option>
                </optgroup>
                <optgroup label="Junior Secondary">
                  <option value="JSS 1 Ruby">JSS 1 Ruby</option>
                  <option value="JSS 2 Sapphire">JSS 2 Sapphire</option>
                  <option value="JSS 3 Diamond">JSS 3 Diamond</option>
                </optgroup>
                <optgroup label="Senior Secondary">
                  <option value="SS 1 Silver">SS 1 Silver</option>
                  <option value="SS 2 Gold">SS 2 Gold</option>
                  <option value="SS 3 Emerald">SS 3 Emerald</option>
                </optgroup>
              </select>

              <button
                onClick={handleTakeAttendance}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Roll Call
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Parent Name</th>
                  <th className="p-3">Attendance Status</th>
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

      {/* TAB CONTENT: AI LESSON NOTES */}
      {activeTab === "lesson-notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-extrabold text-slate-900">
              <Brain className="w-5 h-5 text-emerald-600" />
              Gemini AI Lesson Note Creator
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Class Level</label>
                <input
                  type="text"
                  value={noteClass}
                  onChange={(e) => setNoteClass(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Topic</label>
                <input
                  type="text"
                  value={noteTopic}
                  onChange={(e) => setNoteTopic(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Syllabus Week</label>
                <input
                  type="text"
                  value={noteWeek}
                  onChange={(e) => setNoteWeek(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleGenerateAiNote}
                disabled={isGeneratingNote}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGeneratingNote ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating NERDC Compliant Note...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Lesson Note with Gemini
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Existing Notes List & Content Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Lesson Notes Directory & Drafts</h3>
              <div className="space-y-3">
                {lessonNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{note.topic}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          note.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {note.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {note.subject} • {note.class} • {note.week} ({note.term})
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setGeneratedNoteText(note.content)}
                        className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700"
                      >
                        View Content
                      </button>
                      <button
                        onClick={async () => {
                          const res = await fetch(`/api/teacher/lesson-notes/${note.id}/submit-approval`, { method: "POST" });
                          const json = await res.json();
                          if (json.success) {
                            fetchLessonNotes();
                            showToast("Submitted to Vice Principal!");
                          }
                        }}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold"
                      >
                        Submit for Approval
                      </button>
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
                    onClick={() => showToast("Exported to PDF & DOCX")}
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

      {/* TAB CONTENT: AI EXAM GENERATOR */}
      {activeTab === "exams" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              AI Exam & Marking Scheme Generator
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Objective Qs</label>
                  <input
                    type="number"
                    value={numObj}
                    onChange={(e) => setNumObj(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Theory Qs</label>
                  <input
                    type="number"
                    value={numTheory}
                    onChange={(e) => setNumTheory(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateAiExam}
                disabled={isGeneratingExam}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGeneratingExam ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Exam & Marking Scheme...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Exam with Gemini
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Generated Examinations Archive</h3>
              <div className="space-y-3">
                {exams.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{ex.examType} - {ex.subject}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {ex.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Class: {ex.class} • Duration: {ex.durationMinutes} mins • {ex.objectiveQuestionsCount} MCQs, {ex.theoryQuestionsCount} Theory
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {generatedExamResult && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">Exam Paper & Marking Guide</span>
                  <button
                    onClick={() => showToast("Exported to PDF/DOCX for printing")}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Printable PDF
                  </button>
                </div>
                <div className="bg-slate-900 text-amber-300 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {typeof generatedExamResult.rawContent === "string"
                    ? generatedExamResult.rawContent
                    : JSON.stringify(generatedExamResult, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CA & REPORT CARDS */}
      {activeTab === "ca-reports" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              Continuous Assessment Entry
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
                  Save CA Entry
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
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base">Class Broadsheet & Score Summaries</h3>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/teacher/report-cards/bulk-submit", { method: "POST" });
                    const json = await res.json();
                    if (json.success) showToast(json.message);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Submit Broadsheet to Principal
                </button>
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

      {/* TAB CONTENT: AI CO-PILOT CHAT */}
      {activeTab === "ai-copilot" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">LIVINGSTONEEDU Teacher AI Co-Pilot</h2>
              <p className="text-xs text-slate-500">Powered by Gemini AI — Specialized in NERDC, WAEC, NECO & Cambridge Curricula.</p>
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
                  Gemini AI Co-Pilot is writing response...
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
              placeholder="Ask anything... e.g. 'How can I explain projectile motion to SS2 students easily?'"
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
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
    </div>
  );
}
