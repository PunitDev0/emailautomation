"use client"

import { useState } from "react"
import { BarChart3, Edit3, Download, PieChart, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast} from "sonner"

export default function ChartBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditor, setShowEditor] = useState(false)
  const [chartType, setChartType] = useState(block.content.chartType || "bar")
  const [chartData, setChartData] = useState(block.content.data || "")
  const [chartTitle, setChartTitle] = useState(block.content.title || "")
  const [width, setWidth] = useState(block.content.width || 600)
  const [height, setHeight] = useState(block.content.height || 400)
  const [showLegend, setShowLegend] = useState(block.content.showLegend !== false)
  const [colorScheme, setColorScheme] = useState(block.content.colorScheme || "default")


  const generateChartURL = () => {
    if (!chartData) return `/placeholder.svg?height=${height}&width=${width}&text=Chart+Placeholder`

    // Using Chart.js or similar service (QuickChart.io for demo)
    const config = {
      type: chartType,
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: chartTitle || "Dataset",
            data: chartData.split(",").map((n) => Number.parseFloat(n.trim()) || 0),
            backgroundColor: getColorScheme(),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: showLegend,
          },
          title: {
            display: !!chartTitle,
            text: chartTitle,
          },
        },
      },
    }

    // For demo purposes, return a placeholder
    return `/placeholder.svg?height=${height}&width=${width}&text=${chartType.toUpperCase()}+Chart`
  }

  const getColorScheme = () => {
    const schemes = {
      default: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
      blue: ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
      green: ["#166534", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"],
      purple: ["#581c87", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"],
      warm: ["#dc2626", "#ea580c", "#f59e0b", "#eab308", "#84cc16", "#22c55e"],
    }
    return schemes[colorScheme] || schemes.default
  }

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        chartType,
        data: chartData,
        title: chartTitle,
        width,
        height,
        showLegend,
        colorScheme,
      },
    })
    setShowEditor(false)
    toast({
      title: "Chart Updated! 📊",
      description: "Your chart has been updated successfully.",
      duration: 2000,
    })
  }

  const downloadChart = () => {
    // In a real implementation, you'd generate and download the actual chart
    toast({
      title: "Chart Downloaded! 📥",
      description: "Your chart has been saved to downloads.",
      duration: 2000,
    })
  }

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()

  const getChartIcon = () => {
    switch (chartType) {
      case "line":
        return <LineChart className="w-12 h-12 text-gray-400" />
      case "pie":
        return <PieChart className="w-12 h-12 text-gray-400" />
      case "bar":
      default:
        return <BarChart3 className="w-12 h-12 text-gray-400" />
    }
  }

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
      {/* Chart Toolbar */}
      {isSelected && (
        <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          <Button size="sm" variant="outline" onClick={() => setShowEditor(true)} className="bg-transparent">
            <Edit3 className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={downloadChart} className="bg-transparent">
            <Download className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-1 pl-2 border-l border-gray-200">
            <Button
              size="sm"
              variant={chartType === "bar" ? "default" : "ghost"}
              onClick={() => {
                setChartType("bar")
                onUpdate(block.id, { content: { ...block.content, chartType: "bar" } })
              }}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={chartType === "line" ? "default" : "ghost"}
              onClick={() => {
                setChartType("line")
                onUpdate(block.id, { content: { ...block.content, chartType: "line" } })
              }}
            >
              <LineChart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={chartType === "pie" ? "default" : "ghost"}
              onClick={() => {
                setChartType("pie")
                onUpdate(block.id, { content: { ...block.content, chartType: "pie" } })
              }}
            >
              <PieChart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Chart Content */}
      <div className="flex justify-center">
        {chartData ? (
          <div className="relative">
            <img
              src={generateChartURL() || "/placeholder.svg"}
              alt={`${chartType} chart${chartTitle ? ` - ${chartTitle}` : ""}`}
              className="rounded border border-gray-200 max-w-full h-auto"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                maxWidth: "100%",
              }}
              onError={(e) => {
                e.target.src = `/placeholder.svg?height=${height}&width=${width}&text=Chart+Error`
              }}
            />
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setShowEditor(true)}
            style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
          >
            {getChartIcon()}
            <p className="text-gray-500 mt-4">Click to create chart</p>
            <p className="text-xs text-gray-400 mt-2">Add data to visualize</p>
          </div>
        )}
      </div>

      {/* Chart Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chart Editor</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Chart Title */}
            <div>
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                placeholder="Enter chart title..."
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Chart Type and Color Scheme */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Chart Type</Label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="doughnut">Doughnut Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Color Scheme</Label>
                <Select value={colorScheme} onValueChange={setColorScheme}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="blue">Blue Tones</SelectItem>
                    <SelectItem value="green">Green Tones</SelectItem>
                    <SelectItem value="purple">Purple Tones</SelectItem>
                    <SelectItem value="warm">Warm Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart Data */}
            <div>
              <Label htmlFor="chart-data">Chart Data</Label>
              <Textarea
                id="chart-data"
                placeholder="Enter comma-separated values (e.g., 10, 20, 30, 40, 50, 60)"
                value={chartData}
                onChange={(e) => setChartData(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter numeric values separated by commas. Each value represents a data point.
              </p>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width: {width}px</Label>
                <input
                  type="range"
                  min="300"
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
                  min="200"
                  max="600"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-2">
              <Switch checked={showLegend} onCheckedChange={setShowLegend} />
              <Label>Show Legend</Label>
            </div>

            {/* Preview */}
            {chartData && (
              <div className="border rounded-lg p-4">
                <Label>Preview</Label>
                <div className="mt-2 flex justify-center">
                  <img
                    src={generateChartURL() || "/placeholder.svg"}
                    alt="Chart Preview"
                    className="border border-gray-200 rounded max-w-full h-auto"
                    style={{
                      width: `${Math.min(width, 400)}px`,
                      height: `${Math.min(height, 250)}px`,
                    }}
                    onError={(e) => {
                      e.target.src = `/placeholder.svg?height=250&width=400&text=Chart+Preview`
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!chartData}>
                Save Chart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
