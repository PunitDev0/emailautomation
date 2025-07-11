"use client"

import { useState, useCallback } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, Save, Play, Pause, Trash2, Edit, Mail, Clock, Users, Zap, Settings, Eye, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

// Custom Node Components
const TriggerNode = ({ data }) => (
  <div className="bg-black border-2 border-blue-500 p-4 min-w-48 bg-blue-500/10">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-blue-400" />
        <span className="text-white font-semibold text-sm">{data.label}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/10 p-1"
        onClick={() => data.onEdit?.(data.id)}
      >
        <Settings className="h-3 w-3" />
      </Button>
    </div>
    <p className="text-gray-400 text-xs">{data.description}</p>
    <div className="mt-2 text-xs text-blue-400">Event: {data.config?.event || "Not configured"}</div>
  </div>
)

const DelayNode = ({ data }) => (
  <div className="bg-black border-2 border-yellow-500 p-4 min-w-48 bg-yellow-500/10">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-yellow-400" />
        <span className="text-white font-semibold text-sm">{data.label}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/10 p-1"
        onClick={() => data.onEdit?.(data.id)}
      >
        <Settings className="h-3 w-3" />
      </Button>
    </div>
    <p className="text-gray-400 text-xs">{data.description}</p>
    <div className="mt-2 text-xs text-yellow-400">
      Wait: {data.config?.duration || 1} {data.config?.unit || "days"}
    </div>
  </div>
)

const EmailNode = ({ data }) => (
  <div className="bg-black border-2 border-green-500 p-4 min-w-48 bg-green-500/10">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-green-400" />
        <span className="text-white font-semibold text-sm">{data.label}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/10 p-1"
        onClick={() => data.onEdit?.(data.id)}
      >
        <Settings className="h-3 w-3" />
      </Button>
    </div>
    <p className="text-gray-400 text-xs">{data.description}</p>
    <div className="mt-2 text-xs text-green-400">Template: {data.config?.template || "Not selected"}</div>
  </div>
)

const ConditionNode = ({ data }) => (
  <div className="bg-black border-2 border-purple-500 p-4 min-w-48 bg-purple-500/10">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-purple-400" />
        <span className="text-white font-semibold text-sm">{data.label}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/10 p-1"
        onClick={() => data.onEdit?.(data.id)}
      >
        <Settings className="h-3 w-3" />
      </Button>
    </div>
    <p className="text-gray-400 text-xs">{data.description}</p>
    <div className="mt-2 text-xs text-purple-400">Condition: {data.config?.condition || "Not configured"}</div>
  </div>
)

const ActionNode = ({ data }) => (
  <div className="bg-black border-2 border-orange-500 p-4 min-w-48 bg-orange-500/10">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-orange-400" />
        <span className="text-white font-semibold text-sm">{data.label}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/10 p-1"
        onClick={() => data.onEdit?.(data.id)}
      >
        <Settings className="h-3 w-3" />
      </Button>
    </div>
    <p className="text-gray-400 text-xs">{data.description}</p>
    <div className="mt-2 text-xs text-orange-400">Action: {data.config?.action || "Not configured"}</div>
  </div>
)

const nodeTypes = {
  trigger: TriggerNode,
  delay: DelayNode,
  email: EmailNode,
  condition: ConditionNode,
  action: ActionNode,
}



const templates = [
  {
    id: "welcome",
    name: "Welcome Series",
    description: "3-step welcome sequence for new subscribers",
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "New Subscriber",
          description: "When someone subscribes",
          config: { event: "subscriber_added" },
        },
      },
      {
        id: "delay-1",
        type: "delay",
        position: { x: 100, y: 250 },
        data: {
          label: "Wait 1 Day",
          description: "Delay before welcome email",
          config: { duration: 1, unit: "days" },
        },
      },
      {
        id: "email-1",
        type: "email",
        position: { x: 100, y: 400 },
        data: {
          label: "Welcome Email",
          description: "Send welcome message",
          config: { template: "welcome", subject: "Welcome to our platform!" },
        },
      },
    ],
    edges: [
      { id: "e-trigger-delay", source: "trigger-1", target: "delay-1" },
      { id: "e-delay-email", source: "delay-1", target: "email-1" },
    ],
  },
  {
    id: "abandoned-cart",
    name: "Abandoned Cart Recovery",
    description: "3-email sequence for cart abandonment recovery",
    nodes: [
      {
        id: "trigger-2",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "Cart Abandoned",
          description: "When cart is abandoned for 1 hour",
          config: { event: "cart_abandoned" },
        },
      },
      {
        id: "delay-2",
        type: "delay",
        position: { x: 100, y: 250 },
        data: {
          label: "Wait 1 Hour",
          description: "Short delay before first reminder",
          config: { duration: 1, unit: "hours" },
        },
      },
      {
        id: "email-2",
        type: "email",
        position: { x: 100, y: 400 },
        data: {
          label: "First Reminder",
          description: "Gentle reminder about abandoned cart",
          config: { template: "cart-reminder", subject: "You left something behind!" },
        },
      },
      {
        id: "delay-3",
        type: "delay",
        position: { x: 400, y: 400 },
        data: {
          label: "Wait 1 Day",
          description: "Wait before second reminder",
          config: { duration: 1, unit: "days" },
        },
      },
      {
        id: "email-3",
        type: "email",
        position: { x: 400, y: 550 },
        data: {
          label: "Second Reminder",
          description: "More urgent reminder with discount",
          config: { template: "cart-discount", subject: "10% off your abandoned items" },
        },
      },
    ],
    edges: [
      { id: "e-trigger-delay-1", source: "trigger-2", target: "delay-2" },
      { id: "e-delay-email-1", source: "delay-2", target: "email-2" },
      { id: "e-email-delay-2", source: "email-2", target: "delay-3" },
      { id: "e-delay-email-2", source: "delay-3", target: "email-3" },
    ],
  },
  {
    id: "onboarding",
    name: "Product Onboarding",
    description: "5-step product onboarding sequence",
    nodes: [
      {
        id: "trigger-3",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          label: "User Signs Up",
          description: "When user creates account",
          config: { event: "user_signup" },
        },
      },
      {
        id: "email-4",
        type: "email",
        position: { x: 100, y: 250 },
        data: {
          label: "Welcome & Setup",
          description: "Welcome email with setup guide",
          config: { template: "onboarding-welcome", subject: "Welcome! Let's get you started" },
        },
      },
      {
        id: "delay-4",
        type: "delay",
        position: { x: 100, y: 400 },
        data: {
          label: "Wait 2 Days",
          description: "Give time to explore",
          config: { duration: 2, unit: "days" },
        },
      },
      {
        id: "condition-1",
        type: "condition",
        position: { x: 100, y: 550 },
        data: {
          label: "Check Activity",
          description: "Has user been active?",
          config: { condition: "has_logged_in" },
        },
      },
      {
        id: "email-5",
        type: "email",
        position: { x: 400, y: 550 },
        data: {
          label: "Feature Highlight",
          description: "Show key features",
          config: { template: "feature-highlight", subject: "Discover powerful features" },
        },
      },
    ],
    edges: [
      { id: "e-trigger-welcome", source: "trigger-3", target: "email-4" },
      { id: "e-welcome-delay", source: "email-4", target: "delay-4" },
      { id: "e-delay-condition", source: "delay-4", target: "condition-1" },
      { id: "e-condition-feature", source: "condition-1", target: "email-5" },
    ],
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
    nodes: [],
    edges: [],
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
    edges: [],
  },
]

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [showFlowBuilder, setShowFlowBuilder] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showNodeConfig, setShowNodeConfig] = useState(null)

  // Flow builder state
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [workflowStatus, setWorkflowStatus] = useState("Draft")
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Create workflow modal state
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("welcome")

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const handleCreateWorkflow = useCallback(() => {
    if (!newWorkflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      })
      return
    }

    const template = templates.find((t) => t.id === selectedTemplate)
    const newWorkflow = {
      id: Date.now(),
      name: newWorkflowName,
      description: template?.description || `New workflow`,
      status: "Draft",
      subscribers: 0,
      lastRun: "Never",
      totalRuns: 0,
      successRate: "-",
      nodes: template?.nodes || [],
      edges: template?.edges || [],
    }

    setWorkflows((prev) => [...prev, newWorkflow])
    setSelectedWorkflow(newWorkflow)
    setWorkflowName(newWorkflow.name)
    setWorkflowDescription(newWorkflow.description)
    setWorkflowStatus(newWorkflow.status)

    // Set up nodes with edit handlers
    const nodesWithHandlers = (template?.nodes || []).map((node) => ({
      ...node,
      data: {
        ...node.data,
        onEdit: handleEditNode,
      },
    }))

    setNodes(nodesWithHandlers)
    setEdges(template?.edges || [])
    setShowCreateModal(false)
    setShowFlowBuilder(true)
    setNewWorkflowName("")
    setSelectedTemplate("welcome")

    toast({
      title: "Success",
      description: "Workflow created successfully",
    })
  }, [newWorkflowName, selectedTemplate, setNodes, setEdges])

  const handleEditWorkflow = useCallback(
    (workflow) => {
      setSelectedWorkflow(workflow)
      setWorkflowName(workflow.name)
      setWorkflowDescription(workflow.description)
      setWorkflowStatus(workflow.status)

      const nodesWithHandlers = workflow.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onEdit: handleEditNode,
        },
      }))

      setNodes(nodesWithHandlers)
      setEdges(workflow.edges)
      setShowFlowBuilder(true)
    },
    [setNodes, setEdges],
  )

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
      edges: edges,
    }

    setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))

    toast({
      title: "Success",
      description: "Workflow saved successfully",
    })
  }, [workflowName, workflowDescription, workflowStatus, nodes, edges, selectedWorkflow])

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
            ? { ...w, status: w.status === "Active" ? "Paused" : "Active" }
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

  const addNode = useCallback(
    (type) => {
      const nodeId = `node_${Date.now()}`
      const newNode = {
        id: nodeId,
        type,
        position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
        data: {
          label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          description: `New ${type} node`,
          config: {},
          onEdit: handleEditNode,
        },
      }
      setNodes((nds) => nds.concat(newNode))

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} node added`,
      })
    },
    [setNodes],
  )

  const handleEditNode = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        setShowNodeConfig(node)
      }
    },
    [nodes],
  )

  const updateNodeConfig = useCallback(
    (nodeId, updates) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...updates,
                  config: { ...node.data.config, ...updates.config },
                },
              }
            : node,
        ),
      )
    },
    [setNodes],
  )

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      toast({
        title: "Success",
        description: "Node deleted successfully",
      })
    },
    [setNodes, setEdges],
  )

  const handleUseTemplate = useCallback(
    (templateId) => {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        // Create nodes with proper IDs and handlers
        const nodesWithHandlers = template.nodes.map((node, index) => ({
          ...node,
          id: `${templateId}_node_${index + 1}`, // Ensure unique IDs
          data: {
            ...node.data,
            onEdit: handleEditNode,
          },
        }))

        // Update edges to match new node IDs
        const updatedEdges = template.edges.map((edge, index) => ({
          ...edge,
          id: `${templateId}_edge_${index + 1}`,
          source: `${templateId}_node_${template.nodes.findIndex((n) => n.id === edge.source) + 1}`,
          target: `${templateId}_node_${template.nodes.findIndex((n) => n.id === edge.target) + 1}`,
        }))

        // Clear existing nodes and edges, then set new ones
        setNodes([])
        setEdges([])

        // Use setTimeout to ensure state is cleared before setting new values
        setTimeout(() => {
          setNodes(nodesWithHandlers)
          setEdges(updatedEdges)
        }, 100)

        setShowTemplateModal(false)

        toast({
          title: "Template Applied",
          description: `${template.name} template has been applied to your workflow`,
        })
      }
    },
    [setNodes, setEdges, handleEditNode],
  )

  if (showFlowBuilder) {
    return (
      <DndProvider backend={HTML5Backend}>
        <ReactFlowProvider>
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
                        setEdges([])
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
                      onClick={() => setShowTemplateModal(true)}
                      className="bg-black border border-white text-white hover:bg-white hover:text-black"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
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
                  <Button
                    onClick={() => addNode("trigger")}
                    className="w-full justify-start bg-black border-2 border-blue-500/50 text-white hover:bg-blue-500/10"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Trigger
                  </Button>
                  <Button
                    onClick={() => addNode("delay")}
                    className="w-full justify-start bg-black border-2 border-yellow-500/50 text-white hover:bg-yellow-500/10"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Delay
                  </Button>
                  <Button
                    onClick={() => addNode("email")}
                    className="w-full justify-start bg-black border-2 border-green-500/50 text-white hover:bg-green-500/10"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    onClick={() => addNode("condition")}
                    className="w-full justify-start bg-black border-2 border-purple-500/50 text-white hover:bg-purple-500/10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Condition
                  </Button>
                  <Button
                    onClick={() => addNode("action")}
                    className="w-full justify-start bg-black border-2 border-orange-500/50 text-white hover:bg-orange-500/10"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Action
                  </Button>
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
                      <Textarea
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
              <div className="flex-1 bg-black">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-black"
                >
                  <Controls className="bg-black border-white/20" />
                  <MiniMap className="bg-black border-white/20" />
                  <Background color="#333" gap={20} />
                </ReactFlow>
              </div>
            </div>

            {/* Template Selection Modal */}
            <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
              <DialogContent className="bg-black border-2 border-white text-white max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Choose Workflow Template</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="bg-black border-2 border-white/20 hover:border-white/40 transition-colors"
                    >
                      <CardHeader>
                        <CardTitle className="text-white">{template.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <span>{template.nodes.length} nodes</span>
                          <span>•</span>
                          <span>{template.edges.length} connections</span>
                        </div>
                        <Button
                          onClick={() => handleUseTemplate(template.id)}
                          className="w-full bg-white text-black hover:bg-gray-200"
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Node Configuration Modal */}
            <Dialog open={!!showNodeConfig} onOpenChange={() => setShowNodeConfig(null)}>
              <DialogContent className="bg-black border-2 border-white text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Configure {showNodeConfig?.data?.label}</DialogTitle>
                </DialogHeader>
                {showNodeConfig && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Node Title</Label>
                      <Input
                        className="bg-black border-2 border-white/20 text-white"
                        value={showNodeConfig.data.label}
                        onChange={(e) => {
                          updateNodeConfig(showNodeConfig.id, { label: e.target.value })
                          setShowNodeConfig({
                            ...showNodeConfig,
                            data: { ...showNodeConfig.data, label: e.target.value },
                          })
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-white">Description</Label>
                      <Input
                        className="bg-black border-2 border-white/20 text-white"
                        value={showNodeConfig.data.description}
                        onChange={(e) => {
                          updateNodeConfig(showNodeConfig.id, { description: e.target.value })
                          setShowNodeConfig({
                            ...showNodeConfig,
                            data: { ...showNodeConfig.data, description: e.target.value },
                          })
                        }}
                      />
                    </div>

                    {/* Trigger Node Config */}
                    {showNodeConfig.type === "trigger" && (
                      <div>
                        <Label className="text-white">Event Type</Label>
                        <Select
                          value={showNodeConfig.data.config?.event || "subscriber_added"}
                          onValueChange={(value) => updateNodeConfig(showNodeConfig.id, { config: { event: value } })}
                        >
                          <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                            <SelectValue placeholder="Select event" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/20">
                            <SelectItem value="subscriber_added">New Subscriber</SelectItem>
                            <SelectItem value="email_opened">Email Opened</SelectItem>
                            <SelectItem value="link_clicked">Link Clicked</SelectItem>
                            <SelectItem value="cart_abandoned">Cart Abandoned</SelectItem>
                            <SelectItem value="purchase_made">Purchase Made</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Delay Node Config */}
                    {showNodeConfig.type === "delay" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-white">Duration</Label>
                          <Input
                            type="number"
                            className="bg-black border-2 border-white/20 text-white"
                            value={showNodeConfig.data.config?.duration || 1}
                            onChange={(e) =>
                              updateNodeConfig(showNodeConfig.id, {
                                config: { duration: Number.parseInt(e.target.value) },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-white">Unit</Label>
                          <Select
                            value={showNodeConfig.data.config?.unit || "days"}
                            onValueChange={(value) => updateNodeConfig(showNodeConfig.id, { config: { unit: value } })}
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

                    {/* Email Node Config */}
                    {showNodeConfig.type === "email" && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-white">Email Template</Label>
                          <Select
                            value={showNodeConfig.data.config?.template || "welcome"}
                            onValueChange={(value) =>
                              updateNodeConfig(showNodeConfig.id, { config: { template: value } })
                            }
                          >
                            <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="welcome">Welcome Email</SelectItem>
                              <SelectItem value="newsletter">Newsletter</SelectItem>
                              <SelectItem value="promotional">Promotional</SelectItem>
                              <SelectItem value="cart-reminder">Cart Reminder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">Subject Line</Label>
                          <Input
                            className="bg-black border-2 border-white/20 text-white"
                            value={showNodeConfig.data.config?.subject || ""}
                            onChange={(e) =>
                              updateNodeConfig(showNodeConfig.id, { config: { subject: e.target.value } })
                            }
                            placeholder="Enter email subject"
                          />
                        </div>
                      </div>
                    )}

                    {/* Condition Node Config */}
                    {showNodeConfig.type === "condition" && (
                      <div>
                        <Label className="text-white">Condition</Label>
                        <Select
                          value={showNodeConfig.data.config?.condition || "has_tag"}
                          onValueChange={(value) =>
                            updateNodeConfig(showNodeConfig.id, { config: { condition: value } })
                          }
                        >
                          <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/20">
                            <SelectItem value="has_tag">Has Tag</SelectItem>
                            <SelectItem value="opened_email">Opened Email</SelectItem>
                            <SelectItem value="clicked_link">Clicked Link</SelectItem>
                            <SelectItem value="made_purchase">Made Purchase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Action Node Config */}
                    {showNodeConfig.type === "action" && (
                      <div>
                        <Label className="text-white">Action</Label>
                        <Select
                          value={showNodeConfig.data.config?.action || "add_tag"}
                          onValueChange={(value) => updateNodeConfig(showNodeConfig.id, { config: { action: value } })}
                        >
                          <SelectTrigger className="bg-black border-2 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/20">
                            <SelectItem value="add_tag">Add Tag</SelectItem>
                            <SelectItem value="remove_tag">Remove Tag</SelectItem>
                            <SelectItem value="move_to_segment">Move to Segment</SelectItem>
                            <SelectItem value="update_field">Update Field</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowNodeConfig(null)}
                        className="flex-1 bg-white text-black hover:bg-gray-200"
                      >
                        Save Configuration
                      </Button>
                      <Button
                        onClick={() => {
                          deleteNode(showNodeConfig.id)
                          setShowNodeConfig(null)
                        }}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Node
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </ReactFlowProvider>
      </DndProvider>
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
                          <SelectItem value="welcome">Start from Blank</SelectItem>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
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
                          setSelectedTemplate("welcome")
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
                  setEdges([])
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
                <TrendingUp className="h-4 w-4 text-blue-400" />
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
