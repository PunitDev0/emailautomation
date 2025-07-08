"use client"

import { useState } from "react"
import { QrCode, Edit3, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast} from "sonner"

export default function QRBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditor, setShowEditor] = useState(false)
  const [qrData, setQrData] = useState(block.content.data || "")
  const [qrSize, setQrSize] = useState(block.content.size || 200)
  const [qrColor, setQrColor] = useState(block.content.color || "#000000")
  const [qrBgColor, setQrBgColor] = useState(block.content.backgroundColor || "#ffffff")
  const [errorLevel, setErrorLevel] = useState(block.content.errorLevel || "M")


  const generateQRCodeURL = () => {
    if (!qrData) return "/placeholder.svg?height=200&width=200"

    // Using QR Server API for demonstration
    const params = new URLSearchParams({
      size: `${qrSize}x${qrSize}`,
      data: qrData,
      color: qrColor.replace("#", ""),
      bgcolor: qrBgColor.replace("#", ""),
      ecc: errorLevel,
    })

    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`
  }

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        data: qrData,
        size: qrSize,
        color: qrColor,
        backgroundColor: qrBgColor,
        errorLevel: errorLevel,
      },
    })
    setShowEditor(false)
    toast({
      title: "QR Code Updated! 📱",
      description: "Your QR code has been updated successfully.",
      duration: 2000,
    })
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = generateQRCodeURL()
    link.download = "qr-code.png"
    link.click()

    toast({
      title: "QR Code Downloaded! 📥",
      description: "Your QR code has been saved to downloads.",
      duration: 2000,
    })
  }

  const copyQRData = () => {
    navigator.clipboard.writeText(qrData)
    toast({
      title: "Copied! 📋",
      description: "QR code data copied to clipboard.",
      duration: 2000,
    })
  }

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
        textAlign: styles.textAlign || "center",
      }}
    >
      {/* QR Code Toolbar */}
      {isSelected && (
        <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          <Button size="sm" variant="outline" onClick={() => setShowEditor(true)} className="bg-transparent">
            <Edit3 className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={downloadQR} className="bg-transparent">
            <Download className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={copyQRData} className="bg-transparent">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* QR Code Content */}
      <div className="flex justify-center">
        {qrData ? (
          <img
            src={generateQRCodeURL() || "/placeholder.svg"}
            alt="QR Code"
            className="rounded border border-gray-200"
            style={{
              width: `${qrSize}px`,
              height: `${qrSize}px`,
              maxWidth: "100%",
              height: "auto",
            }}
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=200&width=200"
            }}
          />
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setShowEditor(true)}
          >
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Click to create QR code</p>
            <p className="text-xs text-gray-400 mt-2">Enter URL, text, or data</p>
          </div>
        )}
      </div>

      {/* QR Code Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>QR Code Generator</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* QR Data Input */}
            <div>
              <Label htmlFor="qr-data">QR Code Data</Label>
              <Input
                id="qr-data"
                placeholder="Enter URL, text, or any data..."
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Can be a URL, text, phone number, email, or any data</p>
            </div>

            {/* QR Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Size: {qrSize}px</Label>
                <Slider
                  value={[qrSize]}
                  onValueChange={([value]) => setQrSize(value)}
                  min={100}
                  max={500}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Error Correction Level</Label>
                <Select value={errorLevel} onValueChange={setErrorLevel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Foreground Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="flex-1" />
                </div>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-12 h-8 p-0 border-0"
                  />
                  <Input value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>

            {/* Preview */}
            {qrData && (
              <div className="border rounded-lg p-4">
                <Label>Preview</Label>
                <div className="mt-2 flex justify-center">
                  <img
                    src={generateQRCodeURL() || "/placeholder.svg"}
                    alt="QR Code Preview"
                    className="border border-gray-200 rounded"
                    style={{ width: `${Math.min(qrSize, 200)}px`, height: `${Math.min(qrSize, 200)}px` }}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!qrData}>
                Save QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
