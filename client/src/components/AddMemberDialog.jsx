import { useState } from "react";
import { X, UserPlus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export function AddMemberDialog({ isOpen, onClose, groupId, userId, friends, existingMemberIds, onMemberAdded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter out friends who are already in the group
  const availableFriends = friends.filter(
    (f) => !existingMemberIds.includes(f._id)
  );

  const handleAdd = async (friendId) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.post(`/api/groups/${groupId}/members`, {
        userId,
        newMemberId: friendId,
      });

      setSuccessMsg(`${res.data.member.name} added to the group!`);
      onMemberAdded?.(res.data.member);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setError("");
    setSuccessMsg("");
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
            className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-border/50 bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Add Member</h2>
                  <p className="text-xs text-muted-foreground">
                    Invite a friend to this group
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
            <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
              {availableFriends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  All your friends are already in this group 🎉
                </p>
              ) : (
                <div className="space-y-1">
                  {availableFriends.map((friend) => (
                    <div
                      key={friend._id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/30 transition-all"
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
                      <button
                        onClick={() => handleAdd(friend._id)}
                        disabled={loading}
                        className="flex h-8 items-center gap-1.5 px-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg mt-3">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg mt-3 flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  {successMsg}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border/50 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
