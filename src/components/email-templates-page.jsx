"use client";
import { useState } from "react"
import { Plus, Mail, Edit, Eye, Copy, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmailTemplateBuilder } from "@/components/email-template-builder"
import { useToast } from "@/hooks/use-toast"

const mockTemplates = [
  {
    id: "1",
    title: "Welcome Template",
    subject: "Welcome to {{company}}!",
    blocks: [
      {
        id: "1",
        type: "text",
        content: {
          text: "Hello {{name}},\n\nWelcome to {{company}}! We're excited to have you on board.",
          fontSize: "16",
          color: "#333333",
          alignment: "left",
        },
        order: 0,
      },
      {
        id: "2",
        type: "button",
        content: {
          text: "Get Started",
          url: "https://example.com/get-started",
          backgroundColor: "#007bff",
          textColor: "#ffffff",
          alignment: "center",
        },
        order: 1,
      },
    ],
    createdAt: "2025-06-20",
    updatedAt: "2025-06-20",
  },
  {
    id: "2",
    title: "Product Launch Template",
    subject: "Exciting News: New Product Launch!",
    blocks: [
      {
        id: "3",
        type: "text",
        content: {
          text: "Hi {{name}},\n\nWe're thrilled to announce the launch of our new product!",
          fontSize: "16",
          color: "#333333",
          alignment: "left",
        },
        order: 0,
      },
      {
        id: "4",
        type: "image",
        content: {
          url: "/placeholder.svg?height=200&width=400",
          alt: "Product Launch Banner",
          alignment: "center",
        },
        order: 1,
      },
      {
        id: "5",
        type: "button",
        content: {
          text: "Learn More",
          url: "https://example.com/product",
          backgroundColor: "#28a745",
          textColor: "#ffffff",
          alignment: "center",
        },
        order: 2,
      },
    ],
    createdAt: "2025-06-22",
    updatedAt: "2025-06-22",
  },
]

export function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const { toast } = useToast()

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setIsBuilderOpen(true)
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setIsBuilderOpen(true)
  }

  const handleSaveTemplate = (template) => {
    if (editingTemplate) {
      setTemplates((prev) => prev.map((t) => (t.id === template.id ? template : t)))
      toast({
        title: "Template updated",
        description: "Your email template has been updated successfully.",
      })
    } else {
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setTemplates((prev) => [...prev, newTemplate])
      toast({
        title: "Template created",
        description: "Your email template has been created successfully.",
      })
    }
    setIsBuilderOpen(false)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
    toast({
      title: "Template deleted",
      description: "The email template has been deleted successfully.",
    })
  }

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: Date.now().toString(),
      title: `${template.title} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setTemplates((prev) => [...prev, duplicatedTemplate])
    toast({
      title: "Template duplicated",
      description: "The email template has been duplicated successfully.",
    })
  }

  if (isBuilderOpen) {
    return (
      <EmailTemplateBuilder
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setIsBuilderOpen(false)
          setEditingTemplate(null)
        }} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
          <p className="text-muted-foreground">Create and manage your email templates</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Mail className="w-5 h-5 text-blue-600" />
                <div
                  className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <CardDescription>Subject: {template.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Blocks: {template.blocks.length}</p>
                  <p>Updated: {new Date(template.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleEditTemplate(template)}>
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {templates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first email template to get started</p>
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
