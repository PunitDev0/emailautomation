"use client"

import React,{ useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  ExternalLink,
  Mail,
  Phone,
  User,
  Briefcase,
  LinkIcon,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Check,
  AlertCircle,
} from "lucide-react"
import { useDebouncedCallback } from "../../hooks/use-debounce"

const linkTemplates = {
  website: {
    icon: Globe,
    label: "Website",
    placeholder: "https://example.com",
    examples: ["https://google.com", "https://github.com", "https://stackoverflow.com"],
  },
  email: {
    icon: Mail,
    label: "Email",
    placeholder: "mailto:someone@example.com",
    examples: ["mailto:contact@company.com", "mailto:support@service.com", "mailto:hello@startup.com"],
  },
  phone: {
    icon: Phone,
    label: "Phone",
    placeholder: "tel:+1234567890",
    examples: ["tel:+1-555-123-4567", "tel:+44-20-7946-0958", "tel:+91-98765-43210"],
  },
  social: {
    icon: User,
    label: "Social Media",
    placeholder: "https://twitter.com/username",
    examples: [
      "https://twitter.com/username",
      "https://linkedin.com/in/username",
      "https://instagram.com/username",
      "https://facebook.com/username",
    ],
  },
  portfolio: {
    icon: Briefcase,
    label: "Portfolio",
    placeholder: "https://portfolio.com",
    examples: ["https://behance.net/username", "https://dribbble.com/username", "https://portfolio.com"],
  },
  custom: {
    icon: LinkIcon,
    label: "Custom Link",
    placeholder: "https://custom-link.com",
    examples: ["https://custom-service.com", "https://internal-tool.com", "https://special-page.com"],
  },
}

export default function LinkEditorModal({
  isOpen,
  onClose,
  selectedText,
  onInsertLink,
  existingLink,
}) {
  const [linkData, setLinkData] = useState({
    text: selectedText || "",
    url: "",
    target: "_blank",
    type: "website",
    title: "",
    rel: "",
    ...existingLink,
  })

  const [tempUrl, setTempUrl] = useState(linkData.url)
  const [isValidUrl, setIsValidUrl] = useState(true)

  const debouncedValidateUrl = useDebouncedCallback((url) => {
    if (!url) {
      setIsValidUrl(true)
      return
    }

    try {
      new URL(url)
      setIsValidUrl(true)
    } catch {
      const isEmail = url.startsWith("mailto:")
      const isPhone = url.startsWith("tel:")
      const isRelative = url.startsWith("/") || url.startsWith("#")

      setIsValidUrl(isEmail || isPhone || isRelative)
    }
  }, 300)

  const handleUrlChange = useCallback(
    (url) => {
      setTempUrl(url)
      setLinkData((prev) => ({ ...prev, url }))
      debouncedValidateUrl(url)
    },
    [debouncedValidateUrl],
  )

  const handleSubmit = useCallback(() => {
    if (!linkData.text.trim() || !linkData.url.trim()) return

    onInsertLink({
      ...linkData,
      url: tempUrl,
    })
    onClose()
  }, [linkData, tempUrl, onInsertLink, onClose])

  const handleTemplateSelect = useCallback(
    (template) => {
      const newUrl = template.examples[0]
      setTempUrl(newUrl)
      setLinkData((prev) => ({
        ...prev,
        url: newUrl,
        type: template.type,
      }))
      debouncedValidateUrl(newUrl)
    },
    [debouncedValidateUrl],
  )

  const detectLinkType = useCallback((url) => {
    if (url.startsWith("mailto:")) return "email"
    if (url.startsWith("tel:")) return "phone"
    if (
      url.includes("twitter.com") ||
      url.includes("facebook.com") ||
      url.includes("instagram.com") ||
      url.includes("linkedin.com") ||
      url.includes("youtube.com") ||
      url.includes("github.com")
    ) {
      return "social"
    }
    if (url.includes("behance.net") || url.includes("dribbble.com") || url.includes("portfolio")) {
      return "portfolio"
    }
    return "website"
  }, [])

  const getSocialIcon = useCallback((url) => {
    if (url.includes("twitter.com")) return Twitter
    if (url.includes("facebook.com")) return Facebook
    if (url.includes("instagram.com")) return Instagram
    if (url.includes("linkedin.com")) return Linkedin
    if (url.includes("youtube.com")) return Youtube
    if (url.includes("github.com")) return Github
    return ExternalLink
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LinkIcon className="w-5 h-5" />
            <span>{existingLink ? "Edit Link" : "Add Link"}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 max-h-[70vh] overflow-y-auto">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Selected Text
              </Badge>
              <span className="font-medium text-blue-900">"{linkData.text || selectedText}"</span>
            </div>
            <p className="text-xs text-blue-600 mt-2">This text will become clickable with your link</p>
          </Card>

          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Link</TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(linkTemplates).map(([key, template]) => {
                  const IconComponent = template.icon
                  return (
                    <motion.div key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          linkData.type === key ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleTemplateSelect({ ...template, type: key })}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{template.label}</h3>
                            <p className="text-xs text-gray-500">{template.placeholder}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {linkData.type && (
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    {React.createElement(linkTemplates[linkData.type].icon, { className: "w-5 h-5 mr-2" })}
                    <span>{linkTemplates[linkData.type].label} Examples</span>
                  </h4>
                  <div className="space-y-2">
                    {linkTemplates[linkData.type].examples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleUrlChange(example)}
                        className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">{example}</span>
                          {tempUrl === example && <Check className="w-4 h-4 text-green-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-text" className="text-sm font-medium">
                    Link Text
                  </Label>
                  <Input
                    id="link-text"
                    value={linkData.text}
                    onChange={(e) => setLinkData((prev) => ({ ...prev, text: e.target.value }))}
                    className="mt-1"
                    placeholder="Enter link text"
                  />
                </div>

                <div>
                  <Label htmlFor="link-url" className="text-sm font-medium flex items-center space-x-2">
                    <span>URL</span>
                    {!isValidUrl && tempUrl && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Invalid URL
                      </Badge>
                    )}
                    {isValidUrl && tempUrl && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Valid
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="link-url"
                    value={tempUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={`mt-1 transition-colors duration-200 ${
                      !isValidUrl && tempUrl ? "border-red-300 focus:border-red-500" : ""
                    }`}
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a complete URL including https:// or use mailto: for emails, tel: for phone numbers
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="link-target" className="text-sm font-medium">
                      Open In
                    </Label>
                    <Select
                      value={linkData.target}
                      onValueChange={(value) => setLinkData((prev) => ({ ...prev, target: value }))}
                    >
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
                    <Label htmlFor="link-type" className="text-sm font-medium">
                      Link Type
                    </Label>
                    <Select
                      value={linkData.type}
                      onValueChange={(value) => setLinkData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="link-title" className="text-sm font-medium">
                    Tooltip Text (Optional)
                  </Label>
                  <Input
                    id="link-title"
                    value={linkData.title}
                    onChange={(e) => setLinkData((prev) => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                    placeholder="Appears when users hover over the link"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <AnimatePresence>
            {tempUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Link Preview
                  </h4>
                  <div className="flex items-center space-x-3">
                    {linkData.type === "social" && (
                      (() => {
                        const SocialIcon = getSocialIcon(tempUrl)
                        return <SocialIcon className="w-5 h-5 text-blue-600" />
                      })()
                    )}
                    <div>
                      <p className="text-sm">
                        <span
                          className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                          title={linkData.title}
                        >
                          {linkData.text}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-md">{tempUrl}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {linkData.text && tempUrl ? (
              <span className="flex items-center text-green-600">
                <Check className="w-3 h-3 mr-1" />
                Ready to insert link
              </span>
            ) : (
              <span className="flex items-center text-gray-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Please enter both text and URL
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!linkData.text.trim() || !tempUrl.trim() || !isValidUrl}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {existingLink ? "Update Link" : "Insert Link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}