"use client";
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Link, ExternalLink, Mail, Phone, Globe, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const linkTypes = [
  { value: "website", label: "Website", icon: Globe, placeholder: "https://example.com" },
  { value: "email", label: "Email", icon: Mail, placeholder: "contact@example.com" },
  { value: "phone", label: "Phone", icon: Phone, placeholder: "+1 (555) 123-4567" },
  { value: "social", label: "Social Media", icon: User, placeholder: "https://twitter.com/username" },
  { value: "portfolio", label: "Portfolio", icon: Briefcase, placeholder: "https://portfolio.com" },
  { value: "custom", label: "Custom", icon: Link, placeholder: "https://custom-link.com" },
]

const socialPlatforms = [
  { name: "Twitter", domain: "twitter.com", color: "#1DA1F2" },
  { name: "LinkedIn", domain: "linkedin.com", color: "#0077B5" },
  { name: "Facebook", domain: "facebook.com", color: "#1877F2" },
  { name: "Instagram", domain: "instagram.com", color: "#E4405F" },
  { name: "GitHub", domain: "github.com", color: "#333" },
  { name: "YouTube", domain: "youtube.com", color: "#FF0000" },
  { name: "TikTok", domain: "tiktok.com", color: "#000" },
  { name: "Discord", domain: "discord.com", color: "#5865F2" },
]

export default function LinkEditorModal({
  isOpen,
  onClose,
  selectedText,
  onInsertLink,
  existingLink
}) {
  const [linkData, setLinkData] = useState({
    text: selectedText || "",
    url: "",
    target: "_blank",
    type: "website",
    title: "",
    rel: "noopener noreferrer",
  })

  const [quickLinks, setQuickLinks] = useState([
    { text: "Visit our website", url: "https://example.com", target: "_blank", type: "website" },
    { text: "Contact us", url: "mailto:contact@example.com", target: "_self", type: "email" },
    { text: "Follow us on Twitter", url: "https://twitter.com/example", target: "_blank", type: "social" },
    { text: "View portfolio", url: "https://portfolio.example.com", target: "_blank", type: "portfolio" },
  ])

  useEffect(() => {
    if (existingLink) {
      setLinkData(existingLink)
    } else {
      setLinkData((prev) => ({
        ...prev,
        text: selectedText || "",
      }))
    }
  }, [selectedText, existingLink])

  const handleTypeChange = (type) => {
    setLinkData((prev) => ({
      ...prev,
      type: type,
      url: "",
    }))
  }

  const handleUrlChange = (url) => {
    let processedUrl = url
    let detectedType = linkData.type

    // Auto-detect link type and format URL
    if (url.includes("@") && !url.startsWith("mailto:")) {
      processedUrl = `mailto:${url}`
      detectedType = "email"
    } else if (url.match(/^\+?[\d\s\-$$$$]+$/)) {
      processedUrl = `tel:${url.replace(/\s/g, "")}`
      detectedType = "phone"
    } else if (url && !url.startsWith("http") && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
      processedUrl = `https://${url}`
    }

    // Detect social platforms
    const socialPlatform = socialPlatforms.find((platform) => url.includes(platform.domain))
    if (socialPlatform) {
      detectedType = "social"
    }

    setLinkData((prev) => ({
      ...prev,
      url: processedUrl,
      type: detectedType,
    }))
  }

  const handleInsertLink = () => {
    if (!linkData.url || !linkData.text) return

    onInsertLink(linkData)
    onClose()
  }

  const handleQuickLinkSelect = (quickLink) => {
    setLinkData({
      ...quickLink,
      text: selectedText || quickLink.text,
    })
  }

  const getUrlPlaceholder = () => {
    const linkType = linkTypes.find((type) => type.value === linkData.type)
    return linkType?.placeholder || "Enter URL"
  }

  const getLinkPreview = () => {
    if (!linkData.url || !linkData.text) return null

    return (
      <Card className="mt-4 bg-blue-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Preview:</span>
          </div>
          <a
            href={linkData.url}
            target={linkData.target}
            rel={linkData.rel}
            className="text-blue-600 hover:text-blue-800 underline text-sm mt-1 block"
            onClick={(e) => e.preventDefault()}>
            {linkData.text}
          </a>
          <p className="text-xs text-gray-500 mt-1">{linkData.url}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Link className="w-5 h-5" />
              <span>{existingLink ? "Edit Link" : "Add Link"}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="quick">Quick Links</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  value={linkData.text}
                  onChange={(e) => setLinkData((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter the text to display"
                  className="mt-1" />
              </div>

              <div>
                <Label htmlFor="link-type">Link Type</Label>
                <Select value={linkData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {linkTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={linkData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder={getUrlPlaceholder()}
                  className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  {linkData.type === "email" && "Email addresses will automatically get mailto: prefix"}
                  {linkData.type === "phone" && "Phone numbers will automatically get tel: prefix"}
                  {linkData.type === "website" && "URLs will automatically get https:// prefix if needed"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link-target">Open In</Label>
                  <Select
                    value={linkData.target}
                    onValueChange={(value) => setLinkData((prev) => ({ ...prev, target: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_blank">New Window/Tab</SelectItem>
                      <SelectItem value="_self">Same Window</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="link-title">Title (Optional)</Label>
                  <Input
                    id="link-title"
                    value={linkData.title || ""}
                    onChange={(e) => setLinkData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Tooltip text"
                    className="mt-1" />
                </div>
              </div>

              {/* Social Platform Detection */}
              {linkData.type === "social" && linkData.url && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Detected Platform</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {socialPlatforms
                      .filter((platform) => linkData.url.includes(platform.domain))
                      .map((platform) => (
                        <Badge
                          key={platform.name}
                          style={{ backgroundColor: platform.color, color: "white" }}>
                          {platform.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {getLinkPreview()}
            </div>
          </TabsContent>

          <TabsContent value="quick" className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Link Templates</Label>
              <div className="grid gap-2">
                {quickLinks.map((quickLink, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300"
                      onClick={() => handleQuickLinkSelect(quickLink)}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {linkTypes.find((type) => type.value === quickLink.type)?.icon && (
                              <div className="p-2 rounded-lg bg-blue-100">
                                {(() => {
                                  const IconComponent = linkTypes.find((type) => type.value === quickLink.type)?.icon
                                  return IconComponent ? <IconComponent className="w-4 h-4 text-blue-600" /> : null;
                                })()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{quickLink.text}</p>
                              <p className="text-xs text-gray-500">{quickLink.url}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {linkTypes.find((type) => type.value === quickLink.type)?.label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Custom Quick Link</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Link text"
                  value={linkData.text}
                  onChange={(e) => setLinkData((prev) => ({ ...prev, text: e.target.value }))} />
                <Input
                  placeholder="URL"
                  value={linkData.url}
                  onChange={(e) => handleUrlChange(e.target.value)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleInsertLink}
            disabled={!linkData.url || !linkData.text}
            className="bg-blue-600 hover:bg-blue-700">
            {existingLink ? "Update Link" : "Insert Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
