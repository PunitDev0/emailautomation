"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Store, Star, Download, Heart, Filter, Search, TrendingUp, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



const marketplaceTemplates = [
  {
    id: "mp-1",
    name: "Modern SaaS Newsletter",
    description: "Clean and professional newsletter template perfect for SaaS companies",
    author: {
      name: "Design Studio Pro",
      avatar: "/placeholder.svg?height=32&width=32",
      verified: true,
    },
    price: 29,
    rating: 4.9,
    downloads: 1250,
    likes: 89,
    tags: ["saas", "newsletter", "modern", "professional"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Business",
    isPremium: true,
    isTrending: true,
    isNew: false,
  },
  {
    id: "mp-2",
    name: "E-commerce Flash Sale",
    description: "High-converting flash sale template with countdown timer",
    author: {
      name: "Commerce Templates",
      avatar: "/placeholder.svg?height=32&width=32",
      verified: true,
    },
    price: 0,
    rating: 4.7,
    downloads: 2100,
    likes: 156,
    tags: ["ecommerce", "sale", "countdown", "conversion"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "E-commerce",
    isPremium: false,
    isTrending: true,
    isNew: true,
  },
  {
    id: "mp-3",
    name: "Creative Portfolio Showcase",
    description: "Stunning portfolio template for creative professionals",
    author: {
      name: "Creative Collective",
      avatar: "/placeholder.svg?height=32&width=32",
      verified: false,
    },
    price: 19,
    rating: 4.8,
    downloads: 890,
    likes: 67,
    tags: ["portfolio", "creative", "showcase", "artistic"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Creative",
    isPremium: true,
    isTrending: false,
    isNew: true,
  },
]


export default function TemplateMarketplace({ isOpen, onClose, onPurchaseTemplate }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [likedTemplates, setLikedTemplates] = useState(new Set())

  const toggleLike = (templateId) => {
    setLikedTemplates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(templateId)) {
        newSet.delete(templateId)
      } else {
        newSet.add(templateId)
      }
      return newSet
    })
  }

  const filteredTemplates = marketplaceTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Template Marketplace</h2>
                    <p className="text-gray-600">Discover premium templates from the community</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center space-x-4 mt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200 p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {["all", "business", "e-commerce", "creative", "newsletter"].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {[
                        { value: "trending", label: "Trending", icon: TrendingUp },
                        { value: "popular", label: "Most Popular", icon: Star },
                        { value: "newest", label: "Newest", icon: Zap },
                        { value: "price-low", label: "Price: Low to High", icon: null },
                        { value: "price-high", label: "Price: High to Low", icon: null },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                            sortBy === option.value ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {option.icon && <option.icon className="w-4 h-4 mr-2" />}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="flex-1">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="all">All Templates</TabsTrigger>
                        <TabsTrigger value="free">Free</TabsTrigger>
                        <TabsTrigger value="premium">Premium</TabsTrigger>
                        <TabsTrigger value="trending">Trending</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredTemplates.map((template, index) => (
                            <motion.div
                              key={template.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -5 }}
                            >
                              <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="relative">
                                  <img
                                    src={template.thumbnail || "/placeholder.svg"}
                                    alt={template.name}
                                    className="w-full h-48 object-cover"
                                  />

                                  {/* Badges */}
                                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                                    {template.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                                    {template.isTrending && (
                                      <Badge className="bg-orange-500 text-white">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Trending
                                      </Badge>
                                    )}
                                    {template.isPremium && (
                                      <Badge className="bg-purple-500 text-white">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Premium
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Like Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleLike(template.id)
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                  >
                                    <Heart
                                      className={`w-4 h-4 ${
                                        likedTemplates.has(template.id) ? "text-red-500 fill-current" : "text-gray-600"
                                      }`}
                                    />
                                  </button>

                                  {/* Overlay */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                    <Button
                                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                                      onClick={() => onPurchaseTemplate(template)}
                                    >
                                      {template.price === 0 ? "Download Free" : `Buy for $${template.price}`}
                                    </Button>
                                  </div>
                                </div>

                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                      {template.name}
                                    </h3>
                                    <div className="text-right">
                                      {template.price === 0 ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                          Free
                                        </Badge>
                                      ) : (
                                        <p className="font-bold text-gray-800">${template.price}</p>
                                      )}
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                                  {/* Author */}
                                  <div className="flex items-center space-x-2 mb-3">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={template.author.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="text-xs">
                                        {template.author.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-gray-600">{template.author.name}</span>
                                    {template.author.verified && (
                                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
                                        Verified
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Stats */}
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-3">
                                      <span className="flex items-center">
                                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                        {template.rating}
                                      </span>
                                      <span className="flex items-center">
                                        <Download className="w-3 h-3 mr-1" />
                                        {template.downloads.toLocaleString()}
                                      </span>
                                      <span className="flex items-center">
                                        <Heart className="w-3 h-3 mr-1" />
                                        {template.likes}
                                      </span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {template.category}
                                    </Badge>
                                  </div>

                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {template.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {template.tags.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{template.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="free">
                        <div className="text-center py-12">
                          <p className="text-gray-500">Free templates will be displayed here</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="premium">
                        <div className="text-center py-12">
                          <p className="text-gray-500">Premium templates will be displayed here</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="trending">
                        <div className="text-center py-12">
                          <p className="text-gray-500">Trending templates will be displayed here</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
