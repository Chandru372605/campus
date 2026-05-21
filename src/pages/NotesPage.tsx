import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  BookOpen,
  Plus,
  ArrowUp,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Bookmark,
  Trash2,
  X,
  FileText,
  Eye,
  Send
} from "lucide-react";

export default function NotesPage() {
  const {
    notes,
    loadingNotes,
    fetchNotes,
    createNote,
    upvoteNote,
    addNoteComment,
    summarizeNote,
    deleteNote,
    user
  } = useApp();

  // Search/Filters
  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  // Form Modal trigger
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("3rd Semester");
  const [branch, setBranch] = useState("Computer Science");

  // Local drawer / view details
  const [viewingNoteId, setViewingNoteId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes({ search, semester: selectedSemester, branch: selectedBranch });
  }, [selectedSemester, selectedBranch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes({ search, semester: selectedSemester, branch: selectedBranch });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !subject) return;

    const success = await createNote({
      title,
      description,
      subject,
      semester,
      branch,
      fileName: `${subject.replace(/\s+/g, "_")}_Notes.pdf`,
      fileType: "application/pdf"
    });

    if (success) {
      setShowUploadModal(false);
      setTitle("");
      setDescription("");
      setSubject("");
    }
  };

  const activeNote = notes.find((n) => n.id === viewingNoteId);

  const handleRunSummary = async (noteId: string) => {
    setSummarizingId(noteId);
    await summarizeNote(noteId);
    setSummarizingId(null);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !viewingNoteId) return;
    await addNoteComment(viewingNoteId, commentText);
    setCommentText("");
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Page header with search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:border-indigo-500 transition">
          <Search className="w-4.5 h-4.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search notes, topics or course subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent border-none outline-none text-slate-800 dark:text-slate-100"
          />
          <button type="submit" className="hidden" />
        </form>

        <div className="flex gap-2">
          {user && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 dark:bg-indigo-550 dark:hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-1.5 transition"
              id="upload-notes"
            >
              <Plus className="w-4 h-4" />
              Upload Study Resource
            </button>
          )}
        </div>
      </div>

      {/* Grid Filtering Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {/* Semester selector dropdown */}
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <option value="">All Semesters</option>
          <option value="1st Semester">1st Sem</option>
          <option value="2nd Semester">2nd Sem</option>
          <option value="3rd Semester">3rd Sem</option>
          <option value="4th Semester">4th Sem</option>
          <option value="5th Semester">5th Sem</option>
          <option value="6th Semester">6th Sem</option>
          <option value="7th Semester">7th Sem</option>
          <option value="8th Semester">8th Sem</option>
        </select>

        {/* Branch selector dropdown */}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Data Science">Data Science & AI</option>
          <option value="Electrical Engineering">Electrical Eng</option>
          <option value="Mechanical Engineering">Mech Eng</option>
        </select>

        {(selectedSemester || selectedBranch || search) && (
          <button
            onClick={() => {
              setSelectedSemester("");
              setSelectedBranch("");
              setSearch("");
              fetchNotes();
            }}
            className="px-3 py-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Listing Catalog Card Grid */}
      {loadingNotes ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-mono">RETRIEVING LATEST SYLLABUS DIRECTORIES...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 font-display font-semibold mt-4">No note files matching criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Be the first to upload reference study guides for this semester class!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bento-card-base bento-card-light dark:bento-card-dark flex flex-col justify-between overflow-hidden relative group hover:scale-[1.005]"
            >
              <div className="p-6 space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-455 text-[10px] font-bold rounded-lg font-mono uppercase">
                    {note.branch} • {note.semester}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Info titles */}
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-slate-950 dark:text-white leading-snug hover:text-indigo-600 cursor-pointer" onClick={() => setViewingNoteId(note.id)}>
                    {note.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                    SUBJECT: {note.subject}
                  </p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {note.description}
                </p>

                {/* Embedded Optional Gemini AI Summary Box */}
                {note.summarizedText ? (
                  <div className="p-3.5 bg-teal-500/5 border border-teal-500/10 dark:border-teal-500/20 rounded-xl space-y-1 relative">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      Gemini 3.5 Quick Outline:
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 italic leading-normal">
                      {note.summarizedText}
                    </p>
                  </div>
                ) : (
                  user && (
                    <button
                      onClick={() => handleRunSummary(note.id)}
                      disabled={summarizingId === note.id}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850/60 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 transition flex items-center justify-center gap-1.5 hover:shadow-sm"
                    >
                      {summarizingId === note.id ? (
                        <>
                          <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
                          Synthesizing Key Takeaways...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Summarize with Gemini
                        </>
                      )}
                    </button>
                  )
                )}
              </div>

              {/* Action columns footer */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => upvoteNote(note.id)}
                    className={`flex items-center gap-1 transition ${
                      user && note.upvotes.includes(user.username)
                        ? "text-rose-500 font-bold"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>{note.upvotes.length} Upvotes</span>
                  </button>

                  <button
                    onClick={() => setViewingNoteId(note.id)}
                    className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{note.comments.length} Comments</span>
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setViewingNoteId(note.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="View PDF references"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {user && (note.uploadedBy === user.username || user.role === "admin") && (
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Deplane upload"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NOTES MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
              Share Academic Resource
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Document / Topic Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Graph Theory BFS/DFS revision sheets"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Discrete Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Department Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science & AI</option>
                    <option value="Electrical Engineering">Electrical Eng</option>
                    <option value="Mechanical Engineering">Mech Eng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Semester Tag
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Revision Notes Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide brief details on normal forms covered, textbook chapters included or any practice problems solved inside."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                  📄 Study Resource Loaded
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Handwritten_Lecture_Notes.pdf (PDF • 4.2 MB)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-bold transition text-sm shadow-md"
              >
                Publish Study Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED NOTE VIEW DRAWER */}
      {viewingNoteId && activeNote && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-indigo-500" />
                <span className="font-display font-bold text-slate-900 dark:text-white">Note Exchange Detail</span>
              </div>
              <button
                onClick={() => setViewingNoteId(null)}
                className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content info */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
              <span className="inline-flex px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-mono text-[10px] font-bold">
                {activeNote.branch} • {activeNote.semester}
              </span>

              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-lg text-slate-950 dark:text-white">
                  {activeNote.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono text-indigo-600 dark:text-indigo-400">
                  SUBJECT: {activeNote.subject} • BY: @{activeNote.uploadedBy}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                {activeNote.description}
              </p>

              {/* PDF Preview frame mock */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between border border-slate-800 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center font-black text-rose-50 text-[10px]">
                    PDF
                  </div>
                  <div>
                    <span className="block font-bold text-xs truncate max-w-[200px]">
                      {activeNote.fileName}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">
                      VITE CONTEXT FILE STORAGE MOCK
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Beginning file download stream onto local storage: ${activeNote.fileName}`)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold rounded-lg shadow transition"
                >
                  Download
                </button>
              </div>

              {/* Comments list heading */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <span className="block font-display font-extrabold text-xs text-slate-400 uppercase tracking-widest">
                  Discussion comments ({activeNote.comments?.length || 0})
                </span>

                <div className="space-y-3">
                  {!activeNote.comments || activeNote.comments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No comments shared on this topic yet.</p>
                  ) : (
                    activeNote.comments.map((comm) => (
                      <div key={comm.id} className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-150/40 dark:border-slate-850 rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1 text-[10px] text-slate-450 font-mono">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">@{comm.author}</span>
                          <span>{new Date(comm.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-normal">{comm.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comment submission footprint */}
          <div className="p-4 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share revision question or feedback..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-none focus:border-indigo-500 test-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <p className="text-center text-[11px] text-slate-400 leading-normal">
                Sign in to reply and participate in this course thread.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
