"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmailBlock } from "../email-template-maker"


export default function VideoBlock({ block, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const videoStyles = {
    width: block.content.width ? `${block.content.width}px` : "100%",
    height: block.content.height ? `${block.content.height}px` : "auto",
    padding: `${block.styles.padding?.top || 0}px ${block.styles.padding?.right || 0}px ${block.styles.padding?.bottom || 0}px ${block.styles.padding?.left || 0}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 0}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor,
    borderRadius: `${block.styles.borderRadius}px`,
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
      style={videoStyles}
    >
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          className="w-full h-auto"
          poster={block.content.poster || "/placeholder.svg?height=300&width=500"}
          muted={isMuted}
          style={{ borderRadius: `${block.styles.borderRadius}px` }}
        >
          <source src={block.content.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-16 h-16"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
