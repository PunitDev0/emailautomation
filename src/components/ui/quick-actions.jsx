"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Type, ImageIcon, MousePointer, Share2, Layout, Bot, Sparkles, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const quickBlocks = [
  { type: "text", icon: Type, label: "Text", color: "bg-blue-500" },
  { type: "image", icon: ImageIcon, label: "Image", color: "bg-green-500" },
  { type: "button", icon: MousePointer, label: "Button", color: "bg-purple-500" },
  { type: "social", icon: Share2, label: "Social", color: "bg-pink-500" },
]

export default function QuickActions({
  onAddBlock,
  onShowTemplates,
  onShowAI,
  isMobile
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isMobile) {
    return null // Mobile uses floating action button instead
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <Card
        className="bg-white/90 backdrop-blur-xl border-white/40 shadow-2xl overflow-hidden">
        <TooltipProvider>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Quick Add</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {quickBlocks.map((block) => (
                    <Tooltip key={block.type}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onAddBlock(block.type)
                            setIsExpanded(false)
                          }}
                          className="h-12 flex-col space-y-1 hover:bg-gray-50">
                          <div
                            className={`w-6 h-6 rounded ${block.color} flex items-center justify-center`}>
                            <block.icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs">{block.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add {block.label} Block</TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowTemplates}
                    className="flex-1 bg-transparent">
                    <Layout className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowAI}
                    className="flex-1 bg-transparent">
                    <Bot className="w-4 h-4 mr-2" />
                    AI Help
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-2">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Quick Actions</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </TooltipProvider>
      </Card>
    </div>
  );
}
