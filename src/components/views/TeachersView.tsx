import React, { useState, useEffect } from "react";
import { Users, Plus, Mail, Phone, BookOpen, Award, Check, QrCode, Trash2, AlertTriangle, CheckSquare, Square, LayoutGrid, Table, Pencil, X } from "lucide-react";
import { initialTeachers } from "../../data/initialData";
import { TeacherRecord } from "../../types";
import { useLiveData, notifyDataChanged } from "../../lib/liveStore";

export const TeachersView: React.FC = () => {
  const live = useLiveData<TeacherRecord>("teachers");
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);

  // Sync the faculty directory to the live server store.
  useEffect(() => {
    if (live.data && live.data.length) setTeachers(live.data);
  }, [live.data]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [idCardModalTeacher, setIdCardModalTeacher] = useState<TeacherRecord | null>(null);

  // Edit Teacher Modal State
  const [editModalTeacher, setEditModalTeacher] = useState<TeacherRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editStaffId, setEditStaffId] = useState("");
  const [editSubjectSpecialization, setEditSubjectSpecialization] = useState("");
  const [editAssignedClass, setEditAssignedClass] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "On Leave" | "Suspended">("Active");

  const openEditModal = (t: TeacherRecord) => {
    setEditModalTeacher(t);
    setEditName(t.name);
    setEditStaffId(t.staffId);
    setEditSubjectSpecialization(t.subjectSpecialization);
    setEditAssignedClass(t.assignedClass);
    setEditEmail(t.email);
    setEditPhone(t.phone);
    setEditStatus((t.status as any) || "Active");
  };

  const handleSaveEditTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalTeacher || !editName.trim()) return;

    setTeachers((prev) =>
      prev.map((t) =>
        t.id === editModalTeacher.id
          ? {
              ...t,
              name: editName,
              staffId: editStaffId,
              subjectSpecialization: editSubjectSpecialization,
              assignedClass: editAssignedClass,
              email: editEmail,
              phone: editPhone,
              status: editStatus,
            }
          : t
      )
    );
    setSuccessMsg(`✓ Updated teacher record for ${editName}!`);
    setEditModalTeacher(null);
    setTimeout(() => setSuccessMsg(""), 3500);
    fetch(`/api/teachers/${editModalTeacher.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        staffId: editStaffId,
        subjectSpecialization: editSubjectSpecialization,
        assignedClass: editAssignedClass,
        email: editEmail,
        phone: editPhone,
        status: editStatus,
      })
    })
      .then(() => notifyDataChanged(["teachers"]))
      .catch(() => {});
  };

  // Multi-select & Bulk Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [name, setName] = useState("");
  const [subjectSpecialization, setSubjectSpecialization] = useState("Primary Education");
  const [assignedClass, setAssignedClass] = useState("Primary 1 Gold");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === teachers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(teachers.map((t) => t.id));
    }
  };

  const triggerDelete = (ids: string[]) => {
    if (ids.length === 0) return;
    setDeleteTargetIds(ids);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setTeachers((prev) => prev.filter((t) => !deleteTargetIds.includes(t.id)));
    setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
    setSuccessMsg(`✓ Deleted ${deleteTargetIds.length} teacher record(s) successfully.`);
    setDeleteModalOpen(false);
    setDeleteTargetIds([]);
    setTimeout(() => setSuccessMsg(""), 3500);
    Promise.all(
      deleteTargetIds.map((id) =>
        fetch(`/api/teachers/${id}`, { method: "DELETE" }).catch(() => {})
      )
    ).then(() => notifyDataChanged(["teachers"]));
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTeacher: TeacherRecord = {
      id: `TCH-${String(teachers.length + 1).padStart(3, "0")}`,
      name,
      staffId: `STF-LIV-${Math.floor(100 + Math.random() * 900)}`,
      subjectSpecialization,
      assignedClass,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@livingstone.edu`,
      phone: phone || "+234 800 000 0000",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    };

    setTeachers([newTeacher, ...teachers]);
    setSuccessMsg(`Added teacher ${name} to directory!`);
    setName("");
    setEmail("");
    setPhone("");
    setAddModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 3500);
    fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeacher)
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setTeachers((prev) => prev.map((t) => (t.id === newTeacher.id ? json.data : t)));
        notifyDataChanged(["teachers"]);
      })
      .catch(() => notifyDataChanged(["teachers"]));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Faculty & Teaching Staff Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Academic qualifications, subject specializations, form class assignments for Primary & Secondary divisions.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Multi-Select Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            {selectedIds.length === teachers.length && teachers.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {selectedIds.length === teachers.length && teachers.length > 0
                ? "Deselect All"
                : `Select All (${teachers.length})`}
            </span>
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={() => triggerDelete(selectedIds)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 active:scale-95 transition-all animate-in fade-in"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Table View"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Teacher Content Display (Grid or Table) */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => {
            const isSelected = selectedIds.includes(t.id);
            return (
              <div
                key={t.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${
                  isSelected
                    ? "border-purple-500 ring-2 ring-purple-500/20"
                    : "border-slate-200/80 dark:border-slate-800"
                } shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between relative group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(t.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h3>
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 block">
                          {t.subjectSpecialization}
                        </span>
                        <span className="text-[10px] text-slate-400">ID: {t.staffId}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerDelete([t.id])}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Teacher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Form Class:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{t.assignedClass}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{t.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{t.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {t.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(t)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 flex items-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setIdCardModalTeacher(t)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                    >
                      ID Badge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === teachers.length && teachers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Staff Name</th>
                <th className="p-3.5">Staff ID</th>
                <th className="p-3.5">Subject Specialization</th>
                <th className="p-3.5">Form Class</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teachers.map((t) => {
                const isSelected = selectedIds.includes(t.id);
                return (
                  <tr
                    key={t.id}
                    onClick={() => openEditModal(t)}
                    className={`hover:bg-purple-50/40 dark:hover:bg-purple-950/20 cursor-pointer transition-colors ${isSelected ? "bg-purple-50/50 dark:bg-purple-950/20" : ""}`}
                  >
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(t.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{t.name}</span>
                        <span className="text-[10px] text-slate-400">{t.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{t.staffId}</td>
                    <td className="p-3.5 font-medium text-purple-600 dark:text-purple-400">{t.subjectSpecialization}</td>
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{t.assignedClass}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{t.phone}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(t)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 inline-flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setIdCardModalTeacher(t)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                      >
                        ID Badge
                      </button>
                      <button
                        onClick={() => triggerDelete([t.id])}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CONFIRM DELETION MODAL DIALOG */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  This operation is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-rose-600 dark:text-rose-400">{deleteTargetIds.length}</strong> selected teacher record(s) from the staff directory?
            </p>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs max-h-32 overflow-y-auto space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Items to be removed:</span>
              {teachers
                .filter((t) => deleteTargetIds.includes(t.id))
                .slice(0, 5)
                .map((t) => (
                  <div key={t.id} className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span>{t.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{t.staffId}</span>
                  </div>
                ))}
              {deleteTargetIds.length > 5 && (
                <p className="text-[10px] text-slate-400 italic">...and {deleteTargetIds.length - 5} more record(s)</p>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER ID CARD MODAL */}
      {idCardModalTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Staff ID Badge
              </h3>
              <button onClick={() => setIdCardModalTeacher(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-700 shadow-lg text-center space-y-3 relative">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-300 block">
                LIVINGSTONE ACADEMY STAFF ID
              </span>
              <img
                src={idCardModalTeacher.avatar}
                alt={idCardModalTeacher.name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-indigo-400"
              />
              <div>
                <h4 className="font-bold text-sm text-white">{idCardModalTeacher.name}</h4>
                <p className="text-[11px] text-indigo-200 font-semibold">{idCardModalTeacher.subjectSpecialization}</p>
                <p className="text-[10px] font-mono text-indigo-300 mt-1">STAFF NO: {idCardModalTeacher.staffId}</p>
              </div>

              <div className="pt-2 border-t border-indigo-800 flex justify-center">
                <QrCode className="w-10 h-10 text-slate-200" />
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Printing Staff ID for ${idCardModalTeacher.name}...`);
                setIdCardModalTeacher(null);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
            >
              Print Staff Badge
            </button>
          </div>
        </div>
      )}

      {/* ADD NEW TEACHER MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddTeacher} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Staff / Teacher Record
              </h3>
              <button type="button" onClick={() => setAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Mrs. Adeleke Comfort"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Specialization
                </label>
                <input
                  type="text"
                  value={subjectSpecialization}
                  onChange={(e) => setSubjectSpecialization(e.target.value)}
                  placeholder="e.g., Mathematics & Basic Technology"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Class Stream
                </label>
                <select
                  value={assignedClass}
                  onChange={(e) => setAssignedClass(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@livingstone.edu"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="w-1/3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Save Teacher Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT TEACHER MODAL */}
      {editModalTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleSaveEditTeacher} className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                  <Pencil className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Faculty Record
                  </h3>
                  <p className="text-[11px] text-slate-500">ID: {editModalTeacher.id}</p>
                </div>
              </div>
              <button type="button" onClick={() => setEditModalTeacher(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-purple-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Staff ID Number
                </label>
                <input
                  type="text"
                  value={editStaffId}
                  onChange={(e) => setEditStaffId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-purple-500 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Specialization
                </label>
                <input
                  type="text"
                  value={editSubjectSpecialization}
                  onChange={(e) => setEditSubjectSpecialization(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Form Class
                </label>
                <select
                  value={editAssignedClass}
                  onChange={(e) => setEditAssignedClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Contact
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditModalTeacher(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Updated Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
