import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, UserPlus, Check, Loader2 } from "lucide-react"
import axios from "axios"

export function AddFriendDialog({ isOpen, onClose, userId }) {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState(null) // { user } or null
  const [status, setStatus] = useState("idle") // idle | searching | found | not-found | sending | sent | error
  const [message, setMessage] = useState("")

  const handleSearch = async () => {
    if (!email.trim()) return

    setStatus("searching")
    setResult(null)
    setMessage("")

    try {
      const res = await axios.get(`/api/friends/search?email=${encodeURIComponent(email.trim())}&userId=${userId}`)
      setResult(res.data.user)
      setStatus("found")
    } catch (err) {
      setStatus("not-found")
      setMessage(err.response?.data?.message || "No user found")
    }
  }

  const handleSendRequest = async () => {
    if (!result) return

    setStatus("sending")

    try {
      const res = await axios.post("/api/friends/request", {
        from: userId,
        to: result._id,
      })
      setStatus("sent")
      setMessage(res.data.message)
    } catch (err) {
      setStatus("error")
      setMessage(err.response?.data?.message || "Failed to send request")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleClose = () => {
    setEmail("")
    setResult(null)
    setStatus("idle")
    setMessage("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-border/50 bg-background shadow-2xl shadow-black/20 p-6">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Add Friend</h2>
                    <p className="text-xs text-muted-foreground">Search by email address</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Search Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="flex-1 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <button
                  onClick={handleSearch}
                  disabled={!email.trim() || status === "searching"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                >
                  {status === "searching" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Result */}
              <AnimatePresence mode="wait">
                {status === "found" && result && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="rounded-xl border border-border/50 bg-muted/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
                        <span className="text-sm font-bold text-white">
                          {result.firstname?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{result.firstname}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.email}</p>
                      </div>
                      <button
                        onClick={handleSendRequest}
                        disabled={status === "sending"}
                        className="flex items-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium px-3 py-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {status === "sending" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                        Send Request
                      </button>
                    </div>
                  </motion.div>
                )}

                {status === "sent" && (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <p className="text-sm font-medium text-emerald-500">{message}</p>
                    </div>
                  </motion.div>
                )}

                {(status === "not-found" || status === "error") && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center"
                  >
                    <p className="text-sm font-medium text-red-400">{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
