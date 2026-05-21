import React from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  MessageSquareOff,
  ShoppingBag,
  Search,
  Briefcase,
  MessagesSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ArrowUpDown
} from "lucide-react";

export default function LandingPage() {
  const { setCurrentPage, login } = useApp();

  const handleDemoSignIn = async (role: "student" | "admin") => {
    const user = role === "student" ? "alex_rover" : "admin";
    await login(user, "password");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[400px] left-5 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
            C
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Campus<span className="text-indigo-600 dark:text-indigo-400">Connect</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage("login")}
            className="px-4 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="nav-login-btn"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentPage("register")}
            className="px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/10 hover:shadow-lg transition"
            id="nav-register-btn"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col justify-center z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Centralized digital campus loop
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Your College Hub, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-teal-400 dark:from-indigo-400 dark:to-teal-300">
              Fully Connected.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Share study notes, locate lost belongings, trade student dorm goods, read campus secrets, and consult placement interviews directly in one unified, real-time college portal.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage("register")}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center gap-2 group text-base"
              id="get-started-btn"
            >
              Join Your Peers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-slate-400 text-xs sm:text-sm font-medium">or</div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleDemoSignIn("student")}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition text-indigo-600 dark:text-indigo-400 shadow-sm"
                id="demo-student-login-btn"
              >
                Demo Student
              </button>
              <button
                onClick={() => handleDemoSignIn("admin")}
                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition text-teal-600 dark:text-teal-400 shadow-sm"
                id="demo-admin-login-btn"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid Catalog */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Notes Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition duration-200 group">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg text-slate-900 dark:text-white">
              Notes Sharing & AI summarize
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Download PDF review cheatsheets by semester and course area. Synthesize concise takeaways in one-click using **Gemini 3.5**.
            </p>
          </div>

          {/* Confessions Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-purple-500 dark:hover:border-purple-400 shadow-sm hover:shadow-md transition duration-200 group">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <MessageSquareOff className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg text-slate-900 dark:text-white">
              Confessions Board
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Vent and share lighthearted college experiences safely and anonymously. Upvote humor, leave anonymous feedback, and self-moderate content.
            </p>
          </div>

          {/* Student Marketplace */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-md transition duration-200 group">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg text-slate-900 dark:text-white">
              Dorm Marketplace
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Trade course gear, textbooks, lab kits, or study desk items. Coordinate direct student handoffs and verify email addresses.
            </p>
          </div>

          {/* Lost & Found */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-pink-500 dark:hover:border-pink-400 shadow-sm hover:shadow-md transition duration-200 group">
            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/50 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg text-slate-900 dark:text-white">
              Lost & Found Portal
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Lost keys or a wireless earbud? Log description tags, post visual photos, set item markers, and log return statuses in real-time.
            </p>
          </div>

          {/* Placement Hub */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-md transition duration-200 group">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg text-slate-900 dark:text-white">
              Placement Preparation
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Share interview logs and coding round tips. Use custom AI agents to design study timetables and company-specific coding preparation lists.
            </p>
          </div>

          {/* Real-time Courtyard Chat */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-orange-500 dark:hover:border-orange-400 shadow-sm hover:shadow-md transition duration-200 group">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/50 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <MessagesSquare className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg text-slate-900 dark:text-white">
              Global Courtyard Chat
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Stay synchronized with instantly distributed notifications, active room announcements, and student chatting streams on standard port lines.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-900 py-10 bg-white/50 dark:bg-black/20 text-center text-xs text-slate-400">
        <p>© 2026 CampusConnect Platform. Designed with high-density university feedback. Powered by Gemini Core.</p>
      </footer>
    </div>
  );
}
