import React, { useState } from "react"
import { ChatWindow } from "@/components/chatwindow"
import { CoolSidebar } from "@/components/coolsidebar"

export default function Chats({ user }) {
  const [selectedFriend, setSelectedFriend] = useState(null)

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar keeps its own width */}
      <CoolSidebar
        user={user}
        onSelectFriend={setSelectedFriend}
      />

      {/* Chat window fills remaining space */}
      <div className="flex-1">
        <ChatWindow selectedFriend={selectedFriend} />
      </div>
    </div>
  )
}
