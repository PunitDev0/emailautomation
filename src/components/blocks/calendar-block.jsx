"use client"

import { useState } from "react"
import { Calendar, Edit3, Download, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast} from "sonner"

export default function CalendarBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditor, setShowEditor] = useState(false)
  const [eventTitle, setEventTitle] = useState(block.content.title || "")
  const [eventDate, setEventDate] = useState(block.content.date || "")
  const [eventTime, setEventTime] = useState(block.content.time || "")
  const [eventLocation, setEventLocation] = useState(block.content.location || "")
  const [eventDescription, setEventDescription] = useState(block.content.description || "")
  const [showAddToCalendar, setShowAddToCalendar] = useState(block.content.showAddToCalendar !== false)


  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        showAddToCalendar,
      },
    })
    setShowEditor(false)
    toast({
      title: "Event Updated! 📅",
      description: "Your calendar event has been updated successfully.",
      duration: 2000,
    })
  }

  const generateCalendarLink = (type) => {
    const startDate = new Date(`${eventDate} ${eventTime}`).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const endDate =
      new Date(new Date(`${eventDate} ${eventTime}`).getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z"

    const params = {
      text: eventTitle,
      dates: `${startDate}/${endDate}`,
      details: eventDescription,
      location: eventLocation,
    }

    switch (type) {
      case "google":
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&${new URLSearchParams(params).toString()}`
      case "outlook":
        return `https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams({
          subject: eventTitle,
          startdt: startDate,
          enddt: endDate,
          body: eventDescription,
          location: eventLocation,
        }).toString()}`
      case "ics":
        return generateICSFile()
      default:
        return "#"
    }
  }

  const generateICSFile = () => {
    const startDate = new Date(`${eventDate} ${eventTime}`).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const endDate =
      new Date(new Date(`${eventDate} ${eventTime}`).getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z"

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Email Template Maker//Event//EN",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${eventDescription}`,
      `LOCATION:${eventLocation}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar" })
    return URL.createObjectURL(blob)
  }

  const downloadICS = () => {
    const link = document.createElement("a")
    link.href = generateICSFile()
    link.download = `${eventTitle || "event"}.ics`
    link.click()

    toast({
      title: "Calendar File Downloaded! 📥",
      description: "Your .ics file has been saved to downloads.",
      duration: 2000,
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ""
    const [hours, minutes] = timeStr.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
      }}
    >
      {/* Calendar Toolbar */}
      {isSelected && (
        <div className="absolute -top-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-1 z-20">
          <Button size="sm" variant="outline" onClick={() => setShowEditor(true)} className="bg-transparent">
            <Edit3 className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={downloadICS} className="bg-transparent">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Calendar Event Content */}
      {eventTitle ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{eventTitle}</h3>

              {eventDate && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatDate(eventDate)}</span>
                </div>
              )}

              {eventTime && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatTime(eventTime)}</span>
                </div>
              )}

              {eventLocation && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{eventLocation}</span>
                </div>
              )}

              {eventDescription && <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{eventDescription}</p>}

              {showAddToCalendar && eventDate && eventTime && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">Add to calendar:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(generateCalendarLink("google"), "_blank")}
                      className="text-xs"
                    >
                      Google
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(generateCalendarLink("outlook"), "_blank")}
                      className="text-xs"
                    >
                      Outlook
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadICS} className="text-xs bg-transparent">
                      Download .ics
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors max-w-md mx-auto"
          onClick={() => setShowEditor(true)}
        >
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Click to add calendar event</p>
          <p className="text-xs text-gray-400 mt-2">Create an event invitation</p>
        </div>
      )}

      {/* Calendar Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Calendar Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                placeholder="Enter event title..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="event-time">Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="Enter event location..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Enter event description..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>

            {/* Options */}
            <div className="flex items-center space-x-2">
              <Switch checked={showAddToCalendar} onCheckedChange={setShowAddToCalendar} />
              <Label>Show "Add to Calendar" buttons</Label>
            </div>

            {/* Preview */}
            {eventTitle && (
              <div className="border rounded-lg p-4">
                <Label>Preview</Label>
                <div className="mt-2">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-sm">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{eventTitle}</h4>
                        {eventDate && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">📅 {formatDate(eventDate)}</p>
                        )}
                        {eventTime && (
                          <p className="text-xs text-gray-600 dark:text-gray-300">🕐 {formatTime(eventTime)}</p>
                        )}
                        {eventLocation && (
                          <p className="text-xs text-gray-600 dark:text-gray-300">📍 {eventLocation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditor(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!eventTitle}>
                Save Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
