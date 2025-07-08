"use client"

import { useState, useRef } from "react"
import { ImageIcon, Upload, Link, Edit3, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export default function ImageBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [showLinkEditor, setShowLinkEditor] = useState(false)
  const [imageUrl, setImageUrl] = useState(block.content.src || "")
  const [altText, setAltText] = useState(block.content.alt || "")
  const [linkUrl, setLinkUrl] = useState(block.content.href || "")
  const [linkTarget, setLinkTarget] = useState(block.content.target || "_blank")
  const [imageFilters, setImageFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    opacity: 100,
  })
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target.result)
        onUpdate(block.id, {
          content: { ...block.content, src: e.target.result },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        src: imageUrl,
        alt: altText,
        filters: imageFilters,
      },
    })
    setShowImageEditor(false)
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

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()

  const generateFilterString = () => {
    const filters = block.content.filters || imageFilters
    const filterParts = []

    if (filters.brightness !== 100) filterParts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== 100) filterParts.push(`contrast(${filters.contrast}%)`)
    if (filters.saturate !== 100) filterParts.push(`saturate(${filters.saturate}%)`)
    if (filters.blur > 0) filterParts.push(`blur(${filters.blur}px)`)
    if (filters.opacity !== 100) filterParts.push(`opacity(${filters.opacity}%)`)

    return filterParts.length > 0 ? filterParts.join(" ") : "none"
  }

  const renderImage = () => {
    const imageElement = (
      <img
        src={block.content.src || "/placeholder.svg?height=200&width=300"}
        alt={block.content.alt || "Image"}
        className="max-w-full h-auto rounded transition-all duration-200 hover:shadow-lg"
        style={{
          width: block.content.width ? `${block.content.width}px` : "auto",
          height: block.content.height ? `${block.content.height}px` : "auto",
          filter: generateFilterString(),
          borderRadius: `${styles.borderRadius || 0}px`,
          border: styles.borderWidth ? `${styles.borderWidth}px solid ${styles.borderColor || "#e5e7eb"}` : "none",
        }}
        onError={(e) => {
          e.target.src = "/placeholder.svg?height=200&width=300"
        }}
      />
    )

    if (block.content.href) {
      return (
        <a
          href={block.content.href}
          target={block.content.target || "_blank"}
          rel="noopener noreferrer"
          className="inline-block"
          onClick={(e) => {
            if (isSelected) {
              e.preventDefault()
            }
          }}
        >
          {imageElement}
        </a>
      )
    }

    return imageElement
  }

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
        textAlign: styles.textAlign || "center",
      }}
    >
      {/* Enhanced Image Toolbar */}
      {isSelected && (
        <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          {/* Upload Button */}
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent">
            <Upload className="w-4 h-4" />
          </Button>

          {/* Edit Image Button */}
          <Button size="sm" variant="outline" onClick={() => setShowImageEditor(true)} className="bg-transparent">
            <Edit3 className="w-4 h-4" />
          </Button>

          {/* Filter Button */}
          <Button size="sm" variant="outline" onClick={() => setShowImageEditor(true)} className="bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>

          {/* Link Button */}
          <Button size="sm" variant={block.content.href ? "default" : "ghost"} onClick={() => setShowLinkEditor(true)}>
            <Link className="w-4 h-4" />
          </Button>

          {/* Dimensions */}
          <div className="flex items-center space-x-1 pl-2 border-l border-gray-200">
            <Input
              type="number"
              placeholder="W"
              value={block.content.width || ""}
              onChange={(e) =>
                onUpdate(block.id, {
                  content: { ...block.content, width: e.target.value ? Number(e.target.value) : null },
                })
              }
              className="w-16 h-8 text-xs"
            />
            <span className="text-xs text-gray-500">×</span>
            <Input
              type="number"
              placeholder="H"
              value={block.content.height || ""}
              onChange={(e) =>
                onUpdate(block.id, {
                  content: { ...block.content, height: e.target.value ? Number(e.target.value) : null },
                })
              }
              className="w-16 h-8 text-xs"
            />
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {/* Image Content */}
      <div className="flex justify-center">
        {block.content.src ? (
          renderImage()
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Click to upload an image</p>
            <p className="text-xs text-gray-400 mt-2">or drag and drop</p>
          </div>
        )}
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Image URL */}
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* Alt Text */}
            <div>
              <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
              <Input
                id="alt-text"
                placeholder="Describe the image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>

            {/* Image Filters */}
            <div className="space-y-4">
              <h4 className="font-medium">Image Filters</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Brightness: {imageFilters.brightness}%</Label>
                  <Slider
                    value={[imageFilters.brightness]}
                    onValueChange={([value]) => setImageFilters((prev) => ({ ...prev, brightness: value }))}
                    min={0}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Contrast: {imageFilters.contrast}%</Label>
                  <Slider
                    value={[imageFilters.contrast]}
                    onValueChange={([value]) => setImageFilters((prev) => ({ ...prev, contrast: value }))}
                    min={0}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Saturation: {imageFilters.saturate}%</Label>
                  <Slider
                    value={[imageFilters.saturate]}
                    onValueChange={([value]) => setImageFilters((prev) => ({ ...prev, saturate: value }))}
                    min={0}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Blur: {imageFilters.blur}px</Label>
                  <Slider
                    value={[imageFilters.blur]}
                    onValueChange={([value]) => setImageFilters((prev) => ({ ...prev, blur: value }))}
                    min={0}
                    max={20}
                    step={0.5}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Opacity: {imageFilters.opacity}%</Label>
                <Slider
                  value={[imageFilters.opacity]}
                  onValueChange={([value]) => setImageFilters((prev) => ({ ...prev, opacity: value }))}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Responsive Settings */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={block.content.responsive || false}
                onCheckedChange={(checked) =>
                  onUpdate(block.id, {
                    content: { ...block.content, responsive: checked },
                  })
                }
              />
              <Label>Responsive Image</Label>
            </div>

            {/* Preview */}
            {imageUrl && (
              <div className="border rounded-lg p-4">
                <Label>Preview</Label>
                <div className="mt-2 flex justify-center">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={altText}
                    className="max-w-full max-h-48 rounded"
                    style={{ filter: generateFilterString() }}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowImageEditor(false)}>
                Cancel
              </Button>
              <Button onClick={handleImageSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Editor Dialog */}
      <Dialog open={showLinkEditor} onOpenChange={setShowLinkEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image Link</DialogTitle>
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
