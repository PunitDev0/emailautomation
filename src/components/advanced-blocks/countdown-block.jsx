"use client"

import { useState, useEffect } from "react"
import { Clock, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CountdownBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [title, setTitle] = useState(block.content.title || "")
  const [subtitle, setSubtitle] = useState(block.content.subtitle || "")
  const [targetDate, setTargetDate] = useState(
    block.content.targetDate ? new Date(block.content.targetDate).toISOString().slice(0, 16) : "",
  )
  const [showDays, setShowDays] = useState(block.content.showDays !== false)
  const [showHours, setShowHours] = useState(block.content.showHours !== false)
  const [showMinutes, setShowMinutes] = useState(block.content.showMinutes !== false)
  const [showSeconds, setShowSeconds] = useState(block.content.showSeconds !== false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(block.content.targetDate)
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [block.content.targetDate])

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        title,
        subtitle,
        targetDate: new Date(targetDate).toISOString(),
        showDays,
        showHours,
        showMinutes,
        showSeconds,
      },
    })
    setShowEditDialog(false)
  }

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()

  const timeBoxes = [
    { value: timeLeft.days, label: "Days", show: showDays },
    { value: timeLeft.hours, label: "Hours", show: showHours },
    { value: timeLeft.minutes, label: "Minutes", show: showMinutes },
    { value: timeLeft.seconds, label: "Seconds", show: showSeconds },
  ].filter((box) => box.show)

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onClick={() => onSelect(block.id)}
      style={{
        padding: `${styles.padding?.top || 16}px ${styles.padding?.right || 16}px ${styles.padding?.bottom || 16}px ${styles.padding?.left || 16}px`,
        margin: `${styles.margin?.top || 0}px ${styles.margin?.right || 0}px ${styles.margin?.bottom || 16}px ${styles.margin?.left || 0}px`,
        backgroundColor: styles.backgroundColor || "#f8fafc",
        borderRadius: `${styles.borderRadius || 8}px`,
        textAlign: styles.textAlign || "center",
      }}
    >
      {/* Title */}
      {block.content.title && (
        <h3
          className="font-bold mb-2"
          style={{
            fontSize: `${(styles.fontSize || 16) + 4}px`,
            color: styles.titleColor || "#333333",
          }}
        >
          {block.content.title}
        </h3>
      )}

      {/* Countdown Display */}
      <div
        className={`flex items-center justify-center space-x-4 mb-4 ${previewMode === "mobile" ? "flex-wrap gap-2" : ""}`}
      >
        {timeBoxes.map((box, index) => (
          <div key={box.label} className="flex flex-col items-center">
            <div
              className="rounded-lg shadow-sm font-bold text-2xl min-w-[60px] h-[60px] flex items-center justify-center"
              style={{
                backgroundColor: styles.timeBoxColor || "#3b82f6",
                color: styles.timeTextColor || "#ffffff",
              }}
            >
              {String(box.value).padStart(2, "0")}
            </div>
            <span className="text-sm mt-1 text-gray-600 dark:text-gray-400">{box.label}</span>
          </div>
        ))}
      </div>

      {/* Subtitle */}
      {block.content.subtitle && (
        <p
          className="text-sm"
          style={{
            color: styles.color || "#666666",
          }}
        >
          {block.content.subtitle}
        </p>
      )}

      {/* Edit Button */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-black hover:bg-gray-100 shadow-lg">
                <Settings className="w-4 h-4 mr-2" />
                Edit Countdown
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Countdown Timer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="countdown-title">Title</Label>
                  <Input
                    id="countdown-title"
                    placeholder="Limited Time Offer!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countdown-subtitle">Subtitle</Label>
                  <Input
                    id="countdown-subtitle"
                    placeholder="Don't miss out on this amazing deal!"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-date">Target Date & Time</Label>
                  <Input
                    id="target-date"
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Display Options</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="show-days" checked={showDays} onCheckedChange={setShowDays} />
                      <Label htmlFor="show-days">Days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-hours" checked={showHours} onCheckedChange={setShowHours} />
                      <Label htmlFor="show-hours">Hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-minutes" checked={showMinutes} onCheckedChange={setShowMinutes} />
                      <Label htmlFor="show-minutes">Minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-seconds" checked={showSeconds} onCheckedChange={setShowSeconds} />
                      <Label htmlFor="show-seconds">Seconds</Label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Block Type Indicator */}
      {isSelected && (
        <div className="absolute -top-6 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Countdown</span>
        </div>
      )}
    </div>
  )
}
