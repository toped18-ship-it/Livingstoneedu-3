import React, { useState } from "react";
import { Sparkles, Download, Printer, FileText, Check, Copy, Edit3, Save, Search, BookOpen, Layers } from "lucide-react";
import { LessonNote, ALL_CLASSES, getSubjectsForClass } from "../../types";

export const AILessonNotesView: React.FC = () => {
  const [country, setCountry] = useState("Nigeria");
  const [state, setState] = useState("Lagos");
  const [className, setClassName] = useState("SS 2");
  const [subject, setSubject] = useState("Physics");
  const availableSubjects = getSubjectsForClass(className);
  const [term, setTerm] = useState("First Term");
  const [week, setWeek] = useState("Week 4");
  const [topic, setTopic] = useState("Wave Motion & Sound Wave Properties");
  const [curriculum, setCurriculum] = useState("NERDC / WAEC Standard");
  const [objectives, setObjectives] = useState(
    "Define progressive waves, state the wave equation V = fλ, calculate numerical wave problems, and distinguish transverse vs longitudinal waves."
  );

  const [loading, setLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<LessonNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotes, setSavedNotes] = useState<LessonNote[]>([]);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setSavedSuccessMsg("");
    try {
      const res = await fetch("/api/ai/lesson-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          state,
          className,
          subject,
          term,
          week,
          topic,
          curriculum,
          objectives,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedNote(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToRepo = () => {
    if (!generatedNote) return;
    setSavedNotes((prev) => [generatedNote, ...prev]);
    setSavedSuccessMsg("Lesson Note successfully saved to School Repository!");
    setTimeout(() => setSavedSuccessMsg(""), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Lesson Notes Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate NERDC, WAEC, NECO, & BECE aligned lesson plans instantly using Google Gemini AI.
          </p>
        </div>

        {savedSuccessMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form Controls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            Syllabus & Class Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                State / Region
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Class Level
              </label>
              <select
                value={className}
                onChange={(e) => {
                  const newClass = e.target.value;
                  setClassName(newClass);
                  const newSubjs = getSubjectsForClass(newClass);
                  if (!newSubjs.includes(subject)) {
                    setSubject(newSubjs[0] || "Mathematics");
                  }
                }}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200 font-medium"
              >
                <optgroup label="Primary Classes">
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
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Subject ({availableSubjects.length} Available)
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200 font-medium"
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
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Academic Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Week Number
              </label>
              <select
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              >
                <option value="Week 1">Week 1</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 3">Week 3</option>
                <option value="Week 4">Week 4</option>
                <option value="Week 5">Week 5</option>
                <option value="Week 6">Week 6 (Mid-Term)</option>
                <option value="Week 7">Week 7</option>
                <option value="Week 8">Week 8</option>
                <option value="Week 9">Week 9</option>
                <option value="Week 10">Week 10</option>
                <option value="Week 11">Week 11 (Revision)</option>
                <option value="Week 12">Week 12 (Examination)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Curriculum Standard
            </label>
            <select
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            >
              <option value="NERDC Curriculum">NERDC Curriculum (National Standard)</option>
              <option value="WAEC Syllabus">WAEC Senior School Syllabus</option>
              <option value="NECO Syllabus">NECO National Examination Syllabus</option>
              <option value="BECE Junior Syllabus">BECE Junior Secondary Standard</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Topic Title
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Wave Motion and Sound Waves"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Behavioral Learning Objectives
            </label>
            <textarea
              rows={3}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Generating Gemini Lesson Note..." : "Generate AI Lesson Note"}</span>
          </button>
        </div>

        {/* Right Column (2 Cols): Interactive Generated Lesson Note Document */}
        <div className="lg:col-span-2 space-y-4">
          {generatedNote ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm print:shadow-none print:border-none space-y-5">
              {/* Document Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    {generatedNote.subject} • {generatedNote.className}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                    {generatedNote.week}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToRepo}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Repository</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* Lesson Plan Official Form Header */}
              <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  LIVINGSTONE INTERNATIONAL ACADEMY
                </h2>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">
                  OFFICIAL NERDC CURRICULUM LESSON NOTE
                </p>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                  TOPIC: {generatedNote.topic}
                </div>
              </div>

              {/* Document Metadata Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Duration</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{generatedNote.durationMinutes} Mins (Double Period)</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Class Level</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{generatedNote.className}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Syllabus Ref</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{generatedNote.curriculumRef}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Date Prepared</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Behavioral Objectives */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>1. Behavioral Objectives</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-2">
                  {generatedNote.behavioralObjectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Instructional Materials & Previous Knowledge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Instructional Materials:</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {generatedNote.instructionalMaterials.join(", ")}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Previous Knowledge:</h4>
                  <p className="text-slate-600 dark:text-slate-400">{generatedNote.previousKnowledge}</p>
                </div>
              </div>

              {/* Core Content Sub-sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>2. Main Lesson Content & Mathematical Derivations</span>
                </h4>

                {generatedNote.coreContent.map((section, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {section.subheading}
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {section.explanation}
                    </p>
                    {section.keyTerms && section.keyTerms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {section.keyTerms.map((kt, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                          >
                            #{kt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Evaluation Questions & Assignment */}
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2 text-xs">
                <h4 className="font-bold text-amber-900 dark:text-amber-300">
                  3. Student Evaluation & Classroom Assessment:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-800 dark:text-slate-200 pl-2">
                  {generatedNote.evaluationQuestions.map((q, qIdx) => (
                    <li key={qIdx}>{q}</li>
                  ))}
                </ol>
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                  <span className="font-bold text-amber-900 dark:text-amber-300">Take-Home Homework Assignment: </span>
                  <span className="text-slate-800 dark:text-slate-200">{generatedNote.assignment}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                No Lesson Note Generated Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in the subject and syllabus parameters on the left and click "Generate AI Lesson Note" to generate a NERDC-aligned lesson plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
