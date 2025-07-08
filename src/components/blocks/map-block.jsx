"use client"

import { useState } from "react"
import { MapPin, Edit3, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast} from "sonner"

export default function MapBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditor, setShowEditor] = useState(false)
  const [address, setAddress] = useState(block.content.address || "")
  const [mapType, setMapType] = useState(block.content.mapType || "roadmap")
  const [zoom, setZoom] = useState(block.content.zoom || 15)
  const [showMarker, setShowMarker] = useState(block.content.showMarker !== false)
  const [width, setWidth] = useState(block.content.width || 600)
  const [height, setHeight] = useState(block.content.height || 300)


  const generateMapURL = () => {
    if (!address) return "/placeholder.svg?height=300&width=600&text=Map+Placeholder"

    // Using Google Maps Static API format (you'd need an API key in production)
    const params = new URLSearchParams({
      center: address,
      zoom: zoom.toString(),
      size: `${width}x${height}`,
      maptype: mapType,
      markers: showMarker ? `color:red|${address}` : "",
      key: "YOUR_API_KEY", // Replace with actual API key
    })

    // For demo purposes, return a placeholder
    return `/placeholder.svg?height=${height}&width=${width}&text=Map:+${encodeURIComponent(address)}`
  }

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        address,
        mapType,
        zoom,
        showMarker,
        width,
        height,
      },
    })
    setShowEditor(false)
    toast({
      title: "Map Updated! 🗺️",
      description: "Your map has been updated successfully.",
      duration: 2000,
    })
  }

  const searchLocation = () => {
    // In a real implementation, you'd use geocoding API
    toast({
      title: "Location Found! 📍",
      description: `Showing map for: ${address}`,
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
      {/* Map Toolbar */}
      {isSelected && (
        <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          <Button size="sm" variant="outline" onClick={() => setShowEditor(true)} className="bg-transparent">
            <Edit3 className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={searchLocation} className="bg-transparent">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Map Content */}
      <div className="flex justify-center">
        {address ? (
          <div className="relative">
            <img
              src={generateMapURL() || "/placeholder.svg"}
              alt={`Map of ${address}`}
              className="rounded border border-gray-200 max-w-full h-auto"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                maxWidth: "100%",
              }}
              onError={(e) => {
                e.target.src = `/placeholder.svg?height=${height}&width=${width}&text=Map+Error`
              }}
            />
            {showMarker && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
              </div>
            )}
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setShowEditor(true)}
            style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
          >
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Click to add map</p>
            <p className="text-xs text-gray-400 mt-2">Enter an address or location</p>
          </div>
        )}
      </div>

      {/* Map Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Map Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Address Input */}
            <div>
              <Label htmlFor="map-address">Address or Location</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="map-address"
                  placeholder="Enter address, city, or landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchLocation} disabled={!address}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Map Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Map Type</Label>
                <Select value={mapType} onValueChange={setMapType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Zoom Level: {zoom}</Label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width: {width}px</Label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label>Height: {height}px</Label>
                <input
                  type="range"
                  min="150"
                  max="600"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-2">
              <Switch checked={showMarker} onCheckedChange={setShowMarker} />
              <Label>Show Location Marker</Label>
            </div>

            {/* Preview */}
            {address && (
              <div className="border rounded-lg p-4">
                <Label>Preview</Label>
                <div className="mt-2 flex justify-center">
                  <img
                    src={generateMapURL() || "/placeholder.svg"}
                    alt="Map Preview"
                    className="border border-gray-200 rounded max-w-full h-auto"
                    style={{
                      width: `${Math.min(width, 400)}px`,
                      height: `${Math.min(height, 200)}px`,
                    }}
                    onError={(e) => {
                      e.target.src = `/placeholder.svg?height=200&width=400&text=Map+Preview`
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!address}>
                Save Map
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
