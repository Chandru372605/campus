import fs from "fs";
import path from "path";

// Define Interfaces
export interface User {
  username: string;
  passwordHash: string;
  email: string;
  name: string;
  avatar: string;
  college: string;
  branch: string;
  role: "student" | "admin";
  joinedAt: string;
}

export interface NoteComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  fileUrl: string; // Base64 or mock URL
  fileName: string;
  fileType: string;
  subject: string;
  semester: string;
  branch: string;
  upvotes: string[]; // List of usernames who upvoted
  uploadedBy: string; // Username
  uploadedByName: string;
  summarizedText?: string; // AI Summarized text
  comments: NoteComment[];
  createdAt: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  contact: string;
  sellerUsername: string;
  sellerName: string;
  sellerBranch: string;
  sellerEmail: string;
  status: "active" | "sold";
  createdAt: string;
}

export interface LostAndFoundListing {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: "lost" | "found";
  location: string;
  contact: string;
  reporterName: string;
  reporterUsername: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface ConfessionComment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Confession {
  id: string;
  text: string;
  likes: string[]; // List of usernames who liked or anonymous session fingerprint
  likesCount: number;
  reportsCount: number;
  status: "approved" | "pending" | "flagged";
  comments: ConfessionComment[];
  createdAt: string;
}

export interface PlacementComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface PlacementPost {
  id: string;
  title: string;
  company: string;
  category: "internship" | "interview" | "coding" | "referral";
  content: string;
  authorUsername: string;
  authorName: string;
  authorBranch: string;
  upvotes: string[]; // List of usernames
  comments: PlacementComment[];
  createdAt: string;
  role?: string;
  difficulty?: string;
  questions?: string[];
  resources?: string[];
}

export interface ChatMessage {
  id: string;
  sender: string; // Username
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "upvote" | "comment" | "chat" | "alert";
  recipient: string; // Username
  isRead: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  notes: Note[];
  marketplace: MarketplaceListing[];
  lostAndFound: LostAndFoundListing[];
  confessions: Confession[];
  placementPosts: PlacementPost[];
  chats: ChatMessage[];
  notifications: Notification[];
}

const DB_FILE_PATH = path.join(process.cwd(), "server_db.json");

// Initial Seed Data for immediate polish!
const initialData: DatabaseSchema = {
  users: [
    {
      username: "admin",
      passwordHash: "admin123", // Simple plain password for mock-free admin login convenience
      email: "admin@campusconnect.edu",
      name: "Professor Dave (Admin)",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      college: "State Tech University",
      branch: "Computer Science",
      role: "admin",
      joinedAt: "2026-01-10T12:00:00Z"
    },
    {
      username: "alex_rover",
      passwordHash: "password",
      email: "alex.rover@campusconnect.edu",
      name: "Alex Rover",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      college: "State Tech University",
      branch: "Computer Science & Engineering",
      role: "student",
      joinedAt: "2026-02-15T09:30:00Z"
    },
    {
      username: "samantha_smith",
      passwordHash: "password",
      email: "sam.smith@campusconnect.edu",
      name: "Samantha Smith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      college: "State Tech University",
      branch: "Data Science & AI",
      role: "student",
      joinedAt: "2026-03-01T14:45:00Z"
    },
    {
      username: "johndoe",
      passwordHash: "password",
      email: "john.doe@campusconnect.edu",
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      college: "State Tech University",
      branch: "Electrical Engineering",
      role: "student",
      joinedAt: "2026-03-10T10:20:00Z"
    }
  ],
  notes: [
    {
      id: "note-1",
      title: "Data Structures & Algorithms - Complete Term CheatSheet",
      description: "Handwritten revision notes covering HashMaps, Trees, Graph Algorithms (BFS/DFS, Dijkstra, MSTs) and Dynamic Programming patterns. Perfect for end semester exams and standard coding interview preparation.",
      fileUrl: "LocalStorageFile",
      fileName: "DSA_Exam_Cheatsheet.pdf",
      fileType: "application/pdf",
      subject: "Data Structures & Algorithms",
      semester: "3rd Semester",
      branch: "Computer Science",
      upvotes: ["samantha_smith", "johndoe"],
      uploadedBy: "alex_rover",
      uploadedByName: "Alex Rover",
      summarizedText: "This notes set provides a comprehensive review of essential computer science concepts. It covers linear and non-linear data structures. Section 1 outlines HashMaps and Trees detailing basic insertion and lookup complexity analysis. Section 2 reviews Graph Traversal algorithms BFS, DFS, and Dijkstra's algorithm for single-source shortest path. Section 3 discusses optimal substructure properties in Dynamic Programming with example recurrence relations for Knapsack and LCS questions.",
      comments: [
        {
          id: "comment-1",
          text: "This literally saved me on my midterm! Dynamic programming section is beautifully explained.",
          author: "samantha_smith",
          createdAt: "2026-04-18T10:30:00Z"
        }
      ],
      createdAt: "2026-04-15T08:00:00Z"
    },
    {
      id: "note-2",
      title: "Database Management Systems (DBMS) Regular Expressions & Normalization",
      description: "Class notes on SQL subqueries, relational algebra, and detailed explanations of 1NF, 2NF, 3NF, and BCNF with step-by-step table decomposition examples.",
      fileUrl: "LocalStorageFile",
      fileName: "DBMS_Normalization_Guide.pdf",
      fileType: "application/pdf",
      subject: "Database Management Systems",
      semester: "4th Semester",
      branch: "Computer Science",
      upvotes: ["alex_rover"],
      uploadedBy: "samantha_smith",
      uploadedByName: "Samantha Smith",
      summarizedText: "The notes synthesize DBMS architectures focusing on structural consistency and normal forms. Covers relational algebra selection, projection, joins, and relational calculus queries. It steps through primary definitions of functional dependencies and guides the learner through 1st, 2nd, and 3rd normal forms. Highlights Lossless Join decomposition and Dependency Preservation bounds with worked examples.",
      comments: [],
      createdAt: "2026-05-10T11:20:00Z"
    }
  ],
  marketplace: [
    {
      id: "item-1",
      title: "Scientific Calculator CASIO fx-991EX ClassWiz",
      description: "Hardly used scientific calculator, perfect for engineering students taking statistics, electrical labs, or linear algebra. Displays spreadsheets and solves simultaneous equations easily. Batteries included.",
      price: 25,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
      category: "Calculators & Lab Kit",
      contact: "+1 (555) 302-9901",
      sellerUsername: "johndoe",
      sellerName: "John Doe",
      sellerBranch: "Electrical Engineering",
      sellerEmail: "john.doe@campusconnect.edu",
      status: "active",
      createdAt: "2026-05-18T09:00:00Z"
    },
    {
      id: "item-2",
      title: "Ergonomic Mesh Study Chair",
      description: "Moving out of dorm soon and selling this extremely comfortable study chair. Height is adjustable, has lumbar support and armrests. Excellent condition without any tears or blemishes.",
      price: 49,
      imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400",
      category: "Dorm Essentials",
      contact: "+1 (555) 123-4567",
      sellerUsername: "alex_rover",
      sellerName: "Alex Rover",
      sellerBranch: "Computer Science & Engineering",
      sellerEmail: "alex.rover@campusconnect.edu",
      status: "active",
      createdAt: "2026-05-19T14:00:00Z"
    }
  ],
  lostAndFound: [
    {
      id: "lf-1",
      title: "AirPods Pro Left Earbud (2nd Gen)",
      description: "Found a solo AirPods Pro 2 left earbud sitting on the bench outside Block B Science Cafe. It had a tiny red stripe sticker on the bottom stem. I gave it to the tech support desk at Lib Room 102 but posting here to find the owner.",
      imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
      category: "found",
      location: "Block B Cafeteria Bench",
      contact: "Lib Room 102 Desk or message me here",
      reporterName: "Samantha Smith",
      reporterUsername: "samantha_smith",
      status: "open",
      createdAt: "2026-05-20T10:15:00Z"
    },
    {
      id: "lf-2",
      title: "Blue Leather Lanyard with Dorm FOB & Transit Pass",
      description: "Lost my primary lanyard containing my room key, college card ID FOB, and city transit card during the evening basketball tournament at the campus courts. Please contact me if you picked it up!",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
      category: "lost",
      location: "Basketball Courts / Gym locker area",
      contact: "+1 (231) 222-3849",
      reporterName: "John Doe",
      reporterUsername: "johndoe",
      status: "open",
      createdAt: "2026-05-21T02:00:00Z"
    }
  ],
  confessions: [
    {
      id: "conf-1",
      text: "I have been using ChatGPT to generate all our Physics Lab assignments, and my lab partner praised me as a 'genius coder' when our scripts worked perfectly on the first try. I feel like a complete fraud, but I'm too deep into the lie now to admit it. 😂",
      likes: ["alex_rover", "johndoe"],
      likesCount: 2,
      reportsCount: 0,
      status: "approved",
      comments: [
        {
          id: "cc-1",
          text: "Don't sweat, your partner is probably using it too!",
          createdAt: "2026-05-21T08:00:00Z"
        },
        {
          id: "cc-2",
          text: "LMAO standard engineering workflow.",
          createdAt: "2026-05-21T08:45:00Z"
        }
      ],
      createdAt: "2026-05-21T01:00:00Z"
    },
    {
      id: "conf-2",
      text: "I've had a massive crush on the TA of CS 240 since semester start. She is so articulate and explains recursion like absolute poetry. I literally sit in the front row every Tuesday, but I freeze and can barely say 'present' during roll call.",
      likes: ["samantha_smith"],
      likesCount: 1,
      reportsCount: 0,
      status: "approved",
      comments: [
        {
          id: "cc-3",
          text: "Recursion! Tell her that your love for her has no base case.",
          createdAt: "2026-05-21T09:10:00Z"
        }
      ],
      createdAt: "2026-05-21T06:30:00Z"
    }
  ],
  placementPosts: [
    {
      id: "place-1",
      title: "Google STEP Sophomore Intern Live Interview Experience - CS major",
      company: "Google",
      category: "interview",
      content: "I interviewed for the Google STEP Internship last month! It consisted of two technical rounds, each 45 minutes long.\n\n**Round 1:** Focus was on basic Array manipulation and String algorithms. Question was similar to 'Longest Substring Without Repeating Characters' but with custom condition rules (ignoring certain punctuation). Edge cases like empty inputs, strings with all same characters were key. We talked about O(N) sliding window and O(N^2) naive approach. Got working code that compile cleanly on Doc.\n\n**Round 2:** Graphs & Recursion. Interviewer asked about matrix-based DFS/BFS (island count variation, finding route with minimal cells). Focus was on clean recursion stack design, preventing infinite loops by marking visited coordinates, and analyzing time complexity (O(R * C)).\n\n**Tips:** Think out loud! Google care deeply about your thought process, even if you are struggling with clean syntax.",
      authorUsername: "alex_rover",
      authorName: "Alex Rover",
      authorBranch: "Computer Science & Engineering",
      upvotes: ["samantha_smith", "johndoe"],
      comments: [
        {
          id: "pc-1",
          text: "This is super helpful! Did you get the offer?",
          author: "samantha_smith",
          createdAt: "2026-05-20T11:00:00Z"
        },
        {
          id: "pc-2",
          text: "Yes, thankfully got matched to the Nest Labs team in California!",
          author: "alex_rover",
          createdAt: "2026-05-20T11:30:00Z"
        }
      ],
      createdAt: "2026-05-19T10:00:00Z"
    },
    {
      id: "place-2",
      title: "NVIDIA Compiler Engineer Intern Coding Assessment Prep Guide",
      company: "NVIDIA",
      category: "coding",
      content: "Just finished the online coding assessment today. There were 3 coding problems: one easy, one medium, one hard. 90 minutes limit. Highly recommend practicing BIT manipulation and Binary Trees deeply on Leetcode, since compiler roles love testing memory layout and bitwise operators (e.g. XOR, masking, shifts).\n\nProblem 1 was easy array subtraction. Problem 2 was Custom Tree Inorder traversal that required using stack rather than traditional stack frames. Problem 3 was dynamic programming with matrix paths. Make sure you practice optimal time limits!",
      authorUsername: "johndoe",
      authorName: "John Doe",
      authorBranch: "Electrical Engineering",
      upvotes: ["alex_rover"],
      comments: [],
      createdAt: "2026-05-20T16:00:00Z"
    }
  ],
  chats: [
    {
      id: "msg-1",
      sender: "alex_rover",
      senderName: "Alex Rover",
      text: "Hey everyone! Welcome to CampusConnect global courtyard.",
      timestamp: "2026-05-21T18:00:00Z"
    },
    {
      id: "msg-2",
      sender: "samantha_smith",
      senderName: "Samantha Smith",
      text: "Hi Alex! Awesome workspace, I can upload notes and view placement experiences so easily now.",
      timestamp: "2026-05-21T18:15:00Z"
    },
    {
      id: "msg-3",
      sender: "johndoe",
      senderName: "John Doe",
      text: "Is anyone planning to study for the DBMS quiz tomorrow in Block A library?",
      timestamp: "2026-05-21T19:00:00Z"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Note Upvote",
      description: "Samantha Smith upvoted your note 'DSA - Complete Term CheatSheet'",
      type: "upvote",
      recipient: "alex_rover",
      isRead: false,
      createdAt: "2026-05-21T10:00:00Z"
    }
  ]
};

// Database utility class
export class JSONDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = initialData;
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Error loading Database file, using initial mock data", e);
      this.data = initialData;
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving database schema", e);
    }
  }

  // Users Operations
  public getUsers(): User[] {
    this.load();
    return this.data.users;
  }

  public findUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User) {
    this.load();
    this.data.users.push(user);
    this.save();
  }

  public updateUser(username: string, updatedUser: Partial<User>) {
    this.load();
    const index = this.data.users.findIndex(u => u.username === username);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updatedUser } as User;
      this.save();
    }
  }

  public deleteUser(username: string) {
    this.load();
    this.data.users = this.data.users.filter(u => u.username !== username);
    this.save();
  }

  // Notes Operations
  public getNotes(): Note[] {
    this.load();
    return this.data.notes;
  }

  public addNote(note: Note) {
    this.load();
    this.data.notes.unshift(note);
    this.save();
  }

  public upvoteNote(id: string, username: string) {
    this.load();
    const note = this.data.notes.find(n => n.id === id);
    if (note) {
      if (note.upvotes.includes(username)) {
        note.upvotes = note.upvotes.filter(u => u !== username);
      } else {
        note.upvotes.push(username);
      }
      this.save();
    }
    return note;
  }

  public addNoteComment(noteId: string, comment: NoteComment) {
    this.load();
    const note = this.data.notes.find(n => n.id === noteId);
    if (note) {
      note.comments.push(comment);
      this.save();
    }
    return note;
  }

  public deleteNote(id: string) {
    this.load();
    this.data.notes = this.data.notes.filter(n => n.id !== id);
    this.save();
  }

  // Marketplace Operations
  public getMarketplace(): MarketplaceListing[] {
    this.load();
    return this.data.marketplace;
  }

  public addMarketplaceItem(item: MarketplaceListing) {
    this.load();
    this.data.marketplace.unshift(item);
    this.save();
  }

  public updateMarketplaceItemStatus(id: string, status: "active" | "sold") {
    this.load();
    const item = this.data.marketplace.find(m => m.id === id);
    if (item) {
      item.status = status;
      this.save();
    }
    return item;
  }

  public deleteMarketplaceItem(id: string) {
    this.load();
    this.data.marketplace = this.data.marketplace.filter(m => m.id !== id);
    this.save();
  }

  // Lost and Found Operations
  public getLostAndFound(): LostAndFoundListing[] {
    this.load();
    return this.data.lostAndFound;
  }

  public addLostAndFoundItem(item: LostAndFoundListing) {
    this.load();
    this.data.lostAndFound.unshift(item);
    this.save();
  }

  public updateLostAndFoundItemStatus(id: string, status: "open" | "resolved") {
    this.load();
    const item = this.data.lostAndFound.find(lf => lf.id === id);
    if (item) {
      item.status = status;
      this.save();
    }
    return item;
  }

  public deleteLostAndFoundItem(id: string) {
    this.load();
    this.data.lostAndFound = this.data.lostAndFound.filter(lf => lf.id !== id);
    this.save();
  }

  // Confessions Operations
  public getConfessions(): Confession[] {
    this.load();
    return this.data.confessions;
  }

  public addConfession(confession: Confession) {
    this.load();
    this.data.confessions.unshift(confession);
    this.save();
  }

  public likeConfession(id: string, username: string) {
    this.load();
    const confession = this.data.confessions.find(c => c.id === id);
    if (confession) {
      if (confession.likes.includes(username)) {
        confession.likes = confession.likes.filter(u => u !== username);
      } else {
        confession.likes.push(username);
      }
      confession.likesCount = confession.likes.length;
      this.save();
    }
    return confession;
  }

  public reportConfession(id: string) {
    this.load();
    const confession = this.data.confessions.find(c => c.id === id);
    if (confession) {
      confession.reportsCount += 1;
      if (confession.reportsCount >= 5) {
        confession.status = "flagged";
      }
      this.save();
    }
    return confession;
  }

  public approveConfession(id: string) {
    this.load();
    const confession = this.data.confessions.find(c => c.id === id);
    if (confession) {
      confession.status = "approved";
      confession.reportsCount = 0;
      this.save();
    }
    return confession;
  }

  public commentOnConfession(id: string, comment: ConfessionComment) {
    this.load();
    const confession = this.data.confessions.find(c => c.id === id);
    if (confession) {
      confession.comments.push(comment);
      this.save();
    }
    return confession;
  }

  public deleteConfession(id: string) {
    this.load();
    this.data.confessions = this.data.confessions.filter(c => c.id !== id);
    this.save();
  }

  // Placement Posts Operations
  public getPlacementPosts(): PlacementPost[] {
    this.load();
    return this.data.placementPosts;
  }

  public addPlacementPost(post: PlacementPost) {
    this.load();
    this.data.placementPosts.unshift(post);
    this.save();
  }

  public upvotePlacementPost(id: string, username: string) {
    this.load();
    const post = this.data.placementPosts.find(p => p.id === id);
    if (post) {
      if (post.upvotes.includes(username)) {
        post.upvotes = post.upvotes.filter(u => u !== username);
      } else {
        post.upvotes.push(username);
      }
      this.save();
    }
    return post;
  }

  public addPlacementComment(postId: string, comment: PlacementComment) {
    this.load();
    const post = this.data.placementPosts.find(p => p.id === postId);
    if (post) {
      post.comments.push(comment);
      this.save();
    }
    return post;
  }

  public deletePlacementPost(id: string) {
    this.load();
    this.data.placementPosts = this.data.placementPosts.filter(p => p.id !== id);
    this.save();
  }

  // Chat Operations
  public getChats(): ChatMessage[] {
    this.load();
    return this.data.chats;
  }

  public addChatMessage(msg: ChatMessage) {
    this.load();
    this.data.chats.push(msg);
    if (this.data.chats.length > 200) {
      this.data.chats.shift(); // Limit to last 200 messages for lightweight performance
    }
    this.save();
  }

  // Notifications Operations
  public getNotifications(recipient: string): Notification[] {
    this.load();
    return this.data.notifications.filter(n => n.recipient === recipient);
  }

  public createNotification(notification: Notification) {
    this.load();
    this.data.notifications.unshift(notification);
    if (this.data.notifications.length > 500) {
      this.data.notifications.pop();
    }
    this.save();
  }

  public markNotificationsAsRead(recipient: string) {
    this.load();
    this.data.notifications.forEach(n => {
      if (n.recipient === recipient) {
        n.isRead = true;
      }
    });
    this.save();
  }
}

export const dbInstance = new JSONDatabase();
