import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "./sidebar"

import { UserPlus, LogOut, User, MessageCircle, Search, Check, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { AddFriendDialog } from "./AddFriendDialog"
import axios from "axios"

export function CoolSidebar({ user, onSelectFriend, onLogout }) {
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [addFriendOpen, setAddFriendOpen] = useState(false)

  const userId = user?._id

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    if (!userId) return
    try {
      const res = await axios.get(`/api/friends/${userId}`)
      setFriends(res.data.friends || [])
    } catch (err) {
      console.error("Failed to fetch friends:", err)
    }
  }, [userId])

  // Fetch pending friend requests
  const fetchRequests = useCallback(async () => {
    if (!userId) return
    try {
      const res = await axios.get(`/api/friends/requests/${userId}`)
      setRequests(res.data.requests || [])
    } catch (err) {
      console.error("Failed to fetch requests:", err)
    }
  }, [userId])

  // Load on mount
  useEffect(() => {
    fetchFriends()
    fetchRequests()
  }, [fetchFriends, fetchRequests])

  // Poll for new requests every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRequests()
      fetchFriends()
    }, 15000)
    return () => clearInterval(interval)
  }, [fetchRequests, fetchFriends])

  const handleSelectFriend = (friend) => {
    setSelectedId(friend._id)
    onSelectFriend?.(friend)
  }

  const handleAccept = async (requesterId) => {
    try {
      await axios.post("/api/friends/accept", { userId, requesterId })
      // Refresh both lists
      fetchFriends()
      fetchRequests()
    } catch (err) {
      console.error("Failed to accept request:", err)
    }
  }

  const handleReject = async (requesterId) => {
    try {
      await axios.post("/api/friends/reject", { userId, requesterId })
      fetchRequests()
    } catch (err) {
      console.error("Failed to reject request:", err)
    }
  }

  const handleAddFriendClose = () => {
    setAddFriendOpen(false)
    // Refresh requests in case one was auto-accepted
    fetchRequests()
    fetchFriends()
  }

  return (
    <>
      <Sidebar className="w-72 shrink-0 border-r border-border/50">

        {/* ===== Header ===== */}
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Talksy</h1>
              <p className="text-[11px] text-muted-foreground leading-none">Chat with friends</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>

          {/* ===== Search (visual placeholder) ===== */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search friends...</span>
            </div>
          </div>

          {/* ===== Friends List ===== */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold">
              Friends {friends.length > 0 && `(${friends.length})`}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {friends.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                    No friends yet. Add someone to start chatting!
                  </p>
                ) : (
                  friends.map((friend) => (
                    <SidebarMenuItem key={friend._id}>
                      <SidebarMenuButton
                        onClick={() => handleSelectFriend(friend)}
                        isActive={selectedId === friend._id}
                      >
                        <span className="relative flex items-center justify-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              {friend.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          {friend.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-sidebar" />
                          )}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate font-medium text-sm">{friend.name}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {friend.email}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* ===== Friend Requests ===== */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold">
              Requests {requests.length > 0 && `(${requests.length})`}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {requests.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No pending requests
                  </p>
                ) : (
                  requests.map((req) => (
                    <SidebarMenuItem key={req._id}>
                      <div className="flex items-center gap-2 px-2 py-1.5 w-full">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-700">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-300">
                            {req.firstname?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm truncate">{req.firstname}</span>
                          <span className="text-xs text-muted-foreground truncate">{req.email}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleAccept(req._id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-emerald-500/15 transition-colors cursor-pointer"
                            title="Accept"
                          >
                            <Check className="h-4 w-4 text-emerald-500" />
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-red-500/15 transition-colors cursor-pointer"
                            title="Reject"
                          >
                            <X className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* ===== Add Friend ===== */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="text-violet-500 hover:text-violet-400"
                    onClick={() => setAddFriendOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="font-medium text-sm">Add Friend</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

        </SidebarContent>

        {/* ===== Footer — User Info + Logout ===== */}
        <SidebarFooter>
          <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
              <span className="text-sm font-bold text-white">
                {user?.firstname?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate">
                {user?.firstname || "Unknown"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || "No email"}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors group cursor-pointer"
              title="Log out"
            >
              <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </SidebarFooter>

      </Sidebar>

      {/* Add Friend Dialog (rendered outside sidebar for proper z-index) */}
      <AddFriendDialog
        isOpen={addFriendOpen}
        onClose={handleAddFriendClose}
        userId={userId}
      />
    </>
  )
}
