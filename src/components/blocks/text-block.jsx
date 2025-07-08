"use client"

import { useState, useRef, useEffect } from "react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Edit3, Check, X, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TextBlock({ block, isSelected, onUpdate, onSelect, onEdit, onSave, previewMode, isEditing }) {
  const [tempText, setTempText] = useState(block.content.text || "")
  const [showInlineEditor, setShowInlineEditor] = useState(false)
  const [showLinkEditor, setShowLinkEditor] = useState(false)
  const [linkUrl, setLinkUrl] = useState(block.content.href || "")
  const [linkTarget, setLinkTarget] = useState(block.content.target || "_blank")
  const textRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus()
      editorRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setTempText(block.content.text || "")
    setLinkUrl(block.content.href || "")
    setLinkTarget(block.content.target || "_blank")
  }, [block.content])

  const handleDoubleClick = () => {
    if (!isEditing) {
      setShowInlineEditor(true)
      setTempText(block.content.text || "")
      onEdit(block.id)
    }
  }

  const handleSave = () => {
    onUpdate(block.id, {
      content: { ...block.content, text: tempText },
    })
    setShowInlineEditor(false)
    onSave(block.id)
  }

  const handleCancel = () => {
    setTempText(block.content.text || "")
    setShowInlineEditor(false)
    onSave(block.id)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleLinkSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        href: linkUrl,
        target: linkTarget,
      },
    })
    setShowLinkEditor(false)
  }

  const handleLinkRemove = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        href: "",
        target: "_blank",
      },
    })
    setLinkUrl("")
    setLinkTarget("_blank")
    setShowLinkEditor(false)
  }

  const toggleFormatting = (format) => {
    const currentFormatting = block.content.formatting || {}
    onUpdate(block.id, {
      content: {
        ...block.content,
        formatting: {
          ...currentFormatting,
          [format]: !currentFormatting[format],
        },
      },
    })
  }

  const updateAlignment = (alignment) => {
    onUpdate(block.id, {
      styles: { ...block.styles, textAlign: alignment },
    })
  }

  const updateFontSize = (size) => {
    onUpdate(block.id, {
      styles: { ...block.styles, fontSize: size },
    })
  }

  const updateColor = (color) => {
    onUpdate(block.id, {
      styles: { ...block.styles, color },
    })
  }

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}

    return {
      ...baseStyles,
      ...responsiveStyles,
      fontWeight: block.content.formatting?.bold ? "bold" : baseStyles.fontWeight || "normal",
      fontStyle: block.content.formatting?.italic ? "italic" : "normal",
      textDecoration: block.content.formatting?.underline ? "underline" : "none",
    }
  }

  const styles = getResponsiveStyles()

  const renderContent = () => {
    const content = block.content.text || "Double-click to edit text..."

    if (block.content.href) {
      return (
        <a
          href={block.content.href}
          target={block.content.target || "_blank"}
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={(e) => {
            if (isSelected) {
              e.preventDefault()
            }
          }}
        >
          {content}
        </a>
      )
    }

    return content
  }

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      } ${isEditing ? "ring-2 ring-green-500 ring-opacity-50" : ""}`}
      onClick={() => onSelect(block.id)}
      style={{
        padding: `${styles.padding?.top || 16}px ${styles.padding?.right || 16}px ${styles.padding?.bottom || 16}px ${styles.padding?.left || 16}px`,
        margin: `${styles.margin?.top || 0}px ${styles.margin?.right || 0}px ${styles.margin?.bottom || 16}px ${styles.margin?.left || 0}px`,
        backgroundColor: styles.backgroundColor || "transparent",
        borderRadius: `${styles.borderRadius || 0}px`,
      }}
    >
      {/* Enhanced Formatting Toolbar */}
      {isSelected && !showInlineEditor && (
        <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <Button
              size="sm"
              variant={block.content.formatting?.bold ? "default" : "ghost"}
              onClick={() => toggleFormatting("bold")}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={block.content.formatting?.italic ? "default" : "ghost"}
              onClick={() => toggleFormatting("italic")}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={block.content.formatting?.underline ? "default" : "ghost"}
              onClick={() => toggleFormatting("underline")}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <Button
              size="sm"
              variant={styles.textAlign === "left" ? "default" : "ghost"}
              onClick={() => updateAlignment("left")}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={styles.textAlign === "center" ? "default" : "ghost"}
              onClick={() => updateAlignment("center")}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={styles.textAlign === "right" ? "default" : "ghost"}
              onClick={() => updateAlignment("right")}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Font Size */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <Input
              type="number"
              value={styles.fontSize || 16}
              onChange={(e) => updateFontSize(Number(e.target.value))}
              className="w-16 h-8 text-xs"
              min="8"
              max="72"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>

          {/* Color */}
          <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
            <Input
              type="color"
              value={styles.color || "#333333"}
              onChange={(e) => updateColor(e.target.value)}
              className="w-8 h-8 p-0 border-0 rounded"
            />
          </div>

          {/* Link Button */}
          <Button size="sm" variant={block.content.href ? "default" : "ghost"} onClick={() => setShowLinkEditor(true)}>
            <Link className="w-4 h-4" />
          </Button>

          {/* Edit Button */}
          <Button size="sm" variant="outline" onClick={handleDoubleClick} className="ml-2 bg-transparent">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Text Content */}
      {showInlineEditor || isEditing ? (
        <div className="space-y-2">
          <Textarea
            ref={editorRef}
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] resize-none border-2 border-blue-300 focus:border-blue-500"
            placeholder="Enter your text here..."
            style={{
              fontSize: `${styles.fontSize || 16}px`,
              color: styles.color || "#333333",
              fontFamily: styles.fontFamily || "Arial, sans-serif",
              lineHeight: styles.lineHeight || 1.5,
            }}
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={textRef}
          className="cursor-text min-h-[40px] flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded p-2 transition-colors"
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${styles.fontSize || 16}px`,
            color: styles.color || "#333333",
            textAlign: styles.textAlign || "left",
            fontFamily: styles.fontFamily || "Arial, sans-serif",
            lineHeight: styles.lineHeight || 1.5,
            fontWeight: styles.fontWeight,
            fontStyle: styles.fontStyle,
            textDecoration: styles.textDecoration,
          }}
        >
          {block.content.text ? (
            renderContent()
          ) : (
            <span className="text-gray-400 italic">Double-click to edit text...</span>
          )}
        </div>
      )}

      {/* Link Editor Dialog */}
      <Dialog open={showLinkEditor} onOpenChange={setShowLinkEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="link-target">Link Target</Label>
              <Select value={linkTarget} onValueChange={setLinkTarget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_blank">New Tab</SelectItem>
                  <SelectItem value="_self">Same Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleLinkRemove}>
                Remove Link
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setShowLinkEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLinkSave}>Save Link</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
