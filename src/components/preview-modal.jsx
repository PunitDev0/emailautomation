"use client"
import { X, Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import  { EmailBlock } from "./email-template-maker"



export default function PreviewModal({ isOpen, onClose, blocks, previewMode }) {
  const generatePreviewHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Preview</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background-color: #f5f5f5;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${blocks.map((block) => generateBlockPreviewHTML(block)).join("")}
    </div>
</body>
</html>`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              {previewMode === "desktop" ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              <span>Email Preview - {previewMode}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
            <iframe srcDoc={generatePreviewHTML()} className="w-full h-full border-0" title="Email Preview" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function generateBlockPreviewHTML(block) {
  const baseStyles = `
    padding: ${block.styles.padding?.top || 0}px ${block.styles.padding?.right || 0}px ${block.styles.padding?.bottom || 0}px ${block.styles.padding?.left || 0}px;
    margin: ${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 0}px ${block.styles.margin?.left || 0}px;
    background-color: ${block.styles.backgroundColor || "transparent"};
    border-radius: ${block.styles.borderRadius || 0}px;
  `

  switch (block.type) {
    case "text":
      const textStyles = `
        ${baseStyles}
        font-size: ${block.styles.fontSize}px;
        color: ${block.styles.color};
        text-align: ${block.styles.textAlign};
        font-family: ${block.styles.fontFamily};
        line-height: ${block.styles.lineHeight};
        font-weight: ${block.content.formatting?.bold ? "bold" : "normal"};
        font-style: ${block.content.formatting?.italic ? "italic" : "normal"};
        text-decoration: ${block.content.formatting?.underline ? "underline" : "none"};
      `
      return `<${block.content.tag} style="${textStyles}">${block.content.text}</${block.content.tag}>`

    case "image":
      return `
        <div style="${baseStyles}">
          <img src="${block.content.src}" alt="${block.content.alt}" 
               style="max-width: 100%; height: auto; border-radius: ${block.styles.borderRadius || 0}px;" />
        </div>
      `

    case "button":
      const buttonStyles = `
        ${baseStyles}
        background-color: ${block.styles.backgroundColor};
        color: ${block.styles.color};
        font-size: ${block.styles.fontSize}px;
        font-weight: ${block.styles.fontWeight};
        text-decoration: none;
        display: inline-block;
        text-align: center;
      `
      return `
        <div style="text-align: center;">
          <a href="${block.content.href}" target="${block.content.target}" style="${buttonStyles}">
            ${block.content.text}
          </a>
        </div>
      `

    case "divider":
      return `<hr style="${baseStyles} border-top: ${block.styles.borderTop || "1px solid #e5e7eb"};" />`

    case "spacer":
      return `<div style="height: ${block.content.height}px;"></div>`

    case "social":
      const socialHTML = block.content.platforms
        ?.filter((p) => p.enabled)
        .map(
          (platform) =>
            `<a href="${platform.url}" style="margin: 0 8px; text-decoration: none;">
          <img src="/placeholder.svg?height=24&width=24" alt="${platform.name}" style="width: 24px; height: 24px;" />
         </a>`,
        )
        .join("")
      return `<div style="${baseStyles} text-align: center;">${socialHTML}</div>`

    case "columns":
      const columnsHTML = block.content.columns
        ?.map(
          (column) =>
            `<div style="display: inline-block; width: ${column.width}; vertical-align: top; padding: 16px;">
          ${column.content}
         </div>`,
        )
        .join("")
      return `<div style="${baseStyles}">${columnsHTML}</div>`

    default:
      return `<div style="${baseStyles}">Unknown block type</div>`
  }
}
