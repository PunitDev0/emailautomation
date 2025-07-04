"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, Clock, User, GitBranch, RotateCcw, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const mockVersions = [
  {
    id: "v1.5",
    name: "Added social media section",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    author: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    changes: ["Added social media icons", "Updated footer styling", "Fixed mobile responsiveness"],
    blocks: [],
    isAutoSave: false,
    size: "2.3 KB",
  },
  {
    id: "v1.4",
    name: "Auto-save",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    author: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    changes: ["Modified header text", "Adjusted padding"],
    blocks: [],
    isAutoSave: true,
    size: "2.1 KB",
  },
  {
    id: "v1.3",
    name: "Updated color scheme",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    author: { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    changes: ["Changed primary color to blue", "Updated button styles", "Added gradient backgrounds"],
    blocks: [],
    isAutoSave: false,
    size: "2.0 KB",
  },
  {
    id: "v1.2",
    name: "Initial template structure",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    author: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    changes: ["Created basic layout", "Added header and footer", "Set up content sections"],
    blocks: [],
    isAutoSave: false,
    size: "1.8 KB",
  },
]

export default function VersionHistory({
  isOpen,
  onClose,
  onRestoreVersion
}) {
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [isComparing, setIsComparing] = useState(false)

  const formatTimestamp = (date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    return `${Math.floor(hours / 24)} days ago`;
  }

  const handleRestore = (version) => {
    onRestoreVersion(version)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[700px] flex flex-col">
            {/* Header */}
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Version History</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsComparing(!isComparing)}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    {isComparing ? "Exit Compare" : "Compare"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    ×
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 flex">
              {/* Version List */}
              <div className="w-1/2 border-r border-gray-200">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">All Versions</h3>
                  <p className="text-sm text-gray-600">{mockVersions.length} versions saved</p>
                </div>

                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {mockVersions.map((version, index) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedVersion === version.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedVersion(version.id)}>
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={version.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{version.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-800 truncate">{version.name}</h4>
                              {version.isAutoSave && (
                                <Badge variant="outline" className="text-xs">
                                  Auto-save
                                </Badge>
                              )}
                              {index === 0 && <Badge className="text-xs bg-green-100 text-green-700">Current</Badge>}
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {version.author.name}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimestamp(version.timestamp)}
                              </span>
                              <span>{version.size}</span>
                            </div>

                            <div className="mt-2">
                              <p className="text-xs text-gray-600">{version.changes.length} changes</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Version Details */}
              <div className="w-1/2 flex flex-col">
                {selectedVersion ? (
                  <>
                    {(() => {
                      const version = mockVersions.find((v) => v.id === selectedVersion)
                      return (
                        <>
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-medium text-gray-800">{version.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {formatTimestamp(version.timestamp)} by {version.author.name}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleRestore(version)}
                                  className="bg-blue-600 hover:bg-blue-700">
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Restore
                                </Button>
                              </div>
                            </div>
                          </div>
                          <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Changes Made</h4>
                                <div className="space-y-2">
                                  {version.changes.map((change, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                      <p className="text-sm text-gray-700">{change}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Version Info</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">Version ID</p>
                                    <p className="font-mono text-gray-800">{version.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">File Size</p>
                                    <p className="text-gray-800">{version.size}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Author</p>
                                    <p className="text-gray-800">{version.author.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Type</p>
                                    <p className="text-gray-800">{version.isAutoSave ? "Auto-save" : "Manual save"}</p>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Preview</h4>
                                <div
                                  className="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
                                  <p className="text-gray-500 text-sm">Template preview would appear here</p>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a version to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
