"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Type,
  ImageIcon,
  Square,
  Minus,
  Space,
  Columns,
  Share2,
  FootprintsIcon as Footer,
  Star,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Monitor,
  Tablet,
  Smartphone,
  Trash2,
  Copy,
  Download,
  Move,
  Edit3,
  Code,
  Eye,
  Palette,
  Layers,
  Zap,
  Sparkles,
  Mail,
  Undo,
  Redo,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Grid,
  Layout,
  PaintBucket,
  Wand2,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  Heart,
  ShoppingCart,
  Megaphone,
  TrendingUp,
  Crown,
  Diamond,
  Video,
  DollarSign,
  Tag,
  Package,
  MessageCircle,
  Moon,
} from "lucide-react"

const BLOCK_TYPES = {
  CONTENT: [
    { id: "text", name: "Text", icon: Type, description: "Rich text content", color: "#3B82F6" },
    { id: "heading", name: "Heading", icon: Type, description: "Section headings", color: "#8B5CF6" },
    { id: "hero", name: "Hero", icon: Star, description: "Hero banner section", color: "#F59E0B" },
    { id: "quote", name: "Quote", icon: MessageCircle, description: "Testimonial quotes", color: "#10B981" },
    { id: "list", name: "List", icon: Layers, description: "Bullet or numbered lists", color: "#EF4444" },
  ],
  MEDIA: [
    { id: "image", name: "Image", icon: ImageIcon, description: "Images and graphics", color: "#06B6D4" },
    { id: "gallery", name: "Gallery", icon: Grid, description: "Image gallery grid", color: "#8B5CF6" },
    { id: "video", name: "Video", icon: Video, description: "Embedded videos", color: "#F59E0B" },
    { id: "social", name: "Social Links", icon: Share2, description: "Social media icons", color: "#10B981" },
  ],
  INTERACTIVE: [
    { id: "button", name: "Button", icon: Square, description: "Call-to-action buttons", color: "#EF4444" },
    { id: "form", name: "Form", icon: Edit3, description: "Contact forms", color: "#3B82F6" },
    { id: "countdown", name: "Countdown", icon: Clock, description: "Timer countdown", color: "#F59E0B" },
    { id: "progress", name: "Progress", icon: TrendingUp, description: "Progress bars", color: "#10B981" },
  ],
  LAYOUT: [
    { id: "divider", name: "Divider", icon: Minus, description: "Horizontal dividers", color: "#6B7280" },
    { id: "spacer", name: "Spacer", icon: Space, description: "Vertical spacing", color: "#6B7280" },
    { id: "columns", name: "Columns", icon: Columns, description: "Multi-column layout", color: "#8B5CF6" },
    { id: "container", name: "Container", icon: Layout, description: "Content containers", color: "#06B6D4" },
  ],
  ECOMMERCE: [
    { id: "product", name: "Product", icon: Package, description: "Product showcase", color: "#F59E0B" },
    { id: "pricing", name: "Pricing", icon: DollarSign, description: "Pricing tables", color: "#10B981" },
    { id: "cart", name: "Cart", icon: ShoppingCart, description: "Shopping cart", color: "#EF4444" },
    { id: "coupon", name: "Coupon", icon: Tag, description: "Discount coupons", color: "#8B5CF6" },
  ],
  SPECIAL: [
    { id: "footer", name: "Footer", icon: Footer, description: "Email footer section", color: "#6B7280" },
    { id: "header", name: "Header", icon: Crown, description: "Email header section", color: "#3B82F6" },
    { id: "newsletter", name: "Newsletter", icon: Mail, description: "Newsletter signup", color: "#10B981" },
    {
      id: "announcement",
      name: "Announcement",
      icon: Megaphone,
      description: "Important announcements",
      color: "#F59E0B",
    },
  ],
}

const COLOR_PALETTES = [
  {
    name: "Ocean Breeze",
    primary: "#0EA5E9",
    secondary: "#0284C7",
    accent: "#E0F2FE",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
  },
  {
    name: "Sunset Glow",
    primary: "#F97316",
    secondary: "#EA580C",
    accent: "#FFF7ED",
    gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
  },
  {
    name: "Forest Green",
    primary: "#059669",
    secondary: "#047857",
    accent: "#ECFDF5",
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
  },
  {
    name: "Royal Purple",
    primary: "#7C3AED",
    secondary: "#5B21B6",
    accent: "#F3E8FF",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
  },
  {
    name: "Rose Gold",
    primary: "#EC4899",
    secondary: "#DB2777",
    accent: "#FDF2F8",
    gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
  },
  {
    name: "Midnight Blue",
    primary: "#1E40AF",
    secondary: "#1E3A8A",
    accent: "#EFF6FF",
    gradient: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
  },
]

const TEMPLATE_STYLES = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Modern glass effect design",
    icon: Diamond,
    preview: "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/20",
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft 3D design style",
    icon: Layers,
    preview: "bg-gray-100 shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]",
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Vibrant gradient backgrounds",
    icon: Palette,
    preview: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design",
    icon: Minimize,
    preview: "bg-white border border-gray-200",
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Modern dark theme",
    icon: Moon,
    preview: "bg-gray-900 text-white",
  },
]

const ANIMATION_PRESETS = [
  { id: "fadeIn", name: "Fade In", icon: Eye },
  { id: "slideUp", name: "Slide Up", icon: TrendingUp },
  { id: "slideDown", name: "Slide Down", icon: ChevronDown },
  { id: "slideLeft", name: "Slide Left", icon: ChevronRight },
  { id: "slideRight", name: "Slide Right", icon: ChevronRight },
  { id: "bounce", name: "Bounce", icon: Play },
  { id: "pulse", name: "Pulse", icon: Heart },
  { id: "shake", name: "Shake", icon: Zap },
  { id: "rotate", name: "Rotate", icon: RotateCcw },
  { id: "scale", name: "Scale", icon: Maximize },
]

function EmailTemplateBuilder() {
  const [blocks, setBlocks] = useState([
    {
      id: "1",
      type: "hero",
      content: "🚀 Welcome to the Future of Email Marketing",
      style: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFFFFF",
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: { top: 60, bottom: 60, left: 30, right: 30 },
        borderRadius: 16,
        animation: "fadeIn",
        glassmorphism: true,
      },
    },
    {
      id: "2",
      type: "text",
      content:
        "Experience the power of our advanced email automation platform. Create stunning campaigns that convert with our intuitive drag-and-drop builder.",
      style: {
        fontSize: 18,
        textAlign: "center",
        color: "#374151",
        padding: { top: 30, bottom: 30, left: 30, right: 30 },
        lineHeight: 1.6,
        animation: "slideUp",
      },
    },
    {
      id: "3",
      type: "button",
      content: "Get Started Free ✨",
      style: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFFFFF",
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 12,
        padding: { top: 16, bottom: 16, left: 32, right: 32 },
        animation: "bounce",
        glassmorphism: true,
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
      },
    },
  ])

  const [selectedBlock, setSelectedBlock] = useState(null)
  const [previewMode, setPreviewMode] = useState("desktop")
  const [viewMode, setViewMode] = useState("visual") // visual, code
  const [isAnimating, setIsAnimating] = useState(false)
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const previewRef = useRef(null)
  const timelineRef = useRef(null)

  const [globalSettings, setGlobalSettings] = useState({
    backgroundColor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    maxWidth: 600,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    colorPalette: COLOR_PALETTES[0],
    templateStyle: "glassmorphism",
    animations: true,
    glassmorphism: true,
    borderRadius: 16,
    spacing: 20,
  })

  // GSAP Animation Timeline
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (globalSettings.animations && previewRef.current) {
      timelineRef.current = gsap.timeline({ paused: true })

      blocks.forEach((block, index) => {
        const element = previewRef.current?.querySelector(`[data-block-id="${block.id}"]`)
        if (element && block.style.animation) {
          switch (block.style.animation) {
            case "fadeIn":
              timelineRef.current.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: index * 0.1 })
              break
            case "slideUp":
              timelineRef.current.fromTo(
                element,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1 }
              )
              break
            case "slideDown":
              timelineRef.current.fromTo(
                element,
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1 }
              )
              break
            case "bounce":
              timelineRef.current.fromTo(
                element,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "bounce.out", delay: index * 0.1 }
              )
              break
            case "pulse":
              timelineRef.current.to(element, {
                scale: 1.05,
                duration: 0.5,
                yoyo: true,
                repeat: -1,
                ease: "power2.inOut",
              })
              break
          }
        }
      })
    }
  }, [blocks, globalSettings.animations])

  const playAnimations = () => {
    if (timelineRef.current) {
      setIsAnimating(true)
      timelineRef.current.restart()
      setTimeout(() => setIsAnimating(false), 2000)
    }
  }

  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: getDefaultContent(blockType),
      style: getDefaultStyle(blockType),
    }
    setBlocks((prev) => [...prev, newBlock])
    saveToHistory()
  }, [])

  const updateBlock = useCallback((blockId, updates) => {
    setBlocks(
      (prev) => prev.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    )
    saveToHistory()
  }, [])

  const deleteBlock = useCallback((blockId) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId))
    setSelectedBlock(null)
    saveToHistory()
  }, [])

  const duplicateBlock = useCallback((blockId) => {
    const blockToDuplicate = blocks.find((block) => block.id === blockId)
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: Date.now().toString(),
      }
      setBlocks((prev) => [...prev, newBlock])
      saveToHistory()
    }
  }, [blocks])

  const moveBlock = useCallback((blockId, direction) => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === blockId)
      if (index === -1) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newBlocks = [...prev]
      const [movedBlock] = newBlocks.splice(index, 1)
      newBlocks.splice(newIndex, 0, movedBlock)
      return newBlocks
    })
    saveToHistory()
  }, [])

  const saveToHistory = () => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), blocks])
    setHistoryIndex((prev) => prev + 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setBlocks(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setBlocks(history[historyIndex + 1])
    }
  }

  function getDefaultContent(blockType) {
    const defaults = {
      text: "✨ Enter your amazing content here. Make it engaging and compelling for your audience!",
      heading: "🎯 Your Powerful Heading",
      hero: "🚀 Transform Your Business Today",
      button: "Get Started Now 🎉",
      image: "/placeholder.svg?height=300&width=500",
      quote: '💬 "This product completely transformed our business. Highly recommended!" - Happy Customer',
      list: "✅ Feature one\n✅ Feature two\n✅ Feature three",
      gallery: "/placeholder.svg?height=200&width=200",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      form: "📧 Subscribe to our newsletter",
      countdown: "⏰ Limited Time Offer",
      progress: "🎯 Campaign Progress: 75%",
      divider: "",
      spacer: "",
      container: "📦 Container Content",
      product: "🛍️ Amazing Product - $99.99",
      pricing: "💰 Premium Plan - $29/month",
      cart: "🛒 Your Shopping Cart",
      coupon: "🎟️ Save 50% with code: SAVE50",
      social: "🌟 Follow Us",
      footer: "© 2024 Your Amazing Company. All rights reserved. 📧 contact@company.com",
      header: "🏢 Your Company Logo",
      newsletter: "📬 Join 10,000+ subscribers",
      announcement: "🎉 Big Sale - 50% Off Everything!",
      columns: "📝 Column content goes here",
    }
    return defaults[blockType] || ""
  }

  function getDefaultStyle(blockType) {
    const baseGlass = globalSettings.glassmorphism
      ? {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }
      : {}

    const defaults = {
      text: {
        fontSize: 16,
        textAlign: "left",
        color: "#374151",
        padding: { top: 15, bottom: 15, left: 25, right: 25 },
        lineHeight: 1.6,
        animation: "fadeIn",
        ...baseGlass,
      },
      heading: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "left",
        color: "#1F2937",
        padding: { top: 25, bottom: 15, left: 25, right: 25 },
        animation: "slideUp",
        ...baseGlass,
      },
      hero: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFFFFF",
        backgroundColor: globalSettings.colorPalette.gradient,
        padding: { top: 60, bottom: 60, left: 30, right: 30 },
        borderRadius: globalSettings.borderRadius,
        animation: "fadeIn",
        glassmorphism: true,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      },
      button: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFFFFF",
        backgroundColor: globalSettings.colorPalette.gradient,
        borderRadius: 12,
        padding: { top: 16, bottom: 16, left: 32, right: 32 },
        animation: "bounce",
        glassmorphism: true,
        boxShadow: `0 8px 32px ${globalSettings.colorPalette.primary}30`,
        transform: "translateY(0)",
        transition: "all 0.3s ease",
      },
      image: {
        width: "100%",
        borderRadius: globalSettings.borderRadius,
        padding: { top: 15, bottom: 15, left: 25, right: 25 },
        animation: "fadeIn",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      },
      quote: {
        fontSize: 18,
        fontStyle: "italic",
        textAlign: "center",
        color: "#6B7280",
        padding: { top: 30, bottom: 30, left: 40, right: 40 },
        borderLeft: `4px solid ${globalSettings.colorPalette.primary}`,
        backgroundColor: globalSettings.colorPalette.accent,
        animation: "slideUp",
        ...baseGlass,
      },
      // Add more default styles for other block types...
    }
    return defaults[blockType] || { ...baseGlass, animation: "fadeIn" }
  }

  const renderBlock = (block) => {
    const { type, content, style } = block
    const paddingStyle = {
      paddingTop: `${style.padding?.top || 0}px`,
      paddingBottom: `${style.padding?.bottom || 0}px`,
      paddingLeft: `${style.padding?.left || 0}px`,
      paddingRight: `${style.padding?.right || 0}px`,
    }

    const glassStyle = style.glassmorphism
      ? {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }
      : {}

    const baseStyle = {
      ...paddingStyle,
      ...glassStyle,
      fontSize: `${style.fontSize || 16}px`,
      fontWeight: style.fontWeight || "normal",
      textAlign: style.textAlign || "left",
      color: style.color || "#000000",
      background: style.backgroundColor || "transparent",
      borderRadius: `${style.borderRadius || 0}px`,
      boxShadow: style.boxShadow || "none",
      transform: style.transform || "none",
      transition: style.transition || "none",
      lineHeight: style.lineHeight || "normal",
    }

    const blockElement = (() => {
      switch (type) {
        case "text":
          return (
            <div
              style={baseStyle}
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }} />
          );
        case "heading":
          return <h2 style={baseStyle}>{content}</h2>;
        case "hero":
          return (
            <div style={baseStyle}>
              <h1
                style={{ margin: 0, fontSize: `${style.fontSize}px`, fontWeight: style.fontWeight, color: style.color }}>
                {content}
              </h1>
            </div>
          );
        case "button":
          return (
            <div style={{ textAlign: style.textAlign || "center", ...paddingStyle }}>
              <motion.a
                href="#"
                style={{
                  display: "inline-block",
                  padding: `${style.padding?.top || 16}px ${style.padding?.right || 32}px ${style.padding?.bottom || 16}px ${style.padding?.left || 32}px`,
                  background: style.backgroundColor || globalSettings.colorPalette.gradient,
                  color: style.color || "#FFFFFF",
                  textDecoration: "none",
                  borderRadius: `${style.borderRadius || 12}px`,
                  fontSize: `${style.fontSize || 18}px`,
                  fontWeight: style.fontWeight || "bold",
                  boxShadow: style.boxShadow || "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  cursor: "pointer",
                  ...glassStyle,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                {content}
              </motion.a>
            </div>
          );
        case "image":
          return (
            <div style={paddingStyle}>
              <motion.img
                src={content || "/placeholder.svg?height=300&width=500"}
                alt="Email content"
                style={{
                  width: style.width || "100%",
                  height: "auto",
                  borderRadius: `${style.borderRadius || globalSettings.borderRadius}px`,
                  display: "block",
                  boxShadow: style.boxShadow || "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            </div>
          );
        case "quote":
          return (
            <div style={baseStyle}>
              <blockquote style={{ margin: 0, fontStyle: "italic" }}>{content}</blockquote>
            </div>
          );
        case "list":
          return (
            <div style={baseStyle}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {content.split("\n").map((item, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    {item.replace(/^[✅•-]\s*/, "")}
                  </li>
                ))}
              </ul>
            </div>
          );
        case "divider":
          return (
            <div style={paddingStyle}>
              <hr
                style={{
                  height: `${style.height || 1}px`,
                  background: style.backgroundColor || globalSettings.colorPalette.primary,
                  border: "none",
                  margin: 0,
                  borderRadius: "2px",
                }} />
            </div>
          );
        case "spacer":
          return <div style={{ height: `${style.height || 40}px` }} />;
        case "social":
          return (
            <div style={{ ...baseStyle, textAlign: "center" }}>
              <div style={{ display: "inline-flex", gap: "15px", alignItems: "center" }}>
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((platform) => (
                  <motion.a
                    key={platform}
                    href="#"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: globalSettings.colorPalette.gradient,
                      color: "#FFFFFF",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "bold",
                      ...glassStyle,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}>
                    {platform[0]}
                  </motion.a>
                ))}
              </div>
            </div>
          );
        case "footer":
          return <div style={baseStyle}>{content}</div>;
        case "columns":
          return (
            <div
              style={{ ...paddingStyle, display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div
                style={{
                  flex: 1,
                  minWidth: "200px",
                  ...glassStyle,
                  padding: "20px",
                  borderRadius: `${globalSettings.borderRadius}px`,
                }}>
                {content}
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: "200px",
                  ...glassStyle,
                  padding: "20px",
                  borderRadius: `${globalSettings.borderRadius}px`,
                }}>
                {content}
              </div>
            </div>
          );
        default:
          return <div style={baseStyle}>{content}</div>;
      }
    })()

    return <div data-block-id={block.id}>{blockElement}</div>;
  }

  const renderBlockEditor = () => {
    if (!selectedBlock) {
      return (
        <motion.div
          className="flex items-center justify-center h-64 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <div className="text-center glass-card p-8 rounded-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
              <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            </motion.div>
            <p className="text-lg font-medium">Select a block to edit</p>
            <p className="text-sm opacity-70 mt-2">Click on any block in the preview to start editing</p>
          </div>
        </motion.div>
      );
    }

    const block = blocks.find((b) => b.id === selectedBlock)
    if (!block) return null

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor:
                  BLOCK_TYPES.CONTENT.find((b) => b.id === block.type)?.color ||
                  BLOCK_TYPES.MEDIA.find((b) => b.id === block.type)?.color ||
                  BLOCK_TYPES.INTERACTIVE.find((b) => b.id === block.type)?.color ||
                  BLOCK_TYPES.LAYOUT.find((b) => b.id === block.type)?.color ||
                  BLOCK_TYPES.ECOMMERCE.find((b) => b.id === block.type)?.color ||
                  BLOCK_TYPES.SPECIAL.find((b) => b.id === block.type)?.color ||
                  "#6B7280",
              }} />
            <h3 className="text-lg font-semibold capitalize">{block.type} Block</h3>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => duplicateBlock(block.id)}
                className="glass-button">
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteBlock(block.id)}
                className="glass-button text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Animation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}>
              {(block.type === "text" ||
                block.type === "heading" ||
                block.type === "hero" ||
                block.type === "quote") && (
                <div className="glass-card p-4 rounded-xl">
                  <Label htmlFor="content" className="flex items-center gap-2 mb-2">
                    <Type className="h-4 w-4" />
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    rows={4}
                    className="glass-input"
                    placeholder="Enter your content here..." />
                </div>
              )}

              {block.type === "button" && (
                <div className="glass-card p-4 rounded-xl">
                  <Label htmlFor="button-text" className="flex items-center gap-2 mb-2">
                    <Square className="h-4 w-4" />
                    Button Text
                  </Label>
                  <Input
                    id="button-text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="glass-input"
                    placeholder="Enter button text..." />
                </div>
              )}

              {block.type === "image" && (
                <div className="glass-card p-4 rounded-xl">
                  <Label htmlFor="image-url" className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4" />
                    Image URL
                  </Label>
                  <Input
                    id="image-url"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="glass-input"
                    placeholder="https://example.com/image.jpg" />
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <Label className="flex items-center gap-2 mb-2">
                    <Type className="h-4 w-4" />
                    Font Size
                  </Label>
                  <Slider
                    value={[block.style.fontSize || 16]}
                    onValueChange={([value]) =>
                      updateBlock(block.id, {
                        style: { ...block.style, fontSize: value },
                      })
                    }
                    min={10}
                    max={72}
                    step={1}
                    className="glass-slider" />
                  <span className="text-sm text-gray-500 mt-1 block">{block.style.fontSize || 16}px</span>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <Label className="flex items-center gap-2 mb-2">
                    <PaintBucket className="h-4 w-4" />
                    Text Color
                  </Label>
                  <Input
                    type="color"
                    value={block.style.color || "#000000"}
                    onChange={(e) =>
                      updateBlock(block.id, {
                        style: { ...block.style, color: e.target.value },
                      })
                    }
                    className="glass-input h-12" />
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <Label className="flex items-center gap-2 mb-3">
                  <AlignCenter className="h-4 w-4" />
                  Text Alignment
                </Label>
                <ToggleGroup
                  type="single"
                  value={block.style.textAlign || "left"}
                  onValueChange={(value) =>
                    value &&
                    updateBlock(block.id, {
                      style: { ...block.style, textAlign: value },
                    })
                  }
                  className="justify-start">
                  <ToggleGroupItem value="left" className="glass-button">
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" className="glass-button">
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" className="glass-button">
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <Label className="flex items-center gap-2 mb-2">
                  <Wand2 className="h-4 w-4" />
                  Font Weight
                </Label>
                <Select
                  value={block.style.fontWeight || "normal"}
                  onValueChange={(value) =>
                    updateBlock(block.id, {
                      style: { ...block.style, fontWeight: value },
                    })
                  }>
                  <SelectTrigger className="glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semi Bold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="800">Extra Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(block.type === "hero" || block.type === "button" || block.type === "footer") && (
                <div className="glass-card p-4 rounded-xl">
                  <Label className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4" />
                    Background
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="color"
                      value={
                        block.style.backgroundColor?.includes("gradient")
                          ? globalSettings.colorPalette.primary
                          : block.style.backgroundColor || "#FFFFFF"
                      }
                      onChange={(e) =>
                        updateBlock(block.id, {
                          style: { ...block.style, backgroundColor: e.target.value },
                        })
                      }
                      className="glass-input h-12" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateBlock(block.id, {
                          style: { ...block.style, backgroundColor: globalSettings.colorPalette.gradient },
                        })
                      }
                      className="glass-button w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Gradient
                    </Button>
                  </div>
                </div>
              )}

              {(block.type === "button" || block.type === "image" || block.type === "hero") && (
                <div className="glass-card p-4 rounded-xl">
                  <Label className="flex items-center gap-2 mb-2">
                    <Diamond className="h-4 w-4" />
                    Border Radius
                  </Label>
                  <Slider
                    value={[block.style.borderRadius || 0]}
                    onValueChange={([value]) =>
                      updateBlock(block.id, {
                        style: { ...block.style, borderRadius: value },
                      })
                    }
                    min={0}
                    max={50}
                    step={1}
                    className="glass-slider" />
                  <span className="text-sm text-gray-500 mt-1 block">{block.style.borderRadius || 0}px</span>
                </div>
              )}

              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Glassmorphism Effect
                  </Label>
                  <Switch
                    checked={block.style.glassmorphism || false}
                    onCheckedChange={(checked) =>
                      updateBlock(block.id, {
                        style: { ...block.style, glassmorphism: checked },
                      })
                    } />
                </div>
                <p className="text-xs text-gray-500">Add a modern glass effect to this block</p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["top", "bottom", "left", "right"].map((side) => (
                  <div key={side} className="glass-card p-4 rounded-xl">
                    <Label className="flex items-center gap-2 mb-2 capitalize">
                      <Layout className="h-4 w-4" />
                      Padding {side}
                    </Label>
                    <Slider
                      value={[block.style.padding?.[side] || 0]}
                      onValueChange={([value]) =>
                        updateBlock(block.id, {
                          style: {
                            ...block.style,
                            padding: { ...block.style.padding, [side]: value },
                          },
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                      className="glass-slider" />
                    <span className="text-sm text-gray-500 mt-1 block">{block.style.padding?.[side] || 0}px</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="animation" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="space-y-4">
              <div className="glass-card p-4 rounded-xl">
                <Label className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4" />
                  Animation Type
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ANIMATION_PRESETS.map((animation) => {
                    const Icon = animation.icon
                    return (
                      <motion.button
                        key={animation.id}
                        className={`glass-button p-3 rounded-lg flex items-center gap-2 text-sm ${
                          block.style.animation === animation.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() =>
                          updateBlock(block.id, {
                            style: { ...block.style, animation: animation.id },
                          })
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <Icon className="h-4 w-4" />
                        {animation.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
    }
  }

  const generateHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ${globalSettings.fontFamily}; 
            background: ${globalSettings.backgroundColor}; 
            line-height: 1.6; 
        }
        .email-container { 
            max-width: ${globalSettings.maxWidth}px; 
            margin: 0 auto; 
            background: #FFFFFF; 
            border-radius: ${globalSettings.borderRadius}px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        @media (max-width: 600px) {
            .email-container { margin: 10px; }
            .mobile-padding { padding-left: 15px !important; padding-right: 15px !important; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${blocks
          .map((block) => {
            const style = block.style
            const paddingStyle = `padding: ${style.padding?.top || 0}px ${style.padding?.right || 0}px ${style.padding?.bottom || 0}px ${style.padding?.left || 0}px;`
            const baseStyle = `
            font-size: ${style.fontSize || 16}px;
            font-weight: ${style.fontWeight || "normal"};
            text-align: ${style.textAlign || "left"};
            color: ${style.color || "#000000"};
            background: ${style.backgroundColor || "transparent"};
            border-radius: ${style.borderRadius || 0}px;
            ${paddingStyle}
            ${style.glassmorphism ? "background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);" : ""}
          `

            switch (block.type) {
              case "hero":
                return `<div style="${baseStyle}"><h1 style="margin: 0; font-size: ${style.fontSize}px; font-weight: ${style.fontWeight}; color: ${style.color};">${block.content}</h1></div>`
              case "text":
                return `<div style="${baseStyle}">${block.content.replace(/\n/g, "<br>")}</div>`;
              case "heading":
                return `<h2 style="${baseStyle}">${block.content}</h2>`
              case "button":
                return `<div style="text-align: ${style.textAlign || "center"}; ${paddingStyle}">
                <a href="#" style="display: inline-block; ${baseStyle} text-decoration: none; cursor: pointer;">${block.content}</a>
              </div>`
              case "image":
                return `<div style="${paddingStyle}"><img src="${block.content}" alt="Email content" style="width: 100%; height: auto; border-radius: ${style.borderRadius || 0}px; display: block;"></div>`
              default:
                return `<div style="${baseStyle}">${block.content}</div>`
            }
          })
          .join("")}
    </div>
</body>
</html>`
    return html
  }

  const exportHTML = () => {
    const html = generateHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-template.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (viewMode === "code") {
      setHtmlCode(generateHTML())
    }
  }, [blocks, viewMode, globalSettings])

  return (
    <div
      className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Left Sidebar - Block Library */}
      <motion.div
        className="w-80 glass-panel border-r border-white/20 flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <div className="p-6 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}>
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h2
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Email Builder
                </h2>
                <p className="text-sm text-gray-500">Drag & Drop Components</p>
              </div>
            </div>

            {/* Global Settings */}
            <Card className="glass-card border-0 mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Template Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs flex items-center gap-2 mb-2">
                    <Palette className="h-3 w-3" />
                    Color Palette
                  </Label>
                  <Select
                    value={globalSettings.colorPalette.name}
                    onValueChange={(value) => {
                      const palette = COLOR_PALETTES.find((p) => p.name === value)
                      if (palette) {
                        setGlobalSettings((prev) => ({ ...prev, colorPalette: palette }))
                      }
                    }}>
                    <SelectTrigger className="h-8 glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {COLOR_PALETTES.map((palette) => (
                        <SelectItem key={palette.name} value={palette.name}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: palette.gradient }} />
                            {palette.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs flex items-center gap-2 mb-2">
                    <Diamond className="h-3 w-3" />
                    Template Style
                  </Label>
                  <Select
                    value={globalSettings.templateStyle}
                    onValueChange={(value) => setGlobalSettings((prev) => ({ ...prev, templateStyle: value }))}>
                    <SelectTrigger className="h-8 glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {TEMPLATE_STYLES.map((style) => {
                        const Icon = style.icon
                        return (
                          <SelectItem key={style.id} value={style.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-3 w-3" />
                              {style.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    Animations
                  </Label>
                  <Switch
                    checked={globalSettings.animations}
                    onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, animations: checked }))} />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportHTML}
                  className="glass-button w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={playAnimations}
                  className="glass-button bg-transparent">
                  <Play className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="glass-button bg-transparent">
                  <Undo className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="glass-button">
                  <Redo className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="space-y-6">
            {Object.entries(BLOCK_TYPES).map(([category, blockTypes], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * categoryIndex }}>
                <h3
                  className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  {category.replace("_", " ")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {blockTypes.map((blockType, index) => {
                    const Icon = blockType.icon
                    return (
                      <motion.button
                        key={blockType.id}
                        className="glass-card hover:glass-card-hover p-3 flex flex-col items-center gap-2 transition-all duration-300 group border-0"
                        onClick={() => addBlock(blockType.id)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                          style={{ background: blockType.color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-center">{blockType.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      {/* Center - Email Structure */}
      <motion.div
        className="w-80 glass-panel border-r border-white/20 flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Email Structure
            </h3>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Badge variant="secondary" className="glass-badge">
                {blocks.length} blocks
              </Badge>
            </motion.div>
          </div>

          <div className="flex gap-2 mb-4">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="visual" size="sm" className="glass-button">
                <Eye className="h-4 w-4 mr-1" />
                Visual
              </ToggleGroupItem>
              <ToggleGroupItem value="code" size="sm" className="glass-button">
                <Code className="h-4 w-4 mr-1" />
                Code
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {viewMode === "visual" ? (
            <div className="space-y-2">
              <AnimatePresence>
                {blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    className={`glass-card p-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                      selectedBlock === block.id ? "ring-2 ring-blue-500 glass-card-selected" : "hover:glass-card-hover"
                    }`}
                    onClick={() => setSelectedBlock(block.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    layout>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            background:
                              BLOCK_TYPES.CONTENT.find((b) => b.id === block.type)?.color ||
                              BLOCK_TYPES.MEDIA.find((b) => b.id === block.type)?.color ||
                              BLOCK_TYPES.INTERACTIVE.find((b) => b.id === block.type)?.color ||
                              BLOCK_TYPES.LAYOUT.find((b) => b.id === block.type)?.color ||
                              BLOCK_TYPES.ECOMMERCE.find((b) => b.id === block.type)?.color ||
                              BLOCK_TYPES.SPECIAL.find((b) => b.id === block.type)?.color ||
                              "#6B7280",
                          }} />
                        <div>
                          <span className="text-sm font-medium capitalize">{block.type}</span>
                          {block.style.animation && (
                            <div className="flex items-center gap-1 mt-1">
                              <Zap className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-500 capitalize">{block.style.animation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 glass-button-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveBlock(block.id, "up")
                          }}
                          disabled={index === 0}>
                          <Move className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 glass-button-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveBlock(block.id, "down")
                          }}
                          disabled={index === blocks.length - 1}>
                          <Move className="h-3 w-3 rotate-180" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {typeof block.content === "string"
                        ? block.content.slice(0, 50) + (block.content.length > 50 ? "..." : "")
                        : "Block content"}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl">
                <Label className="flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4" />
                  HTML Code
                </Label>
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  rows={20}
                  className="glass-input font-mono text-xs"
                  placeholder="HTML code will appear here..." />
              </div>
              <Button
                onClick={() => {
                  // Parse and update blocks from HTML code
                  // This would require HTML parsing logic
                }}
                className="glass-button w-full">
                <Check className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          )}
        </div>

        <div
          className="p-4 border-t border-white/10 max-h-96 overflow-y-auto scrollbar-thin">
          {renderBlockEditor()}
        </div>
      </motion.div>
      {/* Right - Preview */}
      <motion.div
        className="flex-1 flex flex-col glass-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Live Preview
            </h3>
            <div className="flex items-center gap-3">
              <ToggleGroup
                type="single"
                value={previewMode}
                onValueChange={(value) => value && setPreviewMode(value)}>
                <ToggleGroupItem value="desktop" size="sm" className="glass-button">
                  <Monitor className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="tablet" size="sm" className="glass-button">
                  <Tablet className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile" size="sm" className="glass-button">
                  <Smartphone className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <Separator orientation="vertical" className="h-6" />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={playAnimations}
                  disabled={isAnimating}
                  className="glass-button">
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <div
          className="flex-1 overflow-auto p-8"
          style={{ background: globalSettings.backgroundColor }}>
          <div className="flex justify-center">
            <motion.div
              ref={previewRef}
              className="bg-white shadow-2xl transition-all duration-500 overflow-hidden"
              style={{
                width: getPreviewWidth(),
                maxWidth: `${globalSettings.maxWidth}px`,
                fontFamily: globalSettings.fontFamily,
                borderRadius: `${globalSettings.borderRadius}px`,
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <AnimatePresence>
                {blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    className={`relative group transition-all duration-300 ${
                      selectedBlock === block.id ? "ring-2 ring-blue-500 ring-inset" : ""
                    }`}
                    onClick={() => setSelectedBlock(block.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}>
                    {renderBlock(block)}
                    {selectedBlock === block.id && (
                      <motion.div
                        className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateBlock(block.id)
                          }}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-100 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteBlock(block.id)
                          }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {blocks.length === 0 && (
                <motion.div
                  className="flex items-center justify-center h-64 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}>
                  <div className="text-center">
                    <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Start Building Your Email</p>
                    <p className="text-sm mt-2">Add blocks from the left panel to get started</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default EmailTemplateBuilder
export { EmailTemplateBuilder }
