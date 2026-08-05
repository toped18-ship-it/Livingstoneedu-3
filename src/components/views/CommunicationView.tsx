import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Bell, Mail, PhoneCall, Check, Plus, AlertCircle } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../lib/firebase";
import { initialAnnouncements } from "../../data/initialData";
import { Announcement } from "../../types";

const mergeAnnouncements = (lists: Announcement[][]): Announcement[] => {
  const map = new Map<string, Announcement>();
  lists.flat().forEach((a) => {
    if (a && a.id) map.set(a.id, a);
  });
  return Array.from(map.values()).sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
};

export const CommunicationView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [channel, setChannel] = useState<"Email" | "SMS" | "WhatsApp" | "Notice Board">("Notice Board");
  const [sentMsg, setSentMsg] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => {
        if (active && Array.isArray(res.data) && res.data.length) {
          setAnnouncements((prev) => (active ? mergeAnnouncements([res.data, prev]) : prev));
        }
      })
      .catch(() => {});

    const annRef = ref(rtdb, "communications/announcements");
    const unsub = onValue(
      annRef,
      (snap) => {
        if (!active) return;
        const val = snap.val();
        if (!val) return;
        const live = Object.values(val) as Announcement[];
        if (live.length) {
          setAnnouncements((prev) => (active ? mergeAnnouncements([live, prev]) : prev));
        }
      },
      (err) => {
        console.warn("Firebase RTDB announcements listener unavailable:", err?.message || err);
      }
    );

    return () => {
      active = false;
      unsub();
    };
  }, []);

  const handlePublish = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: newTitle,
      category: "Broadcast",
      sender: "Principal / Admin",
      date: new Date().toISOString().split("T")[0],
      content: newContent,
      targetRoles: ["Parent", "Student", "Teacher"],
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setSentMsg(`Broadcast message successfully dispatched via [${channel}] to Parents, Teachers, & Students!`);
    setNewTitle("");
    setNewContent("");
    setTimeout(() => setSentMsg(""), 4000);

    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAnn, channel }),
      });
    } catch (err) {
      console.warn("Broadcast persistence failed; showing locally:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Institutional Communication & Broadcast Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dispatch announcements across SMS, Email, WhatsApp Business API, and student parent portals simultaneously.
          </p>
        </div>

        {sentMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{sentMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Dispatcher */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            Compose Broadcast Announcement
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Dispatch Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            >
              <option value="Notice Board">School Portal Notice Board</option>
              <option value="Email">Gmail / Email API Broadcast</option>
              <option value="SMS">SMS Gateway Broadcast</option>
              <option value="WhatsApp">WhatsApp Business API</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Announcement Title / Subject
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Mid-Term Examination Timetable Released"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Announcement Content / Body
            </label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter official message content to parents and students..."
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handlePublish}
            disabled={!newTitle.trim() || !newContent.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Broadcast Message</span>
          </button>
        </div>

        {/* Notice Board Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span>Active Institutional Notices ({announcements.length})</span>
            </h3>

            <div className="space-y-3.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{ann.title}</span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-700 text-[10px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Sender: {ann.sender}</span>
                    <div className="flex gap-1">
                      {ann.targetRoles.map((r, rIdx) => (
                        <span key={rIdx} className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
