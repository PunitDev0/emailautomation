"use client";
import { motion } from "framer-motion"

export default function ButtonBlock({
  block,
  onUpdate
}) {
  const buttonStyles = {
    backgroundColor: block.styles.backgroundColor,
    color: block.styles.color,
    fontSize: `${block.styles.fontSize}px`,
    fontWeight: block.styles.fontWeight,
    textAlign: block.styles.textAlign,
    borderRadius: `${block.styles.borderRadius}px`,
    border: block.styles.border,
    padding: `${block.styles.padding?.top || 12}px ${block.styles.padding?.right || 24}px ${block.styles.padding?.bottom || 12}px ${block.styles.padding?.left || 24}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 0}px ${block.styles.margin?.left || 0}px`,
    display: block.styles.display || "inline-block",
    textDecoration: "none",
    cursor: "pointer",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center">
      <a
        href={block.content.href}
        target={block.content.target}
        style={buttonStyles}
        className="hover:opacity-90 transition-opacity duration-200"
        // Prevent navigation in editor
        onClick={(e) => e.preventDefault()}>
        {block.content.text}
      </a>
    </motion.div>
  );
}
