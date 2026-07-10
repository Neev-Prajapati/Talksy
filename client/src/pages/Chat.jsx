import React, { useState, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SidebarProvider } from "@/components/sidebar"
import { ChatWindow } from "@/components/chatwindow"
import { CoolSidebar } from "@/components/coolsidebar"
import { useSocket } from "@/hooks/useSocket"
import axios from "axios"

export default function Chats() {
  const location = useLocation()
  const navigate = useNavigate()

  // Try location.state first, then fallback to localStorage
  const getUserData = () => {
    if (location.state?.user) return location.state.user
    const saved = localStorage.getItem("user")
    if (saved) return JSON.parse(saved)
    return null
  }

  const user = getUserData()

  // If no user data, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  const [selectedFriend, setSelectedFriend] = useState(null)
  const [friends, setFriends] = useState([])

  // Initialize socket connection
  const socket = useSocket(user?._id)

  // Fetch friends list for passing to ChatWindow (for Add Member dialog)
  const fetchFriends = useCallback(async () => {
    if (!user?._id) return
    try {
      const res = await axios.get(`/api/friends/${user._id}`)
      setFriends(res.data.friends || [])
    } catch (err) {
      console.error("Failed to fetch friends:", err)
    }
  }, [user?._id])

  useEffect(() => {
    fetchFriends()
  }, [fetchFriends])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex overflow-hidden">
        <CoolSidebar
          user={user}
          onSelectFriend={setSelectedFriend}
          onLogout={handleLogout}
          socket={socket}
        />

        <div className="flex-1 min-w-0 ml-72 h-full">
          <ChatWindow
            selectedFriend={selectedFriend}
            currentUser={user}
            socket={socket}
            allFriends={friends}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}
