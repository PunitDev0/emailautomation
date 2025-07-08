"use client"

import { useState, useRef, useCallback } from "react"
import { DndContext, DragOverlay, useDroppable, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToWindowEdges, restrictToParentElement } from "@dnd-kit/modifiers"
import { Move, MousePointer, ZoomIn, ZoomOut, RotateCcw, Eye, Smartphone, Tablet, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast} from "sonner"

// Import all block components
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
import FormBlock from "./blocks/form-block"
import TestimonialBlock from "./blocks/testimonial-block"
import PricingBlock from "./blocks/pricing-block"
import GalleryBlock from "./blocks/gallery-block"

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
  form: FormBlock,
  testimonial: TestimonialBlock,
  pricing: PricingBlock,
  gallery: GalleryBlock,
}

function SortableBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onEdit,
  onSave,
  previewMode,
  isEditing,
  snapToGrid,
  gridSize,
  freePositioning,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: !freePositioning,
  })

  const [localPosition, setLocalPosition] = useState(block.position || { x: 0, y: 0 })
  const [isDraggingFree, setIsDraggingFree] = useState(false)

  const style = {
    transform: freePositioning
      ? `translate3d(${localPosition.x}px, ${localPosition.y}px, 0)`
      : CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    position: freePositioning ? "absolute" : "relative",
    zIndex: isDragging ? 1000 : block.styles?.zIndex || "auto",
  }

  const handleFreePositionDrag = useCallback(
    (event) => {
      if (!freePositioning || !isDraggingFree) return

      const rect = event.currentTarget.parentElement.getBoundingClientRect()
      let newX = event.clientX - rect.left - 50 // Offset for better UX
      let newY = event.clientY - rect.top - 25

      // Snap to grid if enabled
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize
        newY = Math.round(newY / gridSize) * gridSize
      }

      // Keep within bounds
      newX = Math.max(0, Math.min(newX, rect.width - 100))
      newY = Math.max(0, Math.min(newY, rect.height - 50))

      setLocalPosition({ x: newX, y: newY })
      onUpdate(block.id, { position: { x: newX, y: newY } })
    },
    [freePositioning, isDraggingFree, snapToGrid, gridSize, onUpdate, block.id],
  )

  const BlockComponent = blockComponents[block.type]
  if (!BlockComponent) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-600">Unknown block type: {block.type}</p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? "opacity-50" : ""}
        ${isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
        ${freePositioning ? "cursor-move" : ""}
        transition-all duration-200
      `}
      {...(freePositioning ? {} : { ...attributes, ...listeners })}
      onMouseDown={(e) => {
        if (freePositioning && e.button === 0) {
          setIsDraggingFree(true)
          e.preventDefault()
        }
      }}
      onMouseMove={handleFreePositionDrag}
      onMouseUp={() => setIsDraggingFree(false)}
      onMouseLeave={() => setIsDraggingFree(false)}
    >
      {/* Free positioning drag handle */}
      {freePositioning && isSelected && (
        <div className="absolute -top-8 -left-8 bg-blue-500 text-white p-1 rounded cursor-move z-10">
          <Move className="w-4 h-4" />
        </div>
      )}

      <BlockComponent
        block={block}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onEdit={onEdit}
        onSave={onSave}
        previewMode={previewMode}
        isEditing={isEditing}
      />
    </div>
  )
}

function DroppableCanvas({ children, onDrop, freePositioning, showGrid, gridSize }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "canvas",
  })

  const handleCanvasClick = (e) => {
    if (freePositioning && e.target === e.currentTarget) {
      // Handle canvas click for free positioning
      onDrop?.(e)
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-h-[600px] w-full bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed mt-20
        ${isOver ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"}
        ${showGrid ? "bg-grid-pattern" : ""}
        transition-all duration-200
      `}
      style={{
        backgroundImage: showGrid ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` : "none",
        backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : "auto",
      }}
      onClick={handleCanvasClick}
    >
      {children}

      {/* Drop zone indicator */}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-100/50 dark:bg-blue-900/30 rounded-lg">
          <div className="text-blue-600 dark:text-blue-400 text-lg font-medium">Drop your element here</div>
        </div>
      )}
    </div>
  )
}

export default function Canvas({
  blocks = [],
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onAddBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  previewMode = "desktop",
  onPreviewModeChange,
}) {
  const [editingBlockId, setEditingBlockId] = useState(null)
  const [draggedBlock, setDraggedBlock] = useState(null)
  const [canvasMode, setCanvasMode] = useState("design") // design, preview
  const [freePositioning, setFreePositioning] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [zoom, setZoom] = useState(100)
  const [showRulers, setShowRulers] = useState(false)
  const canvasRef = useRef(null)


  const handleDragStart = (event) => {
    const { active } = event
    const block = blocks.find((b) => b.id === active.id)
    setDraggedBlock(block)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setDraggedBlock(null)

    if (!over) return

    if (over.id === "canvas") {
      // Handle dropping on canvas
      return
    }

    // Handle reordering
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      // Update parent component with new order
      newBlocks.forEach((block, index) => {
        onUpdateBlock(block.id, { order: index })
      })
    }
  }

  const handleBlockEdit = (blockId) => {
    setEditingBlockId(blockId)
  }

  const handleBlockSave = (blockId) => {
    setEditingBlockId(null)
    toast({
      title: "Block Updated! ✅",
      description: "Your changes have been saved.",
      duration: 2000,
    })
  }

  const handleCanvasDrop = (e) => {
    if (!freePositioning) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // This would be called when dropping a new block from sidebar
    // onAddBlock({ position: { x, y } })
  }

  const getCanvasStyles = () => {
    const baseStyles = {
      transform: `scale(${zoom / 100})`,
      transformOrigin: "top left",
      width: previewMode === "mobile" ? "375px" : previewMode === "tablet" ? "768px" : "100%",
      maxWidth: previewMode === "desktop" ? "1200px" : "none",
      margin: "0 auto",
    }

    return baseStyles
  }

  const resetCanvas = () => {
    setZoom(100)
    setFreePositioning(false)
    setShowGrid(true)
    setSnapToGrid(true)
    setCanvasMode("design")
    toast({
      title: "Canvas Reset! 🔄",
      description: "Canvas settings have been reset to default.",
      duration: 2000,
    })
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
      {/* Enhanced Canvas Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Canvas Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={canvasMode === "design" ? "default" : "outline"}
              onClick={() => setCanvasMode("design")}
            >
              <MousePointer className="w-4 h-4 mr-1" />
              Design
            </Button>
            <Button
              size="sm"
              variant={canvasMode === "preview" ? "default" : "outline"}
              onClick={() => setCanvasMode("preview")}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>

          {/* Device Preview */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button
              size="sm"
              variant={previewMode === "desktop" ? "default" : "ghost"}
              onClick={() => onPreviewModeChange("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "tablet" ? "default" : "ghost"}
              onClick={() => onPreviewModeChange("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "mobile" ? "default" : "ghost"}
              onClick={() => onPreviewModeChange("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          {/* Canvas Options */}
          {canvasMode === "design" && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch checked={freePositioning} onCheckedChange={setFreePositioning} />
                <Label className="text-sm">Free Positioning</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                <Label className="text-sm">Grid</Label>
              </div>

              {showGrid && (
                <div className="flex items-center space-x-2">
                  <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                  <Label className="text-sm">Snap</Label>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch checked={showRulers} onCheckedChange={setShowRulers} />
                <Label className="text-sm">Rulers</Label>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(25, zoom - 25))} disabled={zoom <= 25}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Grid Size */}
          {showGrid && canvasMode === "design" && (
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Grid:</Label>
              <Slider
                value={[gridSize]}
                onValueChange={([value]) => setGridSize(value)}
                min={10}
                max={50}
                step={5}
                className="w-20"
              />
              <span className="text-xs text-gray-500 min-w-[30px]">{gridSize}px</span>
            </div>
          )}

          {/* Reset Button */}
          <Button size="sm" variant="outline" onClick={resetCanvas}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Canvas Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {blocks.length} {blocks.length === 1 ? "Block" : "Blocks"}
          </Badge>
          {selectedBlockId && (
            <Badge variant="outline">Selected: {blocks.find((b) => b.id === selectedBlockId)?.type || "Unknown"}</Badge>
          )}
          {freePositioning && (
            <Badge variant="outline" className="text-blue-600">
              Free Positioning Mode
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <span>Canvas: {previewMode}</span>
          <span>•</span>
          <span>Zoom: {zoom}%</span>
          {showGrid && (
            <>
              <span>•</span>
              <span>Grid: {gridSize}px</span>
            </>
          )}
        </div>
      </div>

      {/* Rulers */}
      {showRulers && canvasMode === "design" && (
        <div className="flex">
          {/* Horizontal Ruler */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 flex-1 ml-6">
            {/* Ruler marks would go here */}
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-4" style={{ zoom: zoom / 100 }}>
        <div ref={canvasRef} style={getCanvasStyles()} className="">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={freePositioning ? [restrictToParentElement] : [restrictToWindowEdges]}
          >
            <DroppableCanvas
              onDrop={handleCanvasDrop}
              freePositioning={freePositioning}
              showGrid={showGrid}
              gridSize={gridSize}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={freePositioning ? undefined : verticalListSortingStrategy}
              >
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={onSelectBlock}
                    onUpdate={onUpdateBlock}
                    onEdit={handleBlockEdit}
                    onSave={handleBlockSave}
                    previewMode={previewMode}
                    isEditing={editingBlockId === block.id}
                    snapToGrid={snapToGrid}
                    gridSize={gridSize}
                    freePositioning={freePositioning}
                  />
                ))}
              </SortableContext>
            </DroppableCanvas>

            <DragOverlay>
              {draggedBlock && (
                <div className="opacity-75 transform rotate-3 shadow-lg">
                  <Badge>{draggedBlock.type}</Badge>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="p-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 text-center">
        {canvasMode === "design"
          ? freePositioning
            ? "Free positioning mode: Click and drag elements anywhere on the canvas"
            : "Drag blocks to reorder • Double-click text to edit • Select blocks to customize"
          : "Preview mode: See how your email will look to recipients"}
      </div>
    </div>
  )
}
