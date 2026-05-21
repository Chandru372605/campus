import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  ShoppingBag,
  Plus,
  Mail,
  X,
  Phone,
  Grid,
  MapPin,
  Tag,
  BadgeDollarSign,
  Trash2,
  CheckCircle,
  Copy
} from "lucide-react";

export default function MarketplacePage() {
  const {
    marketplace,
    loadingMarketplace,
    fetchMarketplace,
    createMarketplaceItem,
    toggleMarketplaceItemStatus,
    deleteMarketplaceItem,
    user,
    showToast
  } = useApp();

  // Filters & State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSellModal, setShowSellModal] = useState(false);

  // Form parameters
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics & Gadgets");
  const [contact, setContact] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Viewing detail card
  const [viewingSellerId, setViewingSellerId] = useState<string | null>(null);

  const categories = [
    "Electronics & Gadgets",
    "Textbooks & Notes",
    "Furniture",
    "Dorm Essentials",
    "Calculators & Lab Kit",
    "Clothing & Cycles"
  ];

  useEffect(() => {
    fetchMarketplace({ search, category: selectedCategory });
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplace({ search, category: selectedCategory });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !contact) return;

    const imgFallback =
      imageUrl ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";

    const success = await createMarketplaceItem({
      title,
      description,
      price: Number(price),
      imageUrl: imgFallback,
      category,
      contact
    });

    if (success) {
      setShowSellModal(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setContact("");
    }
  };

  const copyContactDetails = (txt: string) => {
    navigator.clipboard.writeText(txt);
    showToast("Contact details copied to clipboard!", "success");
  };

  const activeListingItem = marketplace.find((m) => m.id === viewingSellerId);

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Search Header and Sell CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-sm focus-within:border-emerald-500 transition">
          <Search className="w-4.5 h-4.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search textbook name, lab coats, calculation pads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent border-none outline-none text-slate-800 dark:text-slate-100"
          />
          <button type="submit" className="hidden" />
        </form>

        {user && (
          <button
            onClick={() => setShowSellModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-1.5 transition"
            id="sell-item"
          >
            <Plus className="w-4 h-4" />
            List Dorm Item
          </button>
        )}
      </div>

      {/* Filter Category Lists */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <button
          onClick={() => {
            setSelectedCategory("");
            fetchMarketplace({ search });
          }}
          className={`px-3 py-1.5 rounded-xl border transition ${
            selectedCategory === ""
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white font-bold"
              : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900"
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border transition ${
              selectedCategory === cat
                ? "bg-emerald-600 border-emerald-605 text-white font-bold"
                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 hover:dark:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loadingMarketplace ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent animate-spin rounded-full mx-auto" />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-mono">BROWSING CAMPUS INVENTORY DATABASE...</p>
        </div>
      ) : marketplace.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-205 dark:border-slate-800 rounded-2xl">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 font-display font-semibold mt-4">No trading listings found.</p>
          <p className="text-xs text-slate-400 mt-1">Declutter your room and sell some gear now!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplace.map((item) => {
            const isOwner = user && (item.sellerUsername === user.username || user.role === "admin");
            const isSold = item.status === "sold";

            return (
              <div
                key={item.id}
                className={`bento-card-base ${
                  isSold
                    ? "opacity-60 bg-slate-100/40 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-850"
                    : "bento-card-light dark:bento-card-dark"
                } flex flex-col justify-between overflow-hidden relative group hover:scale-[1.005]`}
              >
                <div>
                  {/* Photo attachment frame */}
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950/60 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover group-hover:scale-105 transition duration-200 ${
                        isSold ? "grayscale shrink-0" : ""
                      }`}
                    />
                    
                    {/* Floating category & Price indicator */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-white rounded-lg text-[10px] font-extrabold shadow uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg text-xs font-black shadow-lg">
                        ${item.price}
                      </span>
                    </div>

                    {isSold && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-4 py-2 border-2 border-white rounded-xl text-white text-xs font-black uppercase tracking-widest rotate-6">
                          Sold Out 🤝
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Core details layout */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-slate-950 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        POSTED ON: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Subfooter Actions column */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {/* User node click to summon contact drawer */}
                    <button
                      onClick={() => setViewingSellerId(item.id)}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer"
                    >
                      Seller: @{item.sellerUsername}
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    {isOwner ? (
                      <>
                        <button
                          onClick={() => toggleMarketplaceItemStatus(item.id, item.status)}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg transition"
                          title="Toggle sold logs marker"
                        >
                          {isSold ? "Mark Active" : "Declare Sold"}
                        </button>
                        <button
                          onClick={() => deleteMarketplaceItem(item.id)}
                          className="p-1 px-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          title="Delete list item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setViewingSellerId(item.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg shadow-sm font-sans flex items-center gap-1 transition"
                      >
                        <Phone className="w-3 h-3" />
                        Get Seller Contacts
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELL GOODS MODAL */}
      {showSellModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setShowSellModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
              List Item on Dorm Marketplace
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Product/Item Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Casio Scientific stats calc"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Asking Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g., 25"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-7 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Product Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Visual Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/your-image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Private Seller Contact (Phone, dorm room address, or Whatsapp link)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Block B, Room 304 or WhatsApp / SMS: +1 555-081"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Item Description & Condition details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details such as scratch markings, battery details, manuals included, or why you are trading the item."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition text-sm"
              >
                Synthesize Item Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SELLER INQUIRING DETAILS DRAWER */}
      {viewingSellerId && activeListingItem && (
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col justify-between">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="font-display font-extrabold text-slate-900 dark:text-white">Seller Contact Information</span>
              <button
                onClick={() => setViewingSellerId(null)}
                className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seller profile overview cards */}
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center font-display font-black text-slate-800 text-xl shadow">
                {activeListingItem.sellerUsername.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <span className="block font-extrabold text-sm text-slate-900 dark:text-white">
                  {activeListingItem.sellerName}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  {activeListingItem.sellerBranch} • STUDENT seller
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1 relative">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Institutional Mail:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block outline-none">
                  {activeListingItem.sellerEmail}
                </span>
                <button
                  onClick={() => copyContactDetails(activeListingItem.sellerEmail)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-505 dark:text-indigo-400 hover:scale-110 active:scale-95 transition"
                >
                  <Copy className=" Merino-Icon w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-1 relative">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Liaison Coordinates (Phone/Dorm):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {activeListingItem.contact}
                </span>
                <button
                  onClick={() => copyContactDetails(activeListingItem.contact)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-505 dark:text-indigo-455 hover:scale-110 active:scale-95 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 text-center text-[10px] text-slate-400 font-mono">
            COORDINATE MEETUPS EXCLUSIVELY AT DESIG'NATED CAMPUS DROP BOX AREAS FOR PRIVATE STUDENT SAFEGUARDS.
          </div>
        </div>
      )}
    </div>
  );
}
