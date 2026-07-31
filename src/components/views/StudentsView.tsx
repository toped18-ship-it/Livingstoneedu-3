import React, { useState } from "react";
import { GraduationCap, Search, Plus, Filter, Mail, Phone, MoreVertical, ShieldCheck, Check, UserCheck, X } from "lucide-react";
import { initialStudents } from "../../data/initialData";
import { StudentRecord } from "../../types";

export const StudentsView: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentRecord | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  // New Student Form State
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("Primary 1 Gold");
  const [newGender, setNewGender] = useState<"Male" | "Female">("Male");
  const [newParentName, setNewParentName] = useState("");
  const [newParentPhone, setNewParentPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === "All" || s.class.startsWith(selectedClass);
    return matchesSearch && matchesClass;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newParentName.trim()) return;

    const newStudent: StudentRecord = {
      id: `STD-2026-${String(students.length + 1).padStart(3, "0")}`,
      name: newName,
      admissionNo: `LIV/2026/${Math.floor(100 + Math.random() * 900)}`,
      class: newClass,
      gender: newGender,
      parentName: newParentName,
      parentPhone: newParentPhone || "+234 800 000 0000",
      status: "Active",
      avatar: newGender === "Male"
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    };

    setStudents([newStudent, ...students]);
    setSuccessMsg(`Enrolled student ${newName} successfully!`);
    setNewName("");
    setNewParentName("");
    setNewParentPhone("");
    setEnrollModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Student Information & Enrollment Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive profile records for Primary 1–6, JSS 1–3, and SS 1–3 streams.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          onClick={() => setEnrollModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter & Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or admission number..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-800 dark:text-slate-200"
        >
          <option value="All">All Class Levels (Primary 1-6, JSS 1-3, SS 1-3)</option>
          <option value="Primary 1">Primary 1</option>
          <option value="Primary 2">Primary 2</option>
          <option value="Primary 3">Primary 3</option>
          <option value="Primary 4">Primary 4</option>
          <option value="Primary 5">Primary 5</option>
          <option value="Primary 6">Primary 6</option>
          <option value="JSS 1">JSS 1</option>
          <option value="JSS 2">JSS 2</option>
          <option value="JSS 3">JSS 3</option>
          <option value="SS 1">SS 1</option>
          <option value="SS 2">SS 2</option>
          <option value="SS 3">SS 3</option>
        </select>
      </div>

      {/* Student Records Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Student</th>
              <th className="p-3.5">Admission No</th>
              <th className="p-3.5">Class Stream</th>
              <th className="p-3.5">Gender</th>
              <th className="p-3.5">Parent / Guardian</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 flex items-center gap-3">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{st.name}</span>
                    <span className="text-[10px] text-slate-400">ID: {st.id}</span>
                  </div>
                </td>
                <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{st.admissionNo}</td>
                <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{st.class}</td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400">{st.gender}</td>
                <td className="p-3.5">
                  <span className="block font-medium text-slate-800 dark:text-slate-200">{st.parentName}</span>
                  <span className="text-[10px] text-slate-400">{st.parentPhone}</span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {st.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => setSelectedStudentDetail(st)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* STUDENT PROFILE DETAIL MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Student Record Details
              </h3>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedStudentDetail.avatar}
                alt={selectedStudentDetail.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedStudentDetail.name}
                </h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  {selectedStudentDetail.admissionNo}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedStudentDetail.class}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Gender:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedStudentDetail.gender}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent / Guardian:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedStudentDetail.parentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone Contact:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedStudentDetail.parentPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Standing:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">Good (Active)</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL NEW STUDENT MODAL */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleEnrollSubmit} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enroll New Student
              </h3>
              <button type="button" onClick={() => setEnrollModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Okafor Miracle"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class Stream
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Primary 1 Gold">Primary 1 Gold</option>
                    <option value="Primary 2 Silver">Primary 2 Silver</option>
                    <option value="Primary 3 Bronze">Primary 3 Bronze</option>
                    <option value="Primary 4 Gold">Primary 4 Gold</option>
                    <option value="Primary 5 Silver">Primary 5 Silver</option>
                    <option value="Primary 6 Diamond">Primary 6 Diamond</option>
                    <option value="JSS 1 Ruby">JSS 1 Ruby</option>
                    <option value="JSS 2 Sapphire">JSS 2 Sapphire</option>
                    <option value="JSS 3 Diamond">JSS 3 Diamond</option>
                    <option value="SS 1 Silver">SS 1 Silver</option>
                    <option value="SS 2 Gold">SS 2 Gold</option>
                    <option value="SS 3 Emerald">SS 3 Emerald</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as "Male" | "Female")}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  required
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder="e.g., Mr. Okafor Dennis"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Phone Number
                </label>
                <input
                  type="text"
                  value={newParentPhone}
                  onChange={(e) => setNewParentPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="w-1/3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Save Enrollment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
