"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Info, AlertTriangle, CheckCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"



export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "error":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const unreadCount = notifications?.filter((n) => !n.read).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[70vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DialogTitle>Notifications</DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {notifications?.length > 0 && (
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

        <ScrollArea className="flex-1 px-4 pb-4">
          <AnimatePresence>
            {notifications?.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No new notifications to show.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {notifications?.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getNotificationColor(
                        notification.type,
                      )} ${notification.read ? "opacity-60" : ""}`}
                      onClick={() => !notification.read && onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{notification.timestamp.toLocaleTimeString()}</span>
                            {notification.action && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  notification.action.onClick()
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {notifications?.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{notifications?.length} total notifications</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => notifications?.forEach((n) => !n.read && onMarkAsRead(n.id))}
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all as read
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
