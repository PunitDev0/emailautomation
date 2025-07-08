"use client"

import { useState } from "react"
import { Columns, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function ColumnsBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [editingColumn, setEditingColumn] = useState(null)

  const addColumn = () => {
    const newColumns = [
      ...block.content.columns,
      { content: "New column content", width: `${100 / (block.content.columns.length + 1)}%` },
    ]

    // Redistribute widths
    const equalWidth = `${100 / newColumns.length}%`
    const redistributedColumns = newColumns.map((col) => ({ ...col, width: equalWidth }))

    onUpdate(block.id, {
      content: { ...block.content, columns: redistributedColumns },
    })
  }

  const removeColumn = (index) => {
    if (block.content.columns.length <= 1) return

    const newColumns = block.content.columns.filter((_, i) => i !== index)
    const equalWidth = `${100 / newColumns.length}%`
    const redistributedColumns = newColumns.map((col) => ({ ...col, width: equalWidth }))

    onUpdate(block.id, {
      content: { ...block.content, columns: redistributedColumns },
    })
  }

  const updateColumnContent = (index, content) => {
    const newColumns = [...block.content.columns]
    newColumns[index] = { ...newColumns[index], content }

    onUpdate(block.id, {
      content: { ...block.content, columns: newColumns },
    })
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
      {/* Columns Container */}
      <div className={`flex gap-4 ${previewMode === "mobile" ? "flex-col" : "flex-row"}`}>
        {block.content.columns.map((column, index) => (
          <div
            key={index}
            className="relative flex-1 min-h-[100px] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
            style={{
              width: previewMode === "mobile" ? "100%" : column.width,
            }}
          >
            {editingColumn === index ? (
              <div className="space-y-2">
                <Textarea
                  value={column.content}
                  onChange={(e) => updateColumnContent(index, e.target.value)}
                  className="min-h-[80px] resize-none"
                  placeholder="Enter column content..."
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => setEditingColumn(null)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingColumn(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-text min-h-[80px] flex items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingColumn(index)
                }}
              >
                <p className="text-gray-700 dark:text-gray-300">
                  {column.content || "Click to edit column content..."}
                </p>
              </div>
            )}

            {/* Column Controls */}
            {isSelected && editingColumn !== index && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeColumn(index)
                  }}
                  disabled={block.content.columns.length <= 1}
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Column Button */}
      {isSelected && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <Button size="sm" onClick={addColumn} className="bg-white text-black hover:bg-gray-100 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Column
          </Button>
        </div>
      )}

      {/* Block Type Indicator */}
      {isSelected && (
        <div className="absolute -top-6 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Columns className="w-3 h-3" />
          <span>Columns</span>
        </div>
      )}
    </div>
  )
}
