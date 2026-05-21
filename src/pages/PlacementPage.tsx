import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Plus,
  Briefcase,
  Sparkles,
  ArrowRight,
  BookMarked,
  X,
  Bookmark,
  Calendar,
  Layers,
  ChevronRight,
  Sliders,
  Tv
} from "lucide-react";

export default function PlacementPage() {
  const {
    placements,
    loadingPlacements,
    fetchPlacements,
    createPlacement,
    generatePrepGuide,
    generatePlacementRoadmap,
    user
  } = useApp();

  // Search filter flags
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Simple thread logging form modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState("");
  const [resources, setResources] = useState("");

  // AI Prep Deck tab setup
  const [activeSubTab, setActiveSubTab] = useState<"threads" | "ai-interview" | "ai-roadmap">("threads");
  const [aiCompany, setAiCompany] = useState("Google");
  const [aiRole, setAiRole] = useState("Software Engineer (L4)");
  const [aiTopics, setAiTopics] = useState("Graphs, BFS/DFS, System Design, Sharding");
  const [aiDuration, setAiDuration] = useState("4 Weeks");

  // AI loading / outputs
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    fetchPlacements({ search, company: selectedCompany });
  }, [selectedCompany]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlacements({ search, company: selectedCompany });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !role || !questions) return;

    const success = await createPlacement({
      title,
      company,
      role,
      difficulty,
      questions: questions.split(",").map((q) => q.trim()),
      resources: resources ? resources.split(",").map((r) => r.trim()) : []
    });

    if (success) {
      setShowLogModal(false);
      setTitle("");
      setCompany("");
      setRole("");
      setQuestions("");
      setResources("");
    }
  };

  // Run AI Interview study wizard
  const handleRunAiWizard = async () => {
    setAiLoading(true);
    setAiResult(null);
    const result = await generatePrepGuide(aiCompany, aiRole, aiTopics);
    setAiLoading(false);
    if (result.success && result.data) {
      setAiResult(result.data.guide);
    } else {
      setAiResult("Failed to invoke interview guide. Please check if your GEMINI_API_KEY secret is loaded in AI Studio.");
    }
  };

  // Run AI Study schedule countdown
  const handleRunAiRoadmap = async () => {
    setAiLoading(true);
    setAiResult(null);
    const result = await generatePlacementRoadmap(aiCompany, aiDuration);
    setAiLoading(false);
    if (result.success && result.data) {
      setAiResult(result.data.roadmap);
    } else {
      setAiResult("Failed to assemble preparation roadmap details via server APIs.");
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Tab Controller Headers */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex gap-4 -mb-px">
          <button
            onClick={() => {
              setActiveSubTab("threads");
              setAiResult(null);
            }}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeSubTab === "threads"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Peer Interview Logs
          </button>

          <button
            onClick={() => {
              setActiveSubTab("ai-interview");
              setAiResult(null);
            }}
            className="pb-3 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Interview Advisor
          </button>

          <button
            onClick={() => {
              setActiveSubTab("ai-roadmap");
              setAiResult(null);
            }}
            className="pb-3 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-blue-500" />
            AI Preparation Roadmaps
          </button>
        </div>

        {activeSubTab === "threads" && user && (
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
            id="log-experience"
          >
            <Plus className="w-4.5 h-4.5" />
            Log Interview Exp
          </button>
        )}
      </div>

      {activeSubTab === "threads" ? (
        <div className="space-y-6">
          {/* Search tool block */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-grow max-w-sm flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-500 transition">
              <Search className="w-4.5 h-4.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search target company, role titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm bg-transparent border-none outline-none text-slate-850 dark:text-slate-105"
              />
              <button type="submit" className="hidden" />
            </form>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
            >
              <option value="">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Adobe">Adobe</option>
              <option value="Stripe">Stripe</option>
              <option value="Amazon">Amazon</option>
              <option value="Meta">Meta</option>
            </select>
          </div>

          {loadingPlacements ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full mx-auto" />
              <p className="text-xs text-slate-400 mt-4 font-mono">ASSEMBLING PEER PLACEMENT DATABASE DATA...</p>
            </div>
          ) : placements.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Briefcase className="w-12 h-12 text-slate-350 mx-auto" />
              <p className="text-sm font-semibold text-slate-500 mt-4">No logged interview logs matching filters.</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to share questions asked during current placement weeks!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {placements.map((p) => {
                const diffColor =
                  p.difficulty === "Easy"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                    : p.difficulty === "Hard"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                    : "bg-amber-50 text-amber-750 dark:bg-amber-950/20 dark:text-amber-400";

                return (
                  <div
                    key={p.id}
                    className="bento-card-base bento-card-light dark:bento-card-dark p-6 space-y-4 relative overflow-hidden group hover:scale-[1.005]"
                  >
                    {/* Header tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-extrabold text-xs rounded-lg uppercase">
                          {p.company}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {p.role}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md font-mono ${diffColor}`}>
                        {p.difficulty} DIFFICULTY
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-black text-slate-950 dark:text-white leading-tight">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        SUBMITTED BY: @{p.authorUsername || p.author} • {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Interview Questions list */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                        Topics Discussed / Assessment items:
                      </span>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300">
                        {(p.questions || []).map((question, i) => (
                          <li key={i}>{question}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Preparation links tags */}
                    {p.resources && p.resources.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="block text-[10px] font-bold uppercase text-slate-400 font-mono">Recommended prep resources:</span>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                          {(p.resources || []).map((res, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-850 rounded text-slate-500">
                              🔗 {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeSubTab === "ai-interview" ? (
        /* AI Interview Wizard Page */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Config sidebar card */}
          <div className="bento-card-base bento-card-light dark:bento-card-dark p-5 space-y-4">
            <h4 className="font-display font-bold text-xs text-indigo-155 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Sliders className="w-4 h-4 text-amber-500" />
              Advisor parameters
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Target Company Name
                </label>
                <input
                  type="text"
                  value={aiCompany}
                  onChange={(e) => setAiCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Candidate Role Designation
                </label>
                <input
                  type="text"
                  value={aiRole}
                  onChange={(e) => setAiRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Topic domains (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={aiTopics}
                  onChange={(e) => setAiTopics(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white font-mono resize-none"
                />
              </div>

              <button
                onClick={handleRunAiWizard}
                disabled={aiLoading}
                className="w-full py-2.5 bg-blue-650 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 bg-indigo-650 hover:bg-slate-955"
              >
                {aiLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full mr-1" />
                    Consulting Gemini Core...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Synthesize AI Guide
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result showcase column */}
          <div className="md:col-span-2 bento-card-base bento-card-light dark:bento-card-dark p-6 min-h-60 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Tv className="w-5 h-5 text-indigo-505" />
                Gemini AI Interview Outline
              </h4>

              {aiLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent animate-spin rounded-full mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">PARSING COMPANY HISTORICAL LANDMARKS & STUDY GUIDES...</p>
                </div>
              ) : aiResult ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-4 max-h-[40vh] overflow-y-auto">
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium prose prose-slate">
                    {aiResult}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs">No checklist generated yet.</p>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-sm mx-auto">Configure your target company parameters and trigger the Gemini synthesizer to construct custom preparation matrices!</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t text-[10px] text-slate-400 font-mono leading-snug">
              🚨 INTERVIEW DISCLAIMER: AI PREF'ERENCE RESULTS ARE COMPILED VIA HISTORIC EXAMINER POOLS. USE AS INTEGRAL SUPPLEMENT STUDY MATERIAL ONLY.
            </div>
          </div>
        </div>
      ) : (
        /* AI Prep Roadmap tab Page */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-card-base bento-card-light dark:bento-card-dark p-5 space-y-4">
            <h4 className="font-display font-bold text-xs text-indigo-155 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-blue-500 animate-pulse" />
              Roadmap settings
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Target Company / Tech Stack
                </label>
                <input
                  type="text"
                  value={aiCompany}
                  onChange={(e) => setAiCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Prep Action Lifespan
                </label>
                <select
                  value={aiDuration}
                  onChange={(e) => setAiDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="2 Weeks">2 Weeks Sprint</option>
                  <option value="4 Weeks">4 Weeks Standard</option>
                  <option value="8 Weeks">8 Weeks Advanced</option>
                  <option value="3 Months">3 Months Full-Tier</option>
                </select>
              </div>

              <button
                onClick={handleRunAiRoadmap}
                disabled={aiLoading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {aiLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full mr-1" />
                    Mapping milestones...
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5" />
                    Compile Roadmap Timeline
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Roadmap visual result block */}
          <div className="md:col-span-2 bento-card-base bento-card-light dark:bento-card-dark p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-display font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500 animate-bounce" />
                Milestone Study Calendar
              </h4>

              {aiLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent animate-spin rounded-full mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">DRAFTING DYNAMIC WEEKLY CHECKPOINTS...</p>
                </div>
              ) : aiResult ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-4 max-h-[40vh] overflow-y-auto">
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium prose prose-slate">
                    {aiResult}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Calendar className="w-12 h-12 text-slate-250 mx-auto" />
                  <p className="text-xs">No roadmap generated yet.</p>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-sm mx-auto">Set target lifespan and assemble preparation milestones in one-click via Google Gemini AI server engines!</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t text-[10px] text-slate-400 dark:text-slate-500 font-mono leading-snug">
              ℹ️ STUDY TIMELINE HAS STABILIZED CHECKPOINTS MAPPED ACCORDING TO DATA STRUCTURE & ALGORITHMIC WEIGHTS.
            </div>
          </div>
        </div>
      )}

      {/* CREATE LOG EXP MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
              Log Placement Interview Exp
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Microsoft"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Job Role Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend developer, SDE-1"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Difficulty Profile
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200"
                  >
                    <option value="Easy">Easy / Basic</option>
                    <option value="Medium">Medium / Inter</option>
                    <option value="Hard">Hard / Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Preseeded Topics discussed (log labels)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Graphs, DP, System Design"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-550 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Questions asked (Comma-separated logs)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g., Code a binary tree spiral traversal, Design a rate limiter system"
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-550 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Preparation reference guides (links/text comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GeeksforGeeks tree DFS article, Neetcode graph YouTube"
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-550 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition text-sm"
              >
                Synthesize Experience Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
