"use client"

import { useState, useCallback } from "react"
import { Plus, Save, Play, Pause, Trash2, Edit, ArrowDown, ArrowRight, Mail, Clock, Users, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"



const initialNodes = [
  {
    id: "1",
    type: "trigger",
    title: "User Signs Up",
    description: "When a new user subscribes",
    position: { x: 50, y: 50 },
    connections: ["2"],
    config: { event: "subscriber_added" },
  },
  {
    id: "2",
    type: "delay",
    title: "Wait 2 Days",
    description: "Delay before next action",
    position: { x: 50, y: 150 },
    connections: ["3"],
    config: { duration: 2, unit: "days" },
  },
  {
    id: "3",
    type: "email",
    title: "Send Welcome Email",
    description: "Welcome email template",
    position: { x: 50, y: 250 },
    connections: [],
    config: { template: "welcome", subject: "Welcome!" },
  },
]

const initialWorkflows = [
  {
    id: 1,
    name: "Welcome Series",
    description: "Automated welcome sequence for new subscribers",
    status: "Active",
    subscribers: 1250,
    lastRun: "2024-01-15",
    totalRuns: 1250,
    successRate: "94%",
    nodes: initialNodes,
  },
  {
    id: 2,
    name: "Re-engagement Campaign",
    description: "Win back inactive subscribers",
    status: "Paused",
    subscribers: 89,
    lastRun: "2024-01-10",
    totalRuns: 456,
    successRate: "67%",
    nodes: [],
  },
  {
    id: 3,
    name: "Product Onboarding",
    description: "Guide users through product features",
    status: "Draft",
    subscribers: 0,
    lastRun: "Never",
    totalRuns: 0,
    successRate: "-",
    nodes: [],
  },
  {
    id: 4,
    name: "Abandoned Cart Recovery",
    description: "Recover abandoned shopping carts",
    status: "Active",
    subscribers: 234,
    lastRun: "2024-01-19",
    totalRuns: 1890,
    successRate: "78%",
    nodes: [],
  },
]

const nodeTypes = [
  { type: "trigger", label: "Trigger", icon: Zap, color: "border-blue-500 bg-blue-500/10" },
  { type: "delay", label: "Delay", icon: Clock, color: "border-yellow-500 bg-yellow-500/10" },
  { type: "email", label: "Send Email", icon: Mail, color: "border-green-500 bg-green-500/10" },
  { type: "condition", label: "Condition", icon: ArrowRight, color: "border-purple-500 bg-purple-500/10" },
  { type: "action", label: "Action", icon: Users, color: "border-orange-500 bg-orange-500/10" },
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [showFlowBuilder, setShowFlowBuilder] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showNodeConfig, setShowNodeConfig] = useState(null)

  // Flow builder state
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [workflowStatus, setWorkflowStatus] = useState("Draft")
  const [nodes, setNodes] = useState([])

  // Create workflow modal state
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const handleCreateWorkflow = useCallback(() => {
    if (!newWorkflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      })
      return
    }

    const newWorkflow = {
      id: Date.now(),
      name: newWorkflowName,
      description: `New ${selectedTemplate || "custom"} workflow`,
      status: "Draft",
      subscribers: 0,
      lastRun: "Never",
      totalRuns: 0,
      successRate: "-",
      nodes: selectedTemplate === "welcome" ? initialNodes : [],
    }

    setWorkflows((prev) => [...prev, newWorkflow])
    setSelectedWorkflow(newWorkflow)
    setWorkflowName(newWorkflow.name)
    setWorkflowDescription(newWorkflow.description)
    setWorkflowStatus(newWorkflow.status)
    setNodes(newWorkflow.nodes)
    setShowCreateModal(false)
    setShowFlowBuilder(true)
    setNewWorkflowName("")
    setSelectedTemplate("")

    toast({
      title: "Success",
      description: "Workflow created successfully",
    })
  }, [newWorkflowName, selectedTemplate])

  const handleEditWorkflow = useCallback((workflow) => {
    setSelectedWorkflow(workflow)
    setWorkflowName(workflow.name)
    setWorkflowDescription(workflow.description)
    setWorkflowStatus(workflow.status)
    setNodes(workflow.nodes)
    setShowFlowBuilder(true)
  }, [])

  const handleSaveWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      })
      return
    }

    const updatedWorkflow = {
      id: selectedWorkflow?.id || Date.now(),
      name: workflowName,
      description: workflowDescription,
      status: workflowStatus,
      subscribers: selectedWorkflow?.subscribers || 0,
      lastRun: selectedWorkflow?.lastRun || "Never",
      totalRuns: selectedWorkflow?.totalRuns || 0,
      successRate: selectedWorkflow?.successRate || "-",
      nodes: nodes,
    }

    setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))

    toast({
      title: "Success",
      description: "Workflow saved successfully",
    })
  }, [workflowName, workflowDescription, workflowStatus, nodes, selectedWorkflow])

  const handleDeleteWorkflow = useCallback((workflowId) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== workflowId))
    toast({
      title: "Success",
      description: "Workflow deleted successfully",
    })
  }, [])

  const handleToggleWorkflowStatus = useCallback(
    (workflowId) => {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflowId
            ? { ...w, status: w.status === "Active" ? "Paused" : ("Active") }
            : w,
        ),
      )

      const workflow = workflows.find((w) => w.id === workflowId)
      const newStatus = workflow?.status === "Active" ? "Paused" : "Active"

      toast({
        title: "Success",
        description: `Workflow ${newStatus.toLowerCase()} successfully`,
      })
    },
    [workflows],
  )

  const addNode = useCallback((type, title) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      title,
      description: `New ${type} node`,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 300 + 50 },
      connections: [],
      config: {},
    }
    setNodes((prev) => [...prev, newNode])

    toast({
      title: "Success",
      description: `${title} node added`,
    })
  }, [])

  const deleteNode = useCallback((nodeId) => {
    setNodes((prev) => {
      // Remove the node and any connections to it
      const filteredNodes = prev.filter((n) => n.id !== nodeId)
      return filteredNodes.map((n) => ({
        ...n,
        connections: n.connections.filter((c) => c !== nodeId),
      }))
    })

    toast({
      title: "Success",
      description: "Node deleted successfully",
    })
  }, [])

  const updateNodeConfig = useCallback((nodeId, config) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, config: { ...n.config, ...config } } : n)))
  }, [])

  const FlowNode = ({ node }) => {
    const nodeType = nodeTypes.find((t) => t.type === node.type)
    const Icon = nodeType?.icon || Zap

    return (
      <div className="relative">
        <div
          className={`border-2 ${nodeType?.color} p-4 min-w-48 bg-black cursor-pointer hover:border-white/60 transition-colors`}
          style={{
            position: "absolute",
            left: node.position.x,
            top: node.position.y,
          }}
          onClick={() => setShowNodeConfig(node)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-white" />
              <span className="text-white font-semibold text-sm">{node.title}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:bg-red-500/10 p-1"
              onClick={(e) => {
                e.stopPropagation()
                deleteNode(node.id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-gray-400 text-xs">{node.description}</p>
        </div>
        {node.connections.map((connectionId) => {
          const connectedNode = nodes.find((n) => n.id === connectionId)
          if (!connectedNode) return null

          return (
            <div
              key={connectionId}
              className="absolute border-l-2 border-white"
              style={{
                left: node.position.x + 96,
                top: node.position.y + 60,
                height: Math.max(0, connectedNode.position.y - node.position.y - 60),
              }}
            >
              <ArrowDown className="h-4 w-4 text-white absolute -bottom-2 -left-2" />
            </div>
          )
        })}
      </div>
    )
  }

  if (showFlowBuilder) {
    return (
      <div className="flex flex-col h-full bg-black">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b-2 border-white/20 bg-black">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setShowFlowBuilder(false)
                    setSelectedWorkflow(null)
                    setNodes([])
                  }}
                  className="bg-black border-2 border-white text-white hover:bg-white hover:text-black"
                >
                  ← Back to Workflows
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">Automation Flow Builder</h1>
                  <p className="text-gray-400 text-sm">
                    {selectedWorkflow ? `Editing: ${selectedWorkflow.name}` : "Create new workflow"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveWorkflow}
                  className="bg-black border border-white text-white hover:bg-white hover:text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Workflow
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Test Started",
                      description: "Testing workflow with sample data",
                    })
                  }}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Test Flow
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Node Palette */}
          <div className="w-64 bg-black border-r-2 border-white/20 p-4 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">Add Nodes</h3>
            <div className="space-y-2">
              {nodeTypes.map((nodeType) => (
                <Button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type, `New ${nodeType.label}`)}
                  className="w-full justify-start bg-black border-2 border-white/20 text-white hover:bg-white hover:text-black"
                >
                  <nodeType.icon className="h-4 w-4 mr-2" />
                  {nodeType.label}
                </Button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4">Flow Properties</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-white text-sm">Workflow Name</Label>
                  <Input
                    className="bg-black border-2 border-white/20 text-white"
                    placeholder="Enter name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Description</Label>
                  <Input
                    className="bg-black border-2 border-white/20 text-white"
                    placeholder="Enter description"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Status</Label>
                  <Select
                    value={workflowStatus}
                    onValueChange={(value) => setWorkflowStatus(value)}
                  >
                    <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Canvas */}
          <div className="flex-1 bg-black relative overflow-auto">
            <div
              className="absolute inset-0 bg-black"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              <div className="relative w-full h-full min-h-96">
                {nodes.map((node) => (
                  <FlowNode key={node.id} node={node} />
                ))}
                {nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Start building your automation workflow</p>
                      <p className="text-gray-500 text-sm">Add nodes from the left panel to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Node Configuration Modal */}
        <Dialog open={!!showNodeConfig} onOpenChange={() => setShowNodeConfig(null)}>
          <DialogContent className="bg-black border-2 border-white text-white">
            <DialogHeader>
              <DialogTitle>Configure {showNodeConfig?.title}</DialogTitle>
            </DialogHeader>
            {showNodeConfig && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Node Title</Label>
                  <Input
                    className="bg-black border-2 border-white/20 text-white"
                    value={showNodeConfig.title}
                    onChange={(e) => {
                      const updatedNode = { ...showNodeConfig, title: e.target.value }
                      setShowNodeConfig(updatedNode)
                      setNodes((prev) => prev.map((n) => (n.id === updatedNode.id ? updatedNode : n)))
                    }}
                  />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Input
                    className="bg-black border-2 border-white/20 text-white"
                    value={showNodeConfig.description}
                    onChange={(e) => {
                      const updatedNode = { ...showNodeConfig, description: e.target.value }
                      setShowNodeConfig(updatedNode)
                      setNodes((prev) => prev.map((n) => (n.id === updatedNode.id ? updatedNode : n)))
                    }}
                  />
                </div>
                {showNodeConfig.type === "delay" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white">Duration</Label>
                      <Input
                        type="number"
                        className="bg-black border-2 border-white/20 text-white"
                        value={showNodeConfig.config?.duration || 1}
                        onChange={(e) =>
                          updateNodeConfig(showNodeConfig.id, { duration: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-white">Unit</Label>
                      <Select
                        value={showNodeConfig.config?.unit || "days"}
                        onValueChange={(value) => updateNodeConfig(showNodeConfig.id, { unit: value })}
                      >
                        <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {showNodeConfig.type === "email" && (
                  <div>
                    <Label className="text-white">Email Subject</Label>
                    <Input
                      className="bg-black border-2 border-white/20 text-white"
                      value={showNodeConfig.config?.subject || ""}
                      onChange={(e) => updateNodeConfig(showNodeConfig.id, { subject: e.target.value })}
                      placeholder="Enter email subject"
                    />
                  </div>
                )}
                <Button
                  onClick={() => setShowNodeConfig(null)}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  Save Configuration
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b-2 border-white/20 bg-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Automation Workflows</h1>
              <p className="text-gray-400 mt-1">Create and manage automated email workflows</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="bg-black border border-white text-white hover:bg-white hover:text-black">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-2 border-white text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Workflow Name</Label>
                      <Input
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="Enter workflow name"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-white">Template</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                          <SelectValue placeholder="Choose template" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="welcome">Welcome Series</SelectItem>
                          <SelectItem value="onboarding">Product Onboarding</SelectItem>
                          <SelectItem value="reengagement">Re-engagement</SelectItem>
                          <SelectItem value="abandoned">Abandoned Cart</SelectItem>
                          <SelectItem value="blank">Start from Blank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleCreateWorkflow} className="flex-1 bg-white text-black hover:bg-gray-200">
                        Create & Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => {
                          setShowCreateModal(false)
                          setNewWorkflowName("")
                          setSelectedTemplate("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => {
                  setSelectedWorkflow(null)
                  setWorkflowName("")
                  setWorkflowDescription("")
                  setWorkflowStatus("Draft")
                  setNodes([])
                  setShowFlowBuilder(true)
                }}
                className="bg-black border-2 border-white text-white hover:bg-white hover:text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>
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
                <CardTitle className="text-sm font-medium text-gray-400">Total Workflows</CardTitle>
                <Zap className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{workflows.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active</CardTitle>
                <Play className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {workflows.filter((w) => w.status === "Active").length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {workflows.reduce((sum, w) => sum + w.subscribers, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg Success Rate</CardTitle>
                <ArrowRight className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">82%</div>
              </CardContent>
            </Card>
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="bg-black border-2 border-white/20 hover:border-white/40 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-white" />
                      <div>
                        <CardTitle className="text-white text-lg">{workflow.name}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs border font-medium ${
                          workflow.status === "Active"
                            ? "border-green-500 text-green-400 bg-green-500/10"
                            : workflow.status === "Paused"
                              ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                              : "border-gray-500 text-gray-400 bg-gray-500/10"
                        }`}
                      >
                        {workflow.status}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/10 p-1"
                          onClick={() => handleEditWorkflow(workflow)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/10 p-1"
                          onClick={() => handleToggleWorkflowStatus(workflow.id)}
                        >
                          {workflow.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 p-1"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Active Subscribers</p>
                      <p className="text-xl font-bold text-white">{workflow.subscribers.toLocaleString()}</p>
                    </div>
                    <div className="border-2 border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Success Rate</p>
                      <p className="text-xl font-bold text-green-400">{workflow.successRate}</p>
                    </div>
                  </div>

                  <div className="border-2 border-white/20 p-3 bg-white/5">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-gray-400">Total Runs</p>
                        <p className="text-white font-semibold">{workflow.totalRuns.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400">Last Run</p>
                        <p className="text-white">{workflow.lastRun}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEditWorkflow(workflow)}
                    className="w-full bg-black border-2 border-white text-white hover:bg-white hover:text-black"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Workflow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {workflows.length === 0 && (
            <div className="text-center py-12 border-2 border-white/20 bg-black">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No automation workflows created yet.</p>
              <Button
                onClick={() => setShowFlowBuilder(true)}
                className="bg-black border-2 border-white text-white hover:bg-white hover:text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
