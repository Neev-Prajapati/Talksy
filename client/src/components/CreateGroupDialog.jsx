import { useState } from "react";
import { X, Users, ImagePlus, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export function CreateGroupDialog({ isOpen, onClose, userId, friends, onGroupCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMember = (friendId) => {
    setSelectedMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    if (selectedMembers.length === 0) {
      setError("Select at least one member");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/groups", {
        name: name.trim(),
        description: description.trim(),
        avatar: avatar.trim(),
        memberIds: selectedMembers,
        creatorId: userId,
      });

      onGroupCreated?.(res.data.group);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setAvatar("");
    setSelectedMembers([]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-border/50 bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Create Group</h2>
                  <p className="text-xs text-muted-foreground">
                    Start a group conversation
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Group Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Study Buddies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="What's this group about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  <ImagePlus className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                  Avatar URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/avatar.png"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                {avatar && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={avatar}
                      alt="Preview"
                      className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500/30"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="text-xs text-muted-foreground">Preview</span>
                  </div>
                )}
              </div>

              {/* Members Selection */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Add Members <span className="text-red-400">*</span>
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto rounded-xl border border-border/50 bg-muted/20 p-2">
                  {friends.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No friends to add yet
                    </p>
                  ) : (
                    friends.map((friend) => {
                      const isSelected = selectedMembers.includes(friend._id);
                      return (
                        <button
                          key={friend._id}
                          onClick={() => toggleMember(friend._id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500/10 border border-emerald-500/30"
                              : "hover:bg-muted/50 border border-transparent"
                          }`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 shrink-0">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              {friend.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium truncate">
                              {friend.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {friend.email}
                            </span>
                          </div>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                              isSelected
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-border/70"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
                {selectedMembers.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
