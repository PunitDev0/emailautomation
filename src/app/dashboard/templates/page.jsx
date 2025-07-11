"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Search,
  Plus,
  Eye,
  Copy,
  Edit,
  Trash2,
  Mail,
  ShoppingCart,
  Heart,
  Gift,
  Zap,
  Star,
} from "lucide-react"

// Simplified CanvasPreview component for rendering template blocks in dialog
const CanvasPreview = ({ blocks }) => {
  const renderBlock = (block) => {
    switch (block.type) {
      case "text":
        return (
          <div style={block.styles} className="p-4">
            <div dangerouslySetInnerHTML={{ __html: block.content.text }} />
          </div>
        )
      case "image":
        return (
          <div style={block.styles} className="p-4">
            <img
              src={block.content.src || "/placeholder.svg"}
              alt={block.content.alt}
              className="max-w-full h-auto"
            />
          </div>
        )
      case "button":
        return (
          <div style={block.styles} className="p-4 text-center">
            <a
              href={block.content.href}
              target={block.content.target}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {block.content.text}
            </a>
          </div>
        )
      case "divider":
        return (
          <div style={block.styles} className="p-4">
            <hr style={{ borderTop: `${block.content.thickness}px ${block.content.style} ${block.content.color}` }} />
          </div>
        )
      case "spacer":
        return <div style={{ height: block.content.height }} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg max-h-[70vh] overflow-y-auto">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  )
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [templates, setTemplates] = useState([])
  const [categories, setCategories] = useState([
    { id: "all", name: "All Templates", count: 0 },
    { id: "welcome", name: "Welcome", count: 0 },
    { id: "promotional", name: "Promotional", count: 0 },
    { id: "transactional", name: "Transactional", count: 0 },
    { id: "newsletter", name: "Newsletter", count: 0 },
    { id: "abandoned-cart", name: "Abandoned Cart", count: 0 },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0, hasNext: false, hasPrev: false })
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTemplateId, setDeleteTemplateId] = useState(null)
  const limit = 10
  const router = useRouter()

  // Fetch templates and category counts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch templates
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          category: selectedCategory,
          search: searchTerm,
          public: "true",
        })

        const response = await fetch(`/api/tempelates?${query}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to fetch templates")
        }

        setTemplates(result.data.templates)
        setPagination(result.data.pagination)

      

      } catch (err) {
        console.error("Fetch data error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, selectedCategory, page])

  const getCategoryIcon = (category) => {
    switch (category) {
      case "welcome":
        return <Heart className="h-4 w-4" />
      case "promotional":
        return <Gift className="h-4 w-4" />
      case "transactional":
        return <ShoppingCart className="h-4 w-4" />
      case "newsletter":
        return <Mail className="h-4 w-4" />
      case "abandoned-cart":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const handleCreateTemplate = () => {
    router.push("/templates/create")
  }

  const handlePreviewTemplate = async (templateId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tempelates/${templateId}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch template")
      }

      setPreviewTemplate(result.data)
    } catch (err) {
      console.error("Fetch preview error:", err)
      toast({
        title: "Preview Failed! ❌",
        description: err.message || "There was an error loading the template preview.",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (templateId) => {
    router.push(`/campaigns/create?template=${templateId}`)
  }

  const handleEditTemplate = (templateId) => {
    router.push(`/tempelates/${templateId}/edit`)
  }

  const handleDeleteTemplate = async (templateId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tempelates/${templateId}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete template")
      }

      setTemplates((prev) => prev.filter((t) => t.id !== templateId))
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          count: cat.id === "all" ? cat.count - 1 : cat.count,
        }))
      )
      setShowDeleteDialog(false)
      setDeleteTemplateId(null)

      toast({
        title: "Template Deleted! 🗑️",
        description: "The template has been deleted successfully.",
        duration: 2000,
      })
    } catch (err) {
      console.error("Delete template error:", err)
      toast({
        title: "Delete Failed! ❌",
        description: err.message || "There was an error deleting the template.",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLaunchBuilder = () => {
    router.push("/templates/builder")
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Email Templates</h1>
          <p className="text-gray-400">Choose from our collection of professionally designed email templates</p>
        </div>
        <Button size="sm" onClick={handleCreateTemplate} className="bg-white text-black hover:bg-gray-200">
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black border-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-white">Loading templates...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-black border border-white/20">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center space-x-2 text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              {getCategoryIcon(category.id)}
              <span>{category.name}</span>
              <Badge variant="outline" className="ml-1 border-white/20 text-gray-400">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="group rounded-none hover:shadow-lg transition-shadow bg-black border-white/20"
              >
                <div className="relative p-4">
                  {template.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-black text-white border border-white/20">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-white text-white" />
                      <span className="text-sm font-medium text-white">{template.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{template.downloads.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template.id)}
                      className="bg-black border-white text-white hover:bg-white hover:text-black w-10 h-10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteTemplateId(template.id)
                        setShowDeleteDialog(true)
                      }}
                      className="bg-black border-white text-white hover:bg-white hover:text-black w-10 h-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                disabled={!pagination.hasPrev}
                onClick={() => setPage(page - 1)}
                className="bg-black border-white text-white hover:bg-white hover:text-black"
              >
                Previous
              </Button>
              <span className="text-gray-400">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={!pagination.hasNext}
                onClick={() => setPage(page + 1)}
                className="bg-black border-white text-white hover:bg-white hover:text-black"
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Template Builder CTA */}
      <Card className="bg-black border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Create Your Own Template</h3>
              <p className="text-gray-400">
                Use our drag-and-drop template builder to create custom email templates that match your brand
              </p>
            </div>
            <Button size="lg" onClick={handleLaunchBuilder} className="bg-white text-black hover:bg-gray-200">
              <Zap className="mr-2 h-5 w-5" />
              Launch Builder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name} Preview</DialogTitle>
            <DialogDescription>Preview the template as it will appear in emails.</DialogDescription>
          </DialogHeader>
          {previewTemplate && <CanvasPreview blocks={previewTemplate.blocks || []} />}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewTemplate(null)}
              className="bg-black border-white text-white hover:bg-white hover:text-black"
            >
              Close
            </Button>
            <Button
              onClick={() => handleUseTemplate(previewTemplate.id)}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Copy className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeleteTemplateId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteTemplate(deleteTemplateId)}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}