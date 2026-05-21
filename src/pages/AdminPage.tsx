import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Crown,
  Users,
  Shield,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  UserX,
  Trash2,
  Sparkles
} from "lucide-react";

export default function AdminPage() {
  const {
    adminStats,
    fetchAdminStats,
    confessions,
    fetchConfessions,
    approveConfession,
    rejectConfession,
    deleteConfession,
    user,
    showToast
  } = useApp();

  const [banishedUsersList, setBanishedUsersList] = useState<string[]>([]);

  useEffect(() => {
    fetchAdminStats();
    fetchConfessions();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto">
        <Users className="w-12 h-12 text-slate-400 mx-auto" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-4">Administrative Clearance Required.</p>
        <p className="text-xs text-slate-400 mt-1">Please authenticate under an administrative demo identity first.</p>
      </div>
    );
  }

  // Segment confessions by status
  const pendingConfessions = confessions.filter((c) => c.status === "pending");
  const reportedConfessions = confessions.filter((c) => c.reports && c.reportsCount > 0);

  const handleBanishUser = (username: string) => {
    setBanishedUsersList((prev) => [...prev, username]);
    showToast(`Institutional access credentials for @${username} have been suspended.`, "success");
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Overview Analytics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Students</span>
            <span className="block font-display font-black text-2xl text-slate-900 dark:text-white">
              {adminStats ? adminStats.totalStudents : 3}
            </span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Shared Resource Modules</span>
            <span className="block font-display font-black text-2xl text-slate-900 dark:text-white">
              {adminStats ? adminStats.totalNotes : 4}
            </span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-955/40 text-purple-650 dark:text-purple-400 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Confessions Posted</span>
            <span className="block font-display font-black text-2xl text-slate-900 dark:text-white">
              {adminStats ? adminStats.totalConfessions : 5}
            </span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-955/40 text-rose-600 dark:text-rose-450 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Pending Mod Moderations</span>
            <span className="block font-display font-black text-2xl text-slate-900 dark:text-white">
              {pendingConfessions.length}
            </span>
          </div>
        </div>
      </section>

      {/* Admin core grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMN 1: Confessions Moderations Queue */}
        <section className="space-y-4">
          <h3 className="font-display font-extrabold text-sm text-purple-600 dark:text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
            <Shield className="w-4.5 h-4.5" />
            Confessions Moderation Inbox ({pendingConfessions.length})
          </h3>

          <div className="space-y-4">
            {pendingConfessions.length === 0 ? (
              <p className="p-10 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                ✔ Moderation inbox cleared. No pending confessions.
              </p>
            ) : (
              pendingConfessions.map((c) => (
                <div
                  key={c.id}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-xs space-y-3 relative"
                >
                  <span className="block text-[10px] text-slate-400 font-mono">
                    SUBMITTED: {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{c.text}"
                  </p>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => approveConfession(c.id)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve onto Board
                    </button>
                    <button
                      onClick={() => rejectConfession(c.id)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COLUMN 2: Students Roster and Reports */}
        <div className="space-y-8">
          
          {/* Section: Academic Roster */}
          <section className="space-y-4">
            <h3 className="font-display font-extrabold text-sm text-indigo-650 dark:text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-indigo-500" />
              Interactive Student roster
            </h3>

            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-150/40 text-[10px] uppercase font-bold text-slate-400 font-mono">
                    <th className="p-4">Student Info</th>
                    <th className="p-4">Department Branch</th>
                    <th className="p-4 text-right">Moderations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {[
                    { name: "Alex Rover", username: "alex_rover", branch: "CS 3rd Year", active: true },
                    { name: "Samantha Smith", username: "samantha_smith", branch: "Data Science 2nd Year", active: true },
                    { name: "Dave Host Admin", username: "admin", branch: "Dean Host Room", active: true }
                  ].map((student) => {
                    const isBanished = banishedUsersList.includes(student.username);
                    return (
                      <tr key={student.username} className={isBanished ? "bg-rose-50/20 opacity-50" : ""}>
                        <td className="p-4">
                          <div className="font-bold text-slate-850 dark:text-white">{student.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">@{student.username}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-600 dark:text-slate-350">{student.branch}</td>
                        <td className="p-4 text-right">
                          {student.username === "admin" ? (
                            <span className="text-[10px] font-bold text-amber-500 font-mono">PROTECTED</span>
                          ) : isBanished ? (
                            <span className="text-[10px] font-bold text-rose-500 font-mono">SUSPENDED</span>
                          ) : (
                            <button
                              onClick={() => handleBanishUser(student.username)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded font-bold text-[10px] transition"
                            >
                              Banish
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: reported secrets review queue */}
          <section className="space-y-4">
            <h3 className="font-display font-extrabold text-sm text-rose-600 dark:text-rose-400 tracking-wider uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
              Reported Confessions Review ({reportedConfessions.length})
            </h3>

            <div className="space-y-3">
              {reportedConfessions.length === 0 ? (
                <p className="p-5 text-xs text-slate-400 bg-white dark:bg-slate-905 border border-slate-150 rounded-2xl italic text-center">
                  No public confession posts flagged for review.
                </p>
              ) : (
                reportedConfessions.map((c) => (
                  <div key={c.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs space-y-2 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-500 font-mono">FLAGGED ACTIONS ({c.reportsCount} Reports):</span>
                      <p className="text-slate-700 dark:text-slate-300 italic">"{c.text}"</p>
                    </div>
                    <button
                      onClick={() => deleteConfession(c.id)}
                      className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg shrink-0 transition"
                      title="Surgically erase target post"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
