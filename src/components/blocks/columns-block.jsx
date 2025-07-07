"use client"

import { motion } from "framer-motion"


export default function ColumnsBlock({ block, onUpdate }) {
  const containerStyles = {
    padding: `${block.styles.padding?.top || 16}px ${block.styles.padding?.right || 16}px ${block.styles.padding?.bottom || 16}px ${block.styles.padding?.left || 16}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 16}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor,
    borderRadius: `${block.styles.borderRadius}px`,
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={containerStyles}>
      <div className="flex gap-4">
        {block.content.columns?.map((column, index) => (
          <div
            key={index}
            className="flex-1 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-200 min-h-[100px] flex items-center justify-center text-gray-500"
            style={{ width: column.width }}
          >
            <div className="text-center">
              <div className="text-sm font-medium">{column.content}</div>
              <div className="text-xs mt-1">Width: {column.width}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
