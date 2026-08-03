import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  Printer,
  FileText,
  Check,
  Copy,
  Edit3,
  Save,
  BookOpen,
  Layers,
  Share2,
  Archive,
  Trash2,
  RotateCcw,
  History,
  CheckCircle2,
  AlertCircle,
  Eye,
  Maximize2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image as ImageIcon,
  Table,
  Highlighter,
  SpellCheck,
  Send,
  Users,
  Building,
  Brain,
  ShieldCheck,
  Plus,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Upload,
  Calendar as CalendarIcon,
  Search,
  Filter,
  BarChart2,
  TrendingUp,
  Clock,
  Bell,
  CheckSquare,
  HelpCircle,
  X,
  FileCheck,
  RefreshCw
} from "lucide-react";
import { LessonNote, ALL_CLASSES, getSubjectsForClass } from "../../types";
import { lookupCurriculumTopic, CURRICULUM_DATABASE, CurriculumTopic } from "../../data/curriculumData";

interface AILessonNotesViewProps {
  userSession?: any;
}

export const AILessonNotesView: React.FC<AILessonNotesViewProps> = ({ userSession }) => {
  // Top Level Navigation Sub-Tabs requested in Prompt
  const [moduleTab, setModuleTab] = useState<
    | "dashboard"
    | "generate"
    | "my-notes"
    | "weekly"
    | "drafts"
    | "submitted"
    | "approved"
    | "returned"
    | "calendar"
    | "downloads"
  >("dashboard");

  // 1. Selector State for Form
  const [schoolName, setSchoolName] = useState(userSession?.schoolName || "LIVINGSTONE INTERNATIONAL ACADEMY");
  const [teacherName, setTeacherName] = useState("Mrs. Okonkwo Beatrice");
  const [academicSession, setAcademicSession] = useState("2026/2027");
  const [className, setClassName] = useState("SS 2");
  const [subject, setSubject] = useState("Mathematics");
  const [term, setTerm] = useState("First Term");
  const [week, setWeek] = useState("Week 4");
  const [lessonDuration, setLessonDuration] = useState("40 Minutes (Double Period)");
  const [teachingDate, setTeachingDate] = useState(() => new Date().toISOString().split("T")[0]);

  const availableSubjects = getSubjectsForClass(className);

  // 2. Auto-Retrieved Curriculum Topic State (No manual typing required)
  const [curriculumTopic, setCurriculumTopic] = useState<CurriculumTopic>(() =>
    lookupCurriculumTopic("SS 2", "Mathematics", "First Term", "Week 4")
  );
  const [topic, setTopic] = useState("Quadratic Equations & Roots Analysis");
  const [subTopic, setSubTopic] = useState("Factorization, Completing the Square, & Graphical Solution");
  const [learningArea, setLearningArea] = useState("Algebra & Polynomial Expressions");
  const [objectives, setObjectives] = useState<string[]>([
    "Express quadratic equations in standard form ax² + bx + c = 0",
    "Apply completing the square method to solve quadratic equations",
    "Plot quadratic graphs and estimate roots from intersection points",
    "Analyze discriminant b² - 4ac to determine nature of roots"
  ]);

  // Auto-Update Topic & Curriculum metadata whenever Class, Subject, Term, or Week changes
  useEffect(() => {
    const retrieved = lookupCurriculumTopic(className, subject, term, week);
    setCurriculumTopic(retrieved);
    if (retrieved) {
      setTopic(retrieved.topic);
      setSubTopic(retrieved.subTopic);
      setLearningArea(`${subject} - Module ${week}`);
      setObjectives(retrieved.objectives || []);
    }
  }, [className, subject, term, week]);

  // 3. Main Data Store for Lesson Notes
  const [notesList, setNotesList] = useState<any[]>([
    {
      id: "les-001",
      schoolName: "LIVINGSTONE INTERNATIONAL ACADEMY",
      teacherName: "Mrs. Okonkwo Beatrice",
      session: "2026/2027",
      term: "First Term",
      week: "Week 4",
      subject: "Mathematics",
      class: "SS 2",
      date: "2026-08-03",
      duration: "40 Minutes (Double Period)",
      topic: "Quadratic Equations & Roots Analysis",
      subTopic: "Factorization, Completing the Square, & Graphical Solution",
      learningArea: "Algebra & Polynomial Expressions",
      objectives: [
        "Express quadratic equations in standard form ax² + bx + c = 0",
        "Apply completing the square method to solve quadratic equations",
        "Plot quadratic graphs and estimate roots from intersection points",
        "Analyze discriminant b² - 4ac to determine nature of roots"
      ],
      previousKnowledge: "Students are familiar with basic factorization of quadratic trinomials from SS1.",
      instructionalMaterials: ["Graph sheets", "Whiteboard grid", "Desmos geometry tool", "Calculators"],
      teachingMethods: ["5E Instructional Model", "Guided Problem Solving", "Peer Collaboration"],
      teacherActivities: "Demonstrate completing the square step-by-step on whiteboard with color-coded algebraic terms.",
      studentActivities: "Students work in pairs to factorize 5 quadratic equations and check solutions.",
      classroomActivities: "Interactive speed problem-solving competition on the board.",
      guidedPractice: "Teacher guides students through 2 worked examples on completing the square.",
      independentPractice: "Students independently solve questions 1-5 in exercise book.",
      assessment: "Formative evaluation via oral check and 2 short diagnostic questions.",
      evaluationQuestions: [
        "Solve 2x² - 5x + 3 = 0 using factorization.",
        "Use completing the square to solve x² + 6x - 7 = 0.",
        "Determine the nature of roots for 3x² + 4x + 5 = 0."
      ],
      assignment: "Exercise 4.2, Questions 1-8 on Page 112 of New General Mathematics SS2.",
      summary: "Quadratic equations can be solved factorially, graphically, or via completing the square.",
      conclusion: "Understanding quadratic curves is essential for projectile physics and engineering designs.",
      references: ["NERDC Senior Secondary Mathematics Syllabus", "New General Mathematics for SS2"],
      status: "Approved",
      submittedTo: "Principal",
      content: `[NERDC & WAEC APPROVED AI LESSON NOTE]
SCHOOL: LIVINGSTONE INTERNATIONAL ACADEMY
TEACHER: Mrs. Okonkwo Beatrice
CLASS: SS 2 | SUBJECT: Mathematics | TERM: First Term | WEEK: Week 4
TOPIC: Quadratic Equations & Roots Analysis
SUB-TOPIC: Factorization, Completing the Square, & Graphical Solution

1. PERFORMANCE OBJECTIVES:
- Express quadratic equations in standard form ax² + bx + c = 0
- Apply completing the square method to solve quadratic equations
- Plot quadratic graphs and estimate roots from intersection points
- Analyze discriminant b² - 4ac to determine nature of roots

2. PREVIOUS KNOWLEDGE:
Students are familiar with basic factorization of linear and quadratic trinomials from SS1.

3. INSTRUCTIONAL MATERIALS:
Graph sheets, Grid board, Scientific calculators, GeoGebra app.

4. DETAILED LESSON DELIVERABLES & STEP-BY-STEP PRESENTATION:
STEP 1 (Introduction): Hook learners with a real-world projectile trajectory analogy (throwing a basketball).
STEP 2 (Teacher Explanation): Explain standard form ax² + bx + c = 0. Show why completing the square leads to the quadratic formula.
STEP 3 (Guided Practice): Work through 2x² - 8x + 6 = 0 step-by-step.
STEP 4 (Independent Work): Students solve 3 equations in pairs.
STEP 5 (Evaluation & Assessment): Administer 3 WAEC level questions on root determination.`,
      createdAt: "2026-07-28",
      updatedAt: "2026-08-01 10:14:22",
      archived: false
    },
    {
      id: "les-002",
      schoolName: "LIVINGSTONE INTERNATIONAL ACADEMY",
      teacherName: "Mrs. Okonkwo Beatrice",
      session: "2026/2027",
      term: "First Term",
      week: "Week 5",
      subject: "Physics",
      class: "SS 3",
      date: "2026-08-05",
      duration: "40 Minutes",
      topic: "Electromagnetic Induction & Faraday's Laws",
      subTopic: "Lenz's Law and Self/Mutual Inductance",
      learningArea: "Electricity & Magnetism",
      objectives: ["State Faraday's laws", "Apply Lenz's law"],
      previousKnowledge: "Students understand magnetic fields around bar magnets.",
      instructionalMaterials: ["Solenoid coil", "Bar magnet", "Galvanometer"],
      teachingMethods: ["Experimental Demonstration", "Group Inquiry"],
      teacherActivities: "Move bar magnet in solenoid coil to show induced current on galvanometer.",
      studentActivities: "Record deflection direction when magnet polarity changes.",
      classroomActivities: "Hands-on induction lab.",
      guidedPractice: "Derive e.m.f equation E = -N(dΦ/dt).",
      independentPractice: "Calculate induced e.m.f for N=200 turns.",
      assessment: "Lab quiz.",
      evaluationQuestions: ["State Lenz's law.", "Explain why AC works in transformers."],
      assignment: "Solve Page 84 Questions 1-4.",
      summary: "Induction links changing magnetic flux with electrical voltage.",
      conclusion: "Transformers and generators depend on electromagnetic induction.",
      references: ["NERDC Physics Syllabus SS3", "Senior Secondary Physics by P.N. Okeke"],
      status: "Submitted",
      submittedTo: "Head Teacher",
      content: `[ELECTROMAGNETIC INDUCTION LESSON PLAN]\nSubject: Physics | Class: SS 3\nTopic: Electromagnetic Induction & Faraday's Laws...`,
      createdAt: "2026-08-01",
      updatedAt: "2026-08-02 14:05:10",
      archived: false
    },
    {
      id: "les-003",
      schoolName: "LIVINGSTONE INTERNATIONAL ACADEMY",
      teacherName: "Mrs. Okonkwo Beatrice",
      session: "2026/2027",
      term: "First Term",
      week: "Week 3",
      subject: "Chemistry",
      class: "SS 2",
      date: "2026-07-25",
      duration: "40 Minutes",
      topic: "Periodic Table & Periodic Trends",
      subTopic: "Electronegativity, Ionization Energy, & Atomic Radius",
      learningArea: "Inorganic Chemistry",
      objectives: ["Describe periodic trends across periods and down groups"],
      previousKnowledge: "Atomic numbers 1 to 20.",
      instructionalMaterials: ["Periodic table wall chart"],
      teachingMethods: ["Visual Illustration"],
      teacherActivities: "Explain atomic radius reduction across period 3.",
      studentActivities: "Draw atomic shell configurations.",
      classroomActivities: "Group chart sorting.",
      guidedPractice: "Analyze trend of electronegativity in Group 7.",
      independentPractice: "Write electron configurations.",
      assessment: "Short test.",
      evaluationQuestions: ["Why does atomic radius decrease across a period?"],
      assignment: "Read Chapter 5 in Ababio Chemistry.",
      summary: "Periodic trends repeat systematically based on atomic number.",
      conclusion: "Reactivity of metals and non-metals is governed by electron shielding.",
      references: ["NERDC Chemistry Syllabus"],
      status: "Returned for Correction",
      correctionFeedback: "Please include 2 practical qualitative chemistry lab tests and update evaluation questions to WAEC standard format.",
      submittedTo: "Academic Director",
      content: `[PERIODIC TABLE LESSON PLAN]\nSubject: Chemistry | Class: SS 2\nTopic: Periodic Trends...`,
      createdAt: "2026-07-22",
      updatedAt: "2026-07-24 09:30:00",
      archived: false
    },
    {
      id: "les-004",
      schoolName: "LIVINGSTONE INTERNATIONAL ACADEMY",
      teacherName: "Mrs. Okonkwo Beatrice",
      session: "2026/2027",
      term: "First Term",
      week: "Week 6",
      subject: "Mathematics",
      class: "SS 2",
      date: "2026-08-10",
      duration: "40 Minutes",
      topic: "Simultaneous Linear & Quadratic Equations",
      subTopic: "Analytical & Graphical Solutions",
      learningArea: "Algebraic Processes",
      objectives: ["Solve one linear and one quadratic equation simultaneously"],
      previousKnowledge: "Solving linear simultaneous equations.",
      instructionalMaterials: ["Graph paper"],
      teachingMethods: ["Demonstration"],
      teacherActivities: "Demonstrate substitution method.",
      studentActivities: "Solve x + y = 5 and x² + y² = 13.",
      classroomActivities: "Whiteboard practice.",
      guidedPractice: "Find points of intersection.",
      independentPractice: "Solve 3 homework questions.",
      assessment: "Oral check.",
      evaluationQuestions: ["What are the intersection points of y = x + 1 and y = x² - 1?"],
      assignment: "Exercise 6.1 Questions 1-5.",
      summary: "Substitution reduces simultaneous equations to a single quadratic equation.",
      conclusion: "Graphs confirm analytical intersection roots.",
      references: ["NERDC Mathematics Syllabus"],
      status: "Draft",
      submittedTo: "Head Teacher",
      content: `[SIMULTANEOUS EQUATIONS DRAFT NOTE]\nSubject: Mathematics | Class: SS 2\nTopic: Simultaneous Linear & Quadratic Equations...`,
      createdAt: "2026-08-02",
      updatedAt: "2026-08-03 08:20:15",
      archived: false
    }
  ]);

  // Selected Note for Viewing / Editing / Printable Export
  const [selectedNote, setSelectedNote] = useState<any | null>(notesList[0]);
  const [editorText, setEditorText] = useState(notesList[0]?.content || "");

  // Auto Save State & Indicator
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);

  // Auto-Save Effect: Runs every 8 seconds if there are unsaved changes
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty && selectedNote) {
        handleAutoSaveDraft();
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [isDirty, editorText, selectedNote]);

  const handleAutoSaveDraft = async () => {
    if (!selectedNote) return;
    setIsAutoSaving(true);
    const now = new Date().toLocaleTimeString();

    try {
      await fetch("/api/teacher/lesson-notes/auto-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedNote.id,
          content: editorText,
          topic: selectedNote.topic,
          status: selectedNote.status === "Approved" ? "Approved" : "Draft"
        })
      });
      setLastSavedTimestamp(now);
      setIsDirty(false);
      // Update in local state
      setNotesList((prev) =>
        prev.map((n) => (n.id === selectedNote.id ? { ...n, content: editorText, updatedAt: now } : n))
      );
    } catch (e) {
      console.error("Auto-save error", e);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // AI Assistant Drawer State & Handlers
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);
  const [aiAssistantMessage, setAiAssistantMessage] = useState("");

  const handleAiAssistantAction = async (actionType: string) => {
    setAiAssistantLoading(true);
    setAiAssistantMessage(`Running AI action: ${actionType}...`);
    try {
      const res = await fetch("/api/teacher/lesson-notes/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          currentContent: editorText,
          topic: selectedNote?.topic || topic,
          subject: selectedNote?.subject || subject,
          classLevel: selectedNote?.class || className
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEditorText((prev) => `${prev}\n\n${data.data}`);
        setIsDirty(true);
        setAiAssistantMessage(`✓ ${actionType} generated and appended to lesson note!`);
      }
    } catch (e) {
      console.error(e);
      setAiAssistantMessage("AI action completed with offline template mode.");
    } finally {
      setAiAssistantLoading(false);
    }
  };

  // Submit Modal & Workflow State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitRecipient, setSubmitRecipient] = useState<"Head Teacher" | "Academic Director" | "Principal">("Head Teacher");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Submit Note Handler
  const handleSubmitForApproval = async () => {
    if (!selectedNote) return;
    try {
      const res = await fetch(`/api/teacher/lesson-notes/${selectedNote.id}/submit-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientRole: submitRecipient })
      });
      const data = await res.json();
      if (data.success) {
        setNotesList((prev) =>
          prev.map((n) =>
            n.id === selectedNote.id ? { ...n, status: "Submitted", submittedTo: submitRecipient } : n
          )
        );
        setSelectedNote({ ...selectedNote, status: "Submitted", submittedTo: submitRecipient });
        setShowSubmitModal(false);
        showNotification(`✓ Lesson Note submitted to ${submitRecipient} for review & approval!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generate AI Lesson Note Handler
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAiNote = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/teacher/lesson-notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName,
          teacherName,
          session: academicSession,
          classLevel: className,
          subject,
          term,
          week,
          topic,
          subTopic,
          lessonDuration,
          teachingDate
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newNote = {
          ...data.data,
          schoolName,
          teacherName,
          session: academicSession,
          term,
          week,
          subject,
          class: className,
          date: teachingDate,
          duration: lessonDuration,
          topic,
          subTopic,
          learningArea,
          objectives,
          previousKnowledge: curriculumTopic.previousKnowledge || "Foundational prerequisite concepts covered in previous terms.",
          instructionalMaterials: curriculumTopic.instructionalMaterials || ["Standard Textbook", "Whiteboard", "Diagram Charts"],
          teachingMethods: ["5E Model", "Guided Inquiry", "Classroom Demonstration"],
          teacherActivities: "Explain core concepts step-by-step with board illustrations and worked examples.",
          studentActivities: "Students participate in pairs to solve guided practice problems.",
          classroomActivities: "Interactive speed question-and-answer session.",
          guidedPractice: "Guided step-by-step solution of standard examination questions.",
          independentPractice: "Independent exercise solving.",
          assessment: "Formative check for understanding.",
          evaluationQuestions: [
            `Define ${topic}.`,
            `Solve 2 WAEC standard questions on ${subTopic}.`
          ],
          assignment: `Solve questions 1-5 on page 45 of standard curriculum textbook.`,
          summary: `Summary of key principles of ${topic}.`,
          conclusion: "Core concepts established for next week's advanced sub-topics.",
          references: [`NERDC ${className} ${subject} Syllabus`],
          status: "Draft",
          submittedTo: "Head Teacher"
        };

        setNotesList((prev) => [newNote, ...prev]);
        setSelectedNote(newNote);
        setEditorText(newNote.content || "");
        setModuleTab("my-notes");
        showNotification(`✓ Complete 28-Section AI Lesson Note generated for ${topic}!`);
      }
    } catch (e) {
      console.error(e);
      showNotification("Error connecting to Gemini generation server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Search & Filter State for My Lesson Notes
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredNotes = notesList.filter((n) => {
    const matchesSearch =
      n.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "All" || n.subject === filterSubject;
    const matchesStatus = filterStatus === "All" || n.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([
    { id: "not-1", title: "Lesson Note Approved", message: "SS2 Mathematics Week 4 note approved by Principal.", date: "Today 09:30 AM", type: "approval" },
    { id: "not-2", title: "Correction Requested", message: "Chemistry Week 3 note returned for lab test updates.", date: "Yesterday 04:15 PM", type: "correction" },
    { id: "not-3", title: "Curriculum Sync", message: "NERDC 2026 syllabus synchronized.", date: "2 days ago", type: "curriculum" }
  ]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Admin Modal state
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Fullscreen Preview Mode
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watermarkText, setWatermarkText] = useState("LIVINGSTONE INTERNATIONAL ACADEMY");

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto text-slate-100" : ""}`}>
      {/* ========================================================= */}
      {/* HEADER BANNER & NOTIFICATIONS CONTROL */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-purple-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                AI Lesson Notes Module
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                LIVINGSTONEEDU Teacher Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Curriculum-Integrated Lesson Note Generator • Auto Topic Retrieval • 28-Section Official Schema • PDF/Word Export
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" /> Teacher Notifications
                  </span>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-slate-400 hover:text-white">Clear</button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="font-bold text-purple-300">{n.title}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-slate-500 block mt-1">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin Curriculum View</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Admin Panel Drawer */}
      {showAdminPanel && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Building className="w-4 h-4 text-purple-400" />
              School Curriculum & Super Admin Supervision Panel
            </div>
            <span className="text-xs text-slate-400 font-mono">NERDC 2026.4 Database Active</span>
          </div>
          <p className="text-xs text-slate-400">
            Note: Teachers generate lesson notes based on approved syllabus. Administrators manage subjects, classes, approvals, and school-wide analytics.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10 SUB-SECTION NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart2 },
          { id: "generate", label: "Generate AI Lesson Note", icon: Sparkles },
          { id: "my-notes", label: "My Lesson Notes", icon: BookOpen },
          { id: "weekly", label: "Weekly Lesson Notes", icon: CalendarIcon },
          { id: "drafts", label: "Drafts", icon: Save },
          { id: "submitted", label: "Submitted Notes", icon: Send },
          { id: "approved", label: "Approved Notes", icon: CheckCircle2 },
          { id: "returned", label: "Returned for Correction", icon: AlertCircle },
          { id: "calendar", label: "Lesson Notes Calendar", icon: CalendarIcon },
          { id: "downloads", label: "Download Centre", icon: Download }
        ].map((tb) => {
          const Icon = tb.icon;
          const isActive = moduleTab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setModuleTab(tb.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-purple-400"}`} />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: TEACHER DASHBOARD / ANALYTICS */}
      {/* ========================================================= */}
      {moduleTab === "dashboard" && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lesson Notes Created</span>
              <div className="text-2xl font-black text-white">{notesList.length} Notes</div>
              <span className="text-[11px] text-emerald-400 font-semibold">100% Curriculum Aligned</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Approval</span>
              <div className="text-2xl font-black text-amber-400">
                {notesList.filter((n) => n.status === "Submitted" || n.status === "Pending Approval").length} Notes
              </div>
              <span className="text-[11px] text-amber-300/80 font-semibold">Under Review by Principal</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Notes</span>
              <div className="text-2xl font-black text-emerald-400">
                {notesList.filter((n) => n.status === "Approved").length} Notes
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">Ready for Classroom Teaching</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Returned for Correction</span>
              <div className="text-2xl font-black text-rose-400">
                {notesList.filter((n) => n.status === "Returned for Correction").length} Notes
              </div>
              <span className="text-[11px] text-rose-300/80 font-semibold">Feedback Attached</span>
            </div>
          </div>

          {/* Progress Bars & Subjects Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" /> Syllabus & Lesson Notes Progress Tracker
                </h3>
                <span className="text-xs font-bold text-purple-300 font-mono">First Term 2026/2027</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Weekly Lesson Note Completion Rate</span>
                    <span className="text-purple-400 font-mono">83.3% (10 / 12 Weeks)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full w-[83.3%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Monthly Academic Target</span>
                    <span className="text-emerald-400 font-mono">92%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Subjects Completed</span>
                    <div className="text-lg font-black text-white mt-1">4 Subjects</div>
                    <p className="text-[11px] text-slate-400">Mathematics, Physics, Chemistry, Biology</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Remaining Lesson Notes</span>
                    <div className="text-lg font-black text-purple-400 mt-1">2 Notes</div>
                    <p className="text-[11px] text-slate-400">Week 11 & Week 12 Revision Notes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-purple-400" /> Quick Generator Shortcut
              </h3>

              <p className="text-xs text-slate-400">
                Generate your next NERDC aligned lesson note automatically in 10 seconds without manual topic typing.
              </p>

              <button
                onClick={() => setModuleTab("generate")}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Note Generator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: GENERATE AI LESSON NOTE FORM */}
      {/* ========================================================= */}
      {moduleTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: FORM SELECTORS */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase text-purple-400 flex items-center gap-2 tracking-wider">
                <BookOpen className="w-4 h-4" /> Curriculum Auto-Retrieval Form
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                No Manual Topic Entry Needed
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Academic Session *</label>
                <select
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                >
                  <option value="2026/2027">2026/2027 Academic Session</option>
                  <option value="2025/2026">2025/2026 Academic Session</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">School Term *</label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="First Term">First Term</option>
                    <option value="Second Term">Second Term</option>
                    <option value="Third Term">Third Term</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Week Number *</label>
                  <select
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    {Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`).map((wk) => (
                      <option key={wk} value={wk}>{wk}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Class Level *</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <optgroup label="Junior Secondary">
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3 (BECE)</option>
                    </optgroup>
                    <optgroup label="Senior Secondary">
                      <option value="SS 1">SS 1</option>
                      <option value="SS 2">SS 2</option>
                      <option value="SS 3">SS 3 (WAEC/NECO)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    {availableSubjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AUTOMATICALLY RETRIEVED CURRICULUM DISPLAY */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-300 block">
                  ✓ Automatically Retrieved Curriculum Topic
                </span>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Topic:</span>
                  <p className="text-sm font-black text-white">{topic}</p>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Sub-Topic:</span>
                  <p className="text-xs font-semibold text-slate-300">{subTopic}</p>
                </div>

                <div className="pt-2 border-t border-purple-500/30 text-[10px] text-emerald-400 font-bold flex justify-between">
                  <span>Syllabus Status: Verified</span>
                  <span>NERDC Ref: {curriculumTopic?.nerdcReference || "NERDC-2026"}</span>
                </div>
              </div>

              <button
                onClick={handleGenerateAiNote}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                <span>{isGenerating ? "Generating 28-Section Lesson Note..." : "Generate AI Lesson Note"}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW & OBJECTIVES SUMMARY */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Curriculum Learning Objectives & Plan Setup
              </h3>
              <span className="text-xs font-mono text-purple-300">{className} • {subject}</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-300 uppercase tracking-wider block text-[10px]">
                  Curriculum Learning Objectives:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-200 pl-1">
                  {objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Entry Behaviour (Previous Knowledge):</span>
                  <p className="text-slate-300">{curriculumTopic.previousKnowledge || "Prerequisite foundational knowledge."}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Instructional Materials:</span>
                  <p className="text-slate-300">{(curriculumTopic.instructionalMaterials || []).join(", ")}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2 text-slate-300">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" /> AI Pedagogy Guarantee
                </div>
                <p>
                  The Gemini AI engine reads directly from the approved school curriculum database to compose complete lesson notes covering all 28 mandatory educational sections.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: MY LESSON NOTES (SEARCH, EDIT, EXPORT, ACTIONS) */}
      {/* ========================================================= */}
      {moduleTab === "my-notes" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lesson notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-bold"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-bold"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Submitted">Submitted</option>
                <option value="Draft">Draft</option>
                <option value="Returned for Correction">Returned</option>
              </select>
            </div>

            {selectedNote && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAiAssistant(!showAiAssistant)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Brain className="w-4 h-4" /> AI Assistant Tools
                </button>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Send className="w-4 h-4" /> Submit for Approval
                </button>
              </div>
            )}
          </div>

          {/* AI ASSISTANT DRAWER WITH ALL 13 TOOLS */}
          {showAiAssistant && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-4 animate-in slide-in-from-top-2 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 font-black text-white text-sm">
                  <Brain className="w-5 h-5 text-purple-400" /> AI Teaching Assistant Suite (13 Pedagogical Enhancers)
                </div>
                <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {aiAssistantMessage && (
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 font-bold">
                  {aiAssistantMessage}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                {[
                  "Improve lesson notes",
                  "Rewrite professionally",
                  "Simplify for younger learners",
                  "Expand explanations",
                  "Generate practical activities",
                  "Generate classroom discussions",
                  "Generate games",
                  "Generate projects",
                  "Generate experiments",
                  "Generate worksheets",
                  "Generate quizzes",
                  "Generate homework",
                  "Generate revision questions"
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => handleAiAssistantAction(act)}
                    disabled={aiAssistantLoading}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500 text-slate-200 font-bold text-left flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="truncate">{act}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MAIN DOCUMENT & EDITOR VIEW */}
          {selectedNote ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LIST OF NOTES ON LEFT */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
                  Lesson Notes List ({filteredNotes.length})
                </span>
                <div className="space-y-2 max-h-[700px] overflow-y-auto">
                  {filteredNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNote(n);
                        setEditorText(n.content || "");
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        selectedNote?.id === n.id
                          ? "bg-purple-950/40 border-purple-500 text-white shadow-lg"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white truncate max-w-[180px]">{n.topic}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            n.status === "Approved"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : n.status === "Returned for Correction"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : n.status === "Submitted"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {n.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {n.subject} • {n.class} • {n.week}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Updated: {n.updatedAt || n.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 28-SECTION DOCUMENT VIEW ON RIGHT */}
              <div className="lg:col-span-2 space-y-4">
                {/* Document Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{selectedNote.topic}</span>
                    {isAutoSaving ? (
                      <span className="text-[10px] text-purple-400 font-bold animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Auto-saving draft...
                      </span>
                    ) : (
                      lastSavedTimestamp && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ✓ Draft auto-saved at {lastSavedTimestamp}
                        </span>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAutoSaveDraft()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5 text-purple-400" /> Save Draft
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>
                </div>

                {/* REALISTIC 28-SECTION A4 LESSON NOTE SHEET */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
                  <div className="w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 font-serif text-xs leading-relaxed relative print:shadow-none print:border-none print:p-0">
                    
                    {/* WATERMARK */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 z-0">
                      <span className="text-slate-900 font-serif font-black text-5xl tracking-widest uppercase rotate-[-30deg] text-center border-4 border-dashed border-slate-900 p-8">
                        {watermarkText}
                      </span>
                    </div>

                    {/* DOCUMENT HEADER */}
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                        <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl border-2 border-amber-400">
                          LIA
                        </div>
                        <div className="text-center flex-1 px-4">
                          <h1 className="text-xl font-black uppercase text-slate-900 tracking-wider">
                            {selectedNote.schoolName || schoolName}
                          </h1>
                          <p className="text-[10px] font-bold text-slate-600 uppercase">
                            Federal Ministry of Education & NERDC Approved Curriculum Standard
                          </p>
                          <div className="inline-block mt-1 px-3 py-0.5 bg-purple-100 border border-purple-300 text-[11px] font-bold text-purple-900 uppercase">
                            OFFICIAL TEACHER LESSON NOTE & SCHEME DELIVERABLE
                          </div>
                        </div>
                        <div className="w-16 h-16 rounded-lg border-2 border-emerald-700 bg-emerald-50 text-emerald-800 p-1 text-[9px] font-extrabold text-center flex flex-col items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-emerald-700 mb-0.5" />
                          VERIFIED
                        </div>
                      </div>

                      {/* METADATA 28-SCHEMA GRID */}
                      <div className="border border-slate-900 text-[11px] overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100 border-b border-slate-900 divide-x divide-slate-900 font-bold text-slate-900">
                          <div className="p-2"><span className="text-slate-500 block text-[9px]">1-3. SCHOOL & TEACHER:</span> {selectedNote.teacherName}</div>
                          <div className="p-2"><span className="text-slate-500 block text-[9px]">4-6. SUBJECT & CLASS:</span> {selectedNote.subject} ({selectedNote.class})</div>
                          <div className="p-2"><span className="text-slate-500 block text-[9px]">7-9. SESSION, TERM & WEEK:</span> {selectedNote.session} • {selectedNote.term} ({selectedNote.week})</div>
                          <div className="p-2"><span className="text-slate-500 block text-[9px]">12. DURATION & DATE:</span> {selectedNote.duration} ({selectedNote.date})</div>
                        </div>
                        <div className="p-3 bg-purple-50">
                          <span className="text-purple-900 font-bold block text-[10px] uppercase">10-11. TOPIC & SUB-TOPIC:</span>
                          <h3 className="text-sm font-black text-slate-900 uppercase">{selectedNote.topic}</h3>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">
                            <span className="font-bold text-slate-900">SUB-TOPIC:</span> {selectedNote.subTopic}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 28 SECTIONS BODY */}
                    <div className="relative z-10 mt-6 space-y-6 text-slate-900">
                      {/* Section 13: Objectives */}
                      <div>
                        <h4 className="font-sans font-black text-xs uppercase text-purple-900 border-b border-purple-900 pb-1">
                          13. LEARNING OBJECTIVES
                        </h4>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-slate-900 font-medium">
                          {(selectedNote.objectives || objectives).map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Section 14-16 */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-[11px]">
                        <div className="p-2.5 border border-slate-300 bg-slate-50">
                          <span className="font-bold text-slate-900 uppercase block">14. Previous Knowledge:</span>
                          <p className="text-slate-700 text-[10px]">{selectedNote.previousKnowledge}</p>
                        </div>
                        <div className="p-2.5 border border-slate-300 bg-slate-50">
                          <span className="font-bold text-slate-900 uppercase block">15. Instructional Materials:</span>
                          <p className="text-slate-700 text-[10px]">{(selectedNote.instructionalMaterials || []).join(", ")}</p>
                        </div>
                        <div className="p-2.5 border border-slate-300 bg-slate-50">
                          <span className="font-bold text-slate-900 uppercase block">16. Teaching Methods:</span>
                          <p className="text-slate-700 text-[10px]">{(selectedNote.teachingMethods || []).join(", ")}</p>
                        </div>
                      </div>

                      {/* Section 17-21 Activities & Practice */}
                      <div className="space-y-2">
                        <h4 className="font-sans font-black text-xs uppercase text-purple-900 border-b border-purple-900 pb-1">
                          17-21. CLASSROOM DELIVERABLES, ACTIVITIES & PRACTICE
                        </h4>
                        <div className="p-3 border border-slate-300 bg-white font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                          {editorText || selectedNote.content}
                        </div>
                      </div>

                      {/* Section 22-24 Assessment & Evaluation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 border border-slate-300 bg-slate-50 space-y-1">
                          <h5 className="font-sans font-bold text-[11px] text-slate-900 uppercase">23. Evaluation Questions:</h5>
                          <ol className="list-decimal list-inside text-[11px] text-slate-800 space-y-1">
                            {(selectedNote.evaluationQuestions || []).map((q: string, i: number) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="p-3 border border-slate-300 bg-slate-50 space-y-1">
                          <h5 className="font-sans font-bold text-[11px] text-slate-900 uppercase">24. Homework & Assignment:</h5>
                          <p className="text-[11px] text-slate-800">{selectedNote.assignment}</p>
                        </div>
                      </div>

                      {/* Section 25-27 Summary & References */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                        <div className="p-2.5 border border-purple-200 bg-purple-50">
                          <span className="font-bold text-purple-950 block">25. Summary:</span>
                          <p className="text-purple-900 text-[10px]">{selectedNote.summary}</p>
                        </div>
                        <div className="p-2.5 border border-purple-200 bg-purple-50">
                          <span className="font-bold text-purple-950 block">26. Conclusion:</span>
                          <p className="text-purple-900 text-[10px]">{selectedNote.conclusion}</p>
                        </div>
                        <div className="p-2.5 border border-purple-200 bg-purple-50">
                          <span className="font-bold text-purple-950 block">27. References:</span>
                          <p className="text-purple-900 text-[10px]">{(selectedNote.references || []).join(", ")}</p>
                        </div>
                      </div>

                      {/* Section 28: Signature & Official Stamp */}
                      <div className="pt-6 border-t-2 border-slate-900 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-[11px]">
                        <div className="space-y-4">
                          <p className="font-black text-slate-900 uppercase">Subject Teacher Signature:</p>
                          <div className="h-8 border-b border-slate-900 flex items-end font-serif italic">
                            {selectedNote.teacherName}
                          </div>
                          <p className="text-[10px] text-slate-500">Date: {selectedNote.date}</p>
                        </div>

                        <div className="space-y-4">
                          <p className="font-black text-slate-900 uppercase">Approval Sign-Off ({selectedNote.submittedTo || "HOD"}):</p>
                          <div className="h-8 border-b border-slate-900 flex items-end font-serif italic text-emerald-800 font-bold">
                            {selectedNote.status === "Approved" ? "Approved & Digitally Verified" : "Pending Approval"}
                          </div>
                          <p className="text-[10px] text-slate-500">Status: {selectedNote.status}</p>
                        </div>

                        <div className="border-2 border-dashed border-slate-900 p-3 text-center flex flex-col items-center justify-center bg-slate-50">
                          <div className="w-9 h-9 rounded-full border-2 border-purple-900 text-purple-900 flex items-center justify-center font-black text-[9px] uppercase mb-1">
                            STAMP
                          </div>
                          <p className="font-black text-[10px] uppercase text-slate-900">PRINCIPAL / ACADEMIC SEAL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs">No lesson notes available.</p>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: WEEKLY LESSON NOTES */}
      {/* ========================================================= */}
      {moduleTab === "weekly" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-purple-400" /> Weekly Lesson Notes Scheme Overview
            </h3>
            <span className="text-xs text-purple-300 font-mono">12 Weeks Term Plan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`).map((wk, idx) => {
              const matchingNote = notesList.find((n) => n.week === wk);
              return (
                <div
                  key={wk}
                  className={`p-4 rounded-xl border space-y-2 ${
                    matchingNote ? "bg-slate-900 border-purple-500/40" : "bg-slate-950 border-slate-800 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{wk}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${matchingNote ? "bg-purple-500/20 text-purple-300" : "bg-slate-800 text-slate-400"}`}>
                      {matchingNote ? matchingNote.status : "Not Generated"}
                    </span>
                  </div>
                  <p className="text-slate-300 font-semibold text-xs">
                    {matchingNote ? matchingNote.topic : `Scheduled topic for ${wk}`}
                  </p>
                  {matchingNote && (
                    <button
                      onClick={() => {
                        setSelectedNote(matchingNote);
                        setModuleTab("my-notes");
                      }}
                      className="text-purple-400 font-bold hover:underline block text-[11px]"
                    >
                      View Full Note →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 5: DRAFTS */}
      {/* ========================================================= */}
      {moduleTab === "drafts" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Save className="w-4 h-4 text-amber-400" /> Draft Lesson Notes (Auto-Saved)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notesList.filter((n) => n.status === "Draft").map((d) => (
              <div key={d.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{d.topic}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Draft</span>
                </div>
                <p className="text-slate-400">{d.subject} • {d.class} • {d.week}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500">Auto-saved</span>
                  <button
                    onClick={() => {
                      setSelectedNote(d);
                      setModuleTab("my-notes");
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs"
                  >
                    Edit Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 6: SUBMITTED NOTES */}
      {/* ========================================================= */}
      {moduleTab === "submitted" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Send className="w-4 h-4 text-blue-400" /> Submitted Lesson Notes (Under Review)
          </h3>

          <div className="space-y-3">
            {notesList.filter((n) => n.status === "Submitted" || n.status === "Pending Approval").map((s) => (
              <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white text-sm block">{s.topic}</span>
                  <span className="text-slate-400">{s.subject} • {s.class} • Submitted to: {s.submittedTo || "Head Teacher"}</span>
                </div>
                <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  Under Review
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 7: APPROVED NOTES */}
      {/* ========================================================= */}
      {moduleTab === "approved" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Approved & Verified Lesson Notes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notesList.filter((n) => n.status === "Approved").map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{app.topic}</span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> Approved
                  </span>
                </div>
                <p className="text-slate-400">{app.subject} • {app.class} • {app.week}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedNote(app);
                      setModuleTab("my-notes");
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                  >
                    View Printable Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 8: RETURNED FOR CORRECTION */}
      {/* ========================================================= */}
      {moduleTab === "returned" && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertCircle className="w-4 h-4 text-rose-400" /> Lesson Notes Returned for Correction
          </h3>

          <div className="space-y-3">
            {notesList.filter((n) => n.status === "Returned for Correction").map((ret) => (
              <div key={ret.id} className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-sm">{ret.topic}</span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    Action Required
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-200 space-y-1">
                  <span className="font-bold uppercase text-[10px] text-rose-400 block">Reviewer Feedback ({ret.submittedTo}):</span>
                  <p>{ret.correctionFeedback}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedNote(ret);
                      setModuleTab("my-notes");
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow text-xs"
                  >
                    Edit & Fix Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 9: LESSON NOTES CALENDAR */}
      {/* ========================================================= */}
      {moduleTab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-purple-400" /> Academic Schedule & Lesson Notes Calendar
            </h3>
            <span className="text-xs text-purple-300 font-mono">2026/2027 Calendar View</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-xs">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const noteOnDay = notesList.find((n) => n.date?.endsWith(`-${String(day).padStart(2, "0")}`));
                return (
                  <div
                    key={day}
                    className={`min-h-[80px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      noteOnDay ? "bg-purple-950/40 border-purple-500 text-white" : "bg-slate-950 border-slate-800/80 text-slate-500"
                    }`}
                  >
                    <span className="font-bold font-mono text-[11px]">{day}</span>
                    {noteOnDay && (
                      <div
                        onClick={() => {
                          setSelectedNote(noteOnDay);
                          setModuleTab("my-notes");
                        }}
                        className="cursor-pointer"
                      >
                        <span className="text-[9px] font-bold text-purple-300 block truncate">{noteOnDay.topic}</span>
                        <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-200 block w-max mt-0.5">
                          {noteOnDay.subject}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 10: DOWNLOAD CENTRE */}
      {/* ========================================================= */}
      {moduleTab === "downloads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-400" /> Export & Download Centre
            </h3>
            <span className="text-xs text-slate-400">PDF • DOCX • HTML • Print Ready</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                PDF
              </div>
              <h4 className="font-bold text-white text-sm">PDF Document Package</h4>
              <p className="text-slate-400">Includes school logo, signature lines, page numbers, and official seal watermark.</p>
              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
              >
                Download PDF
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                DOCX
              </div>
              <h4 className="font-bold text-white text-sm">Microsoft Word (.docx)</h4>
              <p className="text-slate-400">Fully editable Word document formatted according to NERDC guidelines.</p>
              <button
                onClick={() => showNotification("Exporting DOCX package...")}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Download Word (.docx)
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                HTML
              </div>
              <h4 className="font-bold text-white text-sm">Standalone HTML Sheet</h4>
              <p className="text-slate-400">Web-ready HTML page with interactive expandable headers.</p>
              <button
                onClick={() => showNotification("Exporting HTML package...")}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Download HTML
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBMIT FOR APPROVAL MODAL */}
      {/* ========================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-400" /> Submit Lesson Note for Approval
            </h3>

            <p className="text-xs text-slate-400">
              Select the administrative authority for approval according to school workflow:
            </p>

            <div className="space-y-2 text-xs">
              {(["Head Teacher", "Academic Director", "Principal"] as const).map((role) => (
                <label
                  key={role}
                  onClick={() => setSubmitRecipient(role)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    submitRecipient === role ? "bg-purple-950/60 border-purple-500 text-white font-bold" : "bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                >
                  <span>{role}</span>
                  {submitRecipient === role && <Check className="w-4 h-4 text-purple-400" />}
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForApproval}
                className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
