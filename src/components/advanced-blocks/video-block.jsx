"use client"

import { useState } from "react"
import { Play, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function VideoBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [videoSrc, setVideoSrc] = useState(block.content.src || "")
  const [posterSrc, setPosterSrc] = useState(block.content.poster || "")
  const [autoplay, setAutoplay] = useState(block.content.autoplay || false)
  const [controls, setControls] = useState(block.content.controls !== false)

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        src: videoSrc,
        poster: posterSrc,
        autoplay,
        controls,
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
      }}
    >
      {/* Video Content */}
      <div className="relative">
        {block.content.src ? (
          <video
            className="w-full rounded-lg shadow-sm"
            style={{
              width: block.content.width || 500,
              height: block.content.height || 300,
            }}
            poster={block.content.poster}
            controls={block.content.controls}
            autoPlay={block.content.autoplay}
            muted={block.content.autoplay} // Required for autoplay
          >
            <source src={block.content.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800"
            style={{
              width: block.content.width || 500,
              height: block.content.height || 300,
            }}
          >
            <Video className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm text-center">Click to add a video</p>
          </div>
        )}

        {/* Play Overlay */}
        {block.content.poster && !block.content.autoplay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Edit Button */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-black hover:bg-gray-100 shadow-lg">
                <Video className="w-4 h-4 mr-2" />
                Edit Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-src">Video URL</Label>
                  <Input
                    id="video-src"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={videoSrc}
                    onChange={(e) => setVideoSrc(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poster-src">Poster Image URL (optional)</Label>
                  <Input
                    id="poster-src"
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={posterSrc}
                    onChange={(e) => setPosterSrc(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="autoplay" checked={autoplay} onCheckedChange={setAutoplay} />
                  <Label htmlFor="autoplay">Autoplay (muted)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="controls" checked={controls} onCheckedChange={setControls} />
                  <Label htmlFor="controls">Show controls</Label>
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
        <div className="absolute -top-6 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Video className="w-3 h-3" />
          <span>Video</span>
        </div>
      )}
    </div>
  )
}
