"use client";
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Link, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import LinkEditorModal from "../modals/link-editor-modal"

export default function TextBlock({
  block,
  onUpdate
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(block.content.text)
  const [showLinkEditor, setShowLinkEditor] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState(null)
  const [existingLink, setExistingLink] = useState(null)
  const textRef = useRef(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditText(block.content.text)
  }

  const handleSave = () => {
    onUpdate({ text: editText })
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditText(block.content.text)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString()
      const range = selection.getRangeAt(0)

      setSelectedText(selectedText)
      setSelectionRange({
        start: range.startOffset,
        end: range.endOffset,
      })

      // Check if selection is already a link
      const parentElement = range.commonAncestorContainer.parentElement
      if (parentElement && parentElement.tagName === "A") {
        setExistingLink({
          text: selectedText,
          url: parentElement.getAttribute("href") || "",
          target: (parentElement.getAttribute("target")) || "_blank",
          type: "website",
          title: parentElement.getAttribute("title") || "",
          rel: parentElement.getAttribute("rel") || "",
        })
      } else {
        setExistingLink(null)
      }
    }
  }

  const handleAddLink = () => {
    handleTextSelection()
    if (selectedText) {
      setShowLinkEditor(true)
    }
  }

  const handleInsertLink = (linkData) => {
    if (!selectionRange) return

    const currentText = block.content.text
    const beforeSelection = currentText.substring(0, selectionRange.start)
    const afterSelection = currentText.substring(selectionRange.end)

    const linkHtml = `<a href="${linkData.url}" target="${linkData.target}" ${linkData.title ? `title="${linkData.title}"` : ""} ${linkData.rel ? `rel="${linkData.rel}"` : ""} style="color: #2563eb; text-decoration: underline;">${linkData.text}</a>`

    const newText = beforeSelection + linkHtml + afterSelection

    onUpdate({ text: newText })
    setShowLinkEditor(false)
    setSelectedText("")
    setSelectionRange(null)
    setExistingLink(null)
  }

  const textStyles = {
    fontSize: `${block.styles.fontSize}px`,
    color: block.styles.color,
    textAlign: block.styles.textAlign,
    fontFamily: block.styles.fontFamily,
    lineHeight: block.styles.lineHeight,
    fontWeight: block.content.formatting?.bold ? "bold" : "normal",
    fontStyle: block.content.formatting?.italic ? "italic" : "normal",
    textDecoration: block.content.formatting?.underline ? "underline" : "none",
    padding: `${block.styles.padding?.top || 0}px ${block.styles.padding?.right || 0}px ${block.styles.padding?.bottom || 0}px ${block.styles.padding?.left || 0}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 0}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor,
    borderRadius: `${block.styles.borderRadius}px`,
  }

  const Tag = block.content.tag || "p"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative group">
      {isEditing ? (
        <div className="relative">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full resize-none border-2 border-blue-500 rounded p-2 focus:outline-none"
            style={{
              fontSize: textStyles.fontSize,
              fontFamily: textStyles.fontFamily,
              minHeight: "40px",
            }}
            autoFocus />
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-white shadow-sm"
              onClick={handleAddLink}
              title="Add Link">
              <Link className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <Tag
          ref={textRef}
          style={textStyles}
          onDoubleClick={handleDoubleClick}
          onMouseUp={handleTextSelection}
          className="cursor-text hover:bg-blue-50 transition-colors duration-200 min-h-[20px] block"
          dangerouslySetInnerHTML={{ __html: block.content.text }} />
      )}
      {/* Floating toolbar for text selection */}
      {!isEditing && selectedText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-20 bg-white shadow-lg rounded-lg border p-1 flex items-center space-x-1"
          style={{
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleAddLink}>
            <Link className="w-4 h-4 mr-1" />
            {existingLink ? "Edit Link" : "Add Link"}
          </Button>
        </motion.div>
      )}
      {!isEditing && !selectedText && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute top-2 right-2 flex space-x-1">
            <div
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Type className="w-3 h-3" />
              <span>Double-click to edit</span>
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div
              className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Link className="w-3 h-3" />
              <span>Select text to add links</span>
            </div>
          </div>
        </div>
      )}
      <LinkEditorModal
        isOpen={showLinkEditor}
        onClose={() => {
          setShowLinkEditor(false)
          setSelectedText("")
          setSelectionRange(null)
          setExistingLink(null)
        }}
        selectedText={selectedText}
        onInsertLink={handleInsertLink}
        existingLink={existingLink} />
    </motion.div>
  );
}
