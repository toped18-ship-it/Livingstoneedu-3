import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
  Save,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  TrendingUp,
  Download,
} from "lucide-react";

type Status = "Present" | "Late" | "Absent";

interface RosterStudent {
  id: string;
  name: string;
  admissionNo: string;
}

interface Register {
  id: string;
  date: string;
  class: string;
  takenBy: string;
  present: number;
  late: number;
  absent: number;
  records: { studentId: string; studentName?: string; status: Status; remark?: string }[];
}

const STATUS_COL: { key: Status; label: string; active: string }[] = [
  { key: "Present", label: "Present", active: "bg-emerald-500 text-white" },
  { key: "Late", label: "Late", active: "bg-amber-500 text-white" },
  { key: "Absent", label: "Absent", active: "bg-rose-500 text-white" },
];

const STATUS_COLORS: Record<Status, { dot: string; badge: string }> = {
  Present: { dot: "bg-emerald-400", badge: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" },
  Late: { dot: "bg-amber-400", badge: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300" },
  Absent: { dot: "bg-rose-400", badge: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300" },
};

export const AttendanceTrackerView: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [rosterLoaded, setRosterLoaded] = useState(false);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [className, setClassName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/attendance/classes")
      .then((r) => r.json())
      .then((d) => setClasses(d.data || []));
    fetchRegisters();
  }, []);

  const fetchRegisters = () => {
    fetch("/api/attendance/registers")
      .then((r) => r.json())
      .then((d) => setRegisters(d.data || []))
      .catch(() => undefined);
  };

  const handleLoadRoster = async () => {
    if (!className) return;
    setLoadingRoster(true);
    try {
      const { data } = await fetch(`/api/attendance/roster?class=${encodeURIComponent(className)}`).then((r) => r.json());
      setRoster(data || []);
      const init: Record<string, Status> = {};
      (data || []).forEach((s: RosterStudent) => (init[s.id] = "Present"));
      setStatuses(init);
      setRemarks({});
      setRosterLoaded(true);
    } catch {
      setToast({ ok: false, msg: "Could not load roster." });
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleSave = async () => {
    if (!className || !roster.length) return;
    setSaving(true);
    try {
      const records = roster.map((s) => ({
        studentId: s.id,
        status: statuses[s.id] || "Present",
        remark: remarks[s.id] || "",
      }));
      const res = await fetch("/api/attendance/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className, date, records }),
      });
      await res.json();
      setToast({ ok: true, msg: `Register saved for ${className} on ${date}.` });
      fetchRegisters();
      setRoster([]);
      setRosterLoaded(false);
    } catch {
      setToast({ ok: false, msg: "Failed to save register." });
    } finally {
      setSaving(false);
    }
  };

  const present = roster.filter((s) => (statuses[s.id] || "Present") === "Present").length;
  const late = roster.filter((s) => statuses[s.id] === "Late").length;
  const absent = roster.filter((s) => statuses[s.id] === "Absent").length;

  const totalRegisters = registers.length;
  const todayRegisters = registers.filter((r) => r.date === date);
  const todayPresentPct =
    todayRegisters.length && todayRegisters.reduce((acc, r) => acc + r.present + r.late, 0)
      ? Math.round(
          (todayRegisters.reduce((a, r) => a + r.present, 0) /
            (todayRegisters.reduce((a, r) => a + r.present + r.late + r.absent, 0) || 1)) * 100
        )
      : null;
  const totalStudents = registers.reduce((a, r) => a + r.present + r.late + r.absent, 0);
  const totalPresent = registers.reduce((a, r) => a + r.present, 0);
  const avgAttendance = totalStudents ? Math.round((totalPresent / totalStudents) * 100) : null;

  const resolveName = (reg: Register, studentId: string) => {
    const rec = reg.records.find((r) => r.studentId === studentId);
    if (rec?.studentName) return rec.studentName;
    return `Student ${studentId}`;
  };

  const exportCsv = () => {
    const rows = [["Date", "Class", "Taken By", "Present", "Late", "Absent"]];
    registers.forEach((r) => rows.push([r.date, r.class, r.takenBy, String(r.present), String(r.late), String(r.absent)]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-registers-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: "Total Registers", value: String(totalRegisters), icon: ClipboardList, tone: "text-indigo-500 dark:text-indigo-400" },
    { label: "Today's Present %", value: todayPresentPct === null ? "—" : `${todayPresentPct}%`, icon: CheckCircle2, tone: "text-emerald-500 dark:text-emerald-400" },
    { label: "Average Attendance", value: avgAttendance === null ? "—" : `${avgAttendance}%`, icon: TrendingUp, tone: "text-sky-500 dark:text-sky-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <CalendarCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Tracker</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Daily register, live wall-call, and analytics</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-400"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {toast && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold shadow-sm ${
            toast.ok
              ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}
        >
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>{toast.msg}</span>
          <button className="ml-auto text-xs opacity-70 hover:opacity-100" onClick={() => setToast(null)}>Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">{c.label}</span>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{c.value}</div>
                </div>
                <Icon className={`w-7 h-7 ${c.tone}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Take Attendance
          </h3>
          {roster.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">{present} present</span>
              <span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">{late} late</span>
              <span className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">{absent} absent</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block font-bold text-slate-500 dark:text-slate-400 text-xs mb-1">Class</label>
            <select
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                setRosterLoaded(false);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400"
            >
              <option value="">Select class...</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block font-bold text-slate-500 dark:text-slate-400 text-xs mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <button
            onClick={handleLoadRoster}
            disabled={!className || loadingRoster}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
          >
            {loadingRoster ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Load Roster
          </button>
        </div>

        {rosterLoaded && roster.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3 px-3 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="col-span-4 sm:col-span-5">Student</span>
              <span className="col-span-7 sm:col-span-5">Status</span>
              <span className="hidden sm:block col-span-2">Remark</span>
            </div>
            {roster.map((s, idx) => (
              <div key={s.id} className="grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="col-span-4 sm:col-span-5 flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.admissionNo}</div>
                  </div>
                </div>
                <div className="col-span-5 sm:col-span-4 flex gap-1">
                  {STATUS_COL.map((st) => {
                    const active = (statuses[s.id] || "Present") === st.key;
                    return (
                      <button
                        key={st.key}
                        onClick={() => setStatuses((prev) => ({ ...prev, [s.id]: st.key }))}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          active
                            ? `${st.active} shadow`
                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400"
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  value={remarks[s.id] || ""}
                  onChange={(e) => setRemarks((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  placeholder="Remark (optional)"
                  className="hidden sm:block col-span-2 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-400"
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Register
            </button>
          </div>
        )}

        {rosterLoaded && roster.length === 0 && (
          <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-center">
            No students found in this class.
          </p>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Registers History
        </h3>
        {registers.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No registers saved yet.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Taken By</th>
                  <th className="p-3">Present</th>
                  <th className="p-3">Late</th>
                  <th className="p-3">Absent</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {registers.map((reg) => (
                  <React.Fragment key={reg.id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{reg.date}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{reg.class}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{reg.takenBy}</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{reg.present || 0}</td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400">{reg.late || 0}</td>
                      <td className="p-3 font-bold text-rose-600 dark:text-rose-400">{reg.absent || 0}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}
                          className="px-2.5 py-1 flex items-center gap-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
                        >
                          {expanded === reg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          Records
                        </button>
                      </td>
                    </tr>
                    {expanded === reg.id && (
                      <tr className="bg-slate-50 dark:bg-slate-950/50">
                        <td colSpan={7} className="p-3">
                          {(reg.records || []).length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">No records in this register.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {(reg.records || []).map((rec, i) => {
                                const st = STATUS_COLORS[rec.status] || STATUS_COLORS.Present;
                                return (
                                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <span className={`w-2 h-2 rounded-full ${st.dot} flex-shrink-0`} />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{resolveName(reg, rec.studentId)}</div>
                                      <div className="text-[10px] text-slate-400 font-mono truncate">{rec.studentId}</div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${st.badge}`}>{rec.status}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};