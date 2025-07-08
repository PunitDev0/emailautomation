"use client"

import { useState, useEffect } from "react"
import {
  X,
  Save,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Palette,
  Layout,
  Type,
  Zap,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast} from "sonner"

const colorPresets = [
  "#000000",
  "#ffffff",
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#1f2937",
  "#dc2626",
  "#059669",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#ea580c",
]

const fontFamilies = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
]



export default function PropertyPanel({
  block,
  onUpdateBlock,
  onClose,
  onDuplicate,
  onDelete,
  onMove,
  isMobile,
}) {
  const [activeTab, setActiveTab] = useState("content")
  const [activeDevice, setActiveDevice] = useState("desktop")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [localBlock, setLocalBlock] = useState(block)
  const [showAdvanced, setShowAdvanced] = useState(false)


  useEffect(() => {
    setLocalBlock(block)
    setHasUnsavedChanges(false)
  }, [block])

  if (!block) return null

  const updateLocalBlock = (updates) => {
    setLocalBlock((prev) => ({ ...prev, ...updates }))
    setHasUnsavedChanges(true)
  }

  const saveChanges = () => {
    onUpdateBlock(block.id, localBlock)
    setHasUnsavedChanges(false)
    toast({
      title: "Changes Saved! ✅",
      description: "Your element has been updated successfully.",
      duration: 2000,
    })
  }

  const updateStyle = (property, value) => {
    const currentStyles = localBlock.styles || {}
    updateLocalBlock({
      styles: { ...currentStyles, [property]: value },
    })
  }

  const updateResponsiveStyle = (device, property, value) => {
    const currentResponsive = localBlock.responsive || {}
    const deviceStyles = currentResponsive[device] || {}

    updateLocalBlock({
      responsive: {
        ...currentResponsive,
        [device]: { ...deviceStyles, [property]: value },
      },
    })
  }

  const updateContent = (property, value) => {
    const currentContent = localBlock.content || {}
    updateLocalBlock({
      content: { ...currentContent, [property]: value },
    })
  }

  const getBlockDisplayName = (type) => {
    const names = {
      text: "Text Element",
      image: "Image Element",
      button: "Button Element",
      social: "Social Media",
      divider: "Divider Line",
      spacer: "Spacer",
      columns: "Columns Layout",
      video: "Video Element",
      countdown: "Countdown Timer",
      survey: "Survey Element",
      form: "Contact Form",
      map: "Map Element",
      chart: "Chart Element",
      testimonial: "Testimonial",
      pricing: "Pricing Table",
      gallery: "Image Gallery",
      qr: "QR Code",
      calendar: "Calendar Event",
    }
    return names[type] || type
  }

  const renderContentControls = () => {
    switch (localBlock.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label>Text Content</Label>
              <Textarea
                className="min-h-[120px] resize-none mt-1"
                value={localBlock.content.text || ""}
                onChange={(e) => updateContent("text", e.target.value)}
                placeholder="Enter your text here..."
              />
            </div>
            <div>
              <Label>HTML Tag</Label>
              <Select value={localBlock.content.tag || "p"} onValueChange={(value) => updateContent("tag", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1 (H1)</SelectItem>
                  <SelectItem value="h2">Heading 2 (H2)</SelectItem>
                  <SelectItem value="h3">Heading 3 (H3)</SelectItem>
                  <SelectItem value="h4">Heading 4 (H4)</SelectItem>
                  <SelectItem value="h5">Heading 5 (H5)</SelectItem>
                  <SelectItem value="h6">Heading 6 (H6)</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="span">Span</SelectItem>
                  <SelectItem value="div">Div</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Link URL (Optional)</Label>
              <Input
                value={localBlock.content.href || ""}
                onChange={(e) => updateContent("href", e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            {localBlock.content.href && (
              <div>
                <Label>Link Target</Label>
                <Select
                  value={localBlock.content.target || "_blank"}
                  onValueChange={(value) => updateContent("target", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_blank">New Tab</SelectItem>
                    <SelectItem value="_self">Same Tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={localBlock.content.src || ""}
                onChange={(e) => updateContent("src", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={localBlock.content.alt || ""}
                onChange={(e) => updateContent("alt", e.target.value)}
                placeholder="Describe the image for accessibility"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  type="number"
                  value={localBlock.content.width || ""}
                  onChange={(e) => updateContent("width", e.target.value ? Number(e.target.value) : "")}
                  placeholder="Auto"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Height</Label>
                <Input
                  type="number"
                  value={localBlock.content.height || ""}
                  onChange={(e) => updateContent("height", e.target.value ? Number(e.target.value) : "")}
                  placeholder="Auto"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Link URL (Optional)</Label>
              <Input
                value={localBlock.content.href || ""}
                onChange={(e) => updateContent("href", e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={localBlock.content.responsive || false}
                onCheckedChange={(checked) => updateContent("responsive", checked)}
              />
              <Label>Responsive Image</Label>
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={localBlock.content.text || ""}
                onChange={(e) => updateContent("text", e.target.value)}
                placeholder="Click Me"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input
                value={localBlock.content.href || ""}
                onChange={(e) => updateContent("href", e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Link Target</Label>
              <Select
                value={localBlock.content.target || "_blank"}
                onValueChange={(value) => updateContent("target", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_blank">New Tab</SelectItem>
                  <SelectItem value="_self">Same Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Button Style</Label>
              <Select
                value={localBlock.content.style || "primary"}
                onValueChange={(value) => updateContent("style", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Button Size</Label>
              <Select
                value={localBlock.content.size || "medium"}
                onValueChange={(value) => updateContent("size", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "spacer":
        return (
          <div className="space-y-4">
            <div>
              <Label>Height: {localBlock.content.height || 40}px</Label>
              <Slider
                value={[localBlock.content.height || 40]}
                onValueChange={([value]) => updateContent("height", value)}
                min={10}
                max={200}
                step={5}
                className="mt-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={localBlock.content.showInEditor || false}
                onCheckedChange={(checked) => updateContent("showInEditor", checked)}
              />
              <Label>Show in Editor</Label>
            </div>
          </div>
        )

      case "divider":
        return (
          <div className="space-y-4">
            <div>
              <Label>Divider Style</Label>
              <Select
                value={localBlock.content.style || "solid"}
                onValueChange={(value) => updateContent("style", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Thickness: {localBlock.content.thickness || 1}px</Label>
              <Slider
                value={[localBlock.content.thickness || 1]}
                onValueChange={([value]) => updateContent("thickness", value)}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={localBlock.content.color || "#e5e7eb"}
                onChange={(e) => updateContent("color", e.target.value)}
                className="w-full h-10 mt-1"
              />
            </div>
            <div>
              <Label>Width: {localBlock.content.width || 100}%</Label>
              <Slider
                value={[localBlock.content.width || 100]}
                onValueChange={([value]) => updateContent("width", value)}
                min={10}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        )

      case "social":
        return (
          <div className="space-y-4">
            <div>
              <Label>Social Platforms</Label>
              <div className="space-y-2 mt-2">
                {(localBlock.content.platforms || []).map((platform, index) => (
                  <div key={platform.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Switch
                      checked={platform.enabled}
                      onCheckedChange={(checked) => {
                        const platforms = [...(localBlock.content.platforms || [])]
                        platforms[index] = { ...platform, enabled: checked }
                        updateContent("platforms", platforms)
                      }}
                    />
                    <span className="flex-1 capitalize">{platform.name}</span>
                    <Input
                      value={platform.url}
                      onChange={(e) => {
                        const platforms = [...(localBlock.content.platforms || [])]
                        platforms[index] = { ...platform, url: e.target.value }
                        updateContent("platforms", platforms)
                      }}
                      placeholder={`${platform.name} URL`}
                      className="flex-2"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Icon Size: {localBlock.content.iconSize || 40}px</Label>
              <Slider
                value={[localBlock.content.iconSize || 40]}
                onValueChange={([value]) => updateContent("iconSize", value)}
                min={20}
                max={80}
                step={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Icon Spacing: {localBlock.content.iconSpacing || 12}px</Label>
              <Slider
                value={[localBlock.content.iconSpacing || 12]}
                onValueChange={([value]) => updateContent("iconSpacing", value)}
                min={5}
                max={30}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )

      case "form":
        return (
          <div className="space-y-4">
            <div>
              <Label>Form Title</Label>
              <Input
                value={localBlock.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Contact Us"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Form Subtitle</Label>
              <Input
                value={localBlock.content.subtitle || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                placeholder="We'd love to hear from you"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={localBlock.content.buttonText || ""}
                onChange={(e) => updateContent("buttonText", e.target.value)}
                placeholder="Send Message"
                className="mt-1"
              />
            </div>
          </div>
        )

      case "testimonial":
        return (
          <div className="space-y-4">
            <div>
              <Label>Quote</Label>
              <Textarea
                value={localBlock.content.quote || ""}
                onChange={(e) => updateContent("quote", e.target.value)}
                placeholder="Enter testimonial quote..."
                className="min-h-[100px] mt-1"
              />
            </div>
            <div>
              <Label>Author Name</Label>
              <Input
                value={localBlock.content.author || ""}
                onChange={(e) => updateContent("author", e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Author Title</Label>
              <Input
                value={localBlock.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="CEO, Company"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Avatar URL</Label>
              <Input
                value={localBlock.content.avatar || ""}
                onChange={(e) => updateContent("avatar", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Rating: {localBlock.content.rating || 5}</Label>
              <Slider
                value={[localBlock.content.rating || 5]}
                onValueChange={([value]) => updateContent("rating", value)}
                min={1}
                max={5}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-4">
            <div>
              <Label>Gallery Layout</Label>
              <Select
                value={localBlock.content.layout || "grid"}
                onValueChange={(value) => updateContent("layout", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Columns: {localBlock.content.columns || 3}</Label>
              <Slider
                value={[localBlock.content.columns || 3]}
                onValueChange={([value]) => updateContent("columns", value)}
                min={1}
                max={6}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={localBlock.content.showCaptions || true}
                onCheckedChange={(checked) => updateContent("showCaptions", checked)}
              />
              <Label>Show Captions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={localBlock.content.enableLightbox || true}
                onCheckedChange={(checked) => updateContent("enableLightbox", checked)}
              />
              <Label>Enable Lightbox</Label>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>No content settings available for this element type.</p>
          </div>
        )
    }
  }

  const renderStyleControls = () => {
    const styles = localBlock.styles || {}
    const responsiveStyles = localBlock.responsive?.[activeDevice] || {}
    const currentStyles = { ...styles, ...responsiveStyles }

    return (
      <div className="space-y-6">
        {/* Device Selector */}
        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
          <Button
            size="sm"
            variant={activeDevice === "desktop" ? "default" : "ghost"}
            onClick={() => setActiveDevice("desktop")}
            className="flex-1"
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={activeDevice === "tablet" ? "default" : "ghost"}
            onClick={() => setActiveDevice("tablet")}
            className="flex-1"
          >
            <Tablet className="w-4 h-4 mr-1" />
            Tablet
          </Button>
          <Button
            size="sm"
            variant={activeDevice === "mobile" ? "default" : "ghost"}
            onClick={() => setActiveDevice("mobile")}
            className="flex-1"
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </div>

        {/* Typography Controls */}
        {(localBlock.type === "text" || localBlock.type === "button") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Font Family</Label>
                <Select
                  value={currentStyles.fontFamily || "Arial, sans-serif"}
                  onValueChange={(value) =>
                    activeDevice === "desktop"
                      ? updateStyle("fontFamily", value)
                      : updateResponsiveStyle(activeDevice, "fontFamily", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Size: {currentStyles.fontSize || 16}px</Label>
                  <Slider
                    value={[currentStyles.fontSize || 16]}
                    onValueChange={([value]) =>
                      activeDevice === "desktop"
                        ? updateStyle("fontSize", value)
                        : updateResponsiveStyle(activeDevice, "fontSize", value)
                    }
                    min={8}
                    max={72}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Line Height: {currentStyles.lineHeight || 1.5}</Label>
                  <Slider
                    value={[currentStyles.lineHeight || 1.5]}
                    onValueChange={([value]) =>
                      activeDevice === "desktop"
                        ? updateStyle("lineHeight", value)
                        : updateResponsiveStyle(activeDevice, "lineHeight", value)
                    }
                    min={1}
                    max={3}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="color"
                    value={currentStyles.color || "#333333"}
                    onChange={(e) =>
                      activeDevice === "desktop"
                        ? updateStyle("color", e.target.value)
                        : updateResponsiveStyle(activeDevice, "color", e.target.value)
                    }
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input
                    value={currentStyles.color || "#333333"}
                    onChange={(e) =>
                      activeDevice === "desktop"
                        ? updateStyle("color", e.target.value)
                        : updateResponsiveStyle(activeDevice, "color", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        activeDevice === "desktop"
                          ? updateStyle("color", color)
                          : updateResponsiveStyle(activeDevice, "color", color)
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentStyles.fontWeight === "bold"}
                    onCheckedChange={(checked) =>
                      activeDevice === "desktop"
                        ? updateStyle("fontWeight", checked ? "bold" : "normal")
                        : updateResponsiveStyle(activeDevice, "fontWeight", checked ? "bold" : "normal")
                    }
                  />
                  <Label className="text-sm">Bold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentStyles.fontStyle === "italic"}
                    onCheckedChange={(checked) =>
                      activeDevice === "desktop"
                        ? updateStyle("fontStyle", checked ? "italic" : "normal")
                        : updateResponsiveStyle(activeDevice, "fontStyle", checked ? "italic" : "normal")
                    }
                  />
                  <Label className="text-sm">Italic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={currentStyles.textDecoration === "underline"}
                    onCheckedChange={(checked) =>
                      activeDevice === "desktop"
                        ? updateStyle("textDecoration", checked ? "underline" : "none")
                        : updateResponsiveStyle(activeDevice, "textDecoration", checked ? "underline" : "none")
                    }
                  />
                  <Label className="text-sm">Underline</Label>
                </div>
              </div>

              {localBlock.type === "text" && (
                <div>
                  <Label>Text Alignment</Label>
                  <Select
                    value={currentStyles.textAlign || "left"}
                    onValueChange={(value) =>
                      activeDevice === "desktop"
                        ? updateStyle("textAlign", value)
                        : updateResponsiveStyle(activeDevice, "textAlign", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Background & Border */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Background & Border
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="color"
                  value={currentStyles.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    activeDevice === "desktop"
                      ? updateStyle("backgroundColor", e.target.value)
                      : updateResponsiveStyle(activeDevice, "backgroundColor", e.target.value)
                  }
                  className="w-12 h-8 p-0 border-0"
                />
                <Input
                  value={currentStyles.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    activeDevice === "desktop"
                      ? updateStyle("backgroundColor", e.target.value)
                      : updateResponsiveStyle(activeDevice, "backgroundColor", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      activeDevice === "desktop"
                        ? updateStyle("backgroundColor", color)
                        : updateResponsiveStyle(activeDevice, "backgroundColor", color)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Border Width: {currentStyles.borderWidth || 0}px</Label>
                <Slider
                  value={[currentStyles.borderWidth || 0]}
                  onValueChange={([value]) =>
                    activeDevice === "desktop"
                      ? updateStyle("borderWidth", value)
                      : updateResponsiveStyle(activeDevice, "borderWidth", value)
                  }
                  min={0}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Border Radius: {currentStyles.borderRadius || 0}px</Label>
                <Slider
                  value={[currentStyles.borderRadius || 0]}
                  onValueChange={([value]) =>
                    activeDevice === "desktop"
                      ? updateStyle("borderRadius", value)
                      : updateResponsiveStyle(activeDevice, "borderRadius", value)
                  }
                  min={0}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {currentStyles.borderWidth > 0 && (
              <div>
                <Label>Border Color</Label>
                <Input
                  type="color"
                  value={currentStyles.borderColor || "#e5e7eb"}
                  onChange={(e) =>
                    activeDevice === "desktop"
                      ? updateStyle("borderColor", e.target.value)
                      : updateResponsiveStyle(activeDevice, "borderColor", e.target.value)
                  }
                  className="w-full h-10 mt-1"
                />
              </div>
            )}

            <div>
              <Label>Box Shadow</Label>
              <Select
                value={currentStyles.boxShadow || "none"}
                onValueChange={(value) =>
                  activeDevice === "desktop"
                    ? updateStyle("boxShadow", value === "none" ? "none" : value)
                    : updateResponsiveStyle(activeDevice, "boxShadow", value === "none" ? "none" : value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="0 1px 3px rgba(0,0,0,0.1)">Small</SelectItem>
                  <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">Medium</SelectItem>
                  <SelectItem value="0 10px 15px rgba(0,0,0,0.1)">Large</SelectItem>
                  <SelectItem value="0 20px 25px rgba(0,0,0,0.1)">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Layout className="w-4 h-4 mr-2" />
              Spacing & Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Padding</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    value={currentStyles.padding?.top || 16}
                    onChange={(e) => {
                      const padding = currentStyles.padding || {}
                      const newPadding = { ...padding, top: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("padding", newPadding)
                        : updateResponsiveStyle(activeDevice, "padding", newPadding)
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    value={currentStyles.padding?.right || 16}
                    onChange={(e) => {
                      const padding = currentStyles.padding || {}
                      const newPadding = { ...padding, right: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("padding", newPadding)
                        : updateResponsiveStyle(activeDevice, "padding", newPadding)
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    value={currentStyles.padding?.bottom || 16}
                    onChange={(e) => {
                      const padding = currentStyles.padding || {}
                      const newPadding = { ...padding, bottom: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("padding", newPadding)
                        : updateResponsiveStyle(activeDevice, "padding", newPadding)
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    value={currentStyles.padding?.left || 16}
                    onChange={(e) => {
                      const padding = currentStyles.padding || {}
                      const newPadding = { ...padding, left: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("padding", newPadding)
                        : updateResponsiveStyle(activeDevice, "padding", newPadding)
                    }}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Margin</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    value={currentStyles.margin?.top || 0}
                    onChange={(e) => {
                      const margin = currentStyles.margin || {}
                      const newMargin = { ...margin, top: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("margin", newMargin)
                        : updateResponsiveStyle(activeDevice, "margin", newMargin)
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    value={currentStyles.margin?.right || 0}
                    onChange={(e) => {
                      const margin = currentStyles.margin || {}
                      const newMargin = { ...margin, right: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("margin", newMargin)
                        : updateResponsiveStyle(activeDevice, "margin", newMargin)
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    value={currentStyles.margin?.bottom || 16}
                    onChange={(e) => {
                      const margin = currentStyles.margin || {}
                      const newMargin = { ...margin, bottom: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("margin", newMargin)
                        : updateResponsiveStyle(activeDevice, "margin", newMargin)
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    value={currentStyles.margin?.left || 0}
                    onChange={(e) => {
                      const margin = currentStyles.margin || {}
                      const newMargin = { ...margin, left: Number(e.target.value) }
                      activeDevice === "desktop"
                        ? updateStyle("margin", newMargin)
                        : updateResponsiveStyle(activeDevice, "margin", newMargin)
                    }}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Display</Label>
              <Select
                value={currentStyles.display || "block"}
                onValueChange={(value) =>
                  activeDevice === "desktop"
                    ? updateStyle("display", value)
                    : updateResponsiveStyle(activeDevice, "display", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="none">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Width</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="number"
                  value={currentStyles.width || ""}
                  onChange={(e) =>
                    activeDevice === "desktop"
                      ? updateStyle("width", e.target.value ? Number(e.target.value) : "auto")
                      : updateResponsiveStyle(activeDevice, "width", e.target.value ? Number(e.target.value) : "auto")
                  }
                  placeholder="Auto"
                  className="flex-1"
                />
                <Select
                  value={currentStyles.widthUnit || "px"}
                  onValueChange={(value) =>
                    activeDevice === "desktop"
                      ? updateStyle("widthUnit", value)
                      : updateResponsiveStyle(activeDevice, "widthUnit", value)
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="auto">auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Advanced
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Opacity: {Math.round((currentStyles.opacity || 1) * 100)}%</Label>
              <Slider
                value={[(currentStyles.opacity || 1) * 100]}
                onValueChange={([value]) =>
                  activeDevice === "desktop"
                    ? updateStyle("opacity", value / 100)
                    : updateResponsiveStyle(activeDevice, "opacity", value / 100)
                }
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Z-Index</Label>
              <Input
                type="number"
                value={currentStyles.zIndex || ""}
                onChange={(e) =>
                  activeDevice === "desktop"
                    ? updateStyle("zIndex", e.target.value ? Number(e.target.value) : "auto")
                    : updateResponsiveStyle(activeDevice, "zIndex", e.target.value ? Number(e.target.value) : "auto")
                }
                placeholder="auto"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Custom CSS Class</Label>
              <Input
                value={currentStyles.className || ""}
                onChange={(e) =>
                  activeDevice === "desktop"
                    ? updateStyle("className", e.target.value)
                    : updateResponsiveStyle(activeDevice, "className", e.target.value)
                }
                placeholder="custom-class"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={currentStyles.overflow === "hidden"}
                onCheckedChange={(checked) =>
                  activeDevice === "desktop"
                    ? updateStyle("overflow", checked ? "hidden" : "visible")
                    : updateResponsiveStyle(activeDevice, "overflow", checked ? "hidden" : "visible")
                }
              />
              <Label>Hide Overflow</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Properties
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Customize your element</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Block Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {getBlockDisplayName(localBlock.type)}
            </Badge>
            <span className="text-xs text-gray-500">ID: {localBlock.id.slice(-8)}</span>
          </div>
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Unsaved
            </Badge>
          )}
        </div>
      </div>

      {/* Save Button */}
      {hasUnsavedChanges && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
          <Button onClick={saveChanges} className="w-full bg-orange-600 hover:bg-orange-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="content" className="mt-0">
              {renderContentControls()}
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              {renderStyleControls()}
            </TabsContent>

            <TabsContent value="actions" className="mt-0">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => onDuplicate?.(localBlock.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Element
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => onMove?.(localBlock.id, "up")}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Move Up
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => onMove?.(localBlock.id, "down")}
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Move Down
                </Button>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    onDelete?.(localBlock.id)
                    onClose()
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Element
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
