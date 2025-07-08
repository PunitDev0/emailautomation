"use client"

import { Move } from "lucide-react"

export default function SpacerBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 dark:bg-blue-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
      onClick={() => onSelect(block.id)}
      style={{
        height: `${block.content.height || 40}px`,
        margin: `${styles.margin?.top || 0}px ${styles.margin?.right || 0}px ${styles.margin?.bottom || 0}px ${styles.margin?.left || 0}px`,
        backgroundColor: isSelected ? undefined : "transparent",
      }}
    >
      {/* Spacer Visualization */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <Move className="w-3 h-3" />
            <span>{block.content.height || 40}px</span>
          </div>
        </div>
      )}

      {/* Block Type Indicator */}
      {isSelected && (
        <div className="absolute -top-6 -right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Move className="w-3 h-3" />
          <span>Spacer</span>
        </div>
      )}
    </div>
  )
}
