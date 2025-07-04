"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const defaultPlatforms = [
  { name: "facebook", icon: "Facebook", color: "#1877F2", domain: "facebook.com" },
  { name: "twitter", icon: "Twitter", color: "#1DA1F2", domain: "twitter.com" },
  { name: "instagram", icon: "Instagram", color: "#E4405F", domain: "instagram.com" },
  { name: "linkedin", icon: "Linkedin", color: "#0077B5", domain: "linkedin.com" },
  { name: "youtube", icon: "Youtube", color: "#FF0000", domain: "youtube.com" },
  { name: "github", icon: "Github", color: "#333333", domain: "github.com" },
  { name: "tiktok", icon: "Music", color: "#000000", domain: "tiktok.com" },
  { name: "discord", icon: "MessageCircle", color: "#5865F2", domain: "discord.com" },
  { name: "pinterest", icon: "Image", color: "#BD081C", domain: "pinterest.com" },
  { name: "snapchat", icon: "Camera", color: "#FFFC00", domain: "snapchat.com" },
]

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
}

export default function SocialBlock({
  block,
  onUpdate
}) {
  const [showEditor, setShowEditor] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState(null)
  const [newPlatform, setNewPlatform] = useState({
    name: "",
    url: "",
    color: "#3B82F6",
    icon: "ExternalLink",
  })

  const platforms = block.content.platforms || []

  const handlePlatformUpdate = (platformId, updates) => {
    const updatedPlatforms = platforms.map((platform) =>
      platform.id === platformId ? { ...platform, ...updates } : platform)
    onUpdate({ platforms: updatedPlatforms })
  }

  const handleAddPlatform = (platformData) => {
    const newPlatformObj = {
      id: `platform-${Date.now()}`,
      name: platformData.name,
      url: platformData.url || "#",
      enabled: true,
      icon: platformData.icon,
      color: platformData.color,
      target: "_blank",
    }

    onUpdate({ platforms: [...platforms, newPlatformObj] })
  }

  const handleRemovePlatform = (platformId) => {
    const updatedPlatforms = platforms.filter((platform) => platform.id !== platformId)
    onUpdate({ platforms: updatedPlatforms })
  }

  const handleQuickAdd = (defaultPlatform) => {
    const existingPlatform = platforms.find((p) => p.name === defaultPlatform.name)
    if (existingPlatform) {
      handlePlatformUpdate(existingPlatform.id, { enabled: true })
      return
    }

    handleAddPlatform({
      name: defaultPlatform.name,
      url: `https://${defaultPlatform.domain}`,
      icon: defaultPlatform.icon,
      color: defaultPlatform.color,
    })
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getIconComponent = (iconName) => {
    const IconComponent = socialIcons[iconName] || ExternalLink
    return IconComponent
  }

  const containerStyles = {
    padding: `${block.styles.padding?.top || 16}px ${block.styles.padding?.right || 16}px ${block.styles.padding?.bottom || 16}px ${block.styles.padding?.left || 16}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 16}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor,
    borderRadius: `${block.styles.borderRadius}px`,
    textAlign: "center",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={containerStyles}
      className="relative group">
      {/* Social Icons Display */}
      <div className="flex justify-center items-center flex-wrap gap-3">
        <AnimatePresence>
          {platforms
            .filter((platform) => platform.enabled)
            .map((platform, index) => {
              const IconComponent = getIconComponent(platform.icon)

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group/icon">
                  <a
                    href={platform.url}
                    target={platform.target}
                    rel="noopener noreferrer"
                    title={platform.title || `Visit our ${platform.name}`}
                    className="block p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                    style={{
                      backgroundColor: platform.color,
                      color: "#ffffff",
                    }}
                    // Prevent navigation in editor
                    onClick={(e) => e.preventDefault()}>
                    <IconComponent className="w-5 h-5" />
                  </a>
                  {/* Link Status Indicator */}
                  <div className="absolute -top-1 -right-1">
                    {validateUrl(platform.url) ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    ) : (
                      <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  {/* Quick Edit on Hover */}
                  <div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/icon:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        setEditingPlatform(platform)
                        setShowEditor(true)
                      }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Add New Platform Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            className="p-3 rounded-full border-dashed border-2 hover:border-solid bg-transparent"
            onClick={() => setShowEditor(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
      {/* Management Button (appears on hover) */}
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowEditor(true)}
          className="shadow-lg">
          <Settings className="w-4 h-4 mr-1" />
          Manage
        </Button>
      </div>
      {/* Social Media Management Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
              <span>Social Media Links Manager</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex">
            {/* Left Panel - Platform List */}
            <div className="w-1/2 border-r border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Your Social Platforms</h3>
                <p className="text-sm text-gray-600">Manage your social media links and visibility</p>
              </div>

              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {platforms.map((platform) => (
                    <motion.div
                      key={platform.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: platform.color }}>
                        {(() => {
                          const IconComponent = getIconComponent(platform.icon)
                          return <IconComponent className="w-5 h-5" />;
                        })()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800 capitalize">{platform.name}</h4>
                          {validateUrl(platform.url) ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Valid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Invalid URL
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{platform.url}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={platform.enabled}
                          onCheckedChange={(checked) => handlePlatformUpdate(platform.id, { enabled: checked })} />
                        <Button size="sm" variant="ghost" onClick={() => setEditingPlatform(platform)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemovePlatform(platform.id)}
                          className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {platforms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No social platforms added yet</p>
                      <p className="text-sm">Add your first platform to get started</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right Panel - Platform Editor or Quick Add */}
            <div className="w-1/2 flex flex-col">
              {editingPlatform ? (
                <PlatformEditor
                  platform={editingPlatform}
                  onUpdate={(updates) => {
                    handlePlatformUpdate(editingPlatform.id, updates)
                    setEditingPlatform({ ...editingPlatform, ...updates })
                  }}
                  onClose={() => setEditingPlatform(null)} />
              ) : (
                <QuickAddPanel
                  onAddPlatform={handleAddPlatform}
                  onQuickAdd={handleQuickAdd}
                  existingPlatforms={platforms} />
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Close
            </Button>
            <Button onClick={() => setShowEditor(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Platform Editor Component
function PlatformEditor({
  platform,
  onUpdate,
  onClose
}) {
  const [formData, setFormData] = useState({
    name: platform.name,
    url: platform.url,
    color: platform.color,
    target: platform.target,
    title: platform.title || "",
  })

  const handleSave = () => {
    onUpdate(formData)
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">Edit Platform</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input
              id="platform-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Facebook, Twitter"
              className="mt-1" />
          </div>

          <div>
            <Label htmlFor="platform-url">URL</Label>
            <Input
              id="platform-url"
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://facebook.com/yourpage"
              className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Enter the full URL including https://</p>
          </div>

          <div>
            <Label htmlFor="platform-title">Link Title (Optional)</Label>
            <Input
              id="platform-title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Visit our Facebook page"
              className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Appears as tooltip when users hover over the icon</p>
          </div>

          <div>
            <Label htmlFor="platform-color">Brand Color</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="platform-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                className="w-16 h-10" />
              <Input
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                placeholder="#3B82F6"
                className="flex-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="platform-target">Link Target</Label>
            <Select
              value={formData.target}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, target: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_blank">New Window/Tab</SelectItem>
                <SelectItem value="_self">Same Window</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label>Preview</Label>
            <div
              className="mt-2 p-4 bg-gray-50 rounded-lg flex items-center justify-center">
              <div
                className="p-3 rounded-full text-white shadow-md"
                style={{ backgroundColor: formData.color }}>
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-100">
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// Quick Add Panel Component
function QuickAddPanel({
  onAddPlatform,
  onQuickAdd,
  existingPlatforms
}) {
  const [customPlatform, setCustomPlatform] = useState({
    name: "",
    url: "",
    color: "#3B82F6",
  })

  const handleCustomAdd = () => {
    if (customPlatform.name && customPlatform.url) {
      onAddPlatform({
        ...customPlatform,
        icon: "ExternalLink",
      })
      setCustomPlatform({ name: "", url: "", color: "#3B82F6" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-800">Add Social Platform</h3>
        <p className="text-sm text-gray-600">Choose from popular platforms or add a custom one</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Popular Platforms */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Popular Platforms</h4>
            <div className="grid grid-cols-2 gap-2">
              {defaultPlatforms.map((platform) => {
                const isAdded = existingPlatforms.some((p) => p.name === platform.name)
                return (
                  <Button
                    key={platform.name}
                    variant={isAdded ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onQuickAdd(platform)}
                    disabled={isAdded}
                    className="justify-start">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: platform.color }} />
                    {platform.name}
                    {isAdded && <Badge className="ml-auto">Added</Badge>}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Custom Platform */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Add Custom Platform</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-name">Platform Name</Label>
                <Input
                  id="custom-name"
                  value={customPlatform.name}
                  onChange={(e) => setCustomPlatform((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Behance, Dribbble"
                  className="mt-1" />
              </div>

              <div>
                <Label htmlFor="custom-url">URL</Label>
                <Input
                  id="custom-url"
                  value={customPlatform.url}
                  onChange={(e) => setCustomPlatform((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/yourprofile"
                  className="mt-1" />
              </div>

              <div>
                <Label htmlFor="custom-color">Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="custom-color"
                    type="color"
                    value={customPlatform.color}
                    onChange={(e) => setCustomPlatform((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-10" />
                  <Input
                    value={customPlatform.color}
                    onChange={(e) => setCustomPlatform((prev) => ({ ...prev, color: e.target.value }))}
                    placeholder="#3B82F6"
                    className="flex-1" />
                </div>
              </div>

              <Button
                onClick={handleCustomAdd}
                disabled={!customPlatform.name || !customPlatform.url}
                className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Platform
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
