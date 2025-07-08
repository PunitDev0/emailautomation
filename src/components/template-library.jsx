"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Star, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "./ui/loading-spinner"
import {
  emailTemplates,
  templateCategories,
  featuredTemplates,
  searchTemplates,
   EmailTemplate,
} from "@/data/templates"


export default function TemplateLibrary({
  isOpen,
  onClose,
  onSelectTemplate,
  searchQuery = "",
  onSearchChange,
  activeFilter = "All",
  onFilterChange,
}) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [selectedCategory, setSelectedCategory] = useState(activeFilter)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredTemplate, setHoveredTemplate] = useState(null)

  const filteredTemplates = useMemo(() => {
    let templates = emailTemplates
 console.log(emailTemplates);
 
    // Filter by search query
    if (localSearchQuery) {
      templates = searchTemplates(localSearchQuery)
    }

    // Filter by category
    if (selectedCategory !== "All") {
      templates = templates.filter((t) => t.category === selectedCategory)
    }

    // Filter by premium
    if (showPremiumOnly) {
      templates = templates.filter((t) => t.isPremium)
    }

    return templates
  }, [localSearchQuery, selectedCategory, showPremiumOnly])

  const handleTemplateSelect = async (template) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSelectTemplate(template)
    setIsLoading(false)
  }

  const handleSearchChange = (value) => {
    setLocalSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilterChange?.(category)
  }

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      "Social Media": "📺",
      Business: "🏢",
      "E-commerce": "🛒",
      Event: "🎉",
      Welcome: "👋",
      Holiday: "🎄",
      Survey: "📊",
      "Real Estate": "🏡",
      Health: "💪",
    }
    return emojiMap[category] || "📄"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Template Library
                </DialogTitle>
                <p className="text-gray-600 text-sm">Choose from our collection of professional email templates</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-6 pt-0">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates by name, category, or tags..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-white/40 focus:bg-white"
              />
            </div>
            <Button
              variant={showPremiumOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className={`flex items-center space-x-2 ${
                showPremiumOnly
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                  : "bg-white/70 backdrop-blur-sm border-white/40 hover:bg-white"
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Premium</span>
            </Button>
          </div>

          {/* Featured Templates */}
          {!localSearchQuery && selectedCategory === "All" && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                Featured Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTemplates.slice(0, 3).map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoveredTemplate(template.id)}
                    onHoverEnd={() => setHoveredTemplate(null)}
                  >
                    <Card className="group cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm border-white/40 hover:shadow-2xl transition-all duration-300">
                      <div className="relative">
                        <div
                          className="h-32 bg-gradient-to-br opacity-90"
                          style={{
                            background: `linear-gradient(135deg, ${template.color}20, ${template.color}40)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl">{getCategoryEmoji(template.category)}</div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" style={{ borderColor: template.color, color: template.color }}>
                            {template.category}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleTemplateSelect(template)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 mb-6 bg-white/70 backdrop-blur-sm">
              {templateCategories.slice(0, 10).map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="flex items-center space-x-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="flex-1">
              <ScrollArea className="h-full">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Loading template...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredTemplates.map((template, index) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          onHoverStart={() => setHoveredTemplate(template.id)}
                          onHoverEnd={() => setHoveredTemplate(null)}
                        >
                          <Card className="group cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm border-white/40 hover:shadow-2xl transition-all duration-300">
                            <div className="relative">
                              <div
                                className="h-40 bg-gradient-to-br"
                                style={{
                                  background: `linear-gradient(135deg, ${template.color}15, ${template.color}30)`,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-5xl opacity-80">{getCategoryEmoji(template.category)}</div>
                              </div>
                              {template.isPremium && (
                                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                  <Star className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <Button
                                    onClick={() => handleTemplateSelect(template)}
                                    className="bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                                  >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Use Template
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                  {template.name}
                                </h4>
                                <div
                                  className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
                                  style={{ backgroundColor: template.color }}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {template?.tags?.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {template?.tags?.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{template.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <Badge
                                variant="outline"
                                className="w-full justify-center"
                                style={{ borderColor: template.color, color: template.color }}
                              >
                                {template.category}
                              </Badge>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

                {filteredTemplates.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No templates found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
