import React, { useState } from "react";
import { Award, Printer, Download, Sparkles, Check, QrCode, ShieldCheck, UserCheck, BarChart3, TrendingUp } from "lucide-react";
import { ReportCard, getSubjectsForClass } from "../../types";

export const ReportCardView: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState("Adeyemi Chinedu");
  const [selectedClass, setSelectedClass] = useState("SS 2 Gold");
  const [term, setTerm] = useState("First Term 2026/2027");

  // Editable subject scores
  const [subjectScores, setSubjectScores] = useState<Array<{ name: string; ca1: number; ca2: number; exam: number }>>(() => {
    const subjects = getSubjectsForClass("SS 2 Gold");
    return subjects.slice(0, 9).map((name) => ({
      name,
      ca1: Math.floor(Math.random() * 5) + 15,
      ca2: Math.floor(Math.random() * 5) + 15,
      exam: Math.floor(Math.random() * 12) + 48,
    }));
  });

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    const subjects = getSubjectsForClass(newClass);
    setSubjectScores(
      subjects.map((name) => ({
        name,
        ca1: Math.floor(Math.random() * 5) + 15,
        ca2: Math.floor(Math.random() * 5) + 15,
        exam: Math.floor(Math.random() * 12) + 48,
      }))
    );
  };

  const [loading, setLoading] = useState(false);
  const [compiledReport, setCompiledReport] = useState<ReportCard | null>(null);

  const handleCalculateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report-card/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: selectedStudent,
          class: selectedClass,
          term,
          scores: subjectScores,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCompiledReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (index: number, field: string, value: number) => {
    const updated = [...subjectScores];
    updated[index] = { ...updated[index], [field]: Math.min(Math.max(0, value), field === "exam" ? 60 : 20) };
    setSubjectScores(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Automated Report Card & Result Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated score compilation, class position ranking, grade allocation (A1-F9), psychomotor matrix, and QR verification.
          </p>
        </div>

        <button
          onClick={handleCalculateReport}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 active:scale-95 transition-all"
        >
          <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Calculating Positions..." : "Compile & Calculate Results"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Entry Panel */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            Student Score Entry Sheet
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Student Name
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              >
                <option value="Adeyemi Chinedu">Adeyemi Chinedu (STD-089)</option>
                <option value="Fatima Abubakar">Fatima Abubakar (STD-112)</option>
                <option value="Eze Chukwuemeka">Eze Chukwuemeka (STD-045)</option>
                <option value="Zainab Danjuma">Zainab Danjuma (STD-167)</option>
                <option value="Okafor Ifeoma">Okafor Ifeoma (STD-201)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Class Stream
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200 font-medium"
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
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Scores (CA1: 20, CA2: 20, Exam: 60)</span>
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {subjectScores.map((subj, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-28 truncate">{subj.name}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={subj.ca1}
                      onChange={(e) => handleScoreChange(idx, "ca1", Number(e.target.value))}
                      className="w-11 px-1.5 py-1 text-center font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      title="CA 1 (Max 20)"
                    />
                    <input
                      type="number"
                      value={subj.ca2}
                      onChange={(e) => handleScoreChange(idx, "ca2", Number(e.target.value))}
                      className="w-11 px-1.5 py-1 text-center font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      title="CA 2 (Max 20)"
                    />
                    <input
                      type="number"
                      value={subj.exam}
                      onChange={(e) => handleScoreChange(idx, "exam", Number(e.target.value))}
                      className="w-14 px-1.5 py-1 text-center font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400"
                      title="Exam (Max 60)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Card Document Preview */}
        <div className="lg:col-span-2 space-y-4">
          {compiledReport ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm print:shadow-none print:border-none space-y-6 relative overflow-hidden">
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <span className="text-9xl font-black uppercase rotate-[-25deg] text-slate-900 dark:text-white">
                  LIVINGSTONE
                </span>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Official Printable Report Card Sheet
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Student Result</span>
                  </button>
                </div>
              </div>

              {/* School Header & Crest */}
              <div className="text-center relative z-10 border-b-2 border-slate-900 dark:border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  LIVINGSTONE INTERNATIONAL ACADEMY
                </h2>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">
                  OFFICIAL TERMINAL STUDENT REPORT CARD
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Session: 2026/2027 • Term: {compiledReport.term}
                </p>
              </div>

              {/* Student Profile Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs relative z-10">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Student Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{compiledReport.studentName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Admission Number</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{compiledReport.studentId}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Class Stream</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{compiledReport.class}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Class Position</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{compiledReport.positionInClass}</span>
                </div>
              </div>

              {/* Academic Performance Table */}
              <div className="relative z-10 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Academic Performance Breakdown
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5 text-center">CA1 (20)</th>
                        <th className="p-2.5 text-center">CA2 (20)</th>
                        <th className="p-2.5 text-center">Exam (60)</th>
                        <th className="p-2.5 text-center">Total (100)</th>
                        <th className="p-2.5 text-center">Grade</th>
                        <th className="p-2.5">Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {compiledReport.subjects.map((subj, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{subj.name}</td>
                          <td className="p-2.5 text-center text-slate-700 dark:text-slate-300">{subj.ca1}</td>
                          <td className="p-2.5 text-center text-slate-700 dark:text-slate-300">{subj.ca2}</td>
                          <td className="p-2.5 text-center text-slate-700 dark:text-slate-300">{subj.exam}</td>
                          <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">{subj.total}</td>
                          <td className="p-2.5 text-center font-bold text-indigo-600 dark:text-indigo-400">{subj.grade}</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-400">{subj.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Performance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Overall Aggregate Score</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{compiledReport.overallTotal} / 700</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Percentage Average</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{compiledReport.average}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Promotion Status</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{compiledReport.promotionStatus}</span>
                </div>
              </div>

              {/* Comments & Principal Signature */}
              <div className="space-y-3 relative z-10 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">Form Teacher's AI Remark: </strong>
                  <span className="text-slate-600 dark:text-slate-400">{compiledReport.teacherComment}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">Principal's Official Remark: </strong>
                  <span className="text-slate-600 dark:text-slate-400">{compiledReport.principalComment}</span>
                </div>
              </div>

              {/* Verification & QR Code Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <QrCode className="w-8 h-8 text-slate-800 dark:text-slate-200" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      QR Result Verification Code
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {compiledReport.qrVerificationToken}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-8 flex items-end justify-end">
                    <span className="font-serif italic text-sm font-bold text-slate-800 dark:text-slate-200">
                      Dr. M. A. Livingstone
                    </span>
                  </div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    Principal's Authorized Digital Seal
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                No Report Card Calculated Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Adjust scores on the left and click "Compile & Calculate Results" to auto-generate class positions and report cards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
