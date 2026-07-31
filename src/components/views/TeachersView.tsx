import React, { useState } from "react";
import { Users, Plus, Mail, Phone, BookOpen, Award, Check, QrCode } from "lucide-react";
import { initialTeachers } from "../../data/initialData";
import { TeacherRecord } from "../../types";

export const TeachersView: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [idCardModalTeacher, setIdCardModalTeacher] = useState<TeacherRecord | null>(null);

  const [name, setName] = useState("");
  const [subjectSpecialization, setSubjectSpecialization] = useState("Primary Education");
  const [assignedClass, setAssignedClass] = useState("Primary 1 Gold");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
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
              <button
                onClick={() => setIdCardModalTeacher(t)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
              >
                Generate Teacher ID
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};
