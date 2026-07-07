import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWindow({ selectedFriend }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when switching friends
  useEffect(() => {
    setMessages([]);
  }, [selectedFriend]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { _id: Date.now().toString(), text: message, sender: "me", timestamp: new Date() },
    ]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ===== No chat selected =====
  if (!selectedFriend) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
            <MessageSquare className="h-10 w-10 text-violet-500/60" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              No conversation selected
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pick a friend from the sidebar to start chatting. Your messages will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-background">

      {/* ===== Header ===== */}
      <div className="shrink-0 px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-200">
              {selectedFriend.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {selectedFriend.name}
            </h2>
            <p className="text-xs text-emerald-500 font-medium">
              {selectedFriend.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Messages ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Send a message to start the conversation 💬
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "me"
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-md shadow-lg shadow-violet-500/15"
                        : "bg-muted text-foreground rounded-bl-md border border-border/50"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      msg.sender === "me" ? "text-white/60" : "text-muted-foreground"
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ===== Input ===== */}
      <div className="shrink-0 p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none cursor-pointer"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
