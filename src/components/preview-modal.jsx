"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Monitor, Smartphone, Tablet, Send, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PreviewModal({ isOpen, onClose, blocks, previewMode: initialPreviewMode, templateName }) {
  const [previewMode, setPreviewMode] = useState(initialPreviewMode || "desktop")

  const generateEmailHTML = () => {
    // This would generate the actual HTML email content
    // For now, we'll create a simplified version
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateName}</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
        }
    </style>
</head>
<body>
    <div class="email-container">
`

    blocks.forEach((block) => {
      switch (block.type) {
        case "text":
          html += `<div style="padding: 16px;">${block.content.text || ""}</div>`
          break
        case "image":
          if (block.content.src) {
            html += `<div style="padding: 16px; text-align: center;">
              <img src="${block.content.src}" alt="${block.content.alt || ""}" style="max-width: 100%; height: auto;" />
            </div>`
          }
          break
        case "button":
          html += `<div style="padding: 16px; text-align: center;">
            <a href="${block.content.href || "#"}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
              ${block.content.text || "Button"}
            </a>
          </div>`
          break
        case "divider":
          html += `<div style="padding: 16px;"><hr style="border: none; height: 1px; background-color: #e5e7eb;" /></div>`
          break
        case "spacer":
          html += `<div style="height: ${block.content.height || 40}px;"></div>`
          break
        default:
          html += `<div style="padding: 16px;"><!-- ${block.type} element --></div>`
      }
    })

    html += `
    </div>
</body>
</html>`

    return html
  }

  const getPreviewStyles = () => {
    switch (previewMode) {
      case "mobile":
        return { width: "375px", height: "667px" }
      case "tablet":
        return { width: "768px", height: "1024px" }
      default:
        return { width: "1200px", height: "800px" }
    }
  }

  const handleSendTest = () => {
    // This would integrate with an email service
    console.log("Send test email")
  }

  const handleDownload = () => {
    const html = generateEmailHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${templateName.replace(/\s+/g, "-").toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Email Preview</h2>
              </div>
              <Badge variant="secondary">{templateName}</Badge>
            </div>

            <div className="flex items-center space-x-2">
              {/* Device Selector */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === "tablet" ? "default" : "ghost"}
                  onClick={() => setPreviewMode("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button size="sm" variant="outline" onClick={handleSendTest}>
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </Button>

              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-8">
            <div className="flex justify-center">
              <motion.div
                key={previewMode}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={getPreviewStyles()}
              >
                {/* Email Content */}
                <div className="h-full overflow-auto">
                  <iframe srcDoc={generateEmailHTML()} className="w-full h-full border-0" title="Email Preview" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Elements: {blocks.length}</span>
                <span>•</span>
                <span>Preview Mode: {previewMode}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Ready to send</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
