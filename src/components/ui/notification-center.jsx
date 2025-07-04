"use client";
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const notificationColors = {
  info: "text-blue-600 bg-blue-100",
  success: "text-green-600 bg-green-100",
  warning: "text-yellow-600 bg-yellow-100",
  error: "text-red-600 bg-red-100",
}

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll
}) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTime = (date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearAll}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {notifications.map((notification) => {
                    const IconComponent = notificationIcons[notification.type]
                    const colorClass = notificationColors[notification.type]

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          notification.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200 shadow-sm"
                        }`}>
                        {!notification.read && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <div className="flex items-start space-x-3">
                          <div className={`p-1.5 rounded-full ${colorClass}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(notification.timestamp)}</span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                            <div className="flex items-center justify-between">
                              {notification.action && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={notification.action.onClick}
                                  className="h-7 px-3 text-xs bg-transparent">
                                  {notification.action.label}
                                </Button>
                              )}

                              <div className="flex items-center space-x-1 ml-auto">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className="h-7 px-2 text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="w-full bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Notifications
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
