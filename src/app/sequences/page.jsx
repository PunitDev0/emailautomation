"use client"
import { Plus, Send, Edit, Trash2, Play, Pause, Users, Mail, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sequences = [
  {
    id: 1,
    name: "Welcome Series",
    description: "5-email welcome sequence for new subscribers",
    status: "Active",
    emails: 5,
    subscribers: 1250,
    avgOpenRate: "28.5%",
    avgClickRate: "4.2%",
    completionRate: "76%",
    lastUpdated: "2024-01-15",
    steps: [
      { id: 1, name: "Welcome Email", delay: "Immediate", status: "active" },
      { id: 2, name: "Getting Started Guide", delay: "1 day", status: "active" },
      { id: 3, name: "Feature Highlights", delay: "3 days", status: "active" },
      { id: 4, name: "Success Stories", delay: "7 days", status: "active" },
      { id: 5, name: "Feedback Request", delay: "14 days", status: "active" },
    ],
  },
  {
    id: 2,
    name: "Product Onboarding",
    description: "Guide users through product features",
    status: "Active",
    emails: 3,
    subscribers: 890,
    avgOpenRate: "32.1%",
    avgClickRate: "6.8%",
    completionRate: "82%",
    lastUpdated: "2024-01-12",
    steps: [
      { id: 1, name: "Setup Instructions", delay: "Immediate", status: "active" },
      { id: 2, name: "Advanced Features", delay: "2 days", status: "active" },
      { id: 3, name: "Pro Tips", delay: "5 days", status: "active" },
    ],
  },
  {
    id: 3,
    name: "Re-engagement Campaign",
    description: "Win back inactive subscribers",
    status: "Paused",
    emails: 4,
    subscribers: 234,
    avgOpenRate: "18.3%",
    avgClickRate: "2.1%",
    completionRate: "45%",
    lastUpdated: "2024-01-08",
    steps: [
      { id: 1, name: "We Miss You", delay: "Immediate", status: "paused" },
      { id: 2, name: "Special Offer", delay: "3 days", status: "paused" },
      { id: 3, name: "Last Chance", delay: "7 days", status: "paused" },
      { id: 4, name: "Goodbye Email", delay: "14 days", status: "paused" },
    ],
  },
]

export default function SequencesPage() {
  return (
    <div className="flex flex-col h-full bg-black">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b-2 border-white/20 bg-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Email Sequences</h1>
              <p className="text-gray-400 mt-1">Create automated email sequences and drip campaigns</p>
            </div>
            <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
              <Plus className="h-4 w-4 mr-2" />
              Create Sequence
            </Button>
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
                <CardTitle className="text-sm font-medium text-gray-400">Total Sequences</CardTitle>
                <Send className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{sequences.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Subscribers</CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {sequences.reduce((sum, s) => sum + s.subscribers, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg Completion</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">68%</div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Emails</CardTitle>
                <Mail className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{sequences.reduce((sum, s) => sum + s.emails, 0)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Sequences List */}
          <div className="space-y-6">
            {sequences.map((sequence) => (
              <Card key={sequence.id} className="bg-black border-2 border-white/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Send className="h-6 w-6 text-white" />
                      <div>
                        <CardTitle className="text-white text-xl">{sequence.name}</CardTitle>
                        <p className="text-gray-400 mt-1">{sequence.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`border-2 ${
                          sequence.status === "Active"
                            ? "border-green-500 text-green-400 bg-green-500/10"
                            : "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                        }`}
                      >
                        {sequence.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                          {sequence.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 p-2">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sequence Steps */}
                    <div className="lg:col-span-2">
                      <h3 className="text-white font-semibold mb-4">Email Sequence ({sequence.emails} emails)</h3>
                      <div className="space-y-3">
                        {sequence.steps.map((step, index) => (
                          <div
                            key={step.id}
                            className="flex items-center gap-4 p-3 border-2 border-white/20 bg-white/5"
                          >
                            <div className="flex items-center justify-center w-8 h-8 border-2 border-white text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{step.name}</p>
                              <p className="text-gray-400 text-sm flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {step.delay}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`border ${
                                step.status === "active"
                                  ? "border-green-500 text-green-400"
                                  : "border-yellow-500 text-yellow-400"
                              }`}
                            >
                              {step.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Performance</h3>
                      <div className="space-y-3">
                        <div className="border-2 border-white/20 p-3 bg-white/5">
                          <p className="text-gray-400 text-sm">Active Subscribers</p>
                          <p className="text-2xl font-bold text-white">{sequence.subscribers.toLocaleString()}</p>
                        </div>
                        <div className="border-2 border-white/20 p-3 bg-white/5">
                          <p className="text-gray-400 text-sm">Avg Open Rate</p>
                          <p className="text-xl font-bold text-green-400">{sequence.avgOpenRate}</p>
                        </div>
                        <div className="border-2 border-white/20 p-3 bg-white/5">
                          <p className="text-gray-400 text-sm">Avg Click Rate</p>
                          <p className="text-xl font-bold text-blue-400">{sequence.avgClickRate}</p>
                        </div>
                        <div className="border-2 border-white/20 p-3 bg-white/5">
                          <p className="text-gray-400 text-sm">Completion Rate</p>
                          <p className="text-xl font-bold text-purple-400">{sequence.completionRate}</p>
                        </div>
                      </div>
                      <div className="pt-3">
                        <p className="text-gray-400 text-sm">Last updated: {sequence.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sequences.length === 0 && (
            <div className="text-center py-12 border-2 border-white/20 bg-black">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No email sequences created yet.</p>
              <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Sequence
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
