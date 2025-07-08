"use client"

import { useState } from "react"
import { MousePointer, ExternalLink, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ButtonBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [buttonText, setButtonText] = useState(block.content.text || "")
  const [buttonUrl, setButtonUrl] = useState(block.content.href || "")
  const [buttonTarget, setButtonTarget] = useState(block.content.target || "_blank")

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        text: buttonText,
        href: buttonUrl,
        target: buttonTarget,
      },
    })
    setShowEditDialog(false)
  }

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()

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
      {/* Button Element */}
      <button
        className="inline-flex items-center justify-center transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{
          backgroundColor: styles.backgroundColor || "#3b82f6",
          color: styles.color || "#ffffff",
          fontSize: `${styles.fontSize || 16}px`,
          fontWeight: styles.fontWeight || "bold",
          borderRadius: `${styles.borderRadius || 6}px`,
          border: styles.border || "none",
          minWidth: `${styles.minWidth || 120}px`,
          minHeight: `${styles.minHeight || 44}px`,
          padding: "12px 24px",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (block.content.href && !isSelected) {
            window.open(block.content.href, block.content.target || "_blank")
          }
        }}
      >
        {block.content.text || "Button Text"}
        {block.content.href && <ExternalLink className="w-4 h-4 ml-2" />}
      </button>

      {/* Edit Button */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-black hover:bg-gray-100 shadow-lg">
                <Edit className="w-4 h-4 mr-2" />
                Edit Button
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Button</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="button-text">Button Text</Label>
                  <Input
                    id="button-text"
                    placeholder="Enter button text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button-url">Link URL</Label>
                  <Input
                    id="button-url"
                    type="url"
                    placeholder="https://example.com"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button-target">Link Target</Label>
                  <Select value={buttonTarget} onValueChange={setButtonTarget}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_blank">New Tab</SelectItem>
                      <SelectItem value="_self">Same Tab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
        <div className="absolute -top-6 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <MousePointer className="w-3 h-3" />
          <span>Button</span>
        </div>
      )}
    </div>
  )
}
