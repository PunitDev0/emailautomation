"use client";
import { forwardRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, ArrowUp, ArrowDown, GripVertical } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import TextBlock from "./blocks/text-block"
import ImageBlock from "./blocks/image-block"
import ButtonBlock from "./blocks/button-block"
import SocialBlock from "./blocks/social-block"
import DividerBlock from "./blocks/divider-block"
import SpacerBlock from "./blocks/spacer-block"
import ColumnsBlock from "./blocks/columns-block"
import VideoBlock from "./advanced-blocks/video-block"
import CountdownBlock from "./advanced-blocks/countdown-block"
import SurveyBlock from "./advanced-blocks/survey-block"

const Canvas = forwardRef((
  {
    blocks,
    selectedBlock,
    previewMode,
    onSelectBlock,
    onUpdateBlock,
    onDeleteBlock,
    onDuplicateBlock,
    onMoveBlock,
    draggedBlock,
    setDraggedBlock,
    zoomLevel,
    gridSnap,
    showRulers,
    darkMode,
  },
  ref,
) => {
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 800 })

  // Update canvas size based on preview mode
  useEffect(() => {
    switch (previewMode) {
      case "mobile":
        setCanvasSize({ width: 375, height: 667 })
        break
      case "tablet":
        setCanvasSize({ width: 768, height: 1024 })
        break
      case "desktop":
      default:
        setCanvasSize({ width: 600, height: 800 })
        break
    }
  }, [previewMode])

  const handleDrop = (e) => {
    e.preventDefault()
    const blockType = e.dataTransfer.getData("text/plain")

    if (blockType) {
      // Add new block from sidebar
      const newBlock = {
        id: `block-${Date.now()}`,
        type: blockType,
        content: getDefaultContent(blockType),
        styles: getDefaultStyles(blockType),
        position: { x: 0, y: blocks.length * 100 },
      }

      onUpdateBlock(newBlock.id, newBlock)
    }

    setDragOverIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const renderBlock = (block) => {
    const commonProps = {
      block,
      onUpdate: (updates) => onUpdateBlock(block.id, { content: updates }),
    }

    switch (block.type) {
      case "text":
        return <TextBlock {...commonProps} />;
      case "image":
        return <ImageBlock {...commonProps} />;
      case "button":
        return <ButtonBlock {...commonProps} />;
      case "social":
        return <SocialBlock {...commonProps} />;
      case "divider":
        return <DividerBlock {...commonProps} />;
      case "spacer":
        return <SpacerBlock {...commonProps} />;
      case "columns":
        return <ColumnsBlock {...commonProps} />;
      case "video":
        return <VideoBlock {...commonProps} />;
      case "countdown":
        return <CountdownBlock {...commonProps} />;
      case "survey":
        return <SurveyBlock {...commonProps} />;
      default:
        return <div>Unknown block type</div>;
    }
  }

  const canvasStyles = {
    transform: `scale(${zoomLevel / 100})`,
    transformOrigin: "top center",
    width: `${canvasSize.width}px`,
    minHeight: `${canvasSize.height}px`,
    background: darkMode ? "#1f2937" : "#ffffff",
    backgroundImage: gridSnap
      ? `radial-gradient(circle, ${darkMode ? "#374151" : "#e5e7eb"} 1px, transparent 1px)`
      : "none",
    backgroundSize: gridSnap ? "20px 20px" : "auto",
  }

  return (
    <div
      className="flex-1 flex flex-col bg-gradient-to-b from-white/20 to-white/40 dark:from-gray-800/20 dark:to-gray-800/40 relative">
      {/* Rulers */}
      {showRulers && (
        <>
          {/* Horizontal Ruler */}
          <div
            className="h-6 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-end text-xs text-gray-500">
            {Array.from({ length: Math.ceil(canvasSize.width / 50) }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-full relative border-r border-gray-300 dark:border-gray-600">
                <span className="absolute bottom-0 left-1">{i * 50}</span>
              </div>
            ))}
          </div>

          {/* Vertical Ruler */}
          <div
            className="absolute left-0 top-6 w-6 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col text-xs text-gray-500">
            {Array.from({ length: Math.ceil(canvasSize.height / 50) }).map((_, i) => (
              <div
                key={i}
                className="h-12 w-full relative border-b border-gray-300 dark:border-gray-600">
                <span className="absolute top-1 left-1 transform -rotate-90 origin-left">{i * 50}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Canvas Container */}
      <div
        className="flex-1 overflow-auto p-8"
        style={{ paddingLeft: showRulers ? "32px" : "32px" }}>
        <div className="flex justify-center">
          <motion.div
            ref={ref}
            className="shadow-2xl transition-all duration-300 relative"
            style={canvasStyles}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: zoomLevel / 100, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            {/* Canvas Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
              {gridSnap && (
                <div
                  className="w-full h-full opacity-30"
                  style={{
                    backgroundImage: `linear-gradient(${darkMode ? "#374151" : "#e5e7eb"} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? "#374151" : "#e5e7eb"} 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }} />
              )}
            </div>

            <AnimatePresence>
              {blocks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-96 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-600 m-8 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📧</div>
                    <p className="text-lg font-medium">Start building your email</p>
                    <p className="text-sm mt-2">Drag components from the sidebar to get started</p>
                  </div>
                </motion.div>
              ) : (
                blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`relative group ${
                      selectedBlock === block.id
                        ? "ring-2 ring-blue-500 dark:ring-blue-400"
                        : "hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectBlock(block.id)
                    }}
                    onDragOver={(e) => handleDragOver(e, index)}>
                    {/* Drop indicator */}
                    {dragOverIndex === index && (
                      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 z-10" />
                    )}

                    {/* Block controls */}
                    <AnimatePresence>
                      {selectedBlock === block.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute -top-3 -right-3 flex items-center space-x-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 z-20 border border-gray-200 dark:border-gray-600">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onMoveBlock(block.id, "up")
                                  }}>
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move Up</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onMoveBlock(block.id, "down")
                                  }}>
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move Down</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDuplicateBlock(block.id)
                                  }}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Duplicate</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteBlock(block.id)
                                  }}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Drag handle */}
                    {selectedBlock === block.id && (
                      <div
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-move opacity-50 hover:opacity-100 z-10">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>
                    )}

                    {/* Block content */}
                    <div className="relative">{renderBlock(block)}</div>

                    {/* Block info overlay */}
                    {selectedBlock === block.id && (
                      <div
                        className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
                        {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Canvas Info */}
            <div
              className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 shadow-lg">
              <div className="flex items-center space-x-4">
                <span>
                  {canvasSize.width} × {canvasSize.height}px
                </span>
                <span>{blocks.length} blocks</span>
                <span>{Math.round(zoomLevel)}% zoom</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
})

Canvas.displayName = "Canvas"

export default Canvas

// Helper functions (same as in email-template-maker.tsx)
function getDefaultContent(type) {
  switch (type) {
    case "text":
      return {
        text: "Your text here...",
        tag: "p",
        formatting: { bold: false, italic: false, underline: false },
      }
    case "image":
      return {
        src: "/placeholder.svg?height=200&width=400",
        alt: "Image description",
        width: 400,
        height: 200,
      }
    case "button":
      return {
        text: "Click Me",
        href: "#",
        target: "_blank",
      }
    case "social":
      return {
        platforms: [
          { name: "facebook", url: "#", enabled: true },
          { name: "twitter", url: "#", enabled: true },
          { name: "instagram", url: "#", enabled: true },
          { name: "linkedin", url: "#", enabled: true },
        ],
      }
    case "divider":
      return { style: "solid" }
    case "spacer":
      return { height: 40 }
    case "columns":
      return {
        columns: [
          { content: "Column 1", width: "50%" },
          { content: "Column 2", width: "50%" },
        ],
      }
    default:
      return {}
  }
}

function getDefaultStyles(type) {
  const baseStyles = {
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    backgroundColor: "transparent",
    borderRadius: 0,
  }

  switch (type) {
    case "text":
      return {
        ...baseStyles,
        fontSize: 16,
        color: "#333333",
        textAlign: "left",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
      }
    case "button":
      return {
        ...baseStyles,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        borderRadius: 6,
        border: "none",
        display: "inline-block",
      }
    case "divider":
      return {
        ...baseStyles,
        borderTop: "1px solid #e5e7eb",
        height: 1,
      }
    default:
      return baseStyles
  }
}
