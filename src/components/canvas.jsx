"use client"

import { forwardRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Smartphone, Monitor, Tablet } from "lucide-react"
import TextBlock from "./blocks/text-block"
import ImageBlock from "./blocks/image-block"
import ButtonBlock from "./blocks/button-block"
import DividerBlock from "./blocks/divider-block"
import SpacerBlock from "./blocks/spacer-block"
import ColumnsBlock from "./blocks/columns-block"
import SocialBlock from "./blocks/social-block"
import VideoBlock from "./advanced-blocks/video-block"
import CountdownBlock from "./advanced-blocks/countdown-block"
import SurveyBlock from "./advanced-blocks/survey-block"

const blockComponents = {
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  divider: DividerBlock,
  spacer: SpacerBlock,
  columns: ColumnsBlock,
  social: SocialBlock,
  video: VideoBlock,
  countdown: CountdownBlock,
  survey: SurveyBlock,
}

const Canvas = forwardRef(
  (
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

    const handleDragOver = useCallback((e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }, [])

    const handleDragEnter = useCallback((e, index) => {
      e.preventDefault()
      setDragOverIndex(index)
    }, [])

    const handleDragLeave = useCallback((e) => {
      e.preventDefault()
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setDragOverIndex(null)
      }
    }, [])

    const handleDrop = useCallback((e, index) => {
      e.preventDefault()
      setDragOverIndex(null)

      const blockType = e.dataTransfer.getData("text/plain")
      if (blockType) {
        // This would typically call a function to add a block at a specific position
        console.log(`Add ${blockType} at position ${index}`)
      }
    }, [])

    const getCanvasStyles = () => {
      const baseWidth = previewMode === "mobile" ? 375 : previewMode === "tablet" ? 768 : 1200
      const scaledWidth = (baseWidth * zoomLevel) / 100

      return {
        width: `${scaledWidth}px`,
        minHeight: "600px",
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: "top center",
      }
    }

    const getDeviceIcon = () => {
      switch (previewMode) {
        case "mobile":
          return <Smartphone className="w-4 h-4" />
        case "tablet":
          return <Tablet className="w-4 h-4" />
        default:
          return <Monitor className="w-4 h-4" />
      }
    }

    return (
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 relative">
        {/* Rulers */}
        {showRulers && (
          <>
            <div className="absolute top-0 left-0 right-0 h-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
              {/* Horizontal ruler marks */}
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
              {/* Vertical ruler marks */}
            </div>
          </>
        )}

        {/* Canvas Container */}
        <div className="flex justify-center p-8" style={{ paddingTop: showRulers ? "56px" : "32px" }}>
          <div className="relative">
            {/* Device Frame */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              {getDeviceIcon()}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                {previewMode} Preview
              </span>
              <span className="text-xs text-gray-400">{zoomLevel}%</span>
            </div>

            {/* Canvas */}
            <motion.div
              ref={ref}
              className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden relative"
              style={getCanvasStyles()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Grid Background */}
              {gridSnap && (
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `
                    linear-gradient(to right, #000 1px, transparent 1px),
                    linear-gradient(to bottom, #000 1px, transparent 1px)
                  `,
                    backgroundSize: "20px 20px",
                  }}
                />
              )}

              {/* Blocks */}
              <AnimatePresence>
                {blocks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-96 text-gray-400 dark:text-gray-600"
                  >
                    <Plus className="w-16 h-16 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Start Building Your Email</h3>
                    <p className="text-center max-w-md">
                      Drag elements from the sidebar or click the + button to add your first element
                    </p>
                  </motion.div>
                ) : (
                  blocks.map((block, index) => {
                    const BlockComponent = blockComponents[block.type]
                    if (!BlockComponent) return null

                    return (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {/* Drop Zone Indicator */}
                        {dragOverIndex === index && (
                          <div className="absolute -top-2 left-0 right-0 h-1 bg-blue-500 rounded-full z-10" />
                        )}

                        <BlockComponent
                          block={block}
                          isSelected={selectedBlock === block.id}
                          onUpdate={onUpdateBlock}
                          onSelect={onSelectBlock}
                          onDelete={onDeleteBlock}
                          onDuplicate={onDuplicateBlock}
                          onMove={onMoveBlock}
                          previewMode={previewMode}
                        />
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>

              {/* Final Drop Zone */}
              <div
                className="h-16 flex items-center justify-center border-2 border-dashed border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, blocks.length)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, blocks.length)}
              >
                {dragOverIndex === blocks.length && (
                  <div className="text-blue-500 text-sm font-medium">Drop element here</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  },
)

Canvas.displayName = "Canvas"

export default Canvas
