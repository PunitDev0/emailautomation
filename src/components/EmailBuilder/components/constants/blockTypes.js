import {
    Type, ImageIcon, Square, Minus, Space, Columns, Share2, FootprintsIcon, Star, AlignLeft,
    AlignCenter, AlignRight, Monitor, Tablet, Smartphone, Trash2, Copy, Download, Move, Edit3,
    Code, Eye, Palette, Layers, Zap, Sparkles, Mail, Undo, Redo, Settings, Play, Pause, RotateCcw,
    Grid, Layout, PaintBucket, Wand2, Maximize, Minimize, ChevronDown, ChevronRight, Check, Clock,
    Heart, ShoppingCart, Megaphone, TrendingUp, Crown, Diamond, Video, DollarSign, Tag, Package,
    MessageCircle, Moon
  } from "lucide-react";
  
  export const BLOCK_TYPES = {
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
      { id: "footer", name: "Footer", icon: FootprintsIcon, description: "Email footer section", color: "#6B7280" },
      { id: "header", name: "Header", icon: Crown, description: "Email header section", color: "#3B82F6" },
      { id: "newsletter", name: "Newsletter", icon: Mail, description: "Newsletter signup", color: "#10B981" },
      { id: "announcement", name: "Announcement", icon: Megaphone, description: "Important announcements", color: "#F59E0B" },
    ],
  };