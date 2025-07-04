"use client";
import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, Grid, Ruler, Moon, Sun, Layers, Settings, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
  isMobile
}) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoomLevel + 10, 200))
  }

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoomLevel - 10, 25))
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
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="min-w-[60px] justify-center">
                {zoomLevel}%
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
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
                    className={gridSnap ? "bg-blue-100 text-blue-700" : ""}>
                    <Grid className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid Snap</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => onDarkModeChange(!darkMode)}>
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{darkMode ? "Light Mode" : "Dark Mode"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Zoom Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Zoom:</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 25}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-24">
                <Slider
                  value={[zoomLevel]}
                  onValueChange={([value]) => onZoomChange(value)}
                  min={25}
                  max={200}
                  step={5}
                  className="w-full" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Badge
                variant="outline"
                className="min-w-[60px] justify-center cursor-pointer"
                onClick={handleZoomReset}>
                {zoomLevel}%
              </Badge>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Options */}
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Switch checked={gridSnap} onCheckedChange={onGridSnapChange} />
                    <Label
                      className="text-sm cursor-pointer"
                      onClick={() => onGridSnapChange(!gridSnap)}>
                      <Grid className="w-4 h-4 inline mr-1" />
                      Grid
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Snap to grid when moving blocks</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Switch checked={showRulers} onCheckedChange={onShowRulersChange} />
                    <Label
                      className="text-sm cursor-pointer"
                      onClick={() => onShowRulersChange(!showRulers)}>
                      <Ruler className="w-4 h-4 inline mr-1" />
                      Rulers
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Show measurement rulers</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Center Section - Quick Tools */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Layers className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Layer Manager</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Palette className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Color Palette</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Canvas Settings</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Right Section - Theme & View */}
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => onDarkModeChange(!darkMode)}>
                  {darkMode ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <div
              className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Canvas:</span>
              <Badge variant="secondary">600px</Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
