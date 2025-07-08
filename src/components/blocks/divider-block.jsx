"use client"

import { Minus } from "lucide-react"

export default function DividerBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
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
      }}
    >
      {/* Divider Line */}
      <hr
        className="border-0"
        style={{
          height: `${block.content.thickness || 1}px`,
          backgroundColor: block.content.color || "#e5e7eb",
          borderStyle: block.content.style || "solid",
          borderWidth: block.content.style === "solid" ? 0 : `${block.content.thickness || 1}px 0 0 0`,
          borderColor: block.content.color || "#e5e7eb",
        }}
      />

      {/* Block Type Indicator */}
      {isSelected && (
        <div className="absolute -top-6 -right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Minus className="w-3 h-3" />
          <span>Divider</span>
        </div>
      )}
    </div>
  )
}
