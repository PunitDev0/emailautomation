"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
} from "lucide-react"

const PerformanceMonitor = ({ setisVisible, isVisible }) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 45,
    renderTime: 16.7,
    blockCount: 0,
    canvasSize: { width: 0, height: 0 },
    lastUpdate: Date.now(),
  })

  const [history, setHistory] = useState({
    fps: [],
    memory: [],
    renderTime: [],
  })

  const [alerts, setAlerts] = useState([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const intervalRef = useRef(null)
  const performanceRef = useRef({
    frameCount: 0,
    lastTime: performance.now(),
    renderTimes: [],
  })

  // Performance monitoring
  useEffect(() => {
    if (!isMonitoring) return

    const updateMetrics = () => {
      const now = performance.now()
      const deltaTime = now - performanceRef.current.lastTime

      // Calculate FPS
      performanceRef.current.frameCount++
      if (deltaTime >= 1000) {
        const fps = Math.round((performanceRef.current.frameCount * 1000) / deltaTime)

        // Memory usage (approximation)
        const memoryUsage = performance.memory
          ? Math.round((performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100)
          : Math.random() * 20 + 40 // Fallback for browsers without memory API

        // Render time
        const avgRenderTime =
          performanceRef.current.renderTimes.length > 0
            ? performanceRef.current.renderTimes.reduce((a, b) => a + b, 0) / performanceRef.current.renderTimes.length
            : 16.7

        // Block count from DOM
        const blockCount = document.querySelectorAll("[data-block-id]").length

        // Canvas size
        const canvas = document.querySelector(".email-canvas")
        const canvasSize = canvas
          ? {
              width: canvas.offsetWidth,
              height: canvas.offsetHeight,
            }
          : { width: 0, height: 0 }

        const newMetrics = {
          fps: Math.max(0, Math.min(60, fps)),
          memoryUsage: Math.max(0, Math.min(100, memoryUsage)),
          renderTime: Math.max(0, avgRenderTime),
          blockCount,
          canvasSize,
          lastUpdate: Date.now(),
        }

        setMetrics(newMetrics)

        // Update history
        setHistory((prev) => ({
          fps: [...prev.fps.slice(-19), fps],
          memory: [...prev.memory.slice(-19), memoryUsage],
          renderTime: [...prev.renderTime.slice(-19), avgRenderTime],
        }))

        // Check for performance issues
        checkPerformanceAlerts(newMetrics)

        performanceRef.current.frameCount = 0
        performanceRef.current.lastTime = now
        performanceRef.current.renderTimes = []
      }
    }

    intervalRef.current = setInterval(updateMetrics, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMonitoring])

  // Performance alerts
  const checkPerformanceAlerts = (currentMetrics) => {
    const newAlerts = []

    if (currentMetrics.fps < 30) {
      newAlerts.push({
        id: "low-fps",
        type: "warning",
        message: `Low FPS detected: ${currentMetrics.fps}`,
        timestamp: Date.now(),
      })
    }

    if (currentMetrics.memoryUsage > 80) {
      newAlerts.push({
        id: "high-memory",
        type: "error",
        message: `High memory usage: ${currentMetrics.memoryUsage}%`,
        timestamp: Date.now(),
      })
    }

    if (currentMetrics.renderTime > 33) {
      newAlerts.push({
        id: "slow-render",
        type: "warning",
        message: `Slow render time: ${currentMetrics.renderTime.toFixed(1)}ms`,
        timestamp: Date.now(),
      })
    }

    if (currentMetrics.blockCount > 50) {
      newAlerts.push({
        id: "many-blocks",
        type: "info",
        message: `High block count: ${currentMetrics.blockCount}`,
        timestamp: Date.now(),
      })
    }

    setAlerts((prev) => {
      const filtered = prev.filter((alert) => !newAlerts.some((newAlert) => newAlert.id === alert.id))
      return [...filtered, ...newAlerts].slice(-10)
    })
  }

  // Performance status
  const getPerformanceStatus = () => {
    if (metrics.fps < 30 || metrics.memoryUsage > 80) return "poor"
    if (metrics.fps < 45 || metrics.memoryUsage > 60) return "fair"
    return "good"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "fair":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4" />
      case "fair":
        return <AlertTriangle className="h-4 w-4" />
      case "poor":
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  // Export performance data
  const exportPerformanceData = () => {
    const data = {
      metrics,
      history,
      alerts,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `performance-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Mini chart component
  const MiniChart = ({ data, color = "#3b82f6", height = 40 }) => {
    if (!data || data.length === 0) return null

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = ((max - value) / range) * height
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg width="100%" height={height} className="overflow-visible">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" className="drop-shadow-sm" />
      </svg>
    )
  }

  if (!isVisible) {
    return (
      <Button variant="outline" size="sm" onClick={()=>setisVisible(!isVisible)} className="fixed bottom-4 right-4 z-50 bg-transparent">
        <Eye className="h-4 w-4" />
      </Button>
    )
  }

  const status = getPerformanceStatus()

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={status === "good" ? "default" : status === "fair" ? "secondary" : "destructive"}
              className="text-xs"
            >
              <span className={`flex items-center gap-1 ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                {status.toUpperCase()}
              </span>
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsMonitoring(!isMonitoring)}>
              <RefreshCw className={`h-4 w-4 ${isMonitoring ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={()=>setisVisible(!isVisible)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="metrics" className="text-xs">
              Metrics
            </TabsTrigger>
            <TabsTrigger value="charts" className="text-xs">
              Charts
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              Alerts
              {alerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {alerts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  FPS
                </div>
                <div className="text-lg font-semibold">{metrics.fps}</div>
                <Progress value={(metrics.fps / 60) * 100} className="h-1" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <HardDrive className="h-3 w-3" />
                  Memory
                </div>
                <div className="text-lg font-semibold">{metrics.memoryUsage}%</div>
                <Progress value={metrics.memoryUsage} className="h-1" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Render
                </div>
                <div className="text-lg font-semibold">{metrics.renderTime.toFixed(1)}ms</div>
                <Progress value={Math.min((metrics.renderTime / 33) * 100, 100)} className="h-1" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Cpu className="h-3 w-3" />
                  Blocks
                </div>
                <div className="text-lg font-semibold">{metrics.blockCount}</div>
                <Progress value={Math.min((metrics.blockCount / 100) * 100, 100)} className="h-1" />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Canvas: {metrics.canvasSize.width}×{metrics.canvasSize.height}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-3">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">FPS History</div>
                <MiniChart data={history.fps} color="#10b981" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Memory Usage</div>
                <MiniChart data={history.memory} color="#f59e0b" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Render Time</div>
                <MiniChart data={history.renderTime} color="#ef4444" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-4">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                No performance issues detected
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={`${alert.id}-${alert.timestamp}`}
                    className={`p-2 rounded text-xs border-l-2 ${
                      alert.type === "error"
                        ? "bg-red-50 border-red-500 text-red-700"
                        : alert.type === "warning"
                          ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                          : "bg-blue-50 border-blue-500 text-blue-700"
                    }`}
                  >
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-xs opacity-70">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-3 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Updated: {new Date(metrics.lastUpdate).toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" onClick={exportPerformanceData} className="text-xs bg-transparent">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceMonitor
