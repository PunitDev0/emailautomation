"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Zap, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export default function PerformanceMonitor({ blockCount, isVisible }) {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    blockCount: 0,
    fps: 60,
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId

    const updateMetrics = () => {
      const currentTime = performance.now()
      frameCount++

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        setMetrics((prev) => ({
          ...prev,
          renderTime: Math.round(currentTime - lastTime),
          blockCount,
          fps,
          memoryUsage: (performance).memory
            ? Math.round((performance).memory.usedJSHeapSize / 1024 / 1024)
            : 0,
        }))

        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(updateMetrics)
    }

    if (isVisible) {
      animationId = requestAnimationFrame(updateMetrics)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [blockCount, isVisible])

  const getPerformanceStatus = () => {
    if (metrics.fps < 30 || metrics.renderTime > 100) return "poor"
    if (metrics.fps < 50 || metrics.renderTime > 50) return "fair"
    return "good"
  }

  const status = getPerformanceStatus()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="bg-white/90 backdrop-blur-lg border-white/40 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Performance</span>
                <Badge
                  variant={status === "good" ? "default" : status === "fair" ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span>{metrics.fps} FPS</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>{metrics.renderTime}ms</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span>{metrics.blockCount} blocks</span>
                </div>
                {metrics.memoryUsage > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span>{metrics.memoryUsage}MB</span>
                  </div>
                )}
              </div>

              {status === "poor" && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Performance issues detected</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
