import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageSquareOff,
  ShoppingBag,
  Search,
  ArrowUp,
  AlertCircle,
  MessagesSquare,
  Flame,
  FileBadge,
  TrendingUp,
  Award,
  Briefcase,
  Brain,
  Compass,
  Heart,
  Activity,
  Smile
} from "lucide-react";

export default function DashboardFeed() {
  const { 
    user, 
    setCurrentPage, 
    notes, 
    fetchNotes, 
    confessions, 
    fetchConfessions, 
    activeAura, 
    setActiveAura, 
    showToast 
  } = useApp();

  useEffect(() => {
    fetchNotes();
    fetchConfessions();
  }, []);

  const handleShortcut = (page: string) => {
    setCurrentPage(page);
  };

  const trendingConfessions = (confessions || [])
    .filter((c) => c.status === "approved")
    .slice(0, 2);

  const keyNotes = (notes || []).slice(0, 2);

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-950 dark:via-purple-950 dark:to-indigo-900 text-white relative overflow-hidden shadow-lg shadow-indigo-500/10 dark:shadow-none">
        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-400/25 via-purple-500/10 to-transparent pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Featured Announcement ✨
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-display font-black tracking-tight leading-none text-white">
            Ready to explore the Loop, <br />
            {user ? user.name : "Student"}?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-md">
            Connect seamlessly across classes, trade study notes, locate items, post unlisted listings, or leverage Gemini intelligence to prepare for your Google interviews!
          </p>
        </div>
      </div>      {/* Grid Quick Shortcuts */}
      <div>
        <h3 className="font-display font-extrabold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-indigo-500 animate-pulse" />
          Fast Dispatch Centers
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleShortcut("notes")}
            className="p-5 bento-card-base bento-card-light dark:bento-card-dark text-left outline-none cursor-pointer group"
            id="shortcut-notes"
          >
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-650 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 font-bold" />
            </div>
            <span className="block font-bold text-sm text-slate-900 dark:text-slate-150">Study Files</span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">Acquire Exam Notes</span>
          </button>

          <button
            onClick={() => handleShortcut("marketplace")}
            className="p-5 bento-card-base bento-card-light dark:bento-card-dark text-left outline-none cursor-pointer group"
            id="shortcut-marketplace"
          >
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-650 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="block font-bold text-sm text-slate-900 dark:text-slate-150">Trade Goods</span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">Browse Dorm Supplies</span>
          </button>

          <button
            onClick={() => handleShortcut("confessions")}
            className="p-5 bento-card-base bento-card-light dark:bento-card-dark text-left outline-none cursor-pointer group"
            id="shortcut-confessions"
          >
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-purple-650 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquareOff className="w-5 h-5" />
            </div>
            <span className="block font-bold text-sm text-slate-900 dark:text-slate-150">Confessions</span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">Read Campus Secrets</span>
          </button>

          <button
            onClick={() => handleShortcut("placement")}
            className="p-5 bento-card-base bento-card-light dark:bento-card-dark text-left outline-none cursor-pointer group"
            id="shortcut-placement"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-650 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="block font-bold text-sm text-slate-900 dark:text-slate-150">Placement Prep</span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-1">Get Technical Tips</span>
          </button>
        </div>
      </div>

      {/* Dynamic Color Psychology Sanctuary Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-bento dark:shadow-bento-dark relative overflow-hidden" id="cognitive-sanctuary-dashboard">
        {/* Subtle grid pattern backing */}
        <div className="absolute inset-0 bg-radial-gradient(ellipse,_var(--tw-gradient-stops)) from-indigo-50/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500 animate-pulse" />
              Interactive Campus Cognitive Sanctuary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed md:max-w-lg">
              Optimized leveraging <strong>Attention Restoration Theory</strong> and neuro-ergonomics. Transition your screen's ambient background aura below to support your immediate mental focus state:
            </p>
          </div>
          
          <div className="text-[10px] sm:text-xs font-semibold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/45 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center gap-1.5 self-start md:self-center font-mono">
            <Compass className="w-4 h-4 animate-spin shrink-0" style={{ animationDuration: '8s' }} />
            Active: <span className="font-extrabold capitalize">{activeAura === 'restorative' ? '🌿 Sage (Stress Relief)' : activeAura === 'cognitive' ? '⚡ Ocean (Analytical Focus)' : activeAura === 'creative' ? '🎭 Amethyst (Venting Sanctuary)' : '☀ Amber (Sunshine Trust)'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 relative z-10">
          {/* Restorative vibe */}
          <button
            onClick={() => {
              setActiveAura("restorative");
              showToast("🌿 Restorative Sage activated: Eases ocular strain and supports nervous system replenishment.", "info");
            }}
            className={`p-4 rounded-2xl border text-left outline-none transition-all duration-300 cursor-pointer ${
              activeAura === "restorative"
                ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-500 shadow-sm shadow-emerald-500/10"
                : "bg-slate-50/30 dark:bg-slate-900/15 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800"
            }`}
            id="aura-btn-restorative"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 bg-emerald-500/10`}>
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              🌿 Restorative Sage
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-snug">
              Kaplan's physiological restoration matrix. Best for relaxing during mid-term exam anxiety spikes.
            </p>
          </button>

          {/* Cognitive focus vibe */}
          <button
            onClick={() => {
              setActiveAura("cognitive");
              showToast("⚡ Ocean Focus activated: Maximizes working memory capacity and structured logic retrieval.", "info");
            }}
            className={`p-4 rounded-2xl border text-left outline-none transition-all duration-300 cursor-pointer ${
              activeAura === "cognitive"
                ? "bg-blue-50/50 dark:bg-blue-950/25 border-blue-500 shadow-sm shadow-blue-500/10"
                : "bg-slate-50/30 dark:bg-slate-900/15 border-slate-200 dark:border-slate-800 hover:border-blue-305 dark:hover:border-blue-800"
            }`}
            id="aura-btn-cognitive"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 dark:text-blue-400 mb-3 bg-blue-500/10`}>
              <Brain className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              ⚡ Ocean Focus
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-snug">
              Calms visual processing networks. Best for detailed lecture review, writing essays, or coding.
            </p>
          </button>

          {/* Creative Sanctuary vibe */}
          <button
            onClick={() => {
              setActiveAura("creative");
              showToast("🎭 Amethyst Sanctuary activated: Stabilizes identity ease for safe, honest ventilation.", "info");
            }}
            className={`p-4 rounded-2xl border text-left outline-none transition-all duration-300 cursor-pointer ${
              activeAura === "creative"
                ? "bg-purple-50/50 dark:bg-purple-950/25 border-purple-500 shadow-sm shadow-purple-500/10"
                : "bg-slate-50/30 dark:bg-slate-900/15 border-slate-200 dark:border-slate-800 hover:border-purple-305 dark:hover:border-purple-800"
            }`}
            id="aura-btn-creative"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 bg-purple-500/10`}>
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              🎭 Amethyst Venting
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-snug">
              Maintains high feelings of self-validation and empathy. Ideal for anonymous confessions and peer support.
            </p>
          </button>

          {/* Optimism vibe */}
          <button
            onClick={() => {
              setActiveAura("optimism");
              showToast("☀ Sunset Amber activated: Elevates prosocial trust metrics and bargaining communication.", "info");
            }}
            className={`p-4 rounded-2xl border text-left outline-none transition-all duration-300 cursor-pointer ${
              activeAura === "optimism"
                ? "bg-amber-50/40 dark:bg-amber-955/20 border-amber-500 shadow-sm shadow-amber-500/15"
                : "bg-slate-50/30 dark:bg-slate-900/15 border-slate-200 dark:border-slate-800 hover:border-amber-305 dark:hover:border-amber-800"
            }`}
            id="aura-btn-optimism"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 dark:text-amber-400 mb-3 bg-amber-500/10`}>
              <Smile className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              ☀ Sunshine Trust
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 leading-snug">
              Boosts levels of interpersonal confidence and warmth. Best for trade negotiations and global courtyard chats.
            </p>
          </button>
        </div>
      </div>

      {/* Two Columns Section (Trending secrets / resource uploads) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Trending Confessional Secrets */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-xs sm:text-sm text-purple-600 dark:text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
              <Flame className="w-4.5 h-4.5 text-purple-505 fill-purple-100 dark:fill-transparent" />
              Hot Secrets & Confessions
            </h3>
            <button
              onClick={() => handleShortcut("confessions")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Enter confessions board
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {trendingConfessions.map((c, idx) => {
              // Apply gorgeous bento highlight to the first confessional thread!
              if (idx === 0) {
                return (
                  <div
                    key={c.id}
                    onClick={() => handleShortcut("confessions")}
                    className="p-6 bento-glow-violet rounded-2xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-[1.015] relative overflow-hidden group"
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center gap-2 mb-3 text-indigo-155">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100">TRENDING VENT #{4000 + parseInt(c.id.substring(0,2), 16) || 4202}</span>
                      </div>
                      <p className="text-base sm:text-lg font-medium leading-relaxed italic text-white">
                        "{c.text}"
                      </p>
                      <div className="mt-6 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 font-mono">
                        <span>✨ Anonymous Post</span>
                        <span>
                          ❤️ {c.likesCount} Supports • 💬 {c.comments?.length || 0} logs
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              // Other confessions themed beautifully using solid dark/light bento boxes
              return (
                <div
                  key={c.id}
                  onClick={() => handleShortcut("confessions")}
                  className="p-6 bento-card-base bento-card-light dark:bento-card-dark cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{c.text}"
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-mono">
                    <span>✨ Secret Vent</span>
                    <span className="flex items-center gap-1">
                      ❤️ {c.likesCount} Support • 💬 {c.comments?.length || 0} comments
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Column 2: Newly Shared Class Materials */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
              <FileBadge className="w-4.5 h-4.5 text-indigo-500" />
              Top Academic Resources
            </h3>
            <button
              onClick={() => handleShortcut("notes")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Browse all library files
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {keyNotes.map((note, idx) => (
              <div
                key={note.id}
                onClick={() => handleShortcut("notes")}
                className={`p-6 bento-card-base bento-card-light dark:bento-card-dark cursor-pointer relative overflow-hidden group ${
                  idx === 0 ? "border-indigo-500/40 dark:border-indigo-500/30" : ""
                }`}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                <span className="inline-flex px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md font-mono uppercase">
                  {(note.branch || "General").split(" ")[0]} • {note.semester}
                </span>
                <h4 className="mt-2 font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {note.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {note.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/85 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  <span>👤 @{note.uploadedBy}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-indigo-500 dark:text-indigo-400 font-bold">
                      <ArrowUp className="w-3 h-3" /> {note.upvotes.length} Upvotes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Institutional Code of Conduct Banner */}
      <footer className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-850 flex flex-col sm:flex-row items-center gap-4">
        <Award className="w-10 h-10 text-indigo-500 shrink-0" />
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-display font-bold text-xs sm:text-sm text-slate-850 dark:text-slate-200">
            Interactive Campus Commons Guidelines
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-410 leading-snug">
            All user submissions represent actual college database items. Keep listings respectful, moderate anonymous secrets, and help peers by uploading real handwritten revision files.
          </p>
        </div>
      </footer>
    </div>
  );
}
