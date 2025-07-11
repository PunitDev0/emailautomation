"use client"

import { useState } from "react"
import { Plus, Users, Edit, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const segments = [
  {
    id: 1,
    name: "VIP Customers",
    description: "High-value customers with premium subscriptions",
    conditions: "Tag = VIP AND Status = Active",
    subscriberCount: 89,
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Recent Signups",
    description: "Users who signed up in the last 30 days",
    conditions: "Date Added > 30 days ago",
    subscriberCount: 234,
    lastUpdated: "2024-01-14",
  },
  {
    id: 3,
    name: "Newsletter Subscribers",
    description: "Users subscribed to weekly newsletter",
    conditions: "Tag = Newsletter AND Status = Active",
    subscriberCount: 756,
    lastUpdated: "2024-01-12",
  },
  {
    id: 4,
    name: "Inactive Users",
    description: "Users who haven't opened emails in 60+ days",
    conditions: "Last Opened < 60 days ago",
    subscriberCount: 123,
    lastUpdated: "2024-01-10",
  },
]

export default function SegmentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    filterType: "",
    filterValue: "",
    operator: "equals",
  })

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Segments</h1>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                <Plus className="h-4 w-4 mr-2" />
                Create Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Segment</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="segmentName" className="text-white">
                      Segment Name
                    </Label>
                    <Input
                      id="segmentName"
                      value={newSegment.name}
                      onChange={(e) => setNewSegment((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-black border-white/20 text-white"
                      placeholder="Enter segment name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newSegment.description}
                      onChange={(e) => setNewSegment((prev) => ({ ...prev, description: e.target.value }))}
                      className="bg-black border-white/20 text-white"
                      placeholder="Describe this segment"
                    />
                  </div>
                </div>

                <div className="border border-white/20 p-4">
                  <h3 className="text-white font-semibold mb-4">Filter Conditions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Field</Label>
                      <Select
                        value={newSegment.filterType}
                        onValueChange={(value) => setNewSegment((prev) => ({ ...prev, filterType: value }))}
                      >
                        <SelectTrigger className="bg-black border-white/20 text-white">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="tag">Tag</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="dateAdded">Date Added</SelectItem>
                          <SelectItem value="lastOpened">Last Opened</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Operator</Label>
                      <Select
                        value={newSegment.operator}
                        onValueChange={(value) => setNewSegment((prev) => ({ ...prev, operator: value }))}
                      >
                        <SelectTrigger className="bg-black border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="greaterThan">Greater Than</SelectItem>
                          <SelectItem value="lessThan">Less Than</SelectItem>
                          <SelectItem value="notEquals">Not Equals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Value</Label>
                      <Input
                        value={newSegment.filterValue}
                        onChange={(e) => setNewSegment((prev) => ({ ...prev, filterValue: e.target.value }))}
                        className="bg-black border-white/20 text-white"
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 border border-white/20 bg-white/5">
                    <p className="text-sm text-gray-300">
                      <strong>Preview:</strong>{" "}
                      {newSegment.filterType && newSegment.operator && newSegment.filterValue
                        ? `${newSegment.filterType} ${newSegment.operator} "${newSegment.filterValue}"`
                        : "Configure filters to see preview"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Estimated matches: 0 subscribers</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-white text-black hover:bg-gray-200">Create Segment</Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="border border-white/20 bg-black p-6 hover:border-white/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <Users className="h-8 w-8 text-white" />
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-1">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 p-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{segment.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{segment.description}</p>

              <div className="space-y-3">
                <div className="border border-white/20 p-3 bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">CONDITIONS</p>
                  <p className="text-sm text-white font-mono">{segment.conditions}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{segment.subscriberCount}</p>
                    <p className="text-xs text-gray-400">subscribers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Last updated</p>
                    <p className="text-sm text-white">{segment.lastUpdated}</p>
                  </div>
                </div>

                <Button className="w-full bg-black border border-white text-white hover:bg-white hover:text-black">
                  <Filter className="h-4 w-4 mr-2" />
                  View Subscribers
                </Button>
              </div>
            </div>
          ))}
        </div>

        {segments.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No segments created yet.</p>
            <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Segment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
