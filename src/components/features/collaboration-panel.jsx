"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, MessageCircle, Share2, Eye, Edit, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const mockCollaborators = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "owner",
    status: "online",
    lastSeen: new Date(),
    cursor: { x: 150, y: 200, color: "#3B82F6" },
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "editor",
    status: "online",
    lastSeen: new Date(),
    cursor: { x: 300, y: 150, color: "#10B981" },
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "viewer",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  },
]

const mockComments = [
  {
    id: "1",
    author: mockCollaborators[1],
    content: "I think we should make the header more prominent. What do you think?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    blockId: "header-1",
    resolved: false,
  },
  {
    id: "2",
    author: mockCollaborators[0],
    content: "Great suggestion! I'll increase the font size.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    blockId: "header-1",
    resolved: true,
  },
]

export default function CollaborationPanel({ isOpen, onClose }) {
  const [collaborators, setCollaborators] = useState(mockCollaborators)
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    console.log("Inviting:", inviteEmail)
    setInviteEmail("")
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      author: mockCollaborators[0],
      content: newComment,
      timestamp: new Date(),
      resolved: false,
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3 text-yellow-500" />
      case "editor":
        return <Edit className="w-3 h-3 text-blue-500" />
      case "viewer":
        return <Eye className="w-3 h-3 text-gray-500" />
      default:
        return null
    }
  }

  const formatLastSeen = (date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-40 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Collaboration
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>

            {/* Invite */}
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email to invite"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleInvite}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {/* Collaborators */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Active Collaborators ({collaborators.filter((c) => c.status === "online").length})
              </h3>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <motion.div
                    key={collaborator.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          collaborator.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{collaborator.name}</p>
                        {getRoleIcon(collaborator.role)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {collaborator.status === "online" ? "Online" : formatLastSeen(collaborator.lastSeen)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {collaborator.role}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Comments */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments ({comments.filter((c) => !c.resolved).length} active)
              </h3>

              <div className="mb-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    Send
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border ${
                      comment.resolved ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-xs font-medium text-gray-800">{comment.author.name}</p>
                          <p className="text-xs text-gray-500">{formatLastSeen(comment.timestamp)}</p>
                          {comment.resolved && (
                            <Badge variant="outline" className="text-xs">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Live Cursors */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {collaborators
                  .filter((c) => c.status === "online" && c.cursor)
                  .map((collaborator) => (
                    <motion.div
                      key={collaborator.id}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: collaborator.cursor?.color }}
                    />
                  ))}
              </div>
              <p className="text-xs text-gray-600">
                {collaborators.filter((c) => c.status === "online" && c.cursor).length} active cursors
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
