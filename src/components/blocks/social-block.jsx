"use client"

import React from "react"

import { useState } from "react"
import { Share2, Facebook, Twitter, Instagram, Linkedin, Youtube, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

const socialColors = {
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
}

export default function SocialBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [platforms, setPlatforms] = useState(block.content.platforms || [])

  const handleSave = () => {
    onUpdate(block.id, {
      content: { ...block.content, platforms },
    })
    setShowEditDialog(false)
  }

  const updatePlatform = (index, updates) => {
    const newPlatforms = [...platforms]
    newPlatforms[index] = { ...newPlatforms[index], ...updates }
    setPlatforms(newPlatforms)
  }

  const addPlatform = () => {
    const newPlatform = {
      id: Date.now().toString(),
      name: "facebook",
      url: "https://facebook.com/yourpage",
      enabled: true,
      icon: "facebook",
      color: socialColors.facebook,
      target: "_blank",
    }
    setPlatforms([...platforms, newPlatform])
  }

  const removePlatform = (index) => {
    setPlatforms(platforms.filter((_, i) => i !== index))
  }

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()
  const enabledPlatforms = block.content.platforms?.filter((p) => p.enabled) || []

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onClick={() => onSelect(block.id)}
      style={{
        padding: `${styles.padding?.top || 16}px ${styles.padding?.right || 16}px ${styles.padding?.bottom || 16}px ${styles.padding?.left || 16}px`,
        margin: `${styles.margin?.top || 0}px ${styles.margin?.right || 0}px ${styles.margin?.bottom || 16}px ${styles.margin?.left || 0}px`,
        backgroundColor: styles.backgroundColor || "transparent",
        borderRadius: `${styles.borderRadius || 0}px`,
        textAlign: styles.textAlign || "center",
      }}
    >
      {/* Social Icons */}
      <div className="flex items-center justify-center space-x-3 flex-wrap gap-2">
        {enabledPlatforms.map((platform, index) => {
          const IconComponent = socialIcons[platform.name] || Share2
          return (
            <a
              key={platform.id}
              href={platform.url}
              target={platform.target || "_blank"}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
              style={{
                width: `${styles.iconSize || 40}px`,
                height: `${styles.iconSize || 40}px`,
                backgroundColor: platform.color,
                color: "white",
              }}
              onClick={(e) => {
                if (isSelected) {
                  e.preventDefault()
                }
              }}
            >
              <IconComponent className="w-5 h-5" />
            </a>
          )
        })}

        {enabledPlatforms.length === 0 && (
          <div className="text-gray-500 text-sm py-4">No social platforms enabled. Click to configure.</div>
        )}
      </div>

      {/* Edit Button */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-black hover:bg-gray-100 shadow-lg">
                <Settings className="w-4 h-4 mr-2" />
                Edit Social Links
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Social Media Links</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {platforms.map((platform, index) => (
                  <div key={platform.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: platform.color }}
                        >
                          {React.createElement(socialIcons[platform.name] || Share2, {
                            className: "w-4 h-4 text-white",
                          })}
                        </div>
                        <span className="font-medium capitalize">{platform.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={platform.enabled}
                          onCheckedChange={(enabled) => updatePlatform(index, { enabled })}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePlatform(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {platform.enabled && (
                      <div className="space-y-2">
                        <Label>Profile URL</Label>
                        <Input
                          type="url"
                          placeholder={`https://${platform.name}.com/yourprofile`}
                          value={platform.url}
                          onChange={(e) => updatePlatform(index, { url: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <Button onClick={addPlatform} className="w-full bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Platform
                </Button>

                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Block Type Indicator */}
      {isSelected && (
        <div className="absolute -top-6 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Share2 className="w-3 h-3" />
          <span>Social</span>
        </div>
      )}
    </div>
  )
}
