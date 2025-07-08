"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"



export default function GalleryBlock({ block, onUpdate, isSelected, previewMode }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const content = block.content || {
    images: [
      { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 1", caption: "Beautiful landscape" },
      { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 2", caption: "City skyline" },
      { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 3", caption: "Ocean view" },
      { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 4", caption: "Mountain peak" },
      { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 5", caption: "Forest path" },
      { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 6", caption: "Desert sunset" },
    ],
    layout: "grid", // grid, masonry, carousel
    columns: 3,
    spacing: 16,
    showCaptions: true,
    enableLightbox: true,
  }

  const styles = block.styles || {
    padding: { top: 30, right: 30, bottom: 30, left: 30 },
    backgroundColor: "transparent",
  }

  const openLightbox = (index) => {
    if (content.enableLightbox) {
      setSelectedImage(index)
      setIsLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedImage(null)
  }

  const navigateLightbox = (direction) => {
    if (selectedImage === null) return

    const newIndex =
      direction === "prev"
        ? (selectedImage - 1 + content.images.length) % content.images.length
        : (selectedImage + 1) % content.images.length

    setSelectedImage(newIndex)
  }

  const getGridCols = () => {
    const cols = content.columns || 3
    return (
      {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      }[cols] || "grid-cols-3"
    )
  }

  return (
    <>
      <motion.div
        className={`
          relative w-full
          ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
        `}
        style={{
          padding: `${styles.padding?.top || 30}px ${styles.padding?.right || 30}px ${styles.padding?.bottom || 30}px ${styles.padding?.left || 30}px`,
          backgroundColor: styles.backgroundColor,
          ...styles,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`grid ${getGridCols()} gap-${Math.floor(content.spacing / 4) || 4}`}>
          {content.images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square relative">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>

                {/* Caption */}
                {content.showCaptions && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage !== null && (
              <>
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Navigation */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>

                {/* Image */}
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="max-w-full max-h-full p-8"
                >
                  <img
                    src={content.images[selectedImage].src || "/placeholder.svg"}
                    alt={content.images[selectedImage].alt}
                    className="max-w-full max-h-full object-contain"
                  />

                  {/* Caption */}
                  {content.showCaptions && content.images[selectedImage].caption && (
                    <div className="text-center mt-4">
                      <p className="text-white text-lg">{content.images[selectedImage].caption}</p>
                    </div>
                  )}
                </motion.div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white text-sm">
                    {selectedImage + 1} / {content.images.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
