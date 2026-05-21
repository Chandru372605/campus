import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Send, MessagesSquare, CheckCheck, Smile, HelpCircle } from "lucide-react";

export default function ChatPage() {
  const { chats, loadingChats, fetchChats, sendChatMessage, user } = useApp();
  const [text, setText] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  // Autoscrolling timeline behavior
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || text.trim().length === 0) return;
    const success = await sendChatMessage(text);
    if (success) {
      setText("");
    }
  };

  const handleSmileEmoji = () => {
    setText((prev) => prev + " 😂");
  };

  return (
    <div className="h-[75vh] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden font-sans shadow-sm">
      
      {/* Lobby Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-xl">
            <MessagesSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Global Courtyard lounge
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              REAL-TIME BROADCASTS VIA SOCKET.IO PORT ENGINE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
            Streaming live
          </span>
        </div>
      </div>

      {/* Messages timeline panel */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {loadingChats ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-4">JOINING REAL-TIME COURTYARD CHANNELS...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <MessagesSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xs">No prior chats shared in current loop sessions.</p>
            <p className="text-[10px] text-slate-450 max-w-sm mx-auto">Compose a greeting below to announce your status onto the server courtyard!</p>
          </div>
        ) : (
          chats.map((c) => {
            const isMe = user && c.senderUsername === user.username;
            return (
              <div
                key={c.id}
                className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar representation */}
                {!isMe && (
                  <img
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${c.senderUsername}`}
                    alt={c.senderName}
                    referrerPolicy="no-referrer"
                    className="w-8.5 h-8.5 rounded-full ring-2 ring-indigo-500/10 object-cover shrink-0 bg-slate-100"
                  />
                )}

                <div className="space-y-1">
                  {/* Sender coordinate labels */}
                  {!isMe && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      <span className="font-bold text-slate-800 dark:text-slate-200">@{c.senderUsername}</span>
                      <span>•</span>
                      <span>{(c.senderBranch || "Student").split(" ")[0]} Year</span>
                    </div>
                  )}

                  {/* Text bubble frame */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-800/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{c.text}</p>
                  </div>

                  {/* Timestamp footer indicator */}
                  <div className={`text-[9px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 ${isMe ? "justify-end" : ""}`}>
                    <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Message Composer row */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            {/* Emoji shortcut anchor triggers */}
            <button
              type="button"
              onClick={handleSmileEmoji}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 rounded-xl transition"
              title="Add smile"
            >
              <Smile className="w-4.5 h-4.5" />
            </button>

            <input
              type="text"
              placeholder="Broadcasting class codes or exam prep links..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />

            <button
              type="submit"
              className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/10"
              id="send-chat-message"
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Broadcast</span>
            </button>
          </form>
        ) : (
          <p className="text-center text-xs text-slate-400 py-2">
            Secure sign-in is required to broad'cast courtyard announcements.
          </p>
        )}
      </div>
    </div>
  );
}
