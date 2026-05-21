export interface User {
  username: string;
  email: string;
  name: string;
  avatar: string;
  college: string;
  branch: string;
  role: "student" | "admin";
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
  fileUrl: string;
  fileName: string;
  fileType: string;
  subject: string;
  semester: string;
  branch: string;
  upvotes: string[]; // usernames
  uploadedBy: string;
  uploadedByName: string;
  summarizedText?: string;
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
  likes: string[];
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
  upvotes: string[];
  comments: PlacementComment[];
  createdAt: string;
  role?: string;
  difficulty?: string;
  questions?: string[];
  resources?: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "upvote" | "comment" | "chat" | "alert";
  recipient: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalNotes: number;
  totalMarketplace: number;
  totalLostFound: number;
  totalConfessions: number;
  totalPlacementThreads: number;
  reportedConfessionsCount: number;
  usersList: {
    username: string;
    name: string;
    email: string;
    role: string;
    branch: string;
    joinedAt: string;
  }[];
}
