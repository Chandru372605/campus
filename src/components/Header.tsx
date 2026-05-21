import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Menu, Bell, Sun, Moon, Sparkles, Check, CheckCheck } from "lucide-react";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { currentPage, darkMode, setDarkMode, notifications, clearNotifications, user } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Campus Courtyard Feed";
      case "notes":
        return "Academic Resource Exchange";
      case "marketplace":
        return "Student Dorm Marketplace";
      case "lostfound":
        return "Lost & Found Loggers";
      case "confessions":
        return "Anonymous Confessionals";
      case "placement":
        return "Placement Preparation Hub";
      case "chat":
        return "College Courtyard Lounge";
      case "profile":
        return "Integrative Student Profile";
      case "admin":
        return "Super Administration Suite";
      default:
        return "CampusConnect Portal";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 z-30 px-6 py-4 flex items-center justify-between">
      {/* Mobile control and Title Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          id="hamburger-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] hidden sm:block text-slate-500 dark:text-slate-400 font-sans mt-0.5 animate-fade-in">
            Unified student ecosystem & peer network
          </p>
        </div>
      </div>

      {/* Toolbar actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
          id="darkmode-toggle"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition relative"
            id="notifications-bell"
          >
            <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Campus Notifications
                </span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      clearNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-60 overflow-y-auto space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No new loop alerts detected.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition ${
                        n.isRead
                          ? "bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850"
                          : "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-150/40 dark:border-indigo-900/30"
                      }`}
                    >
                      <span className="block font-bold text-xs text-slate-800 dark:text-slate-200">
                        {n.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {n.description}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Display name indicator */}
        {user && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {(user.branch || "Student").split(" ")[0]} Year
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
