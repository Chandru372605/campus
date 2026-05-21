import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, ArrowLeft, GraduationCap, Mail, Lock, User as UserIcon, Building, HelpCircle } from "lucide-react";

export default function AuthPage({ mode: initialMode }: { mode: "login" | "register" }) {
  const { login, register, setCurrentPage } = useApp();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("State Tech University");
  const [branch, setBranch] = useState("Computer Science & Engineering");

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setErrorMsg("");
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (isLogin) {
      const result = await login(username, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.error || "Login failure.");
      }
    } else {
      const result = await register({
        username,
        password,
        email,
        name,
        college,
        branch,
        role: "student"
      });
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.error || "Registration rejected.");
      }
    }
  };

  const handleQuickDemo = async (role: "student" | "admin" | "student2") => {
    setIsLoading(true);
    let demoUser = "alex_rover";
    if (role === "admin") demoUser = "admin";
    if (role === "student2") demoUser = "samantha_smith";
    
    const result = await login(demoUser, role === "admin" ? "admin123" : "password");
    setIsLoading(false);
    if (!result.success) {
      setErrorMsg(result.error || "Demo auth failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col justify-center items-center p-4 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={() => setCurrentPage("landing")}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        id="back-to-landing-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to info
      </button>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-8 z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl items-center justify-center font-bold">
            C
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isLogin ? "Welcome Back" : "Create Student Profile"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            {isLogin
              ? "Access your campus marketplace, study notes, and recruitment preps."
              : "Register to request exam preparation summaries and share study resources."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/40 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-450">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rover"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl text-sm focus:outline-none transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  College Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                  <input
                    type="email"
                    required
                    placeholder="alex@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl text-sm focus:outline-none transition text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1">Must contain ".edu" or college domain.</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Unique Username
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
              <input
                type="text"
                required
                placeholder="alex_dev_99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl text-sm focus:outline-none transition text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl text-sm focus:outline-none transition text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Your University
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl text-sm focus:outline-none transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Department Branch
                </label>
                <div className="relative">
                  <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400/80" />
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl text-sm focus:outline-none transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/10 transition disabled:opacity-50 text-sm"
            id="auth-submit-btn"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
            ) : isLogin ? (
              "Sign In to CampusConnect"
            ) : (
              "Authorize Account"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200/65 dark:border-slate-800/80 text-center text-xs">
          <span className="text-slate-400">
            {isLogin ? "First time logging in? " : "Already loop'd in? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            id="auth-switch-btn"
          >
            {isLogin ? "Create student profile" : "Return to Log In"}
          </button>
        </div>

        {/* Demo Fast Actions Section */}
        <div className="mt-8 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="text-center font-display font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            One-Click Demo shortcuts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo("student")}
              className="px-2.5 py-1.8 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl text-[11px] font-semibold hover:bg-indigo-100 transition duration-150"
              id="quick-demo-student-1"
            >
              Alex (Student)
            </button>
            <button
              onClick={() => handleQuickDemo("student2")}
              className="px-2.5 py-1.8 bg-purple-50/50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border border-purple-100/50 dark:border-purple-900/40 rounded-xl text-[11px] font-semibold hover:bg-purple-100 transition duration-150"
              id="quick-demo-student-2"
            >
              Sam (Student)
            </button>
            <button
              onClick={() => handleQuickDemo("admin")}
              className="px-2.5 py-1.8 bg-teal-50/50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300 border border-teal-100/50 dark:border-teal-900/40 rounded-xl text-[11px] font-semibold hover:bg-teal-100 transition duration-150"
              id="quick-demo-admin"
            >
              Dave (Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
