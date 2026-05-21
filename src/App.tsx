import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardFeed from "./pages/DashboardFeed";
import NotesPage from "./pages/NotesPage";
import MarketplacePage from "./pages/MarketplacePage";
import LostFoundPage from "./pages/LostFoundPage";
import ConfessionsPage from "./pages/ConfessionsPage";
import PlacementPage from "./pages/PlacementPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";

function MainAppRouter() {
  const { currentPage, user, toasts, dismissToast, darkMode, activeAura } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync darkmode body classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Dynamic ambient light according to cognitive psychology
  const getAuraColors = () => {
    switch (activeAura) {
      case "restorative": // Green Sage / Emerald - reduces stress state
        return "from-emerald-400/15 via-teal-400/5 to-transparent dark:from-emerald-500/5 dark:via-emerald-950/10";
      case "cognitive": // Blue Focus - stimulates working memory
        return "from-sky-400/15 via-indigo-500/5 to-transparent dark:from-blue-500/5 dark:via-indigo-950/10";
      case "creative": // Amethyst Lavender - triggers empathetic connection
        return "from-purple-400/15 via-pink-400/5 to-transparent dark:from-purple-500/5 dark:via-purple-950/10";
      case "optimism": // Sunset Amber - promotes warmth and dialog
        return "from-amber-400/15 via-orange-400/5 to-transparent dark:from-amber-500/5 dark:via-amber-955/10";
      default:
        return "from-indigo-400/10 via-purple-400/5 to-transparent dark:from-indigo-500/5 dark:via-indigo-950/10";
    }
  };

  // Toast icon helper
  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4.5 h-4.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />;
      case "error":
        return <XCircle className="w-4.5 h-4.5 text-rose-500 fill-rose-105 dark:fill-rose-955 shrink-0" />;
      case "warning":
        return <AlertCircle className="w-4.5 h-4.5 text-amber-500 fill-amber-100 dark:fill-amber-955 shrink-0" />;
      default:
        return <Info className="w-4.5 h-4.5 text-blue-500 fill-blue-100 dark:fill-blue-955 shrink-0" />;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardFeed />;
      case "notes":
        return <NotesPage />;
      case "marketplace":
        return <MarketplacePage />;
      case "lostfound":
        return <LostFoundPage />;
      case "confessions":
        return <ConfessionsPage />;
      case "placement":
        return <PlacementPage />;
      case "chat":
        return <ChatPage />;
      case "profile":
        return <ProfilePage />;
      case "admin":
        return <AdminPage />;
      default:
        return <DashboardFeed />;
    }
  };

  // Auth pages logic
  if (currentPage === "landing") {
    return <LandingPage />;
  }
  if (currentPage === "login") {
    return <AuthPage mode="login" />;
  }
  if (currentPage === "register") {
    return <AuthPage mode="register" />;
  }

  // Fallback to landing if user seeks authorized dashboard feeds but is unsigned
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans antialiased relative overflow-hidden">
      
      {/* Human Psychology Color Sanctuary Ambient Backing Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[150px] bg-gradient-to-br ${getAuraColors()} transition-all duration-[1500ms] ease-in-out opacity-80 dark:opacity-40 animate-pulse-slow`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[150px] bg-gradient-to-tr ${getAuraColors()} transition-all duration-[1500ms] ease-in-out opacity-60 dark:opacity-30`} />
      </div>

      {/* Sidebar Navigation Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Screen Backdrop for collapsed menus */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Main Core Content Panel */}
      <div className="flex-grow flex flex-col min-w-0 lg:pl-64 relative z-10">
        {/* Header toolbar */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic page content wrapped with layout sizing */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full font-sans">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex items-start gap-3 animate-slide-in relative overflow-hidden"
          >
            {getToastIcon(toast.type)}
            <div className="flex-grow pr-4">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-normal">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="absolute top-3 right-3 p-0.5 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppRouter />
    </AppProvider>
  );
}
