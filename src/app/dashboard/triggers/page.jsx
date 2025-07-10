"use client"

import { useState } from "react"
import { Plus, Zap, Edit, Trash2, Play, Pause, Users, Calendar, Mail, MousePointer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const triggers = [
  {
    id: 1,
    name: "New Subscriber Welcome",
    description: "Trigger when someone subscribes to newsletter",
    event: "subscriber_added",
    conditions: "Tag contains 'Newsletter'",
    status: "Active",
    totalTriggered: 1250,
    lastTriggered: "2024-01-19 14:30",
    actions: ["Send Welcome Email", "Add to VIP Segment"],
  },
  {
    id: 2,
    name: "Email Opened",
    description: "Trigger when user opens specific campaign",
    event: "email_opened",
    conditions: "Campaign = 'Product Launch'",
    status: "Active",
    totalTriggered: 456,
    lastTriggered: "2024-01-19 16:45",
    actions: ["Send Follow-up Email", "Update User Score"],
  },
  {
    id: 3,
    name: "Link Clicked",
    description: "Trigger when user clicks product link",
    event: "link_clicked",
    conditions: "URL contains '/product/'",
    status: "Paused",
    totalTriggered: 89,
    lastTriggered: "2024-01-18 10:15",
    actions: ["Send Product Info", "Tag as 'Interested'"],
  },
  {
    id: 4,
    name: "Inactive User",
    description: "Trigger for users inactive for 30 days",
    event: "user_inactive",
    conditions: "Last activity > 30 days",
    status: "Active",
    totalTriggered: 234,
    lastTriggered: "2024-01-19 09:00",
    actions: ["Send Re-engagement Email", "Move to Inactive Segment"],
  },
]

const eventTypes = [
  { value: "subscriber_added", label: "Subscriber Added", icon: Users },
  { value: "email_opened", label: "Email Opened", icon: Mail },
  { value: "link_clicked", label: "Link Clicked", icon: MousePointer },
  { value: "user_inactive", label: "User Inactive", icon: Calendar },
  { value: "campaign_sent", label: "Campaign Sent", icon: Mail },
  { value: "form_submitted", label: "Form Submitted", icon: Users },
]

export default function TriggersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTrigger, setNewTrigger] = useState({
    name: "",
    description: "",
    event: "",
    conditions: "",
    actions: "",
  })

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b-2 border-white/20 bg-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Automation Triggers</h1>
              <p className="text-gray-400 mt-1">Set up automated responses to user actions</p>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trigger
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-2 border-white text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Trigger</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="triggerName" className="text-white">
                        Trigger Name
                      </Label>
                      <Input
                        id="triggerName"
                        value={newTrigger.name}
                        onChange={(e) => setNewTrigger((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="Enter trigger name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newTrigger.description}
                        onChange={(e) => setNewTrigger((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="Describe what this trigger does"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Event Type</Label>
                      <Select
                        value={newTrigger.event}
                        onValueChange={(value) => setNewTrigger((prev) => ({ ...prev, event: value }))}
                      >
                        <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          {eventTypes.map((event) => (
                            <SelectItem key={event.value} value={event.value}>
                              <div className="flex items-center gap-2">
                                <event.icon className="h-4 w-4" />
                                {event.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="conditions" className="text-white">
                        Conditions
                      </Label>
                      <Input
                        id="conditions"
                        value={newTrigger.conditions}
                        onChange={(e) => setNewTrigger((prev) => ({ ...prev, conditions: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="e.g., Tag contains 'VIP'"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actions" className="text-white">
                        Actions (comma separated)
                      </Label>
                      <Input
                        id="actions"
                        value={newTrigger.actions}
                        onChange={(e) => setNewTrigger((prev) => ({ ...prev, actions: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="Send Email, Add Tag, Update Segment"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-white text-black hover:bg-gray-200">Create Trigger</Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Triggers</CardTitle>
                <Zap className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{triggers.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active</CardTitle>
                <Play className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {triggers.filter((t) => t.status === "Active").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Executions</CardTitle>
                <Users className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {triggers.reduce((sum, t) => sum + t.totalTriggered, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">+156</div>
              </CardContent>
            </Card>
          </div>

          {/* Triggers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {triggers.map((trigger) => (
              <Card
                key={trigger.id}
                className="bg-black border-2 border-white/20 hover:border-white/40 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-white" />
                      <div>
                        <CardTitle className="text-white text-lg">{trigger.name}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{trigger.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs border font-medium ${
                          trigger.status === "Active"
                            ? "border-green-500 text-green-400 bg-green-500/10"
                            : "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                        }`}
                      >
                        {trigger.status}
                      </span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-1">
                          {trigger.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 p-1">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-white/20 p-3 bg-white/5">
                    <p className="text-xs text-gray-400 mb-1">EVENT & CONDITIONS</p>
                    <p className="text-sm text-white font-mono">{trigger.event}</p>
                    <p className="text-sm text-gray-300 mt-1">{trigger.conditions}</p>
                  </div>

                  <div className="border-2 border-white/20 p-3 bg-white/5">
                    <p className="text-xs text-gray-400 mb-1">ACTIONS</p>
                    <div className="flex flex-wrap gap-1">
                      {trigger.actions.map((action, index) => (
                        <span key={index} className="px-2 py-1 text-xs border border-white/20 text-gray-300">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-white font-semibold">{trigger.totalTriggered.toLocaleString()}</p>
                      <p className="text-gray-400">total executions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Last triggered</p>
                      <p className="text-white">{trigger.lastTriggered}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {triggers.length === 0 && (
            <div className="text-center py-12 border-2 border-white/20 bg-black">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No automation triggers created yet.</p>
              <Button
                className="bg-black border-2 border-white text-white hover:bg-white hover:text-black"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trigger
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
