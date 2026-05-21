import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import {
  User,
  Note,
  MarketplaceListing,
  LostAndFoundListing,
  Confession,
  PlacementPost,
  ChatMessage,
  Notification,
  AdminStats
} from "../types";

interface AppContextType {
  // Auth state
  user: User | null;
  token: string | null;
  loadingAuth: boolean;
  login: (username: string, envPassword?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  // Navigation & General UI
  currentPage: string;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toasts: { id: string; message: string; type: "success" | "error" | "info" }[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  dismissToast: (id: string) => void;
  activeAura: string;
  setActiveAura: (aura: string) => void;

  // Notes
  notes: Note[];
  loadingNotes: boolean;
  fetchNotes: (filters?: { search?: string; subject?: string; semester?: string; branch?: string }) => Promise<void>;
  createNote: (noteData: any) => Promise<boolean>;
  upvoteNote: (noteId: string) => Promise<void>;
  addNoteComment: (noteId: string, text: string) => Promise<void>;
  summarizeNote: (noteId: string) => Promise<string | null>;
  deleteNote: (noteId: string) => Promise<void>;

  // Marketplace
  marketplace: MarketplaceListing[];
  loadingMarketplace: boolean;
  fetchMarketplace: (filters?: { search?: string; category?: string }) => Promise<void>;
  createMarketplaceItem: (itemData: any) => Promise<boolean>;
  toggleMarketplaceItemStatus: (itemId: string, currentStatus: "active" | "sold") => Promise<void>;
  deleteMarketplaceItem: (itemId: string) => Promise<void>;

  // Lost & Found
  lostAndFound: LostAndFoundListing[];
  loadingLostAndFound: boolean;
  fetchLostAndFound: (filters?: { search?: string; category?: "lost" | "found" }) => Promise<void>;
  createLostAndFoundItem: (itemData: any) => Promise<boolean>;
  toggleLostAndFoundStatus: (itemId: string, currentStatus: "open" | "resolved") => Promise<void>;
  deleteLostAndFoundItem: (itemId: string) => Promise<void>;

  // Confessions
  confessions: Confession[];
  loadingConfessions: boolean;
  fetchConfessions: () => Promise<void>;
  createConfession: (text: string) => Promise<boolean>;
  likeConfession: (confessionId: string) => Promise<void>;
  reportConfession: (confessionId: string) => Promise<void>;
  addConfessionComment: (confessionId: string, text: string) => Promise<void>;
  deleteConfession: (confessionId: string) => Promise<void>;

  // Placement Discussions
  placements: PlacementPost[];
  loadingPlacements: boolean;
  fetchPlacements: (filters?: { search?: string; category?: string; company?: string }) => Promise<void>;
  createPlacementPost: (postData: any) => Promise<boolean>;
  createPlacement: (postData: any) => Promise<boolean>;
  upvotePlacementPost: (postId: string) => Promise<void>;
  addPlacementComment: (postId: string, text: string) => Promise<void>;
  deletePlacementPost: (postId: string) => Promise<void>;
  generatePrepGuide: (company: string, role: string, topics?: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  generatePlacementRoadmap: (company: string, duration: string) => Promise<{ success: boolean; data?: any; error?: string }>;

  // Real-time Courtyard Chat
  chats: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  fetchChats: () => Promise<void>;
  loadingChats: boolean;

  // Notifications
  notifications: Notification[];
  clearNotifications: () => Promise<void>;

  // Admin Dashboard stats
  adminStats: AdminStats | null;
  loadingAdmin: boolean;
  fetchAdminStats: () => Promise<void>;
  deleteUserByAdmin: (username: string) => Promise<void>;
  approveConfessionByAdmin: (confessionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("campus_connect_token"));
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Navigation & System
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("campus_connect_theme") === "dark" || false
  );
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" }[]>([]);
  const [activeAura, setActiveAuraState] = useState<string>(
    localStorage.getItem("campus_connected_aura") || "restorative"
  );

  const setActiveAura = (aura: string) => {
    setActiveAuraState(aura);
    localStorage.setItem("campus_connected_aura", aura);
  };

  // Core Module lists
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>([]);
  const [loadingMarketplace, setLoadingMarketplace] = useState(false);

  const [lostAndFound, setLostAndFound] = useState<LostAndFoundListing[]>([]);
  const [loadingLostAndFound, setLoadingLostAndFound] = useState(false);

  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loadingConfessions, setLoadingConfessions] = useState(false);

  const [placements, setPlacements] = useState<PlacementPost[]>([]);
  const [loadingPlacements, setLoadingPlacements] = useState(false);

  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);

  // Applied Toast Notifications Helper
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dismissToast = (id: string) => {
    removeToast(id);
  };

  // Sync darkmode preference to document root list
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("campus_connect_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("campus_connect_theme", "light");
    }
  }, [darkMode]);

  // Auth fetch user automatically on start or token change
  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setLoadingAuth(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // If user was on landing or auth and is successfully validated, skip to the main feeds!
        if (currentPage === "landing" || currentPage === "login" || currentPage === "register") {
          setCurrentPage("dashboard");
        }
      } else {
        // Stale token cleanup
        localStorage.removeItem("campus_connect_token");
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to automatically authenticate student payload:", e);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  // Handle Socket.IO connection and dual backup polling sync
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to CampusConnect primary WebSockets layer");
      newSocket.emit("join_courtyard");
    });

    newSocket.on("chat_message", (msg: ChatMessage) => {
      setChats((prev) => {
        // Prevent doubling of messages of local sender
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch data on module shifts
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, currentPage]);

  // Shared HTTP headers
  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  // ==========================================
  // AUTHENTICATION UTILITIES
  // ==========================================

  const login = async (username: string, envPassword = "password") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: envPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login credentials unauthorized." };
      }

      localStorage.setItem("campus_connect_token", data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}! ✨`, "success");
      setCurrentPage("dashboard");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: "Campus network connection timeout." };
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration validation error." };
      }

      localStorage.setItem("campus_connect_token", data.token);
      setToken(data.token);
      setUser(data.user);
      showToast("Account synthesized successfully! Welcome to the loop. 🚀", "success");
      setCurrentPage("dashboard");
      return { success: true };
    } catch (e) {
      return { success: false, error: "Network error during register cycle." };
    }
  };

  const logout = () => {
    localStorage.removeItem("campus_connect_token");
    setToken(null);
    setUser(null);
    setCurrentPage("landing");
    showToast("Logged out successfully. See you at the next lecture!", "info");
  };

  // ==========================================
  // NOTES SHARING HUB
  // ==========================================

  const fetchNotes = async (filters?: { search?: string; subject?: string; semester?: string; branch?: string }) => {
    setLoadingNotes(true);
    try {
      let url = "/api/notes?";
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val) url += `${key}=${encodeURIComponent(val)}&`;
        });
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (e) {
      console.error("Notes connection failure:", e);
    } finally {
      setLoadingNotes(false);
    }
  };

  const createNote = async (noteData: any) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(noteData)
      });
      if (res.ok) {
        showToast("Note reference uploaded successfully! 📚", "success");
        await fetchNotes();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || "Note submission rejected.", "error");
        return false;
      }
    } catch (e) {
      showToast("Network fault during upload. Try again.", "error");
      return false;
    }
  };

  const upvoteNote = async (noteId: string) => {
    if (!user) {
      showToast("Sign in to upvote standard resources.", "info");
      return;
    }
    try {
      const res = await fetch(`/api/notes/${noteId}/upvote`, {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addNoteComment = async (noteId: string, text: string) => {
    if (!user) {
      showToast("Please authenticate to post comments.", "info");
      return;
    }
    try {
      const res = await fetch(`/api/notes/${noteId}/comment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
        showToast("Comment added!", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const summarizeNote = async (noteId: string): Promise<string | null> => {
    try {
      const res = await fetch(`/api/notes/${noteId}/summarize`, {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh local cache representation
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, summarizedText: data.summary } : n))
        );
        showToast("AI Summary Synthesized!", "success");
        return data.summary;
      } else {
        const data = await res.json();
        showToast(data.error || "AI failure.", "error");
        return null;
      }
    } catch (e) {
      showToast("Connection timeout on Gemini node.", "error");
      return null;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        showToast("Note resource removed.", "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // STUDENT MARKETPLACE
  // ==========================================

  const fetchMarketplace = async (filters?: { search?: string; category?: string }) => {
    setLoadingMarketplace(true);
    try {
      let url = "/api/marketplace?";
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val) url += `${key}=${encodeURIComponent(val)}&`;
        });
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMarketplace(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMarketplace(false);
    }
  };

  const createMarketplaceItem = async (itemData: any) => {
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        showToast("Marketplace listing posted! 🛍️", "success");
        await fetchMarketplace();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || "Submission failed.", "error");
        return false;
      }
    } catch (e) {
      showToast("Network fault during posting.", "error");
      return false;
    }
  };

  const toggleMarketplaceItemStatus = async (itemId: string, currentStatus: "active" | "sold") => {
    const nextStatus = currentStatus === "active" ? "sold" : "active";
    try {
      const res = await fetch(`/api/marketplace/${itemId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setMarketplace((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
        showToast(`Item marked as ${nextStatus}!`, "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMarketplaceItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/marketplace/${itemId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        setMarketplace((prev) => prev.filter((item) => item.id !== itemId));
        showToast("Product listing removed.", "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // LOST & FOUND
  // ==========================================

  const fetchLostAndFound = async (filters?: { search?: string; category?: "lost" | "found" }) => {
    setLoadingLostAndFound(true);
    try {
      let url = "/api/lostfound?";
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val) url += `${key}=${encodeURIComponent(val)}&`;
        });
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLostAndFound(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLostAndFound(false);
    }
  };

  const createLostAndFoundItem = async (itemData: any) => {
    try {
      const res = await fetch("/api/lostfound", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        showToast("Lost & found tag logged successfully! 🔍", "success");
        await fetchLostAndFound();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || "Submission rejected.", "error");
        return false;
      }
    } catch (e) {
      showToast("Network mistake during save.", "error");
      return false;
    }
  };

  const toggleLostAndFoundStatus = async (itemId: string, currentStatus: "open" | "resolved") => {
    const nextStatus = currentStatus === "open" ? "resolved" : "open";
    try {
      const res = await fetch(`/api/lostfound/${itemId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setLostAndFound((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
        showToast(`Item categorized as ${nextStatus}!`, "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLostAndFoundItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/lostfound/${itemId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        setLostAndFound((prev) => prev.filter((item) => item.id !== itemId));
        showToast("Lost/found item removed.", "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // ANONYMOUS CONFESSIONS
  // ==========================================

  const fetchConfessions = async () => {
    setLoadingConfessions(true);
    try {
      const res = await fetch("/api/confessions");
      if (res.ok) {
        const data = await res.json();
        setConfessions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConfessions(false);
    }
  };

  const createConfession = async (text: string) => {
    try {
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        showToast("Anonymously confessed! 🤫", "success");
        await fetchConfessions();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || "Confession blank or filtered.", "error");
        return false;
      }
    } catch (e) {
      showToast("Server feedback delayed. Retry shortly.", "error");
      return false;
    }
  };

  const likeConfession = async (confessionId: string) => {
    if (!user) {
      showToast("Login to validate your support.", "info");
      return;
    }
    try {
      const res = await fetch(`/api/confessions/${confessionId}/like`, {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        const updated = await res.json();
        setConfessions((prev) => prev.map((c) => (c.id === confessionId ? updated : c)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const reportConfession = async (confessionId: string) => {
    try {
      const res = await fetch(`/api/confessions/${confessionId}/report`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setConfessions((prev) =>
          prev.map((c) => (c.id === confessionId ? data.confession : c)).filter((c) => c.status !== "flagged")
        );
        showToast("Report processed. Subject scheduled for review.", "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addConfessionComment = async (confessionId: string, text: string) => {
    try {
      const res = await fetch(`/api/confessions/${confessionId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const updated = await res.json();
        setConfessions((prev) => prev.map((c) => (c.id === confessionId ? updated : c)));
        showToast("Anonymous response added!", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteConfession = async (confessionId: string) => {
    try {
      const res = await fetch(`/api/confessions/${confessionId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        setConfessions((prev) => prev.filter((c) => c.id !== confessionId));
        showToast("Confession removed.", "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // PLACEMENT DISCUSSION HUB
  // ==========================================

  const fetchPlacements = async (filters?: { search?: string; category?: string; company?: string }) => {
    setLoadingPlacements(true);
    try {
      let url = "/api/placement?";
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val) url += `${key}=${encodeURIComponent(val)}&`;
        });
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPlacements(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlacements(false);
    }
  };

  const createPlacementPost = async (postData: any) => {
    try {
      const res = await fetch("/api/placement", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        showToast("Placement guide shared with class! 💼", "success");
        await fetchPlacements();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || "Verification issue.", "error");
        return false;
      }
    } catch (e) {
      showToast("Transfer delay.", "error");
      return false;
    }
  };

  const upvotePlacementPost = async (postId: string) => {
    if (!user) {
      showToast("Login to upvote discussions.", "info");
      return;
    }
    try {
      const res = await fetch(`/api/placement/${postId}/upvote`, {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        const updated = await res.json();
        setPlacements((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addPlacementComment = async (postId: string, text: string) => {
    if (!user) {
      showToast("Registration is required to reply.", "info");
      return;
    }
    try {
      const res = await fetch(`/api/placement/${postId}/comment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const updated = await res.json();
        setPlacements((prev) => prev.map((p) => (p.id === postId ? updated : p)));
        showToast("Reply submitted!", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deletePlacementPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/placement/${postId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        setPlacements((prev) => prev.filter((p) => p.id !== postId));
        showToast("Placement discuss removed.", "info");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createPlacement = createPlacementPost;

  const generatePrepGuide = async (company: string, role: string, topics?: string) => {
    try {
      const res = await fetch("/api/ai/prep-guide", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ company, role, topics })
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || "Failed to generate guide." };
      }
    } catch (e) {
      return { success: false, error: "Network error calling AI service." };
    }
  };

  const generatePlacementRoadmap = async (company: string, duration: string) => {
    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ objective: `Interview Prep for ${company} over ${duration}.` })
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || "Failed to generate roadmap." };
      }
    } catch (e) {
      return { success: false, error: "Network error calling AI roadmap." };
    }
  };

  // ==========================================
  // REAL-TIME COURTYARD CHAT
  // ==========================================

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
    // Refresh chats room every 7 seconds as backup check
    const intId = setInterval(fetchChats, 7000);
    return () => clearInterval(intId);
  }, []);

  const sendChatMessage = async (text: string) => {
    if (!user) {
      showToast("Please login is requested before shouting in chat.", "info");
      return;
    }
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setChats((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    } catch (e) {
      // client WebSocket emit fallback to secure high responsive feeling
      if (socket) {
        socket.emit("send_message", {
          sender: user.username,
          senderName: user.name,
          text
        });
      }
    }
  };

  // ==========================================
  // NOTIFICATIONS FLOW
  // ==========================================

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        showToast("Notifications cleared!", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // ADMIN BOARD ENDPOINTS
  // ==========================================

  const fetchAdminStats = async () => {
    setLoadingAdmin(true);
    try {
      const res = await fetch("/api/admin/stats", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const deleteUserByAdmin = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        showToast(`Banishment finalized for ${userId}.`, "info");
        await fetchAdminStats();
      } else {
        const err = await res.json();
        showToast(err.error || "Operation failed", "error");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const approveConfessionByAdmin = async (confessionId: string) => {
    try {
      const res = await fetch(`/api/admin/confessions/${confessionId}/approve`, {
        method: "POST",
        headers: getHeaders()
      });
      if (res.ok) {
        showToast("Confession approved officially.", "success");
        await fetchAdminStats(); // refresh listing metrics
        await fetchConfessions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loadingAuth,
        login,
        register,
        logout,
        refreshUser,

        currentPage,
        setCurrentPage,
        darkMode,
        setDarkMode,
        toasts,
        showToast,
        removeToast,
        dismissToast,
        activeAura,
        setActiveAura,

        notes,
        loadingNotes,
        fetchNotes,
        createNote,
        upvoteNote,
        addNoteComment,
        summarizeNote,
        deleteNote,

        marketplace,
        loadingMarketplace,
        fetchMarketplace,
        createMarketplaceItem,
        toggleMarketplaceItemStatus,
        deleteMarketplaceItem,

        lostAndFound,
        loadingLostAndFound,
        fetchLostAndFound,
        createLostAndFoundItem,
        toggleLostAndFoundStatus,
        deleteLostAndFoundItem,

        confessions,
        loadingConfessions,
        fetchConfessions,
        createConfession,
        likeConfession,
        reportConfession,
        addConfessionComment,
        deleteConfession,

        placements,
        loadingPlacements,
        fetchPlacements,
        createPlacementPost,
        createPlacement,
        upvotePlacementPost,
        addPlacementComment,
        deletePlacementPost,
        generatePrepGuide,
        generatePlacementRoadmap,

        chats,
        loadingChats,
        fetchChats,
        sendChatMessage,

        notifications,
        clearNotifications,

        adminStats,
        loadingAdmin,
        fetchAdminStats,
        deleteUserByAdmin,
        approveConfessionByAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be wrapped within an AppProvider context hierarchy.");
  }
  return context;
};
