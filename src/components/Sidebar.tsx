import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Search,
  MessageSquare,
  Briefcase,
  MessagesSquare,
  User as UserIcon,
  Crown,
  LogOut,
  X,
  Sparkles
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentPage, setCurrentPage, user, logout } = useApp();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard Feed", icon: LayoutDashboard, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: "notes", label: "Notes Sharing", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: "marketplace", label: "Dorm Marketplace", icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "lostfound", label: "Lost & Found", icon: Search, color: "text-pink-500", bg: "bg-pink-500/10" },
    { id: "confessions", label: "Confessions", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "placement", label: "Placement Prep", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "chat", label: "Global Courtyard", icon: MessagesSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "profile", label: "My Profile", icon: UserIcon, color: "text-slate-500", bg: "bg-slate-500/10" }
  ];

  if (user && user.role === "admin") {
    navigationItems.push({
      id: "admin",
      label: "Admin Room",
      icon: Crown,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    });
  }

  const handleNav = (pageId: string) => {
    setCurrentPage(pageId);
    onClose();
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 z-40 w-64 flex flex-col transform transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Sidebar Header Block */}
      <div className="p-5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            C
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            CampusConnect
          </span>
        </div>
        <button onClick={onClose} className="p-1 px-2 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation section */}
      <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition group ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
              id={`sidebar-link-${item.id}`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-indigo-100 dark:bg-indigo-950/90 text-indigo-600" : "bg-slate-100 dark:bg-slate-950 group-hover:bg-white dark:group-hover:bg-slate-900"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="flex-grow">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Embedded User Section */}
      {user && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/15">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/10 bg-slate-100 dark:bg-slate-850"
            />
            <div className="min-w-0 flex-grow">
              <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate flex items-center gap-1">
                {user.name}
                {user.role === "admin" && (
                  <Crown className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                @{user.username}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 transition flex items-center justify-center gap-2"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
