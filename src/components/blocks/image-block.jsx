"use client"

import { useState, useRef } from "react"
import { ImageIcon, Upload, Edit3, Check, Crop, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

export default function ImageBlock({ block, isSelected, onUpdate, onSelect, onEdit, onSave, previewMode, isEditing }) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState(block.content.src || "")
  const [altText, setAltText] = useState(block.content.alt || "")
  const [imageWidth, setImageWidth] = useState(block.content.width || 400)
  const [imageHeight, setImageHeight] = useState(block.content.height || 200)
  const [borderRadius, setBorderRadius] = useState(block.styles?.borderRadius || 0)
  const [opacity, setOpacity] = useState(block.styles?.opacity || 100)
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") {
          onUpdate(block.id, {
            content: {
              ...block.content,
              src: result,
              alt: altText || file.name,
            },
          })
          setShowImageDialog(false)
          onSave(block.id)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (imageUrl) {
      onUpdate(block.id, {
        content: {
          ...block.content,
          src: imageUrl,
          alt: altText || "Image",
          width: imageWidth,
          height: imageHeight,
        },
        styles: {
          ...block.styles,
          borderRadius,
          opacity: opacity / 100,
        },
      })
      setShowImageDialog(false)
      onSave(block.id)
    }
  }

  const handleEdit = () => {
    setImageUrl(block.content.src || "")
    setAltText(block.content.alt || "")
    setImageWidth(block.content.width || 400)
    setImageHeight(block.content.height || 200)
    setBorderRadius(block.styles?.borderRadius || 0)
    setOpacity((block.styles?.opacity || 1) * 100)
    setShowImageDialog(true)
    onEdit(block.id)
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
      } ${isEditing ? "ring-2 ring-green-500 ring-opacity-50" : ""}`}
      onClick={() => onSelect(block.id)}
      style={{
        padding: `${styles.padding?.top || 16}px ${styles.padding?.right || 16}px ${styles.padding?.bottom || 16}px ${styles.padding?.left || 16}px`,
        margin: `${styles.margin?.top || 0}px ${styles.margin?.right || 0}px ${styles.margin?.bottom || 16}px ${styles.margin?.left || 0}px`,
        backgroundColor: styles.backgroundColor || "transparent",
        borderRadius: `${styles.borderRadius || 0}px`,
      }}
    >
      {/* Enhanced Image Toolbar */}
      {isSelected && (
        <div className="absolute -top-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          <Button size="sm" onClick={handleEdit}>
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button size="sm" variant="outline">
            <Crop className="w-4 h-4 mr-1" />
            Crop
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      )}

      {/* Image Content */}
      <div className="relative">
        {block.content.src ? (
          <img
            src={block.content.src || "/placeholder.svg"}
            alt={block.content.alt || "Image"}
            className="max-w-full h-auto shadow-sm transition-all duration-200 hover:shadow-md"
            style={{
              width: block.content.width ? `${block.content.width}px` : "auto",
              height: block.content.height ? `${block.content.height}px` : "auto",
              objectFit: "cover",
              borderRadius: `${styles.borderRadius || 0}px`,
              opacity: styles.opacity || 1,
            }}
          />
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            style={{
              width: block.content.width || 400,
              height: block.content.height || 200,
            }}
            onClick={handleEdit}
          >
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm text-center">Click to add an image</p>
          </div>
        )}

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Enhanced Image Editor Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Image Source */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            {/* Alt Text */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="altText">Alt Text</Label>
              <Input id="altText" value={altText} onChange={(e) => setAltText(e.target.value)} />
            </div>
            {/* Image Dimensions */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="imageWidth">Width</Label>
              <Input
                id="imageWidth"
                type="number"
                value={imageWidth}
                onChange={(e) => setImageWidth(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="imageHeight">Height</Label>
              <Input
                id="imageHeight"
                type="number"
                value={imageHeight}
                onChange={(e) => setImageHeight(Number(e.target.value))}
              />
            </div>
            {/* Border Radius */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <Slider
                id="borderRadius"
                value={[borderRadius]}
                onChange={([value]) => setBorderRadius(value)}
                max={50}
              />
            </div>
            {/* Opacity */}
            <div className="flex items-center space-x-4">
              <Label htmlFor="opacity">Opacity</Label>
              <Slider id="opacity" value={[opacity]} onChange={([value]) => setOpacity(value)} max={100} />
            </div>
            {/* Save Button */}
            <Button onClick={handleUrlSubmit} className="mt-4">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
