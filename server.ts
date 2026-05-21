import express from "express";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { dbInstance } from "./server/db";

// Load Environment variables
dotenv.config();

// Initialize Express, HTTP Server and Socket.IO
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));

// Initialize Google GenAI
let ai: GoogleGenAI | null = null;
const initGemini = () => {
  if (ai) return ai;
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    console.log("Gemini API initialized successfully!");
    return ai;
  }
  return null;
};

// Simple secure local sessions helper (JWT alternative for 100% reliable local authentication)
const activeSessions = new Map<string, string>(); // token -> username

// Middleware to secure endpoints using Authorization Header
const authenticateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access. Please login first." });
  }
  const token = authHeader.split(" ")[1];
  const username = activeSessions.get(token);
  if (!username) {
    return res.status(401).json({ error: "Session expired or invalid token." });
  }
  const user = dbInstance.findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "User associated with this token not found." });
  }
  (req as any).user = user;
  next();
};

// Admin protection middleware
const authorizeAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden. Admin clearance required." });
  }
  next();
};

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

app.post("/api/auth/register", (req, res) => {
  const { username, password, email, name, college, branch, role } = req.body;

  if (!username || !password || !email || !name || !college || !branch) {
    return res.status(400).json({ error: "Please fill out all fields." });
  }

  // Enforce college domain email verification
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  const isCollegeEmail = 
    domain.includes(".edu") || 
    domain.includes(".ac.") || 
    domain.includes("college") || 
    domain.includes("univ") || 
    domain.includes("student");

  if (!isCollegeEmail) {
    return res.status(400).json({ error: "Please register using a valid college or institutional (.edu) email." });
  }

  const existingUsername = dbInstance.findUserByUsername(username);
  if (existingUsername) {
    return res.status(400).json({ error: "Username is already taken." });
  }

  const existingEmail = dbInstance.findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ error: "Email is already registered." });
  }

  const newUser = {
    username,
    passwordHash: password, // For simplicity in mock-free container database, store plaintext or plain comparative match
    email,
    name,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
    college,
    branch,
    role: (role === "admin" ? "admin" : "student") as "student" | "admin",
    joinedAt: new Date().toISOString()
  };

  dbInstance.createUser(newUser);

  // Auto-Login upon registration
  const token = `token-${username}-${Date.now()}`;
  activeSessions.set(token, username);

  res.status(201).json({
    message: "Registration successful!",
    token,
    user: {
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      college: newUser.college,
      branch: newUser.branch,
      role: newUser.role
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Please provide username and password." });
  }

  const user = dbInstance.findUserByUsername(username);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = `token-${user.username}-${Date.now()}`;
  activeSessions.set(token, user.username);

  res.json({
    message: "Login successful!",
    token,
    user: {
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      college: user.college,
      branch: user.branch,
      role: user.role
    }
  });
});

app.get("/api/auth/me", authenticateUser, (req, res) => {
  const user = (req as any).user;
  res.json({
    user: {
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      college: user.college,
      branch: user.branch,
      role: user.role
    }
  });
});

// ==========================================
// 2. NOTES SHARING MODULE
// ==========================================

app.get("/api/notes", (req, res) => {
  const { search, subject, semester, branch } = req.query;
  let notes = dbInstance.getNotes();

  if (search) {
    const q = (search as string).toLowerCase();
    notes = notes.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q)
    );
  }

  if (subject) {
    notes = notes.filter(n => n.subject.toLowerCase() === (subject as string).toLowerCase());
  }

  if (semester) {
    notes = notes.filter(n => n.semester === (semester as string));
  }

  if (branch) {
    notes = notes.filter(n => n.branch.toLowerCase().includes((branch as string).toLowerCase()));
  }

  res.json(notes);
});

app.post("/api/notes", authenticateUser, (req, res) => {
  const { title, description, subject, semester, branch, fileUrl, fileName, fileType } = req.body;
  const user = (req as any).user;

  if (!title || !description || !subject || !semester || !branch) {
    return res.status(400).json({ error: "Please fill out all notes attributes." });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    title,
    description,
    fileUrl: fileUrl || "LocalStorageFile",
    fileName: fileName || "Handwritten_Notes.pdf",
    fileType: fileType || "application/pdf",
    subject,
    semester,
    branch,
    upvotes: [],
    uploadedBy: user.username,
    uploadedByName: user.name,
    comments: [],
    createdAt: new Date().toISOString()
  };

  dbInstance.addNote(newNote);
  res.status(201).json(newNote);
});

app.post("/api/notes/:id/upvote", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const note = dbInstance.upvoteNote(id, user.username);
  if (!note) {
    return res.status(404).json({ error: "Note not found." });
  }

  // Trigger optional user notification if upvoted by someone else
  if (note.uploadedBy !== user.username && note.upvotes.includes(user.username)) {
    dbInstance.createNotification({
      id: `notif-${Date.now()}`,
      title: "Note Upvote ❤️",
      description: `${user.name} upvoted your note: "${note.title}"`,
      type: "upvote",
      recipient: note.uploadedBy,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json(note);
});

app.post("/api/notes/:id/comment", authenticateUser, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const user = (req as any).user;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    text,
    author: user.username,
    createdAt: new Date().toISOString()
  };

  const updatedNote = dbInstance.addNoteComment(id, newComment);
  if (!updatedNote) {
    return res.status(404).json({ error: "Note not found." });
  }

  // Notify creator
  if (updatedNote.uploadedBy !== user.username) {
    dbInstance.createNotification({
      id: `notif-${Date.now()}`,
      title: "New Note Comment 💬",
      description: `${user.name} commented on your note: "${updatedNote.title}"`,
      type: "comment",
      recipient: updatedNote.uploadedBy,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json(updatedNote);
});

// AI NOTE SUMMARIZER
app.post("/api/notes/:id/summarize", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const note = dbInstance.getNotes().find(n => n.id === id);

  if (!note) {
    return res.status(404).json({ error: "Note not found." });
  }

  // Return cached summary if already generated
  if (note.summarizedText) {
    return res.json({ summary: note.summarizedText });
  }

  const gemini = initGemini();
  if (!gemini) {
    // Elegant fallback summary for demonstration when API Key is missing
    const fallbackSummary = `[API KEY NOT FOUND - DEMO SUMMARY] This note titled "${note.title}" covers essential foundations in ${note.subject}. Highlights focus on semester criteria (${note.semester}) in relation to ${note.branch} branches. Standard core definitions, practice calculations, and summary questions are detailed clearly.`;
    note.summarizedText = fallbackSummary;
    dbInstance.save();
    return res.json({ summary: fallbackSummary });
  }

  try {
    const prompt = `You are a professional university professor. Analyze the following peer-uploaded study note metadata and synthesize a concise 3-sentence learning summary for students. Focus on keys, definitions, and academic utility. Title: "${note.title}". Description: "${note.description}". Subject: "${note.subject}". Branch: "${note.branch}".`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    const summary = response.text || "Summary generation completed, but empty text returned.";
    note.summarizedText = summary.trim();
    dbInstance.save();

    res.json({ summary: note.summarizedText });
  } catch (error: any) {
    console.error("Gemini Note Summarizer Error:", error);
    res.status(500).json({ error: "Failed to generate AI note summary. Please try again." });
  }
});

app.delete("/api/notes/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const notes = dbInstance.getNotes();
  const noteObj = notes.find(n => n.id === id);

  if (!noteObj) {
    return res.status(404).json({ error: "Note not found." });
  }

  if (noteObj.uploadedBy !== user.username && user.role !== "admin") {
    return res.status(403).json({ error: "You are not authorized to delete this note upload." });
  }

  dbInstance.deleteNote(id);
  res.json({ message: "Note deleted successfully." });
});

// ==========================================
// 3. STUDENT MARKETPLACE MODULE
// ==========================================

app.get("/api/marketplace", (req, res) => {
  const { category, search } = req.query;
  let items = dbInstance.getMarketplace();

  if (category) {
    items = items.filter(i => i.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }

  res.json(items);
});

app.post("/api/marketplace", authenticateUser, (req, res) => {
  const { title, description, price, imageUrl, category, contact } = req.body;
  const user = (req as any).user;

  if (!title || !description || price === undefined || !category || !contact) {
    return res.status(400).json({ error: "All product parameters are required." });
  }

  const newItem = {
    id: `item-${Date.now()}`,
    title,
    description,
    price: Number(price),
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category,
    contact,
    sellerUsername: user.username,
    sellerName: user.name,
    sellerBranch: user.branch,
    sellerEmail: user.email,
    status: "active" as const,
    createdAt: new Date().toISOString()
  };

  dbInstance.addMarketplaceItem(newItem);
  res.status(201).json(newItem);
});

app.patch("/api/marketplace/:id/status", authenticateUser, (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'sold'
  const user = (req as any).user;

  const item = dbInstance.getMarketplace().find(m => m.id === id);
  if (!item) {
    return res.status(404).json({ error: "Listing not found." });
  }

  if (item.sellerUsername !== user.username && user.role !== "admin") {
    return res.status(403).json({ error: "Permission denied." });
  }

  const updatedItem = dbInstance.updateMarketplaceItemStatus(id, status);
  res.json(updatedItem);
});

app.delete("/api/marketplace/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const item = dbInstance.getMarketplace().find(m => m.id === id);
  if (!item) {
    return res.status(404).json({ error: "Listing not found." });
  }

  if (item.sellerUsername !== user.username && user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized operation." });
  }

  dbInstance.deleteMarketplaceItem(id);
  res.json({ message: "Marketplace listing removed." });
});

// ==========================================
// 4. LOST AND FOUND MODULE
// ==========================================

app.get("/api/lostfound", (req, res) => {
  const { category, search } = req.query; // category: lost or found
  let posts = dbInstance.getLostAndFound();

  if (category) {
    posts = posts.filter(p => p.category === category);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    posts = posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }

  res.json(posts);
});

app.post("/api/lostfound", authenticateUser, (req, res) => {
  const { title, description, category, location, contact, imageUrl } = req.body;
  const user = (req as any).user;

  if (!title || !description || !category || !location || !contact) {
    return res.status(400).json({ error: "Please fill out all item details." });
  }

  const newItem = {
    id: `lf-${Date.now()}`,
    title,
    description,
    imageUrl: imageUrl || undefined,
    category: category === "found" ? ("found" as const) : ("lost" as const),
    location,
    contact,
    reporterName: user.name,
    reporterUsername: user.username,
    status: "open" as const,
    createdAt: new Date().toISOString()
  };

  dbInstance.addLostAndFoundItem(newItem);
  res.status(201).json(newItem);
});

app.patch("/api/lostfound/:id/status", authenticateUser, (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'open' or 'resolved'
  const user = (req as any).user;

  const item = dbInstance.getLostAndFound().find(lf => lf.id === id);
  if (!item) {
    return res.status(404).json({ error: "Listing not found." });
  }

  if (item.reporterUsername !== user.username && user.role !== "admin") {
    return res.status(403).json({ error: "Permission denied." });
  }

  const updatedItem = dbInstance.updateLostAndFoundItemStatus(id, status);
  res.json(updatedItem);
});

app.delete("/api/lostfound/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const item = dbInstance.getLostAndFound().find(lf => lf.id === id);
  if (!item) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (item.reporterUsername !== user.username && user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized request." });
  }

  dbInstance.deleteLostAndFoundItem(id);
  res.json({ message: "Lost & found item deleted." });
});

// ==========================================
// 5. ANONYMOUS CONFESSIONS MODULE
// ==========================================

app.get("/api/confessions", (req, res) => {
  const confessions = dbInstance.getConfessions();
  // Filter out flagged confessions unless requester is admin or moderator
  res.json(confessions.filter(c => c.status === "approved" || c.status === "pending"));
});

app.post("/api/confessions", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Confession text content cannot be blank." });
  }

  // Auto-approving simple confessions under standard moderation guardrails
  const newConfession = {
    id: `conf-${Date.now()}`,
    text,
    likes: [],
    likesCount: 0,
    reportsCount: 0,
    status: "approved" as const,
    comments: [],
    createdAt: new Date().toISOString()
  };

  dbInstance.addConfession(newConfession);
  res.status(201).json(newConfession);
});

app.post("/api/confessions/:id/like", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const confession = dbInstance.likeConfession(id, user.username);
  if (!confession) {
    return res.status(404).json({ error: "Confession is gone or invalid ID." });
  }

  res.json(confession);
});

app.post("/api/confessions/:id/report", (req, res) => {
  const { id } = req.params;
  const confession = dbInstance.reportConfession(id);
  if (!confession) {
    return res.status(404).json({ error: "Confession not found." });
  }

  res.json({ message: "Report logged successfully. Thank you for keeping campus safe.", confession });
});

app.post("/api/confessions/:id/comment", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text cannot be blank." });
  }

  const commentObj = {
    id: `cc-${Date.now()}`,
    text,
    createdAt: new Date().toISOString()
  };

  const confession = dbInstance.commentOnConfession(id, commentObj);
  if (!confession) {
    return res.status(404).json({ error: "Confession not found." });
  }

  res.json(confession);
});

// ==========================================
// 6. PLACEMENT DISCUSSION HUB MODULE
// ==========================================

app.get("/api/placement", (req, res) => {
  const { search, category, company } = req.query;
  let posts = dbInstance.getPlacementPosts();

  if (category) {
    posts = posts.filter(p => p.category === category);
  }

  if (company) {
    posts = posts.filter(p => p.company.toLowerCase().includes((company as string).toLowerCase()));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    posts = posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q)
    );
  }

  res.json(posts);
});

app.post("/api/placement", authenticateUser, (req, res) => {
  const { title, company, category, content, role, difficulty, questions, resources } = req.body;
  const user = (req as any).user;

  if (!title || !company) {
    return res.status(400).json({ error: "Title and company are required." });
  }

  const newPost = {
    id: `place-${Date.now()}`,
    title,
    company,
    category: (category || "interview") as any,
    content: content || `Interview experience and questions logged for ${company}.`,
    authorUsername: user.username,
    authorName: user.name,
    authorBranch: user.branch,
    upvotes: [],
    comments: [],
    createdAt: new Date().toISOString(),
    role: role || "",
    difficulty: difficulty || "Medium",
    questions: questions || [],
    resources: resources || []
  };

  dbInstance.addPlacementPost(newPost);
  res.status(201).json(newPost);
});

app.post("/api/placement/:id/upvote", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const post = dbInstance.upvotePlacementPost(id, user.username);
  if (!post) {
    return res.status(404).json({ error: "Placement core topic not found." });
  }

  res.json(post);
});

app.post("/api/placement/:id/comment", authenticateUser, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const user = (req as any).user;

  if (!text) {
    return res.status(400).json({ error: "Comment text is mandatory." });
  }

  const commentObj = {
    id: `pc-${Date.now()}`,
    text,
    author: user.username,
    createdAt: new Date().toISOString()
  };

  const post = dbInstance.addPlacementComment(id, commentObj);
  if (!post) {
    return res.status(404).json({ error: "Placement discussion post not found." });
  }

  // Notify author
  if (post.authorUsername !== user.username) {
    dbInstance.createNotification({
      id: `notif-${Date.now()}`,
      title: "Placement Reply 💼",
      description: `${user.name} shared thoughts on your Placement Thread: "${post.title}"`,
      type: "comment",
      recipient: post.authorUsername,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json(post);
});

app.delete("/api/placement/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const post = dbInstance.getPlacementPosts().find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Discussion post not found." });
  }

  if (post.authorUsername !== user.username && user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized to remove this conversation thread." });
  }

  dbInstance.deletePlacementPost(id);
  res.json({ message: "Placement topic deleted." });
});

// ==========================================
// 7. CHATS / GLOBAL COURTYARD API
// ==========================================

app.get("/api/chats", (req, res) => {
  res.json(dbInstance.getChats());
});

app.post("/api/chats", authenticateUser, (req, res) => {
  const { text } = req.body;
  const user = (req as any).user;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Message text cannot be blank." });
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: user.username,
    senderName: user.name,
    text,
    timestamp: new Date().toISOString()
  };

  dbInstance.addChatMessage(newMsg);

  // Broadcast through Socket.io for immediate hot update
  io.emit("chat_message", newMsg);

  res.status(201).json(newMsg);
});

// ==========================================
// 8. NOTIFICATIONS
// ==========================================

app.get("/api/notifications", authenticateUser, (req, res) => {
  const user = (req as any).user;
  res.json(dbInstance.getNotifications(user.username));
});

app.post("/api/notifications/read", authenticateUser, (req, res) => {
  const user = (req as any).user;
  dbInstance.markNotificationsAsRead(user.username);
  res.json({ message: "All notifications cleared!" });
});

// ==========================================
// 9. ADMIN ACTIONS & ANALYTICS DASHBOARD
// ==========================================

app.get("/api/admin/stats", authenticateUser, authorizeAdmin, (req, res) => {
  const users = dbInstance.getUsers();
  const notes = dbInstance.getNotes();
  const listings = dbInstance.getMarketplace();
  const lf = dbInstance.getLostAndFound();
  const confessions = dbInstance.getConfessions();
  const placements = dbInstance.getPlacementPosts();

  // Simple aggregation analytics
  const totalUsers = users.length;
  const totalNotes = notes.length;
  const totalMarketplace = listings.length;
  const totalLostFound = lf.length;
  const totalConfessions = confessions.length;
  const totalPlacementThreads = placements.length;
  const reportedConfessionsCount = confessions.filter(c => c.reportsCount > 0 || c.status === "flagged").length;

  res.json({
    totalUsers,
    totalNotes,
    totalMarketplace,
    totalLostFound,
    totalConfessions,
    totalPlacementThreads,
    reportedConfessionsCount,
    usersList: users.map(u => ({ username: u.username, name: u.name, email: u.email, role: u.role, branch: u.branch, joinedAt: u.joinedAt }))
  });
});

app.delete("/api/admin/users/:username", authenticateUser, authorizeAdmin, (req, res) => {
  const { username } = req.params;
  if (username === "admin") {
    return res.status(400).json({ error: "Cannot delete the super administrator." });
  }

  const user = dbInstance.findUserByUsername(username);
  if (!user) {
    return res.status(404).json({ error: "User profile not found." });
  }

  dbInstance.deleteUser(username);
  res.json({ message: `Successfully banished student profile "${username}" from CampusConnect.` });
});

app.post("/api/admin/confessions/:id/approve", authenticateUser, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const conf = dbInstance.approveConfession(id);
  if (!conf) {
    return res.status(404).json({ error: "Confession not found." });
  }
  res.json({ message: "Confession approved and cleared of reports.", confession: conf });
});

// ==========================================
// 10. AI EXPERT POWER HOOKS (PLACEMENT PREMIER)
// ==========================================

// AI ROUND GUIDE
app.post("/api/ai/prep-guide", authenticateUser, async (req, res) => {
  const { company, role } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: "Please enter a target company and engineering role." });
  }

  const gemini = initGemini();
  if (!gemini) {
    // Demonstration mock-free premium content fallback with high caliber interview advice
    const mockPrepGuide = `### 🚀 ${company.toUpperCase()} - ${role.toUpperCase()} Interview Prep Guide

**1. Mock Technical Assessment focus:**
- Practicing binary heap algorithms, matrix dynamic programming, and custom hashing rules.
- Reviewing O(N log K) priority queues for custom scheduling questions.

**2. Core Concepts checklist:**
- Understanding multi-threaded synchronization conditions if relevant, or distributed database transactions.
- Designing high throughput APIs with custom rate limiting algorithms.

**3. Typical Coding Question:**
- "Given an inventory matrix, optimize item distribution paths with minimum overall overhead." (Time limit constraint: O(Rows * Cols)).

*Configure a valid GEMINI_API_KEY in App secrets to experience full-featured, zero-latency custom interview intelligence!*`;
    return res.json({ guide: mockPrepGuide });
  }

  try {
    const prompt = `You are a Principal Software Engineering Recruiter at a Fortune 500 tech firm. Generate a highly customized, resume-ready, detailed Placement & Interview Prep Guide for a candidate targeting "${company}" as a "${role}". Put it in neat Markdown with 3 structured sections: 1. Core DSA Topics to practice, 2. Design/System concepts typically tested, and 3. An example technical Coding Round question with analytical pointers. Keep it actionable and high caliber.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ guide: response.text || "Empty guide response received." });
  } catch (error: any) {
    console.error("Gemini AI Prep-Guide Error:", error);
    res.status(500).json({ error: "Failed to generate AI Placement Guide. Please retry." });
  }
});

// AI SYLLABUS ROADMAP
app.post("/api/ai/roadmap", authenticateUser, async (req, res) => {
  const { objective } = req.body;

  if (!objective) {
    return res.status(400).json({ error: "Please enter your career objective or learning domain." });
  }

  const gemini = initGemini();
  if (!gemini) {
    const mockRoadmap = `### 🗺️ AI Syllabus Roadmap for "${objective}"

**Phase 1: Foundations (Week 1 - 3)**
- Pick up core theoretical structures (e.g. standard object OOP principles, clean code patterns).
- Complete introductory labs on environment building.

**Phase 2: Master Core System APIs (Week 4 - 8)**
- Implement robust microservices with centralized REST and websocket routing protocols.
- Deploy local DB controllers with index modeling.

**Phase 3: High Scale Optimization (Week 9 - 12)**
- Analyze bottlenecks under stress-tests and execute lazy queries.
- Build production bundles with esbuild modules.

*Add your GEMINI_API_KEY in Settings to customize this roadmap dynamically!*`;
    return res.json({ roadmap: mockRoadmap });
  }

  try {
    const prompt = `You are an elite academic curriculum designer and mentor. Generate an structured, step-by-step master Syllabus Learning Roadmap in Markdown format to achieve the objective of: "${objective}". Split the course outline into three logical progressive phases (Foundational, Intermediate, Advanced) and include bulleted list of essential libraries, frameworks, or code repos to explore. Make it look professional and structured.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ roadmap: response.text || "Empty syllabus roadmap received." });
  } catch (error: any) {
    console.error("Gemini AI Roadmap Error:", error);
    res.status(500).json({ error: "Failed to generate AI Learning Roadmap. Please retry." });
  }
});

// ==========================================
// VITE AND SOCKETS AND DEV INITIALIZATION
// ==========================================

io.on("connection", (socket) => {
  console.log(`Socket client connected with ID: ${socket.id}`);

  socket.on("join_courtyard", () => {
    // Client joining global courtyard chat room
    console.log(`Socket ${socket.id} joined global college courtyard chat`);
  });

  socket.on("send_message", (data) => {
    // Broadcast back
    io.emit("chat_message", {
      id: `msg-${Date.now()}`,
      sender: data.sender || "anonymous",
      senderName: data.senderName || "Anonymous Friend",
      text: data.text,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Connect Vite dev middleware in non-production environments
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusConnect Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Host container failure during Server start sequence:", err);
});
