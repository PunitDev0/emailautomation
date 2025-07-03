"use client";
import { useState } from "react"
import { Zap, Plus, Edit, Users, Mail, Clock, ArrowRight, Settings, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const mockAutomations = [
  {
    id: "1",
    name: "Welcome Series",
    description: "3-email welcome sequence for new subscribers",
    status: "Active",
    trigger: "New Subscriber",
    emails: 3,
    subscribers: 1247,
    openRate: 78,
    clickRate: 15,
    lastRun: "2025-06-30",
    created: "2025-06-01",
  },
  {
    id: "2",
    name: "Abandoned Cart Recovery",
    description: "Recover abandoned shopping carts with targeted emails",
    status: "Active",
    trigger: "Cart Abandonment",
    emails: 2,
    subscribers: 456,
    openRate: 65,
    clickRate: 22,
    lastRun: "2025-06-30",
    created: "2025-06-15",
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    description: "Win back inactive subscribers",
    status: "Paused",
    trigger: "Inactivity (30 days)",
    emails: 4,
    subscribers: 234,
    openRate: 45,
    clickRate: 8,
    lastRun: "2025-06-25",
    created: "2025-05-20",
  },
  {
    id: "4",
    name: "Birthday Campaign",
    description: "Send birthday wishes with special offers",
    status: "Active",
    trigger: "Birthday Date",
    emails: 1,
    subscribers: 89,
    openRate: 85,
    clickRate: 35,
    lastRun: "2025-06-29",
    created: "2025-06-10",
  },
]

const triggerTypes = [
  { value: "new_subscriber", label: "New Subscriber" },
  { value: "cart_abandonment", label: "Cart Abandonment" },
  { value: "inactivity", label: "Inactivity Period" },
  { value: "birthday", label: "Birthday Date" },
  { value: "purchase", label: "Purchase Made" },
  { value: "tag_added", label: "Tag Added" },
]

export function AutomationPage({
  userRole
}) {
  const [automations, setAutomations] = useState(mockAutomations)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    trigger: "",
    delay: "0",
  })
  const { toast } = useToast()

  const handleToggleAutomation = (id) => {
    setAutomations((prev) =>
      prev.map((automation) =>
        automation.id === id
          ? { ...automation, status: automation.status === "Active" ? "Paused" : "Active" }
          : automation))

    const automation = automations.find((a) => a.id === id)
    toast({
      title: `Automation ${automation?.status === "Active" ? "paused" : "activated"}`,
      description: `${automation?.name} has been ${automation?.status === "Active" ? "paused" : "activated"}.`,
    })
  }

  const handleCreateAutomation = () => {
    const automation = {
      id: Date.now().toString(),
      ...newAutomation,
      status: "Active",
      emails: 1,
      subscribers: 0,
      openRate: 0,
      clickRate: 0,
      lastRun: new Date().toISOString().split("T")[0],
      created: new Date().toISOString().split("T")[0],
    }

    setAutomations((prev) => [...prev, automation])
    setNewAutomation({ name: "", description: "", trigger: "", delay: "0" })
    setIsCreateOpen(false)

    toast({
      title: "Automation created",
      description: "Your new automation workflow has been created successfully.",
    })
  }

  const handleDuplicateAutomation = (automation) => {
    const duplicated = {
      ...automation,
      id: Date.now().toString(),
      name: `${automation.name} (Copy)`,
      status: "Paused",
      subscribers: 0,
      created: new Date().toISOString().split("T")[0],
    }

    setAutomations((prev) => [...prev, duplicated])
    toast({
      title: "Automation duplicated",
      description: "The automation has been duplicated successfully.",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">Active
                      </Badge>
        );
      case "Paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Automation</h2>
          <p className="text-muted-foreground">Create automated email workflows to engage your audience</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
              <DialogDescription>Set up an automated email workflow</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Automation Name</Label>
                <Input
                  id="name"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  placeholder="Welcome Series" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAutomation.description}
                  onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  placeholder="Describe what this automation does..."
                  rows={3} />
              </div>
              <div>
                <Label htmlFor="trigger">Trigger</Label>
                <Select
                  value={newAutomation.trigger}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="delay">Initial Delay (hours)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={newAutomation.delay}
                  onChange={(e) => setNewAutomation({ ...newAutomation, delay: e.target.value })}
                  placeholder="0" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAutomation}>Create Automation</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Automation Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automations.filter((a) => a.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Running workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.reduce((sum, a) => sum + a.subscribers, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">In automation workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(automations.reduce((sum, a) => sum + a.openRate, 0) / automations.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all automations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Automated emails</p>
          </CardContent>
        </Card>
      </div>
      {/* Automation List */}
      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    <CardDescription>{automation.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(automation.status)}
                  <Switch
                    checked={automation.status === "Active"}
                    onCheckedChange={() => handleToggleAutomation(automation.id)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Trigger: {automation.trigger}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                    <span>
                      {automation.emails} email{automation.emails !== 1 ? "s" : ""} in sequence
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Performance</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Open Rate</span>
                      <span>{automation.openRate}%</span>
                    </div>
                    <Progress value={automation.openRate} className="h-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Subscribers</div>
                  <div className="text-2xl font-bold">{automation.subscribers.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Active in workflow</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Last Activity</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(automation.lastRun).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateAutomation(automation)}>
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {automations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first automation workflow to engage your audience automatically
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Automation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
