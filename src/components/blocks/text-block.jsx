import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Type, Edit3, Check, X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LinkEditorModal from "../modals/link-editor-modal";
import { useDebouncedCallback } from "../../hooks/use-debounce";
import DOMPurify from "dompurify";

export default function TextBlock({ block, onUpdate, previewMode, styles = {}, isSelected, onSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHtml, setTempHtml] = useState(block.content.text || "");
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState(null);
  const [existingLink, setExistingLink] = useState(null);
  const textRef = useRef(null);

  // Debounced update function
  const debouncedUpdate = useDebouncedCallback((updates) => {
    onUpdate(block.id, updates);
  }, 300);

  // Sanitize HTML content
  const getSanitizedHtml = useCallback((htmlContent) => {
    return DOMPurify.sanitize(htmlContent || "", {
      ADD_TAGS: ["div", "span", "p", "h1", "h2", "h3", "h4", "a", "strong", "em"],
      ADD_ATTR: ["style", "target", "rel", "title", "class"],
      FORBID_TAGS: ["script", "iframe"],
      FORBID_ATTR: ["onerror", "onload"],
    });
  }, []);

  // Combine block and responsive styles
  const getResponsiveStyles = useCallback(() => {
    // Initialize default styles if undefined
    const baseStyles = block.styles || {};
    const responsiveStyles = block.responsive?.[previewMode] || {};
    const parentStyles = styles || {};

    return {
      fontSize: `${parentStyles.fontSize || baseStyles.fontSize || 16}px`,
      color: parentStyles.color || baseStyles.color || "#333333",
      textAlign: parentStyles.textAlign || baseStyles.textAlign || "left",
      fontFamily: parentStyles.fontFamily || baseStyles.fontFamily || "Arial, sans-serif",
      lineHeight: parentStyles.lineHeight || baseStyles.lineHeight || 1.5,
      padding: `${parentStyles.padding?.top || baseStyles.padding?.top || 16}px ${
        parentStyles.padding?.right || baseStyles.padding?.right || 16
      }px ${parentStyles.padding?.bottom || baseStyles.padding?.bottom || 16}px ${
        parentStyles.padding?.left || baseStyles.padding?.left || 16
      }px`,
      margin: `${parentStyles.margin?.top || baseStyles.margin?.top || 0}px ${
        parentStyles.margin?.right || baseStyles.margin?.right || 0
      }px ${parentStyles.margin?.bottom || baseStyles.margin?.bottom || 16}px ${
        parentStyles.margin?.left || baseStyles.margin?.left || 0
      }px`,
      backgroundColor: parentStyles.backgroundColor || baseStyles.backgroundColor || "transparent",
      borderRadius: `${parentStyles.borderRadius || baseStyles.borderRadius || 0}px`,
      transition: "all 0.2s ease",
    };
  }, [block.styles, block.responsive, previewMode, styles]);

  const textStyles = getResponsiveStyles();

  // Handle double-click to enter edit mode
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setTempHtml(getSanitizedHtml(block.content.text));
    if (textRef.current) {
      textRef.current.focus();
    }
  }, [block.content.text, getSanitizedHtml]);

  // Handle save
  const handleSave = useCallback(() => {
    if (textRef.current) {
      const htmlContent = getSanitizedHtml(textRef.current.innerHTML);
      onUpdate(block.id, { content: { ...block.content, text: htmlContent } });
      setTempHtml(htmlContent);
      setIsEditing(false);
    }
  }, [block.content, onUpdate, getSanitizedHtml]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setTempHtml(getSanitizedHtml(block.content.text));
    setSelectedText("");
    setSelectionRange(null);
    setExistingLink(null);
  }, [block.content.text, getSanitizedHtml]);

  // Handle content change
  const handleContentChange = useCallback(() => {
    if (textRef.current) {
      const newHtml = textRef.current.innerHTML;
      setTempHtml(newHtml);
      debouncedUpdate({ content: { ...block.content, text: getSanitizedHtml(newHtml) } });
    }
  }, [block.content, debouncedUpdate, getSanitizedHtml]);

  // Handle key down
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  // Handle text selection
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() && textRef.current) {
      const selectedText = selection.toString();
      const range = selection.getRangeAt(0);
      setSelectedText(selectedText);
      setSelectionRange({
        start: range.startOffset,
        end: range.endOffset,
        range,
      });

      let parentElement = range.commonAncestorContainer;
      if (parentElement.nodeType === Node.TEXT_NODE) {
        parentElement = parentElement.parentElement;
      }
      while (parentElement && parentElement !== textRef.current && parentElement.tagName !== "A") {
        parentElement = parentElement.parentElement;
      }
      if (parentElement && parentElement.tagName === "A") {
        setExistingLink({
          text: selectedText,
          url: parentElement.getAttribute("href") || "",
          target: parentElement.getAttribute("target") || "_blank",
          type: "website",
          title: parentElement.getAttribute("title") || "",
          rel: parentElement.getAttribute("rel") || "",
        });
      } else {
        setExistingLink(null);
      }
    } else {
      setSelectedText("");
      setSelectionRange(null);
      setExistingLink(null);
    }
  }, []);

  // Handle adding link
  const handleAddLink = useCallback(() => {
    handleTextSelection();
    if (selectedText && textRef.current) {
      setShowLinkEditor(true);
    }
  }, [selectedText, handleTextSelection]);

  // Handle inserting link
  const handleInsertLink = useCallback(
    (linkData) => {
      if (!selectionRange || !textRef.current) return;
      const { range } = selectionRange;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", linkData.url);
      linkElement.setAttribute("target", linkData.target);
      if (linkData.title) linkElement.setAttribute("title", linkData.title);
      if (linkData.rel) linkElement.setAttribute("rel", linkData.rel);
      linkElement.style.color = "#2563eb";
      linkElement.style.textDecoration = "underline";
      linkElement.textContent = linkData.text;

      try {
        range.deleteContents();
        range.insertNode(linkElement);
      } catch (error) {
        console.error("Error inserting link:", error);
        return;
      }

      const newHtml = getSanitizedHtml(textRef.current.innerHTML);
      setTempHtml(newHtml);
      onUpdate(block.id, { content: { ...block.content, text: newHtml } });
      setShowLinkEditor(false);
      setSelectedText("");
      setSelectionRange(null);
      setExistingLink(null);
      textRef.current.focus();
    },
    [selectionRange, block.content, onUpdate, getSanitizedHtml],
  );

  // Inline formatting
  const applyFormatting = (format) => {
    if (!selectionRange || !textRef.current) return;
    const { range } = selectionRange;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    try {
      if (format === "bold") {
        document.execCommand("bold", false, null);
      } else if (format === "italic") {
        document.execCommand("italic", false, null);
      } else if (format === "underline") {
        document.execCommand("underline", false, null);
      }
      const newHtml = getSanitizedHtml(textRef.current.innerHTML);
      setTempHtml(newHtml);
      debouncedUpdate({ content: { ...block.content, text: newHtml } });
      textRef.current.focus();
    } catch (error) {
      console.error(`Error applying ${format}:`, error);
    }
  };

  // Block-level style updates
  const updateAlignment = (alignment) => {
    onUpdate(block.id, {
      styles: { ...block.styles, textAlign: alignment },
    });
  };

  const updateFontSize = (size) => {
    onUpdate(block.id, {
      styles: { ...block.styles, fontSize: size },
    });
  };

  const updateColor = (color) => {
    onUpdate(block.id, {
      styles: { ...block.styles, color },
    });
  };

  const Tag = block.content.tag || "div";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      } ${isEditing ? "ring-2 ring-green-500 ring-opacity-50" : ""}`}
      style={textStyles}
      onClick={() => onSelect(block.id)}
    >
      {isEditing ? (
        <div className="relative">
          {/* Inline Formatting Toolbar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 mb-2 flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting("bold")}
              className="h-8 px-3"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting("italic")}
              className="h-8 px-3"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting("underline")}
              className="h-8 px-3"
            >
              <Underline className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddLink}
              className="h-8 px-3"
              disabled={!selectedText}
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>

          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            onMouseUp={handleTextSelection}
            className="w-full border-2 border-blue-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm transition-all duration-200"
            style={{
              fontSize: textStyles.fontSize,
              fontFamily: textStyles.fontFamily,
              minHeight: "60px",
              whiteSpace: "pre-wrap",
              outline: "none",
            }}
            dangerouslySetInnerHTML={{ __html: getSanitizedHtml(tempHtml) || "Type your text here..." }}
            aria-label="Editable text content"
          />

          <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <div className="flex items-center text-xs text-gray-600">
              <span>💡 Press Enter to save, Escape to cancel</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs bg-transparent"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Block-Level Style Toolbar */}
          {isSelected && (
            <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
              <Button
                size="sm"
                variant={textStyles.textAlign === "left" ? "default" : "ghost"}
                onClick={() => updateAlignment("left")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={textStyles.textAlign === "center" ? "default" : "ghost"}
                onClick={() => updateAlignment("center")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={textStyles.textAlign === "right" ? "default" : "ghost"}
                onClick={() => updateAlignment("right")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-1 pr-2 border-r border-gray-200">
                <Input
                  type="number"
                  value={parseInt(textStyles.fontSize) || 16}
                  onChange={(e) => updateFontSize(Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                  min="8"
                  max="72"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
              <div className="flex items-center space-x-1">
                <Input
                  type="color"
                  value={textStyles.color || "#333333"}
                  onChange={(e) => updateColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0 rounded"
                />
              </div>
            </div>
          )}

          <Tag
            ref={textRef}
            style={textStyles}
            onDoubleClick={handleDoubleClick}
            onMouseUp={handleTextSelection}
            className="cursor-text hover:bg-blue-50 transition-colors duration-200 min-h-[20px] block relative"
            dangerouslySetInnerHTML={{ __html: getSanitizedHtml(block.content.text) || "Click to edit text..." }}
            aria-label="Text block"
          />
        </>
      )}

      {/* Link Editor Modal */}
      <LinkEditorModal
        isOpen={showLinkEditor}
        onClose={() => {
          setShowLinkEditor(false);
          setSelectedText("");
          setSelectionRange(null);
          setExistingLink(null);
        }}
        selectedText={selectedText}
        onInsertLink={handleInsertLink}
        existingLink={existingLink}
      />

      {/* Indicators */}
      {isSelected && !isEditing && (
        <div className="absolute -top-6 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Type className="w-3 h-3" />
          <span>Text</span>
        </div>
      )}
      {isEditing && (
        <div className="absolute -top-6 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Edit3 className="w-3 h-3" />
          <span>Editing</span>
        </div>
      )}
    </motion.div>
  );
}