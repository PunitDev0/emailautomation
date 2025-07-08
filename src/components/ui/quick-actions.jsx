"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Type, ImageIcon, MousePointer, Sparkles, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import  { EmailBlock } from "../email-template-maker"



export default function QuickActions({ onAddBlock, onShowTemplates, onShowAI, isMobile }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const quickBlocks = [
    { type: "text" , icon: Type, label: "Add Text", color: "bg-blue-500" },
    { type: "image" , icon: ImageIcon, label: "Add Image", color: "bg-green-500" },
    { type: "button" , icon: MousePointer, label: "Add Button", color: "bg-purple-500" },
    { type: "social" , icon: Sparkles, label: "Social Media", color: "bg-pink-500" },
  ]

  if (isMobile) {
    return null // Mobile uses the floating action button instead
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mb-4"
            >
              <Card className="p-4 bg-white/90 backdrop-blur-xl shadow-2xl border-white/20">
                <div className="flex items-center space-x-3">
                  {/* Quick Add Blocks */}
                  <div className="flex items-center space-x-2">
                    {quickBlocks.map((block) => (
                      <Tooltip key={block.type}>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              onAddBlock(block.type)
                              setIsExpanded(false)
                            }}
                            className={`${block.color} hover:opacity-90 text-white shadow-lg`}
                          >
                            <block.icon className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{block.label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <div className="w-px h-6 bg-gray-300" />

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onShowTemplates()
                            setIsExpanded(false)
                          }}
                          className="bg-white/80 hover:bg-white"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Templates
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Browse Templates</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onShowAI()
                            setIsExpanded(false)
                          }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          AI Help
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>AI Assistant</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`rounded-full shadow-2xl transition-all duration-300 ${
              isExpanded
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
              {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
