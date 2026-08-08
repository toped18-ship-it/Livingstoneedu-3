import React, { useState, useEffect } from "react";
import { useLiveData, useGlobalRefresh } from "../../lib/liveStore";
import { Logo } from "../Logo";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  Sparkles,
  FileText,
  Clock,
  CalendarDays,
  Award,
  MessageSquare,
  CheckCircle2,
  FileDown,
  FileInput,
  HelpCircle,
  BarChart3,
  Send,
  RefreshCw,
  Search,
  Wifi,
  ShieldCheck,
  Bell,
  User,
  Edit,
  Plus,
  TrendingUp,
  Target,
  GraduationCap,
} from "lucide-react";

interface TeacherPortalProps {
  currentRole?: string;
  userSession?: any;
  onSelectTab?: (tab: string) => void;
}

type TeacherPortalSection =
  | "dashboard"
  | "my-classes"
  | "my-subjects"
  | "lesson-notes"
  | "ai-lesson-gen"
  | "scheme-of-work"
  | "weekly-planner"
  | "attendance"
  | "continuous-assessment"
  | "ai-exam-gen"
  | "question-bank"
  | "grade-entry"
  | "student-results"
  | "messages"
  | "calendar"
  | "profile";

const SIDEBAR_ITEMS: { id: TeacherPortalSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-classes", label: "My Classes", icon: Users },
  { id: "my-subjects", label: "My Subjects", icon: BookOpen },
  { id: "lesson-notes", label: "Lesson Notes", icon: FileText },
  { id: "ai-lesson-gen", label: "AI Lesson Generator", icon: Sparkles },
  { id: "scheme-of-work", label: "Scheme of Work", icon: Calendar },
  { id: "weekly-planner", label: "Weekly Planner", icon: CalendarDays },
  { id: "attendance", label: "Attendance", icon: ClipboardList },
  { id: "continuous-assessment", label: "Continuous Assessment", icon: Award },
  { id: "ai-exam-gen", label: "AI Exam Generator", icon: Sparkles },
  { id: "question-bank", label: "Question Bank", icon: HelpCircle },
  { id: "grade-entry", label: "Grade Entry", icon: FileInput },
  { id: "student-results", label: "Student Results", icon: BarChart3 },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

const TEACHER_ROLES = ["Teacher", "Class Teacher", "Subject Teacher", "Lab Assistant", "Teaching Assistant"];

export function TeacherPortalView({ currentRole = "Teacher", userSession, onSelectTab }: TeacherPortalProps) {
  const [activeSection, setActiveSection] = useState<TeacherPortalSection>("dashboard");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [schoolName, setSchoolName] = useState("Destiny Way International Group of Schools");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const liveStudents = useLiveData<any>("students").data;
  const liveTeachers = useLiveData<any>("teachers").data;
  const liveAttendance = useLiveData<any>("attendanceRegister").data;

  useEffect(() => {
    fetchDashboard();
  }, []);

  useGlobalRefresh(
    () => {
      fetchDashboard();
    },
    activeSection === "dashboard"
  );

  useEffect(() => {
    if (userSession?.schoolName) {
      setSchoolName(userSession.schoolName);
    }
  }, [userSession]);

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

  const totalTeachers = liveTeachers.length;
  const assignedStudents = liveStudents.filter((s: any) => {
    const teacherClasses = (userSession?.assignedClasses || ["SS2 Gold", "SS2 Silver"]).map((c: string) =>
      c.toLowerCase()
    );
    return s.class && teacherClasses.includes(s.class.toLowerCase());
  });

  const totalStudents = assignedStudents.length;

  const attendanceRate = liveAttendance.length > 0
    ? Math.round(
        (liveAttendance.filter((a: any) =>
          (a.status || "").toLowerCase() === "present"
        ).length /
          liveAttendance.length) *
          100
      )
    : 0;

  const filteredItems = SIDEBAR_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Teachers
            </span>
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalTeachers}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">In your school</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Attendance Rate
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{attendanceRate}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">(This Month)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Students
            </span>
            <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalStudents}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across assigned classes</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Lessons
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {(dashboardData?.todaysTimetable || []).length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scheduled today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Clock className="w-5 h-5 text-emerald-600" />
              Today's Schedule
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {(dashboardData?.todaysTimetable || []).length} Periods
            </span>
          </div>

          <div className="space-y-3">
            {(dashboardData?.todaysTimetable || []).map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {item.period.split(" ")[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{item.subject}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.class} · {item.room}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {item.period}
                </span>
              </div>
            ))}
            {(!dashboardData?.todaysTimetable || dashboardData.todaysTimetable.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No classes scheduled for today.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveSection("attendance")}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition-all group"
              >
                <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Take Attendance</span>
              </button>
              <button
                onClick={() => setActiveSection("lesson-notes")}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition-all group"
              >
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Lesson Notes</span>
              </button>
              <button
                onClick={() => setActiveSection("ai-exam-gen")}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition-all group"
              >
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Exam</span>
              </button>
              <button
                onClick={() => setActiveSection("messages")}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition-all group"
              >
                <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Messages</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
              <Bell className="w-5 h-5 text-amber-400" />
              Recent Activity
            </div>
            <div className="space-y-3">
              {(dashboardData?.recentActivities || []).map((act: any) => (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{act.title}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{act.time}</span>
                </div>
              ))}
              {(!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0) && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No recent activity.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (label: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{label}</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          This module is connected to the backend and synchronised with Firebase. The full {label}
          interface is being prepared for your school <strong className="text-slate-700 dark:text-slate-200">{schoolName}</strong>.
        </p>
        <button
          onClick={() => setActiveSection("dashboard")}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 mx-auto"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "my-classes":
        return renderPlaceholder("My Classes", Users);
      case "my-subjects":
        return renderPlaceholder("My Subjects", BookOpen);
      case "lesson-notes":
        return renderPlaceholder("Lesson Notes", FileText);
      case "ai-lesson-gen":
        return renderPlaceholder("AI Lesson Generator", Sparkles);
      case "scheme-of-work":
        return renderPlaceholder("Scheme of Work", Calendar);
      case "weekly-planner":
        return renderPlaceholder("Weekly Planner", CalendarDays);
      case "attendance":
        return renderPlaceholder("Attendance", ClipboardList);
      case "continuous-assessment":
        return renderPlaceholder("Continuous Assessment", Award);
      case "ai-exam-gen":
        return renderPlaceholder("AI Exam Generator", Sparkles);
      case "question-bank":
        return renderPlaceholder("Question Bank", HelpCircle);
      case "grade-entry":
        return renderPlaceholder("Grade Entry", FileInput);
      case "student-results":
        return renderPlaceholder("Student Results", BarChart3);
      case "messages":
        return renderPlaceholder("Messages", MessageSquare);
      case "calendar":
        return renderPlaceholder("Calendar", Calendar);
      case "profile":
        return renderPlaceholder("Profile", User);
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
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
          <span className="font-semibold text-slate-500 dark:text-slate-400">teacher</span>
          <span className="ml-auto flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 dark:text-emerald-400">Connected</span>
          </span>
        </div>

        {/* Organization Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white border-b border-indigo-700/60">
          <div className="flex items-center gap-4">
            <Logo variant="icon" size="md" />
            <div>
              <h1 className="text-lg font-black text-white">{schoolName}</h1>
              <p className="text-xs text-indigo-200">Teacher Portal • Session: 2026/2027 Term: First Term</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role: {currentRole}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
              <Bell className="w-3.5 h-3.5" /> 3 unread
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold rounded-xl mx-2 transition-all ${
                      isActive
                        ? "bg-indigo-600/10 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-300"
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
                  if (onSelectTab) onSelectTab("dashboard");
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
            {loading && activeSection === "dashboard" ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                <span className="ml-2 text-slate-500">Loading dashboard...</span>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
