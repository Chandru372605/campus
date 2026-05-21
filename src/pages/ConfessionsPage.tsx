import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  MessageSquare,
  Sparkles,
  Heart,
  AlertTriangle,
  Send,
  HelpCircle,
  Clock,
  EyeOff,
  Flame
} from "lucide-react";

export default function ConfessionsPage() {
  const {
    confessions,
    loadingConfessions,
    fetchConfessions,
    createConfession,
    likeConfession,
    reportConfession,
    addConfessionComment,
    user
  } = useApp();

  const [text, setText] = useState("");
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const preseededInspiration = [
    "I haven't told my group project partners that I actually coded the entire demo... they think we did equal work of 25% each.",
    "I took an extra slice of cake from the department welcome desk when nobody was looking... highly regretted, it was dry.",
    "Actually looking forward to the 8 AM lecture tomorrow because the professor brings her golden retriever model occasionally."
  ];

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || text.trim().length === 0) return;
    const success = await createConfession(text);
    if (success) {
      setText("");
    }
  };

  const handleRandomInspiration = () => {
    const idx = Math.floor(Math.random() * preseededInspiration.length);
    setText(preseededInspiration[idx]);
  };

  const handleAddComment = async (confessionId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText) return;
    await addConfessionComment(confessionId, commentText);
    setCommentText("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-10">
      
      {/* Anonymous Posting Deck Card */}
      <div className="bento-card-base bento-card-light dark:bento-card-dark p-6 relative overflow-hidden">
        {/* Background radial soft light for aesthetic vibe */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-display font-semibold text-sm">
            <EyeOff className="w-4.5 h-4.5" />
            Vibe Deck - Anonymous Confessions
          </div>
          <button
            onClick={handleRandomInspiration}
            className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            🎲 Write for me
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={3}
            maxLength={350}
            required
            placeholder="Vent anonymously about lab groups, midterm anxiety, dorky moments, or secret campus crushes..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-xl text-sm outline-none resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">
              CHARACTER LIMITS: {text.length} / 350
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-650 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-500/10"
              id="submit-confession"
            >
              <Send className="w-3.5 h-3.5" />
              Whistle Anonymously
            </button>
          </div>
        </form>
      </div>

      {/* Listing Feed */}
      <div className="space-y-4">
        <h3 className="font-display font-extrabold text-xs text-purple-600 dark:text-purple-400 tracking-wider uppercase flex items-center gap-1">
          <Flame className="w-4 h-4" />
          Active Confessions Board
        </h3>

        {loadingConfessions ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-4 font-mono">BUFFERING UNDERGROUND CHANNELS...</p>
          </div>
        ) : confessions.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <MessageSquare className="w-10 h-10 text-slate-350 mx-auto" />
            <p className="text-xs text-slate-400 mt-3 font-mono">CONFESSIONS STREAM IS ENTIRELY QUIET.</p>
          </div>
        ) : (
          confessions.map((c) => {
            const hasLiked = user && c.likes.includes(user.username);
            
            return (
              <div
                key={c.id}
                className="bento-card-base bento-card-light dark:bento-card-dark p-6 space-y-4 relative overflow-hidden group hover:scale-[1.005] transition-all hover:border-purple-200 dark:hover:border-purple-800 border-l-4 border-l-purple-500/80 dark:border-l-purple-600/80 bg-gradient-to-br from-white to-purple-50/20 dark:from-slate-900/65 dark:to-purple-950/5 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <span>PENDING REPORTS: {c.reportsCount}</span>
                </div>

                <p className="text-slate-800 dark:text-slate-100 text-sm italic leading-relaxed">
                  "{c.text}"
                </p>

                {/* Counter controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold select-none">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likeConfession(c.id)}
                      className={`flex items-center gap-1 transition ${
                        hasLiked ? "text-rose-500 font-bold" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{c.likesCount} Support</span>
                    </button>

                    <button
                      onClick={() => setCommentingId(commentingId === c.id ? null : c.id)}
                      className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      <MessageSquare className="w-4.5 h-4.5" />
                      <span>{c.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <button
                    onClick={() => reportConfession(c.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-amber-550 transition"
                    title="Audit this submission"
                  >
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Sub comment pane */}
                {commentingId === c.id && (
                  <div className="pt-4 border-t border-dashed border-slate-105 dark:border-slate-850 space-y-3">
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {!c.comments || c.comments.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No secret reactions logged yet.</p>
                      ) : (
                        c.comments.map((comm) => (
                          <div key={comm.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-150/40 dark:border-slate-850 rounded-xl text-xs">
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-0.5">
                              💬 Anonymous Colleague • {new Date(comm.createdAt).toLocaleTimeString()}
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-normal">{comm.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={(e) => handleAddComment(c.id, e)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Log secondary reply anonymously..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-none focus:border-purple-600 text-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-purple-650 text-white rounded-xl font-bold transition flex items-center justify-center shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 text-center rounded-xl text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
        🔒 SECURE CAMPUS VENT: WE NEVER BIND IP ADDRESSES OR ACTIVE USERNAMES TO SECRET DECK ENTRIES. KEEP INFORMATION FRIENDLY AND VENT ETHICALLY!
      </p>
    </div>
  );
}
