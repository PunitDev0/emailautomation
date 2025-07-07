"use client"

import { motion } from "framer-motion"
import {
  Type,
  ImageIcon,
  MousePointer,
  Share2,
  Minus,
  Space,
  Columns,
  Palette,
  Layout,
  Zap,
  Play,
  Clock,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"


const blockTypes = [
  {
    category: "Content",
    blocks: [
      { type: "text", icon: Type, label: "Text Block", description: "Add headings, paragraphs, lists" },
      { type: "image", icon: ImageIcon, label: "Image", description: "Upload or link images" },
      { type: "button", icon: MousePointer, label: "Button", description: "Call-to-action buttons" },
    ],
  },
  {
    category: "Social & Media",
    blocks: [{ type: "social", icon: Share2, label: "Social Icons", description: "Social media links" }],
  },
  {
    category: "Layout",
    blocks: [
      { type: "divider", icon: Minus, label: "Divider", description: "Horizontal line separator" },
      { type: "spacer", icon: Space, label: "Spacer", description: "Add vertical spacing" },
      { type: "columns", icon: Columns, label: "Columns", description: "Multi-column layout" },
    ],
  },
  {
    category: "Advanced",
    blocks: [
      { type: "video", icon: Play, label: "Video", description: "Embed video content" },
      { type: "countdown", icon: Clock, label: "Countdown", description: "Countdown timer" },
      { type: "survey", icon: MessageSquare, label: "Survey", description: "Feedback forms" },
    ],
  },
]

export default function Sidebar({ onAddBlock }) {
  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Components</h2>
        <p className="text-sm text-gray-600">Drag components to your email template</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {blockTypes.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                {category.category}
              </h3>

              <div className="space-y-2">
                {category.blocks.map((block, blockIndex) => (
                  <motion.div
                    key={block.type}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: categoryIndex * 0.1 + blockIndex * 0.05 }}
                  >
                    <Card
                      className="p-3 cursor-pointer hover:shadow-md transition-all duration-200 bg-white/70 hover:bg-white/90 border-white/40 group"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", block.type)
                      }}
                      onClick={() => onAddBlock(block.type)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                          <block.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {block.label}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{block.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          <Separator className="my-6" />

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Quick Actions
            </h3>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/70 hover:bg-white/90 border-white/40"
              >
                <Palette className="w-4 h-4 mr-2" />
                Theme Colors
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/70 hover:bg-white/90 border-white/40"
              >
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
