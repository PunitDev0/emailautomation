"use client";
import { motion } from "framer-motion"

export default function DividerBlock({
  block,
  onUpdate
}) {
  const dividerStyles = {
    borderTop: block.styles.borderTop || "1px solid #e5e7eb",
    height: `${block.styles.height || 1}px`,
    margin: `${block.styles.margin?.top || 16}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 16}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: "transparent",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      style={dividerStyles}
      className="w-full" />
  );
}
