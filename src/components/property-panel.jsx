"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  X,
  Palette,
  Type,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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
]

const fontFamilies = [
  "Arial, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Helvetica, sans-serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
]

export default function PropertyPanel({ block, onUpdateBlock, onClose, isMobile }) {
  const [activeTab, setActiveTab] = useState("style")
  const [activeDevice, setActiveDevice] = useState("desktop")

  if (!block) return null

  const updateStyle = (property, value) => {
    const currentStyles = block.styles || {}
    onUpdateBlock(block.id, {
      styles: { ...currentStyles, [property]: value },
    })
  }

  const updateResponsiveStyle = (device, property, value) => {
    const currentResponsive = block.responsive || {}
    const deviceStyles = currentResponsive[device] || {}

    onUpdateBlock(block.id, {
      responsive: {
        ...currentResponsive,
        [device]: { ...deviceStyles, [property]: value },
      },
    })
  }

  const updateContent = (property, value) => {
    const currentContent = block.content || {}
    onUpdateBlock(block.id, {
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
    }
    return names[type] || type
  }

  const renderStyleControls = () => {
    const styles = block.styles || {}
    const responsiveStyles = block.responsive?.[activeDevice] || {}
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
        {(block.type === "text" || block.type === "button") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={currentStyles.fontFamily || "Arial, sans-serif"}
                  onValueChange={(value) =>
                    activeDevice === "desktop"
                      ? updateStyle("fontFamily", value)
                      : updateResponsiveStyle(activeDevice, "fontFamily", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font.split(",")[0]}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
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
                />
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center space-x-2">
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
                      className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400"
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

              {block.type === "text" && (
                <div className="space-y-2">
                  <Label>Text Alignment</Label>
                  <Select
                    value={currentStyles.textAlign || "left"}
                    onValueChange={(value) =>
                      activeDevice === "desktop"
                        ? updateStyle("textAlign", value)
                        : updateResponsiveStyle(activeDevice, "textAlign", value)
                    }
                  >
                    <SelectTrigger>
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
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2">
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
            </div>

            <div className="space-y-2">
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
              />
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Layout className="w-4 h-4 mr-2" />
              Spacing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Padding Top</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label>Padding Bottom</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label>Padding Left</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label>Padding Right</Label>
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
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContentControls = () => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text Content</Label>
              <textarea
                className="w-full p-3 border rounded-lg resize-none min-h-[100px]"
                value={block.content.text || ""}
                onChange={(e) => updateContent("text", e.target.value)}
                placeholder="Enter your text here..."
              />
            </div>
            <div className="space-y-2">
              <Label>HTML Tag</Label>
              <Select value={block.content.tag || "p"} onValueChange={(value) => updateContent("tag", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="span">Span</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={block.content.src || ""}
                onChange={(e) => updateContent("src", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={block.content.alt || ""}
                onChange={(e) => updateContent("alt", e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={block.content.width || ""}
                  onChange={(e) => updateContent("width", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={block.content.height || ""}
                  onChange={(e) => updateContent("height", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={block.content.text || ""}
                onChange={(e) => updateContent("text", e.target.value)}
                placeholder="Click Me"
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={block.content.href || ""}
                onChange={(e) => updateContent("href", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Link Target</Label>
              <Select
                value={block.content.target || "_blank"}
                onValueChange={(value) => updateContent("target", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_blank">New Tab</SelectItem>
                  <SelectItem value="_self">Same Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "spacer":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Height: {block.content.height || 40}px</Label>
              <Slider
                value={[block.content.height || 40]}
                onValueChange={([value]) => updateContent("height", value)}
                min={10}
                max={200}
                step={5}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content settings available for this element type.</p>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-full flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
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
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {getBlockDisplayName(block.type)}
          </Badge>
          <span className="text-xs text-gray-500">ID: {block.id.slice(-8)}</span>
        </div>
      </div>

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
                  onClick={() => {
                    // Duplicate functionality would be implemented here
                    console.log("Duplicate block:", block.id)
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Element
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    // Move up functionality would be implemented here
                    console.log("Move up:", block.id)
                  }}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Move Up
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    // Move down functionality would be implemented here
                    console.log("Move down:", block.id)
                  }}
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Move Down
                </Button>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    // Delete functionality would be implemented here
                    console.log("Delete block:", block.id)
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
    </motion.div>
  )
}
