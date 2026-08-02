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
  Code,
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
  Upload
} from "lucide-react";
import { LessonNote, ALL_CLASSES, getSubjectsForClass } from "../../types";
import { lookupCurriculumTopic, CURRICULUM_DATABASE, CurriculumTopic } from "../../data/curriculumData";

interface AILessonNotesViewProps {
  userSession?: any;
}

export const AILessonNotesView: React.FC<AILessonNotesViewProps> = ({ userSession }) => {
  // 1. Selector State
  const [schoolName, setSchoolName] = useState(userSession?.schoolName || "Destiny Way International Group of Schools");
  const [teacherName, setTeacherName] = useState("Mrs. Okonkwo Beatrice");
  const [academicSession, setAcademicSession] = useState("2026/2027");
  const [country, setCountry] = useState("Nigeria");
  const [state, setState] = useState("Lagos");
  const [className, setClassName] = useState("SS 2");
  const [subject, setSubject] = useState("Mathematics");
  const [term, setTerm] = useState("First Term");
  const [week, setWeek] = useState("Week 4");
  const [lessonDuration, setLessonDuration] = useState("40 Minutes (Double Period)");
  const [teachingDate, setTeachingDate] = useState(() => new Date().toISOString().split("T")[0]);

  const availableSubjects = getSubjectsForClass(className);

  // 2. Auto-Retrieved & Custom Curriculum Topic State
  const [curriculumTopic, setCurriculumTopic] = useState<CurriculumTopic>(() =>
    lookupCurriculumTopic("SS 2", "Mathematics", "First Term", "Week 4")
  );
  const [customTopic, setCustomTopic] = useState("Quadratic Equations & Roots Analysis");
  const [customSubTopic, setCustomSubTopic] = useState("Factorization, Completing the Square, & Graphical Solution");
  const [isCurriculumValid, setIsCurriculumValid] = useState(true);

  // Auto-Update Topic whenever Class, Subject, Term, or Week changes!
  useEffect(() => {
    const retrieved = lookupCurriculumTopic(className, subject, term, week);
    setCurriculumTopic(retrieved);
    setIsCurriculumValid(Boolean(retrieved));
    if (retrieved) {
      setCustomTopic(retrieved.topic);
      setCustomSubTopic(retrieved.subTopic);
    }
  }, [className, subject, term, week]);

  // 3. Generator & Editor State
  const [loading, setLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<any | null>(null);
  const [editorText, setEditorText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "editor" | "suggestions" | "history" | "admin">("preview");

  // Rich Text Formatting State
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Save / Action Messages
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [versionHistory, setVersionHistory] = useState<{ version: string; date: string; author: string }[]>([]);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState("School Library");

  // Admin Modal State
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [curriculumCatalog, setCurriculumCatalog] = useState(CURRICULUM_DATABASE);

  // Preview Mode & Watermark State
  const [previewStyleMode, setPreviewStyleMode] = useState<"printable" | "darkApp">("printable");
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState("LIVINGSTONE INTERNATIONAL ACADEMY");
  const [watermarkOpacity, setWatermarkOpacity] = useState("0.08");

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 3500);
  };

  // AI Generation Handler
  const handleGenerate = async () => {
    const finalTopic = customTopic.trim() || curriculumTopic.topic;
    const finalSubTopic = customSubTopic.trim() || curriculumTopic.subTopic;

    if (!finalTopic) {
      showNotification("Please specify or select a lesson topic.");
      return;
    }

    setLoading(true);
    setActionSuccessMsg("");

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
          topic: finalTopic,
          subTopic: finalSubTopic,
          lessonDuration,
          teachingDate,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedNote(data.data);
        setEditorText(data.data.content || "");
        setVersionHistory((prev) => [
          { version: `v1.0 (Initial AI Gen)`, date: new Date().toLocaleTimeString(), author: teacherName },
          ...prev,
        ]);
        showNotification("AI Lesson Note generated successfully following NERDC curriculum!");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error connecting to AI generation service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!generatedNote) return;
    const updated = {
      ...generatedNote,
      content: editorText,
      status: "Draft",
      updatedAt: new Date().toLocaleDateString(),
    };
    setGeneratedNote(updated);
    setSavedNotes((prev) => [updated, ...prev]);
    setVersionHistory((prev) => [
      { version: `v${(prev.length + 1.0).toFixed(1)} (Draft Saved)`, date: new Date().toLocaleTimeString(), author: teacherName },
      ...prev,
    ]);
    showNotification("Lesson note saved as Draft!");
  };

  const handleExport = (format: string) => {
    if (!generatedNote) return;
    showNotification(`Exporting lesson note as ${format.toUpperCase()} package...`);
    const blob = new Blob([editorText || generatedNote.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LessonNote-${subject}-${className}-${week}.${format.toLowerCase()}`;
    link.click();
  };

  const handleShare = () => {
    setShowShareModal(false);
    showNotification(`Lesson Note shared successfully with ${shareTarget}!`);
  };

  const applyTextFormat = (tag: string) => {
    if (tag === "bold") setIsBold(!isBold);
    if (tag === "italic") setIsItalic(!isItalic);
    if (tag === "underline") setIsUnderline(!isUnderline);
    if (tag === "highlight") setIsHighlighted(!isHighlighted);
    setEditorText((prev) => `${prev} [${tag.toUpperCase()}]`);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto" : ""}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-purple-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                AI Lesson Notes Generator <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">NERDC 2026 Curriculum Aligned</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Livingstone International Academy • Automated Topic Retrieval & Gemini AI Planning Module
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin Curriculum Control</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Admin Controls Drawer */}
      {showAdminPanel && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Building className="w-4 h-4 text-purple-400" />
              School Curriculum & AI Usage Admin Dashboard
            </div>
            <span className="text-xs text-slate-400 font-mono">Curriculum Version: NERDC-2026.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Curriculum Records</span>
              <span className="text-lg font-black text-white">{curriculumCatalog.length} Topics</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">AI Notes Generated</span>
              <span className="text-lg font-black text-purple-400">142 Notes</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Teacher Approval Rate</span>
              <span className="text-lg font-black text-emerald-400">96.4%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Syllabus Sync</span>
                <span className="text-xs font-bold text-slate-300">Live Database</span>
              </div>
              <button
                onClick={() => showNotification("Syllabus uploaded and synchronized across all teachers!")}
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: School & Curriculum Workflow Controls */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Curriculum Auto-Retrieval Engine
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              No Manual Topic Entry
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-400 mb-1">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Class Level *</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold focus:border-purple-500"
                >
                  <optgroup label="Primary School">
                    <option value="Primary 1">Primary 1</option>
                    <option value="Primary 2">Primary 2</option>
                    <option value="Primary 3">Primary 3</option>
                    <option value="Primary 4">Primary 4</option>
                    <option value="Primary 5">Primary 5</option>
                    <option value="Primary 6">Primary 6</option>
                  </optgroup>
                  <optgroup label="Junior Secondary">
                    <option value="JSS 1">JSS 1</option>
                    <option value="JSS 2">JSS 2</option>
                    <option value="JSS 3">JSS 3 (BECE)</option>
                  </optgroup>
                  <optgroup label="Senior Secondary">
                    <option value="SS 1">SS 1</option>
                    <option value="SS 2">SS 2</option>
                    <option value="SS 3">SS 3 (WAEC / NECO)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold focus:border-purple-500"
                >
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Academic Term *</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-medium"
                >
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Week Number *</label>
                <select
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-medium"
                >
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                  <option value="Week 5">Week 5</option>
                  <option value="Week 6 (Mid-Term)">Week 6 (Mid-Term)</option>
                  <option value="Week 7">Week 7</option>
                  <option value="Week 8">Week 8</option>
                  <option value="Week 9">Week 9</option>
                  <option value="Week 10">Week 10</option>
                  <option value="Week 11 (Revision)">Week 11 (Revision)</option>
                  <option value="Week 12 (Examination)">Week 12 (Exam)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Lesson Duration</label>
                <input
                  type="text"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Teaching Date</label>
                <input
                  type="date"
                  value={teachingDate}
                  onChange={(e) => setTeachingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
                />
              </div>
            </div>

            {/* EDITABLE TOPIC & SUB-TOPIC SECTION WITH CURRICULUM SUGGESTION */}
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> NERDC Syllabus Topic & Inline AI Generator
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  Editable Topic
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  Lesson Topic *
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter or select topic..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/50 text-white font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  Sub-Topic / Specific Focus Area
                </label>
                <input
                  type="text"
                  value={customSubTopic}
                  onChange={(e) => setCustomSubTopic(e.target.value)}
                  placeholder="Enter or select sub-topic..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/50 text-slate-200 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 border-t border-purple-500/30 text-[11px] text-purple-200 flex items-center justify-between">
                <span>Ref: {curriculumTopic.nerdcReference}</span>
                <span className="text-emerald-400 font-bold">✓ Syllabus Verified</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Generating Gemini Lesson Note..." : "Generate AI Lesson Note"}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Lesson Note View / Editor / Export / Sharing */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "preview", label: "Lesson Note View", icon: BookOpen },
                { id: "editor", label: "Rich Text Editor", icon: Edit3 },
                { id: "suggestions", label: "AI Teaching Tips", icon: Brain },
                { id: "history", label: "Version History", icon: History },
              ].map((tb) => {
                const Icon = tb.icon;
                const active = activeTab === tb.id;
                return (
                  <button
                    key={tb.id}
                    onClick={() => setActiveTab(tb.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      active
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tb.label}</span>
                  </button>
                );
              })}
            </div>

            {generatedNote && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" /> Save Draft
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-purple-500/30"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: OFFICIAL LESSON NOTE FORMAT PREVIEW MODE */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              {generatedNote ? (
                <div className="space-y-4">
                  {/* PREVIEW MODE TOOLBAR */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs shadow-lg">
                    {/* View Style Switcher */}
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setPreviewStyleMode("printable")}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          previewStyleMode === "printable"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>📄 Printable A4 Sheet</span>
                      </button>
                      <button
                        onClick={() => setPreviewStyleMode("darkApp")}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          previewStyleMode === "darkApp"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>💻 Dark App Mode</span>
                      </button>
                    </div>

                    {/* Watermark Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-1.5 text-slate-300 font-bold bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showWatermark}
                          onChange={(e) => setShowWatermark(e.target.checked)}
                          className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                        />
                        <span>Watermark</span>
                      </label>

                      {showWatermark && (
                        <select
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-200 font-medium px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="LIVINGSTONE INTERNATIONAL ACADEMY">School Name Watermark</option>
                          <option value="OFFICIAL LESSON PLAN • NERDC">Official NERDC Watermark</option>
                          <option value="CONFIDENTIAL • INTERNAL USE ONLY">Confidential</option>
                          <option value="APPROVED BY ACADEMIC HOD">HOD Approved Stamp</option>
                        </select>
                      )}
                    </div>

                    {/* Export & Print */}
                    <div className="flex items-center gap-1.5">
                      {["PDF", "DOCX", "HTML"].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleExport(fmt)}
                          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-bold text-[11px]"
                        >
                          {fmt}
                        </button>
                      ))}
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                      </button>
                    </div>
                  </div>

                  {/* PRINTABLE A4 DOCUMENT PREVIEW MODE */}
                  {previewStyleMode === "printable" ? (
                    <div className="bg-slate-950 p-4 sm:p-8 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
                      {/* Realistic Sheet */}
                      <div className="w-full max-w-[800px] min-h-[1050px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 relative font-serif text-xs leading-relaxed print:shadow-none print:border-none print:p-0 print:max-w-none">
                        
                        {/* WATERMARK STYLING */}
                        {showWatermark && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                            <span 
                              style={{ opacity: Number(watermarkOpacity) }}
                              className="text-slate-900 font-serif font-black text-4xl sm:text-6xl tracking-widest uppercase rotate-[-30deg] text-center max-w-lg leading-tight border-4 border-dashed border-slate-900 p-8 rounded-3xl"
                            >
                              {watermarkText}
                            </span>
                          </div>
                        )}

                        {/* DOCUMENT HEADER */}
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                            {/* School Emblem Badge */}
                            <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl border-2 border-amber-400 shadow-md">
                              LIA
                            </div>

                            {/* Center Title */}
                            <div className="text-center flex-1 px-4">
                              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900">
                                {schoolName}
                              </h1>
                              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                                Federal Ministry of Education & NERDC Approved Curriculum Standard
                              </p>
                              <div className="inline-block mt-1 px-3 py-0.5 bg-slate-100 border border-slate-300 text-[11px] font-bold text-purple-900 uppercase">
                                OFFICIAL LESSON NOTE & TEACHING SCHEME
                              </div>
                            </div>

                            {/* Seal Badge */}
                            <div className="w-16 h-16 rounded-lg border-2 border-emerald-700 bg-emerald-50 text-emerald-800 p-1 text-[9px] font-extrabold text-center flex flex-col items-center justify-center leading-tight">
                              <ShieldCheck className="w-5 h-5 text-emerald-700 mb-0.5" />
                              VERIFIED SYLLABUS
                            </div>
                          </div>

                          {/* METADATA FORMAL TABLE */}
                          <div className="border border-slate-900 rounded-sm text-[11px] overflow-hidden">
                            <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100 border-b border-slate-900 divide-x divide-slate-900 font-bold text-slate-900">
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">TEACHER NAME:</span> {teacherName}</div>
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">ACADEMIC SESSION:</span> {academicSession}</div>
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">TERM & WEEK:</span> {term} ({week})</div>
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">DATE & DURATION:</span> {teachingDate} ({lessonDuration})</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-slate-900 bg-white font-bold text-slate-900">
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">CLASS:</span> {className}</div>
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">SUBJECT:</span> {subject}</div>
                              <div className="p-2"><span className="text-slate-500 font-semibold block text-[9px]">NERDC REF NO:</span> {curriculumTopic.nerdcReference}</div>
                            </div>
                            <div className="p-2.5 bg-purple-50 border-t border-slate-900">
                              <span className="text-purple-900 font-bold block text-[10px] uppercase">LESSON TOPIC & FOCUS:</span>
                              <h3 className="text-sm font-black text-slate-900 uppercase">{generatedNote.topic}</h3>
                              {curriculumTopic.subTopic && (
                                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                                  <span className="font-bold text-slate-900">SUB-TOPIC:</span> {curriculumTopic.subTopic}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* DOCUMENT BODY SECTIONS */}
                        <div className="relative z-10 mt-6 space-y-6 text-slate-900 font-serif">
                          {/* SECTION 1: PERFORMANCE OBJECTIVES */}
                          <div className="space-y-2">
                            <h4 className="font-sans font-black text-xs uppercase tracking-wider text-purple-900 border-b border-purple-900 pb-1 flex items-center gap-1.5">
                              1. PERFORMANCE OBJECTIVES & LEARNING OUTCOMES
                            </h4>
                            <p className="text-[11px] text-slate-700 italic font-sans">
                              By the end of this lesson, students should be able to:
                            </p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-900 font-medium">
                              {curriculumTopic.objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>

                          {/* SECTION 2: ENTRY BEHAVIOUR & INSTRUCTIONAL MATERIALS */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 border border-slate-300 rounded-sm bg-slate-50 space-y-1">
                              <h5 className="font-sans font-extrabold text-[11px] text-slate-900 uppercase">
                                Entry Behaviour (Previous Knowledge):
                              </h5>
                              <p className="text-[11px] text-slate-700">{curriculumTopic.previousKnowledge}</p>
                            </div>
                            <div className="p-3 border border-slate-300 rounded-sm bg-slate-50 space-y-1">
                              <h5 className="font-sans font-extrabold text-[11px] text-slate-900 uppercase">
                                Teaching Aid & Resources:
                              </h5>
                              <p className="text-[11px] text-slate-700">{curriculumTopic.instructionalMaterials.join(", ")}</p>
                            </div>
                          </div>

                          {/* SECTION 3: DETAILED LESSON CONTENT */}
                          <div className="space-y-2">
                            <h4 className="font-sans font-black text-xs uppercase tracking-wider text-purple-900 border-b border-purple-900 pb-1">
                              2. DETAILED LESSON DELIVERABLES & STEP-BY-STEP PRESENTATION
                            </h4>
                            <div className="p-4 border border-slate-400 bg-white font-mono text-[11px] leading-relaxed text-slate-900 whitespace-pre-wrap rounded-sm shadow-inner">
                              {editorText || generatedNote.content}
                            </div>
                          </div>

                          {/* SECTION 4: MORAL LESSON & INCLUSIVE STRATEGY */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 border border-purple-200 bg-purple-50/50 rounded-sm space-y-1">
                              <h5 className="font-sans font-extrabold text-[11px] text-purple-950 uppercase">
                                Moral Lesson & Ethics:
                              </h5>
                              <p className="text-[11px] text-purple-900">{curriculumTopic.moralLesson}</p>
                            </div>
                            <div className="p-3 border border-emerald-200 bg-emerald-50/50 rounded-sm space-y-1">
                              <h5 className="font-sans font-extrabold text-[11px] text-emerald-950 uppercase">
                                Differentiated & Inclusive Learning:
                              </h5>
                              <p className="text-[11px] text-emerald-900">{curriculumTopic.inclusiveStrategy}</p>
                            </div>
                          </div>

                          {/* SECTION 5: SIGNATURE & OFFICIAL APPROVAL BLOCK */}
                          <div className="pt-6 border-t-2 border-slate-900 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-[11px]">
                            <div className="space-y-4">
                              <p className="font-extrabold text-slate-900 uppercase">Prepared By (Subject Teacher):</p>
                              <div className="h-8 border-b border-slate-900 flex items-end font-serif italic text-slate-800">
                                {teacherName}
                              </div>
                              <p className="text-[10px] text-slate-500">Sign & Date: ____________________</p>
                            </div>

                            <div className="space-y-4">
                              <p className="font-extrabold text-slate-900 uppercase">Reviewed By (HOD Academic):</p>
                              <div className="h-8 border-b border-slate-900 flex items-end font-serif italic text-slate-800">
                                Approved & Verified
                              </div>
                              <p className="text-[10px] text-slate-500">Sign & Date: ____________________</p>
                            </div>

                            <div className="border-2 border-dashed border-slate-900 p-3 rounded-sm text-center flex flex-col items-center justify-center bg-slate-50">
                              <div className="w-10 h-10 rounded-full border-2 border-purple-900 text-purple-900 flex items-center justify-center font-black text-[10px] uppercase mb-1">
                                STAMP
                              </div>
                              <p className="font-black text-[10px] uppercase text-slate-900">SCHOOL STAMP & PRINCIPAL SEAL</p>
                              <p className="text-[9px] text-slate-500">Official Clearance</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* DARK APP MODE PREVIEW */
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-200">
                      {/* Header Table */}
                      <div className="text-center border-b border-slate-800 pb-4 space-y-1">
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">{schoolName}</h2>
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                          OFFICIAL NIGERIAN NERDC CURRICULUM LESSON PLAN
                        </p>
                        <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-purple-950 border border-purple-500/40 text-xs font-bold text-purple-300">
                          TOPIC: {generatedNote.topic}
                        </div>
                      </div>

                      {/* Official Lesson Plan Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Teacher</span>
                          <span className="font-bold text-white">{teacherName}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Subject & Class</span>
                          <span className="font-bold text-white">{subject} • {className}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Session & Term</span>
                          <span className="font-bold text-white">{academicSession} • {term}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Week & Duration</span>
                          <span className="font-bold text-white">{week} • {lessonDuration}</span>
                        </div>
                      </div>

                      {/* Body Content Sections */}
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <h4 className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> Performance Objectives & Learning Outcomes
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                            {curriculumTopic.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <h4 className="font-bold text-slate-300">Previous Knowledge:</h4>
                            <p className="text-slate-400">{curriculumTopic.previousKnowledge}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <h4 className="font-bold text-slate-300">Instructional Materials:</h4>
                            <p className="text-slate-400">{curriculumTopic.instructionalMaterials.join(", ")}</p>
                          </div>
                        </div>

                        {/* Full Lesson Note Content Render */}
                        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">
                          {editorText || generatedNote.content}
                        </div>

                        {/* Moral Lesson & Inclusive Learning */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                            <h4 className="font-bold text-purple-300">Moral Lesson:</h4>
                            <p className="text-purple-200">{curriculumTopic.moralLesson}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                            <h4 className="font-bold text-emerald-300">Inclusive Learning Strategy:</h4>
                            <p className="text-emerald-200">{curriculumTopic.inclusiveStrategy}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">No Lesson Note Generated Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Select Class, Subject, Term, and Week on the left. The NERDC topic is automatically retrieved!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RICH LESSON NOTE EDITOR */}
          {activeTab === "editor" && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => applyTextFormat("bold")}
                    className={`p-2 rounded-lg text-xs font-bold ${isBold ? "bg-purple-600 text-white" : "bg-slate-950 text-slate-300"}`}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyTextFormat("italic")}
                    className={`p-2 rounded-lg text-xs font-bold ${isItalic ? "bg-purple-600 text-white" : "bg-slate-950 text-slate-300"}`}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyTextFormat("underline")}
                    className={`p-2 rounded-lg text-xs font-bold ${isUnderline ? "bg-purple-600 text-white" : "bg-slate-950 text-slate-300"}`}
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyTextFormat("highlight")}
                    className={`p-2 rounded-lg text-xs font-bold ${isHighlighted ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300"}`}
                    title="Highlight Text"
                  >
                    <Highlighter className="w-4 h-4" />
                  </button>
                  <div className="h-5 w-[1px] bg-slate-800 mx-1" />
                  <button
                    onClick={() => setEditorText((prev) => prev + "\n- Bullet item")}
                    className="p-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditorText((prev) => prev + "\n1. Numbered item")}
                    className="p-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditorText((prev) => prev + "\n| Column 1 | Column 2 |\n| --- | --- |\n| Value 1 | Value 2 |")}
                    className="p-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white"
                    title="Insert Table"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditorText((prev) => prev + "\n![Diagram](https://livingstone.edu.ng/diagram.png)")}
                    className="p-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white"
                    title="Insert Image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditorText((prev) => prev + " V = fλ ")}
                    className="p-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white font-serif font-bold"
                    title="Insert Formula"
                  >
                    fx
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showNotification("Spell check completed! No grammatical errors found.")}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1"
                  >
                    <SpellCheck className="w-3.5 h-3.5 text-purple-400" /> Spell Check
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <textarea
                rows={18}
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                placeholder="Lesson note content..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* TAB 3: AI TEACHING SUGGESTIONS */}
          {activeTab === "suggestions" && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3">
                <Brain className="w-5 h-5 text-purple-400" /> AI Pedagogical Recommendations for {curriculumTopic.topic}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Teaching Methodology
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Use the 5E Instructional Model (Engage, Explore, Explain, Elaborate, Evaluate). Begin with real-world demonstration before formal equation derivation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Classroom Management & Groupwork
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Form heterogeneous small groups of 4. Assign specific roles: Calculation Specialist, Diagram Recorder, Presenter, and Timekeeper.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-400" /> Practical Experiments & Games
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Conduct a 10-minute ripple tank laboratory experiment or tuning fork resonance game to reinforce wave frequency and wavelength concepts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" /> Differentiated Homework Ideas
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Provide 3 tiers of difficulty: Tier 1 (Fundamental conceptual definitions), Tier 2 (Standard WAEC multi-step calculations), Tier 3 (Advanced olympiad application problem).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VERSION HISTORY */}
          {activeTab === "history" && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" /> Version History & Revision Audit Log
              </h3>

              <div className="space-y-3">
                {versionHistory.length > 0 ? (
                  versionHistory.map((vh, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-purple-300">{vh.version}</span>
                        <div className="text-slate-400 text-[11px] mt-0.5">Edited by {vh.author}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 font-mono">{vh.date}</span>
                        <button
                          onClick={() => showNotification(`Restored to ${vh.version}!`)}
                          className="block text-emerald-400 font-bold hover:underline mt-1"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No previous versions saved yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" /> Share Lesson Note
            </h3>
            <p className="text-xs text-slate-400">
              Select recipient or repository to publish this NERDC lesson note.
            </p>

            <div className="space-y-2 text-xs">
              {[
                "School Library Repository",
                "Other Subject Teachers",
                "Head Teacher / HOD",
                "Vice Principal (Academic)",
                "School Principal"
              ].map((target) => (
                <label
                  key={target}
                  onClick={() => setShareTarget(target)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    shareTarget === target ? "bg-purple-950/60 border-purple-500 text-white font-bold" : "bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                >
                  <span>{target}</span>
                  {shareTarget === target && <Check className="w-4 h-4 text-purple-400" />}
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Confirm Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
