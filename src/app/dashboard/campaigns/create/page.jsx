"use client"

import { useState } from "react"
import { ArrowLeft, Eye, Send, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const templates = [
  { id: 1, name: "Welcome Email", description: "Clean welcome template with CTA" },
  { id: 2, name: "Newsletter", description: "Weekly newsletter layout" },
  { id: 3, name: "Product Launch", description: "Product announcement template" },
  { id: 4, name: "Promotional", description: "Sales and discount template" },
]

const audiences = [
  { id: 1, name: "All Subscribers", count: 1250 },
  { id: 2, name: "VIP Customers", count: 89 },
  { id: 3, name: "Newsletter Subscribers", count: 756 },
  { id: 4, name: "Recent Signups", count: 234 },
]

export default function CreateCampaignPage() {
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    template: "",
    audience: "",
    sendType: "now",
  })
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  const handleInputChange = (field, value) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Campaign</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Details */}
            <div className="border border-white/20 p-6 bg-black">
              <h2 className="text-lg font-semibold text-white mb-4">Campaign Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Campaign Name
                  </Label>
                  <Input
                    id="name"
                    value={campaignData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-black border-white/20 text-white"
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white">
                    Subject Line
                  </Label>
                  <Input
                    id="subject"
                    value={campaignData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className="bg-black border-white/20 text-white"
                    placeholder="Enter email subject"
                  />
                </div>
              </div>
            </div>

            {/* Sender Information */}
            <div className="border border-white/20 p-6 bg-black">
              <h2 className="text-lg font-semibold text-white mb-4">Sender Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName" className="text-white">
                    From Name
                  </Label>
                  <Input
                    id="fromName"
                    value={campaignData.fromName}
                    onChange={(e) => handleInputChange("fromName", e.target.value)}
                    className="bg-black border-white/20 text-white"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail" className="text-white">
                    From Email
                  </Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={campaignData.fromEmail}
                    onChange={(e) => handleInputChange("fromEmail", e.target.value)}
                    className="bg-black border-white/20 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="replyTo" className="text-white">
                    Reply-To Email
                  </Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={campaignData.replyTo}
                    onChange={(e) => handleInputChange("replyTo", e.target.value)}
                    className="bg-black border-white/20 text-white"
                    placeholder="reply@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="border border-white/20 p-6 bg-black">
              <h2 className="text-lg font-semibold text-white mb-4">Select Template</h2>
              <Select value={campaignData.template} onValueChange={(value) => handleInputChange("template", value)}>
                <SelectTrigger className="bg-black border-white/20 text-white">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-400">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {campaignData.template && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-3 bg-black border border-white text-white hover:bg-white hover:text-black">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-white text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Template Preview</DialogTitle>
                    </DialogHeader>
                    <div className="border border-white/20 p-4 bg-white text-black min-h-96">
                      <p>Template preview would be rendered here...</p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Audience Selection */}
            <div className="border border-white/20 p-6 bg-black">
              <h2 className="text-lg font-semibold text-white mb-4">Select Audience</h2>
              <Select value={campaignData.audience} onValueChange={(value) => handleInputChange("audience", value)}>
                <SelectTrigger className="bg-black border-white/20 text-white">
                  <SelectValue placeholder="Choose audience" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {audiences.map((audience) => (
                    <SelectItem key={audience.id} value={audience.id.toString()}>
                      <div className="flex justify-between items-center w-full">
                        <span>{audience.name}</span>
                        <span className="text-gray-400 ml-2">({audience.count} subscribers)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Send Options */}
            <div className="border border-white/20 p-6 bg-black">
              <h2 className="text-lg font-semibold text-white mb-4">Send Options</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sendNow"
                    name="sendType"
                    value="now"
                    checked={campaignData.sendType === "now"}
                    onChange={(e) => handleInputChange("sendType", e.target.value)}
                    className="text-white"
                  />
                  <Label htmlFor="sendNow" className="text-white">
                    Send Now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule"
                    name="sendType"
                    value="schedule"
                    checked={campaignData.sendType === "schedule"}
                    onChange={(e) => handleInputChange("sendType", e.target.value)}
                    className="text-white"
                  />
                  <Label htmlFor="schedule" className="text-white">
                    Schedule
                  </Label>
                </div>

                {campaignData.sendType === "schedule" && (
                  <div className="space-y-3 ml-6">
                    <div>
                      <Label htmlFor="scheduleDate" className="text-white">
                        Date
                      </Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="bg-black border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduleTime" className="text-white">
                        Time
                      </Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="bg-black border-white/20 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                {campaignData.sendType === "now" ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Campaign
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
