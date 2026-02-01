import { useState } from "react";

const dummyMessages = [
  { _id: "1", text: "Hey!", sender: "friend" },
  { _id: "2", text: "Hi, how are you?", sender: "me" },
  { _id: "3", text: "All good 😄", sender: "friend" },
];

export function ChatWindow({ selectedFriend }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(dummyMessages);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { _id: Date.now(), text: message, sender: "me" },
    ]);
    setMessage("");
  };

  // ===== No chat selected =====
  if (!selectedFriend) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">
          Select a friend to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">

      {/* ===== Header (fixed) ===== */}
      <div className="shrink-0 px-6 py-4 bg-white border-b">
        <h2 className="text-lg font-semibold">
          {selectedFriend.name}
        </h2>
        <p className="text-sm text-green-500">Online</p>
      </div>

      {/* ===== Messages (scrollable) ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
              msg.sender === "me"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-white border"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* ===== Input (fixed) ===== */}
      <div className="shrink-0 p-4 bg-white border-t flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-6 py-2 rounded-full"
        >
          Send
        </button>
      </div>

    </div>
  );
}
