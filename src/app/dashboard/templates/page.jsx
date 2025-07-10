"use client"

import { useState } from "react"
import { Eye, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const templates = [
  {
    id: 1,
    name: "Welcome Email",
    description: "Clean welcome template with company branding and call-to-action button",
    category: "Welcome",
    preview: "Welcome to our platform! We're excited to have you on board...",
  },
  {
    id: 2,
    name: "Newsletter Template",
    description: "Weekly newsletter layout with sections for news, updates, and featured content",
    category: "Newsletter",
    preview: "This week's highlights and important updates from our team...",
  },
  {
    id: 3,
    name: "Product Launch",
    description: "Product announcement template with hero image and feature highlights",
    category: "Product",
    preview: "Introducing our latest product that will revolutionize your workflow...",
  },
  {
    id: 4,
    name: "Promotional Email",
    description: "Sales and discount template with countdown timer and promotional codes",
    category: "Promotional",
    preview: "Limited time offer! Get 50% off on all premium features...",
  },
  {
    id: 5,
    name: "Event Invitation",
    description: "Event invitation template with RSVP button and event details",
    category: "Event",
    preview: "You're invited to our exclusive webinar on digital marketing...",
  },
  {
    id: 6,
    name: "Thank You Email",
    description: "Appreciation template for customers and subscribers",
    category: "Thank You",
    preview: "Thank you for being a valued member of our community...",
  },
  {
    id: 7,
    name: "Survey Request",
    description: "Feedback collection template with survey link and incentives",
    category: "Survey",
    preview: "Help us improve by sharing your feedback in this quick survey...",
  },
  {
    id: 8,
    name: "Re-engagement",
    description: "Win-back template for inactive subscribers with special offers",
    category: "Re-engagement",
    preview: "We miss you! Come back and enjoy these exclusive benefits...",
  },
]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null)

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Email Templates</h1>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-white/20 bg-black p-6 hover:border-white/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-white" />
                <span className="text-xs px-2 py-1 border border-white/20 text-gray-300">{template.category}</span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{template.description}</p>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex-1 bg-black border border-white text-white hover:bg-white hover:text-black"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-white text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedTemplate?.name} - Preview</DialogTitle>
                    </DialogHeader>
                    <div className="border border-white/20 bg-white text-black p-8 min-h-96">
                      <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Email Preview</h1>
                        <p className="text-gray-700 leading-relaxed">{selectedTemplate?.preview}</p>
                        <div className="mt-8 p-4 bg-gray-100 border-l-4 border-blue-500">
                          <p className="text-sm text-gray-600">
                            This is a preview of the {selectedTemplate?.name} template. The actual email will be
                            customized with your content and branding.
                          </p>
                        </div>
                        <div className="mt-6">
                          <button className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700">
                            Call to Action Button
                          </button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="flex-1 bg-white border border-white text-black hover:bg-gray-200">
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No templates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
