import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  ShoppingBag,
  Clock,
  UserCheck,
  Globe,
  Trash2
} from "lucide-react";

export default function ProfilePage() {
  const { user, notes, fetchNotes, marketplace, fetchMarketplace, deleteNote, deleteMarketplaceItem } = useApp();

  useEffect(() => {
    fetchNotes();
    fetchMarketplace();
  }, []);

  if (!user) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto">
        <GraduationCap className="w-12 h-12 text-slate-350 mx-auto" />
        <p className="text-sm font-semibold text-slate-500 mt-4">Profile is unauthored.</p>
        <p className="text-xs text-slate-400 mt-1">Please sign off and login with institutional credentials first.</p>
      </div>
    );
  }

  const myNotes = notes.filter((n) => n.uploadedBy === user.username);
  const myMarketplace = marketplace.filter((m) => m.sellerUsername === user.username);

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Top Banner Card with Badge details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 relative overflow-hidden">
        {/* Glow styling */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-505/5 rounded-full blur-2xl pointer-events-none" />

        <img
          src={user.avatar}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full ring-4 ring-indigo-500/10 object-cover shrink-0 bg-slate-100"
        />

        <div className="space-y-4 flex-grow">
          <div>
            <span className="inline-flex px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider">
              {user.role === "admin" ? "🏫 Super Admin Host" : "🎓 Verified Institutional Profile"}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white mt-1">
              {user.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              USERNAME ID: @{user.username} • SECURE TOKEN AUTHENTICATED
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-0.5">
              <span className="text-slate-400 block font-mono text-[9px] uppercase font-bold">University affiliate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                {user.college}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-0.5">
              <span className="text-slate-400 block font-mono text-[9px] uppercase font-bold">Branch / Specialization:</span>
              <span className="font-bold text-slate-850 dark:text-slate-200 truncate block">
                {user.branch}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-0.5">
              <span className="text-slate-400 block font-mono text-[9px] uppercase font-bold">Liaison Institutional Mail:</span>
              <span className="font-bold text-slate-850 dark:text-slate-200 truncate block">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
          <BookOpen className="w-5 h-5 text-indigo-500 mb-2" />
          <span className="block font-display font-bold text-xl text-slate-900 dark:text-white">{myNotes.length}</span>
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Shared Notes</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
          <ShoppingBag className="w-5 h-5 text-emerald-505 mb-2" />
          <span className="block font-display font-bold text-xl text-slate-900 dark:text-white">{myMarketplace.length}</span>
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Marketplace Posts</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
          <Award className="w-5 h-5 text-purple-500 mb-2" />
          <span className="block font-display font-bold text-xl text-slate-900 dark:text-white">
            {myNotes.reduce((acc, curr) => acc + curr.upvotes.length, 0)}
          </span>
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Upvotes Received</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
          <UserCheck className="w-5 h-5 text-teal-505 mb-2" />
          <span className="block font-display font-bold text-xl text-slate-900 dark:text-white">Level 1</span>
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Campus Status</span>
        </div>
      </div>

      {/* Profile sub listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Study resources posted */}
        <section className="space-y-4">
          <h3 className="font-display font-extrabold text-sm text-indigo-600 dark:text-indigo-400 tracking-wider uppercase flex items-center gap-1">
            <BookOpen className="w-4.5 h-4.5" />
            My Study Note Uploads ({myNotes.length})
          </h3>

          <div className="space-y-3">
            {myNotes.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No uploaded lecture files log.
              </p>
            ) : (
              myNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-xs text-slate-850 dark:text-slate-100">{note.title}</span>
                    <span className="block text-[9px] text-slate-400 font-mono uppercase mt-0.5">
                      {note.subject} • {note.semester}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 px-1.5 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-rose-500 rounded-lg transition"
                    title="Deplane notes"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Marketplace listed merchandise */}
        <section className="space-y-4">
          <h3 className="font-display font-extrabold text-sm text-emerald-600 dark:text-emerald-400 tracking-wider uppercase flex items-center gap-1">
            <ShoppingBag className="w-4.5 h-4.5" />
            My Marketplace Listings ({myMarketplace.length})
          </h3>

          <div className="space-y-3">
            {myMarketplace.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl animate-pulse">
                No products posted on Campus Connect catalog.
              </p>
            ) : (
              myMarketplace.map((item) => (
                <div key={item.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-xl shadow-xs flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block font-bold text-xs text-slate-850 dark:text-slate-100 truncate">{item.title}</span>
                    <span className="block text-[9px] text-slate-450 font-mono mt-0.5">
                      PRICE: ${item.price} • STATUS: {item.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteMarketplaceItem(item.id)}
                    className="p-1 px-1.5 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-rose-500 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
