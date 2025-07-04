"use client";
import { useState } from "react"
import { X, Copy, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExportModal({
  isOpen,
  onClose,
  html
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-template.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const minifiedHTML = html.replace(/\s+/g, " ").trim()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Export Email Template</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          <Tabs defaultValue="html" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="html">HTML Code</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Button onClick={handleCopy} className="flex items-center space-x-2">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </Button>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download HTML
                </Button>
              </div>

              <Textarea
                value={html}
                readOnly
                className="flex-1 font-mono text-sm resize-none"
                placeholder="Your HTML code will appear here..." />
            </TabsContent>

            <TabsContent value="preview" className="flex-1">
              <div className="h-full bg-gray-100 rounded-lg overflow-hidden">
                <iframe srcDoc={html} className="w-full h-full border-0" title="HTML Preview" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
