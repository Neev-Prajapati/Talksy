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
} from "./sidebar"

import { UserPlus, LogOut, User } from "lucide-react"

// dummy data (replace with backend later)
const friends = [
  { _id: "1", name: "Rahul", online: true },
  { _id: "2", name: "Aman", online: false },
]

const requests = [
  { _id: "3", name: "Priya" },
]

export function CoolSidebar({ user, onSelectFriend }) {
  return (
    <Sidebar className="w-72 shrink-0 border-r">

      <SidebarContent>

        {/* ===== Friends List ===== */}
        <SidebarGroup>
          <SidebarGroupLabel>Friends</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {friends.map((friend) => (
                <SidebarMenuItem key={friend._id}>
                  <SidebarMenuButton
                    onClick={() => onSelectFriend?.(friend)}
                  >
                    <span className="relative">
                      <User className="h-4 w-4" />
                      {friend.online && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
                      )}
                    </span>
                    <span>{friend.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ===== Friend Requests ===== */}
        <SidebarGroup>
          <SidebarGroupLabel>Requests</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {requests.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No requests
                </p>
              ) : (
                requests.map((req) => (
                  <SidebarMenuItem key={req._id}>
                    <SidebarMenuButton>
                      <User className="h-4 w-4" />
                      <span>{req.name}</span>
                      <span className="ml-auto text-xs text-blue-500">
                        Accept
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ===== Add Friend ===== */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <UserPlus className="h-4 w-4" />
                  <span>Add Friend</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* ===== Footer ===== */}
      <SidebarFooter>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user?.firstname || "User"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email || "user@email.com"}
              </span>
            </div>
          </div>
          <LogOut className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-red-500" />
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}
