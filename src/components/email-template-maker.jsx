"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import {
  Save,
  Eye,
  Download,
  Undo,
  Redo,
  Settings,
  Palette,
  Smartphone,
  Tablet,
  Monitor,
  Layers,
  Zap,
  FileText,
  BarChart3,
  Users,
  Sparkles,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import components
import Sidebar from "./sidebar"
import Canvas from "./canvas"
import PropertyPanel from "./property-panel"
import PreviewModal from "./preview-modal"
import ExportModal from "./export-modal"
import TemplateLibrary from "./template-library"
import AdvancedEditor from "./features/advanced-editor"
import AIAssistant from "./features/ai-assistant"
import CollaborationPanel from "./features/collaboration-panel"
import VersionHistory from "./features/version-history"
import AnalyticsDashboard from "./features/analytics-dashboard"
import TemplateMarketplace from "./features/template-marketplace"
import NotificationCenter from "./ui/notification-center"
import PerformanceMonitor from "./performance-monitor"

// Import block components
import QRBlock from "./blocks/qr-block"
import MapBlock from "./blocks/map-block"
import ChartBlock from "./blocks/chart-block"
import CalendarBlock from "./blocks/calendar-block"

// Add new block types to the components map
const additionalBlockComponents = {
  qr: QRBlock,
  map: MapBlock,
  chart: ChartBlock,
  calendar: CalendarBlock,
}

export default function EmailTemplateMaker() {
  // Core state
  const [blocks, setBlocks] = useState([])
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [previewMode, setPreviewMode] = useState("desktop")
  const [activeTab, setActiveTab] = useState("design")

  // UI state
  const [isVisible, setIsVisible] = useState(false)
  const [showPropertyPanel, setShowPropertyPanel] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showMarketplace, setShowMarketplace] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // History for undo/redo
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Template state
  const [templateName, setTemplateName] = useState("Untitled Template")
  const [templateCategory, setTemplateCategory] = useState("other")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateMetadata, setTemplateMetadata] = useState({
    version: "1.0.0",
    createdBy: "Anonymous",
    tags: [],
    isPublic: false,
    isPremium: false,
    usageCount: 0,
    rating: 0,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  })

  // Save dialog state
  const [dialogName, setDialogName] = useState(templateName)
  const [dialogDescription, setDialogDescription] = useState(templateDescription)
  const [dialogCategory, setDialogCategory] = useState(templateCategory)
  const [nameError, setNameError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch template by ID if provided
  useEffect(() => {
    const templateId = searchParams.get("template") || router.query?.id
    if (templateId) {
      const fetchTemplate = async () => {
        try {
          const response = await fetch(`/api/tempelates/${templateId}`)
          const result = await response.json()
          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to load template")
          }
          handleLoadTemplate(result.data)
        } catch (error) {
          console.error("Fetch template error:", error)
          toast({
            title: "Load Failed! ❌",
            description: error.message || "There was an error loading the template.",
            duration: 3000,
            variant: "destructive",
          })
        }
      }
      fetchTemplate()
    }
  }, [searchParams, router.query])

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ blocks: [...blocks], timestamp: Date.now() })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [blocks, history, historyIndex])

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1]
      setBlocks(previousState.blocks)
      setHistoryIndex(historyIndex - 1)
      toast({
        title: "Undone! ↶",
        description: "Previous action has been undone.",
        duration: 1500,
      })
    }
  }, [history, historyIndex])

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setBlocks(nextState.blocks)
      setHistoryIndex(historyIndex + 1)
      toast({
        title: "Redone! ↷",
        description: "Action has been redone.",
        duration: 1500,
      })
    }
  }, [history, historyIndex])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "s":
            e.preventDefault()
            setShowSaveDialog(true)
            break
          case "p":
            e.preventDefault()
            setShowPreview(true)
            break
          case "e":
            e.preventDefault()
            setShowExport(true)
            break
        }
      }

      if (e.key === "Escape") {
        setSelectedBlockId(null)
        setShowPropertyPanel(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  // Generate unique ID for blocks
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Add new block
  const handleAddBlock = useCallback(
    (blockType, position = null) => {
      const newBlock = {
        id: generateId(),
        type: blockType,
        content: getDefaultContent(blockType),
        styles: getDefaultStyles(blockType),
        position: position || { x: 0, y: blocks.length * 100 },
        responsive: {
          mobile: {},
          tablet: {},
          desktop: {},
        },
        order: blocks.length,
      }

      setBlocks((prev) => [...prev, newBlock])
      setSelectedBlockId(newBlock.id)
      setShowPropertyPanel(true)
      saveToHistory()

      toast({
        title: "Block Added! ✨",
        description: `${blockType.charAt(0).toUpperCase() + blockType.slice(1)} block has been added to your template.`,
        duration: 2000,
      })
    },
    [blocks, saveToHistory],
  )

  // Get default content for block types
  const getDefaultContent = (blockType) => {
    const defaults = {
      text: { text: "Your text here...", tag: "p", formatting: {} },
      image: { src: "", alt: "Image", width: null, height: null },
      button: { text: "Click Me", href: "#", target: "_blank", style: "primary" },
      divider: { style: "solid", thickness: 1, color: "#e5e7eb", width: 100 },
      spacer: { height: 40, showInEditor: false },
      columns: { columnCount: 2, columns: [] },
      social: {
        platforms: [
          { id: "facebook", name: "facebook", url: "", enabled: true },
          { id: "twitter", name: "twitter", url: "", enabled: true },
          { id: "instagram", name: "instagram", url: "", enabled: true },
          { id: "linkedin", name: "linkedin", url: "", enabled: true },
        ],
        iconSize: 40,
        iconSpacing: 12,
      },
      video: { url: "", thumbnail: "", autoplay: false, controls: true },
      countdown: {
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        targetTime: "23:59",
        timezone: "UTC",
        labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      },
      survey: {
        question: "How satisfied are you with our service?",
        type: "rating",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
      },
      form: {
        title: "Contact Us",
        subtitle: "We'd love to hear from you",
        buttonText: "Send Message",
        fields: [
          { type: "text", name: "name", label: "Name", required: true },
          { type: "email", name: "email", label: "Email", required: true },
          { type: "textarea", name: "message", label: "Message", required: true },
        ],
      },
      testimonial: {
        quote: "This product has completely transformed our business. Highly recommended!",
        author: "John Doe",
        title: "CEO, Company Inc.",
        avatar: "",
        rating: 5,
      },
      pricing: {
        title: "Choose Your Plan",
        plans: [
          {
            name: "Basic",
            price: "$9",
            period: "month",
            features: ["Feature 1", "Feature 2", "Feature 3"],
            highlighted: false,
            buttonText: "Get Started",
          },
          {
            name: "Pro",
            price: "$19",
            period: "month",
            features: ["Everything in Basic", "Feature 4", "Feature 5", "Priority Support"],
            highlighted: true,
            buttonText: "Get Started",
          },
        ],
      },
      gallery: {
        layout: "grid",
        columns: 3,
        images: [],
        showCaptions: true,
        enableLightbox: true,
      },
      qr: {
        data: "",
        size: 200,
        color: "#000000",
        backgroundColor: "#ffffff",
        errorLevel: "M",
      },
      map: {
        address: "",
        mapType: "roadmap",
        zoom: 15,
        showMarker: true,
        width: 600,
        height: 300,
      },
      chart: {
        chartType: "bar",
        data: "",
        title: "",
        width: 600,
        height: 400,
        showLegend: true,
        colorScheme: "default",
      },
      calendar: {
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        showAddToCalendar: true,
      },
    }
    return defaults[blockType] || {}
  }

  // Get default styles for block types
  const getDefaultStyles = (blockType) => {
    const defaults = {
      text: {
        fontSize: 16,
        color: "#333333",
        textAlign: "left",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      },
      image: {
        textAlign: "center",
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
      },
      button: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        borderRadius: 8,
        padding: { top: 12, right: 24, bottom: 12, left: 24 },
        margin: { top: 0, right: 0, bottom: 16, left: 0 },
        display: "inline-block",
      },
    }

    return {
      ...defaults[blockType],
      backgroundColor: "transparent",
      borderWidth: 0,
      borderColor: "#e5e7eb",
      borderRadius: 0,
    }
  }

  // Update block
  const handleUpdateBlock = useCallback(
    (blockId, updates) => {
      setBlocks((prev) => prev.map((block) => (block.id === blockId ? { ...block, ...updates } : block)))
      saveToHistory()
    },
    [saveToHistory],
  )

  // Delete block
  const handleDeleteBlock = useCallback(
    (blockId) => {
      setBlocks((prev) => prev.filter((block) => block.id !== blockId))
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null)
        setShowPropertyPanel(false)
      }
      saveToHistory()

      toast({
        title: "Block Deleted! 🗑️",
        description: "Block has been removed from your template.",
        duration: 2000,
      })
    },
    [selectedBlockId, saveToHistory],
  )

  // Duplicate block
  const handleDuplicateBlock = useCallback(
    (blockId) => {
      const blockToDuplicate = blocks.find((b) => b.id === blockId)
      if (blockToDuplicate) {
        const duplicatedBlock = {
          ...blockToDuplicate,
          id: generateId(),
          position: {
            x: blockToDuplicate.position.x + 20,
            y: blockToDuplicate.position.y + 20,
          },
          order: blocks.length,
        }
        setBlocks((prev) => [...prev, duplicatedBlock])
        setSelectedBlockId(duplicatedBlock.id)
        saveToHistory()

        toast({
          title: "Block Duplicated! 📋",
          description: "Block has been duplicated successfully.",
          duration: 2000,
        })
      }
    },
    [blocks, saveToHistory],
  )

  // Move block
  const handleMoveBlock = useCallback(
    (blockId, direction) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId)
      if (blockIndex === -1) return

      const newBlocks = [...blocks]
      if (direction === "up" && blockIndex > 0) {
        ;[newBlocks[blockIndex], newBlocks[blockIndex - 1]] = [newBlocks[blockIndex - 1], newBlocks[blockIndex]]
      } else if (direction === "down" && blockIndex < blocks.length - 1) {
        ;[newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]]
      }

      setBlocks(newBlocks)
      saveToHistory()
    },
    [blocks, saveToHistory],
  )

  // Select block
  const handleSelectBlock = useCallback((blockId) => {
    setSelectedBlockId(blockId)
    setShowPropertyPanel(true)
  }, [])

  // Save template to database
  const handleSave = useCallback(async () => {
    if (!dialogName || !dialogName.trim()) {
      setNameError("Template name is required")
      return
    }
    if (dialogName.length > 100) {
      setNameError("Template name cannot exceed 100 characters")
      return
    }
    if (dialogDescription.length > 500) {
      setNameError("Description cannot exceed 500 characters")
      return
    }

    setNameError("")
    setTemplateName(dialogName)
    setTemplateDescription(dialogDescription)
    setTemplateCategory(dialogCategory)

    try {
      const templateData = {
        name: dialogName.trim(),
        description: dialogDescription.trim(),
        category: dialogCategory,
        thumbnail: null,
        blocks,
        styles: {},
        metadata: {
          ...templateMetadata,
          updatedAt: new Date().toISOString(),
          createdBy: templateMetadata.createdBy || "Anonymous",
        },
        responsive: {
          mobile: {},
          tablet: {},
          desktop: {},
        },
      }

      const response = await fetch("/api/tempelates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save template")
      }

      setTemplateMetadata((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        createdAt: result.data.metadata.createdAt,
      }))
      setShowSaveDialog(false)

      toast({
        title: "Template Saved! 💾",
        description: result.message || "Your template has been saved successfully.",
        duration: 2000,
      })
    } catch (error) {
      console.error("Save template error:", error)
      toast({
        title: "Save Failed! ❌",
        description: error.message || "There was an error saving your template.",
        duration: 3000,
        variant: "destructive",
      })
    }
  }, [dialogName, dialogDescription, dialogCategory, blocks, templateMetadata])

  // Load template
  const handleLoadTemplate = useCallback(
    (templateData) => {
      setBlocks(templateData.blocks || [])
      setTemplateName(templateData.name || "Untitled Template")
      setTemplateDescription(templateData.description || "")
      setTemplateCategory(templateData.category || "other")
      setDialogName(templateData.name || "Untitled Template")
      setDialogDescription(templateData.description || "")
      setDialogCategory(templateData.category || "other")
      setTemplateMetadata({
        version: templateData.metadata?.version || "1.0.0",
        createdBy: templateData.metadata?.createdBy || "Anonymous",
        tags: templateData.metadata?.tags || [],
        isPublic: templateData.metadata?.isPublic || false,
        isPremium: templateData.metadata?.isPremium || false,
        usageCount: templateData.metadata?.usageCount || 0,
        rating: templateData.metadata?.rating || 0,
        createdAt: templateData.metadata?.createdAt || new Date().toISOString(),
        updatedAt: templateData.metadata?.updatedAt || null,
      })
      setSelectedBlockId(null)
      setShowPropertyPanel(false)
      setShowTemplateLibrary(false)
      saveToHistory()

      toast({
        title: "Template Loaded! 📂",
        description: `${templateData.name} has been loaded successfully.`,
        duration: 2000,
      })
    },
    [saveToHistory],
  )

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id)
        const newIndex = blocks.findIndex((block) => block.id === over.id)

        return arrayMove(blocks, oldIndex, newIndex)
      })
      saveToHistory()
    }
  }

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                src={'/assets/logo.png'}
                width={50}
                height={50}
                alt="Mail Synk Logo"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mail Synk</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {templateName} • {blocks.length} blocks
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4 ml-8">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Layers className="w-3 h-3" />
                <span>{blocks.length} Blocks</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Monitor className="w-3 h-3" />
                <span>{previewMode}</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => console.log("Performance clicked")}
              >
                <Eye className="w-3 h-3" />
                <span>Performance</span>
              </Badge>
              {templateMetadata.updatedAt && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Save className="w-3 h-3" />
                  <span>Saved {new Date(templateMetadata.updatedAt).toLocaleTimeString()}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="bg-transparent"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="bg-transparent"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>

            {/* Device Preview */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <Button
                size="sm"
                variant={previewMode === "desktop" ? "default" : "ghost"}
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === "tablet" ? "default" : "ghost"}
                onClick={() => setPreviewMode("tablet")}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === "mobile" ? "default" : "ghost"}
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Main Actions */}
            <Button size="sm" variant="outline" onClick={() => setShowTemplateLibrary(true)}>
              <FileText className="w-4 h-4 mr-1" />
              Templates
            </Button>

            <Button size="sm" variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Save Template</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={dialogName}
                      onChange={(e) => {
                        setDialogName(e.target.value)
                        setNameError("")
                      }}
                      className="col-span-3"
                      placeholder="Enter template name"
                    />
                  </div>
                  {nameError && (
                    <p className="text-red-500 text-sm col-span-4 text-center">{nameError}</p>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={dialogDescription}
                      onChange={(e) => {
                        setDialogDescription(e.target.value)
                        setNameError("")
                      }}
                      className="col-span-3"
                      placeholder="Enter template description (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={dialogCategory}
                      onValueChange={(value) => {
                        setDialogCategory(value)
                        setNameError("")
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "business",
                          "newsletter",
                          "promotional",
                          "event",
                          "announcement",
                          "personal",
                          "other",
                          "welcome",
                          "transactional",
                          "abandoned-cart",
                        ].map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSaveDialog(false)
                      setNameError("")
                      setDialogName(templateName)
                      setDialogDescription(templateDescription)
                      setDialogCategory(templateCategory)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Template</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="outline" onClick={() => setShowExport(true)}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Sidebar with Tabs */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="design" className="flex items-center space-x-1">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Design</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
              <TabsTrigger value="collab" className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="design" className="h-full mt-0">
                <Sidebar onAddBlock={handleAddBlock} />
              </TabsContent>

              <TabsContent value="ai" className="h-full mt-0">
                <AIAssistant blocks={blocks} onUpdateBlocks={setBlocks} onAddBlock={handleAddBlock} />
              </TabsContent>

              <TabsContent value="collab" className="h-full mt-0">
                <CollaborationPanel templateId="current-template" onCollaboratorUpdate={() => { }} />
              </TabsContent>

              <TabsContent value="analytics" className="h-full mt-0">
                <AnalyticsDashboard templateId="current-template" />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            <Canvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={handleSelectBlock}
              onUpdateBlock={handleUpdateBlock}
              onAddBlock={handleAddBlock}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onMoveBlock={handleMoveBlock}
              previewMode={previewMode}
              onPreviewModeChange={setPreviewMode}
            />
          </DndContext>
        </div>

        {/* Property Panel */}
        {showPropertyPanel && selectedBlock && (
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <PropertyPanel
              block={selectedBlock}
              onUpdateBlock={handleUpdateBlock}
              onClose={() => setShowPropertyPanel(false)}
              onDuplicate={handleDuplicateBlock}
              onDelete={handleDeleteBlock}
              onMove={handleMoveBlock}
              isMobile={previewMode === "mobile"}
            />
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-40">
        <Button
          size="sm"
          onClick={() => setShowAIAssistant(true)}
          className="bg-purple-600 hover:bg-purple-700 shadow-lg"
        >
          <Zap className="w-4 h-4 mr-1" />
          AI Assistant
        </Button>

        <Button size="sm" variant="outline" onClick={() => setShowAdvancedEditor(true)} className="bg-white shadow-lg">
          <Settings className="w-4 h-4 mr-1" />
          Advanced
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowNotifications(true)}
          className="bg-white shadow-lg relative"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor blocks={blocks} isVisible={isVisible} setIsVisible={setIsVisible} />

      {/* Modals and Panels */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        blocks={blocks}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        blocks={blocks}
        templateName={templateName}
      />

      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onSelectTemplate={handleLoadTemplate}
      />

      <AdvancedEditor
        isOpen={showAdvancedEditor}
        onClose={() => setShowAdvancedEditor(false)}
        selectedBlock={selectedBlock}
        onUpdateBlock={handleUpdateBlock}
        previewMode={previewMode}
      />

      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        blocks={blocks}
        onUpdateBlocks={setBlocks}
        onAddBlock={handleAddBlock}
      />

      <CollaborationPanel
        isOpen={showCollaboration}
        onClose={() => setShowCollaboration(false)}
        templateId="current-template"
        onCollaboratorUpdate={() => { }}
      />

      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        history={history}
        currentIndex={historyIndex}
        onRestoreVersion={(index) => {
          const version = history[index]
          setBlocks(version.blocks)
          setHistoryIndex(index)
          setShowVersionHistory(false)
        }}
      />

      <TemplateMarketplace
        isOpen={showMarketplace}
        onClose={() => setShowMarketplace(false)}
        onLoadTemplate={handleLoadTemplate}
      />

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  )
}