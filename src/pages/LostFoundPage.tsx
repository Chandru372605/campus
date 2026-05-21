import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  X,
  MapPin,
  Calendar,
  Sparkles,
  PhoneCall,
  UserCheck
} from "lucide-react";

export default function LostFoundPage() {
  const {
    lostAndFound,
    loadingLostAndFound,
    fetchLostAndFound,
    createLostAndFoundItem,
    toggleLostAndFoundStatus,
    deleteLostAndFoundItem,
    user
  } = useApp();

  // Search/Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"lost" | "found" | "">("");
  const [showLogModal, setShowLogModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"lost" | "found">("lost");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchLostAndFound({ search, category: selectedCategory || undefined });
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLostAndFound({ search, category: selectedCategory || undefined });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !contact) return;

    const fallbackImg =
      imageUrl ||
      (category === "lost"
        ? "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"
        : "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400");

    const success = await createLostAndFoundItem({
      title,
      description,
      category,
      location,
      contact,
      imageUrl: fallbackImg
    });

    if (success) {
      setShowLogModal(false);
      setTitle("");
      setDescription("");
      setLocation("");
      setContact("");
      setImageUrl("");
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Filtering row & creation trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:border-pink-500 transition">
          <Search className="w-4.5 h-4.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search lanyards, keys, transits, folders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent border-none outline-none text-slate-800 dark:text-slate-100"
          />
          <button type="submit" className="hidden" />
        </form>

        {user && (
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-1.5 transition"
            id="log-item"
          >
            <Plus className="w-4 h-4" />
            Post Lost/Found Item
          </button>
        )}
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-2 text-xs font-mono">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-xl border transition ${
            selectedCategory === ""
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white font-bold"
              : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900"
          }`}
        >
          All Items
        </button>

        <button
          onClick={() => setSelectedCategory("lost")}
          className={`px-4 py-2 rounded-xl border transition ${
            selectedCategory === "lost"
              ? "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-600 font-extrabold"
              : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 hover:dark:text-white"
          }`}
        >
          ● Missing / Lost Posts
        </button>

        <button
          onClick={() => setSelectedCategory("found")}
          className={`px-4 py-2 rounded-xl border transition ${
            selectedCategory === "found"
              ? "bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/40 text-teal-600 font-extrabold"
              : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 hover:dark:text-white"
          }`}
        >
          ● Located / Found Posts
        </button>
      </div>

      {/* Grid items */}
      {loadingLostAndFound ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-xs text-slate-400 mt-4 font-mono">SYNCHRONIZING SECURE DATABASE RECORDS...</p>
        </div>
      ) : lostAndFound.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 font-display font-semibold mt-4 font-mono">No belongings matching search.</p>
          <p className="text-xs text-slate-400 mt-1">If you spotted an item on campus benches, log its location details safely here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostAndFound.map((item) => {
            const isOwner = user && (item.reporterUsername === user.username || user.role === "admin");
            const isResolved = item.status === "resolved";
            const isLostType = item.category === "lost";

            return (
              <div
                key={item.id}
                className={`bento-card-base ${
                  isResolved
                    ? "opacity-60 bg-slate-100/40 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-850"
                    : "bento-card-light dark:bento-card-dark"
                } flex flex-col justify-between overflow-hidden relative group hover:scale-[1.005]`}
              >
                <div>
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950/60 overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Left category banner tag */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-black rounded-lg shadow uppercase tracking-wider text-white ${
                          isLostType ? "bg-rose-600" : "bg-teal-600"
                        }`}
                      >
                        {item.category === "lost" ? "Lost / missing" : "Located / Found"}
                      </span>
                    </div>

                    {isResolved && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-4 py-2 border-2 border-green-500 rounded-xl text-green-550 text-xs font-black uppercase tracking-widest flex items-center gap-1 bg-slate-950/30">
                          <UserCheck className="w-4 h-4" />
                          Resolved 🤝
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-slate-950 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pink-500" /> LOCATION: {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-505" /> LOGGED: {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Contact & Claim coordinates:</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-0 py-0 leading-normal flex items-center gap-1.5 break-all">
                        <PhoneCall className="w-3.5 h-3.5 text-indigo-550 mr-1 text-slate-400" />
                        {item.contact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subfooter columns button actions */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    REPORTED BY: @{item.reporterUsername}
                  </span>

                  <div className="flex gap-1.5">
                    {isOwner && (
                      <>
                        <button
                          onClick={() => toggleLostAndFoundStatus(item.id, item.status)}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg transition"
                          title="Toggle resolve statuses"
                        >
                          {isResolved ? "Open Issue" : "Resolve"}
                        </button>
                        <button
                          onClick={() => deleteLostAndFoundItem(item.id)}
                          className="p-1 px-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE LOGS REPORT DIALOG */}
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
              Post Belonging Log
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Belonging Name / Header
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., AirPods Pro gen 2 Case"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-pink-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Log Categorization
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                  >
                    <option value="lost">Lost: Searching for item</option>
                    <option value="found">Found: Located on campus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Approx Location (Building / Hall)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block C Library room 201"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-pink-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-pink-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Secure Claim Instructions (Contact info / Handover desk room)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Leave messages here or Call/SMS: (555) 332-901"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-pink-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Item Description & Key Markings
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="State tags, colors, cases, or precise landmarks to help coordinates. E.g. solo left bud, blue leather lanyard with a key FOB attached."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-pink-500 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition text-sm"
              >
                Synthesize Log Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
