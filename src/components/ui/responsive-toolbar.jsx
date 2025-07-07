"use client"

import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, Grid, Ruler, Moon, Sun, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"



export default function ResponsiveToolbar({
  zoomLevel,
  onZoomChange,
  gridSnap,
  onGridSnapChange,
  showRulers,
  onShowRulersChange,
  darkMode,
  onDarkModeChange,
  isMobile,
}) {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 25, 200)
    onZoomChange(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 25, 25)
    onZoomChange(newZoom)
  }

  const handleZoomReset = () => {
    onZoomChange(100)
  }

  if (isMobile) {
    return (
      <TooltipProvider>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 px-4 py-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 25}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="min-w-[60px] text-center">
                {zoomLevel}%
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGridSnapChange(!gridSnap)}
                    className={gridSnap ? "bg-blue-100 text-blue-700" : ""}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Snap to Grid</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDarkModeChange(!darkMode)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{darkMode ? "Light Mode" : "Dark Mode"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 px-6 py-3"
      >
        <div className="flex items-center justify-between">
          {/* Left Section - Zoom Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zoom:</Label>
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 25}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-24">
                <Slider
                  value={[zoomLevel]}
                  onValueChange={([value]) => onZoomChange(value)}
                  max={200}
                  min={25}
                  step={25}
                  className="w-full"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="min-w-[60px] text-center cursor-pointer" onClick={handleZoomReset}>
                {zoomLevel}%
              </Badge>
            </div>
          </div>

          {/* Center Section - Canvas Controls */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch id="grid-snap" checked={gridSnap} onCheckedChange={onGridSnapChange} />
              <Label htmlFor="grid-snap" className="text-sm font-medium cursor-pointer">
                <Grid className="w-4 h-4 inline mr-1" />
                Snap to Grid
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="show-rulers" checked={showRulers} onCheckedChange={onShowRulersChange} />
              <Label htmlFor="show-rulers" className="text-sm font-medium cursor-pointer">
                <Ruler className="w-4 h-4 inline mr-1" />
                Show Rulers
              </Label>
            </div>
          </div>

          {/* Right Section - Theme & View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={onDarkModeChange} />
              <Label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 inline mr-1" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 inline mr-1" />
                    Dark Mode
                  </>
                )}
              </Label>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomReset}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {zoomLevel === 100 ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Zoom (100%)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
