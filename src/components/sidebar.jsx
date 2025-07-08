"use client"

import { useState } from "react"
import { DragOverlay, useDraggable } from "@dnd-kit/core"
import {
  Type,
  ImageIcon,
  MousePointer,
  Minus,
  Space,
  Columns,
  Share2,
  Play,
  Timer,
  FileText,
  MessageSquare,
  Star,
  DollarSign,
  Grid3X3,
  QrCode,
  MapPin,
  BarChart3,
  Calendar,
  Palette,
  Layout,
  Zap,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const blockCategories = [
  {
    name: "Basic Elements",
    icon: Layout,
    blocks: [
      { type: "text", name: "Text", icon: Type, description: "Add text content" },
      { type: "image", name: "Image", icon: ImageIcon, description: "Add images" },
      { type: "button", name: "Button", icon: MousePointer, description: "Call-to-action button" },
      { type: "divider", name: "Divider", icon: Minus, description: "Horizontal line separator" },
      { type: "spacer", name: "Spacer", icon: Space, description: "Add vertical spacing" },
    ],
  },
  {
    name: "Layout",
    icon: Columns,
    blocks: [{ type: "columns", name: "Columns", icon: Columns, description: "Multi-column layout" }],
  },
  {
    name: "Social & Media",
    icon: Share2,
    blocks: [
      { type: "social", name: "Social Icons", icon: Share2, description: "Social media links" },
      { type: "video", name: "Video", icon: Play, description: "Embed video content" },
    ],
  },
  {
    name: "Interactive",
    icon: Zap,
    blocks: [
      { type: "countdown", name: "Countdown", icon: Timer, description: "Countdown timer" },
      { type: "survey", name: "Survey", icon: FileText, description: "Survey or poll" },
      { type: "form", name: "Contact Form", icon: MessageSquare, description: "Contact form" },
    ],
  },
  {
    name: "Content Blocks",
    icon: Star,
    blocks: [
      { type: "testimonial", name: "Testimonial", icon: MessageSquare, description: "Customer testimonial" },
      { type: "pricing", name: "Pricing Table", icon: DollarSign, description: "Pricing plans" },
      { type: "gallery", name: "Gallery", icon: Grid3X3, description: "Image gallery" },
    ],
  },
  {
    name: "Advanced",
    icon: Palette,
    blocks: [
      { type: "qr", name: "QR Code", icon: QrCode, description: "QR code generator" },
      { type: "map", name: "Map", icon: MapPin, description: "Location map" },
      { type: "chart", name: "Chart", icon: BarChart3, description: "Data visualization" },
      { type: "calendar", name: "Calendar Event", icon: Calendar, description: "Event invitation" },
    ],
  },
]

function DraggableBlock({ block, onAddBlock }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${block.type}`,
    data: { type: block.type },
  })

  const handleClick = () => {
    onAddBlock(block.type)
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        group relative p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-grab active:cursor-grabbing
        hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800
        ${isDragging ? "opacity-50 shadow-lg" : ""}
      `}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
          <block.icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{block.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{block.description}</p>
        </div>
      </div>

      {/* Add button overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

export default function Sidebar({ onAddBlock, selectedCategory = "all" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [openCategories, setOpenCategories] = useState(new Set(["Basic Elements"]))
  const [draggedBlock, setDraggedBlock] = useState(null)

  const toggleCategory = (categoryName) => {
    const newOpenCategories = new Set(openCategories)
    if (newOpenCategories.has(categoryName)) {
      newOpenCategories.delete(categoryName)
    } else {
      newOpenCategories.add(categoryName)
    }
    setOpenCategories(newOpenCategories)
  }

  const filteredCategories = blockCategories
    .map((category) => ({
      ...category,
      blocks: category.blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          block.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.blocks.length > 0)

  const handleDragStart = (event) => {
    const blockType = event.active.data.current?.type
    if (blockType) {
      const block = blockCategories.flatMap((cat) => cat.blocks).find((b) => b.type === blockType)
      setDraggedBlock(block)
    }
  }

  const handleDragEnd = () => {
    setDraggedBlock(null)
  }

  const totalBlocks = blockCategories.reduce((sum, cat) => sum + cat.blocks.length, 0)
  const filteredBlocks = filteredCategories.reduce((sum, cat) => sum + cat.blocks.length, 0)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Elements</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {filteredBlocks} of {totalBlocks} blocks
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Block Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No blocks found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <Collapsible
                  open={openCategories.has(category.name)}
                  onOpenChange={() => toggleCategory(category.name)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-2">
                        <category.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.blocks.length}
                        </Badge>
                      </div>
                      {openCategories.has(category.name) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="space-y-2 mt-2">
                    {category.blocks.map((block) => (
                      <DraggableBlock key={block.type} block={block} onAddBlock={onAddBlock} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {category !== filteredCategories[filteredCategories.length - 1] && <Separator className="my-4" />}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Drag blocks to canvas or click to add</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedBlock && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <draggedBlock.icon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-sm">{draggedBlock.name}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </div>
  )
}
