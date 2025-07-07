"use client"

import { motion } from "framer-motion"
import { EmailBlock } from "../email-template-maker"


export default function SpacerBlock({ block, onUpdate }) {
  const spacerStyles = {
    height: `${block.content.height}px`,
    backgroundColor: "transparent",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={spacerStyles}
      className="w-full relative group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center">
        <span className="text-xs text-blue-600 font-medium">Spacer ({block.content.height}px)</span>
      </div>
    </motion.div>
  )
}
