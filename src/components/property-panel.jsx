"use client";
import { motion } from "framer-motion"
import { X, Palette, Type, Layout, Link, ExternalLink, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function PropertyPanel({
  block,
  onUpdateBlock,
  onClose
}) {
  if (!block) return null

  const updateContent = (updates) => {
    onUpdateBlock(block.id, { content: { ...block.content, ...updates } })
  }

  const updateStyles = (updates) => {
    onUpdateBlock(block.id, { styles: { ...block.styles, ...updates } })
  }

  // Extract links from text content
  const extractLinks = (text) => {
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
    const links = []
    let match

    while ((match = linkRegex.exec(text)) !== null) {
      links.push({
        url: match[1],
        text: match[2],
      })
    }

    return links
  }

  const links = block.type === "text" ? extractLinks(block.content.text || "") : []

  // Get social platform stats for social blocks
  const getSocialStats = () => {
    if (block.type !== "social" || !block.content.platforms) return null

    const platforms = block.content.platforms
    const totalPlatforms = platforms.length
    const enabledPlatforms = platforms.filter((p) => p.enabled).length
    const validLinks = platforms.filter((p) => {
      try {
        new URL(p.url)
        return true
      } catch {
        return false
      }
    }).length

    return {
      total: totalPlatforms,
      enabled: enabledPlatforms,
      valid: validLinks,
      invalid: totalPlatforms - validLinks,
    }
  }

  const socialStats = getSocialStats()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-white/80 backdrop-blur-lg">
      {/* Header */}
      <div
        className="p-4 border-b border-white/20 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 capitalize flex items-center">
          {block.type === "social" && <ExternalLink className="w-4 h-4 mr-2" />}
          {block.type !== "social" && getBlockIcon(block.type)}
          {block.type} Properties
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="content" className="text-xs">
                <Type className="w-3 h-3 mr-1" />
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="w-3 h-3 mr-1" />
                Layout
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {renderContentTab(block, updateContent)}

              {/* Enhanced Social Block Management */}
              {block.type === "social" && socialStats && (
                <Card
                  className="p-4 mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <h4 className="text-sm font-medium mb-3 flex items-center text-blue-900">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Social Media Overview
                  </h4>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{socialStats.enabled}</div>
                      <div className="text-xs text-blue-700">Active</div>
                    </div>
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{socialStats.valid}</div>
                      <div className="text-xs text-green-700">Valid Links</div>
                    </div>
                  </div>

                  {socialStats.invalid > 0 && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg mb-3">
                      <div className="flex items-center text-red-700 text-xs">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {socialStats.invalid} platform(s) have invalid URLs
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-blue-800">Quick Actions:</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-100">
                        Add Platform
                      </Badge>
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-green-100">
                        Validate Links
                      </Badge>
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-purple-100">
                        Bulk Edit
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                    <p className="text-xs text-blue-800 flex items-center">
                      <Settings className="w-3 h-3 mr-1" />
                      Click "Manage" on the block to edit individual platforms
                    </p>
                  </div>
                </Card>
              )}

              {/* Links Section for Text Blocks */}
              {block.type === "text" && links.length > 0 && (
                <Card className="p-3 mt-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Link className="w-4 h-4 mr-2" />
                    Links in this text ({links.length})
                  </h4>
                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-900 truncate">{link.text}</p>
                            <p className="text-xs text-blue-600 truncate">{link.url}</p>
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {link.url.startsWith("mailto:")
                              ? "Email"
                              : link.url.startsWith("tel:")
                                ? "Phone"
                                : link.url.includes("twitter.com") ||
                                    link.url.includes("facebook.com") ||
                                    link.url.includes("linkedin.com") ||
                                    link.url.includes("instagram.com")
                                  ? "Social"
                                  : "Website"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 flex items-center">
                      <Link className="w-3 h-3 mr-1" />
                      Tip: Select text and use the link button to add more links
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              {renderStyleTab(block, updateStyles)}
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              {renderLayoutTab(block, updateStyles)}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

function getBlockIcon(type) {
  const icons = {
    text: <Type className="w-4 h-4 mr-2" />,
    image: <Layout className="w-4 h-4 mr-2" />,
    button: <Layout className="w-4 h-4 mr-2" />,
    social: <ExternalLink className="w-4 h-4 mr-2" />,
    divider: <Layout className="w-4 h-4 mr-2" />,
    spacer: <Layout className="w-4 h-4 mr-2" />,
    columns: <Layout className="w-4 h-4 mr-2" />,
  }
  return icons[type] || <Layout className="w-4 h-4 mr-2" />;
}

function renderContentTab(block, updateContent) {
  switch (block.type) {
    case "text":
      return (
        <>
          <div>
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              value={block.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              className="mt-1"
              rows={4} />
            <p className="text-xs text-gray-500 mt-1">
              💡 Double-click the text block to edit, or select text to add links
            </p>
          </div>
          <div>
            <Label htmlFor="text-tag">HTML Tag</Label>
            <Select
              value={block.content.tag}
              onValueChange={(value) => updateContent({ tag: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="p">Paragraph</SelectItem>
                <SelectItem value="span">Span</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Text Formatting</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={block.content.formatting?.bold}
                  onCheckedChange={(checked) =>
                    updateContent({
                      formatting: { ...block.content.formatting, bold: checked },
                    })
                  } />
                <Label className="text-sm">Bold</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={block.content.formatting?.italic}
                  onCheckedChange={(checked) =>
                    updateContent({
                      formatting: { ...block.content.formatting, italic: checked },
                    })
                  } />
                <Label className="text-sm">Italic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={block.content.formatting?.underline}
                  onCheckedChange={(checked) =>
                    updateContent({
                      formatting: { ...block.content.formatting, underline: checked },
                    })
                  } />
                <Label className="text-sm">Underline</Label>
              </div>
            </div>
          </div>
          <Card className="p-3 bg-blue-50 border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Link className="w-4 h-4 mr-2" />
              Link Features
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Select any text to add website, email, or social media links</li>
              <li>• Auto-detection for email addresses and phone numbers</li>
              <li>• Support for portfolio, social media, and custom links</li>
              <li>• Quick link templates for common use cases</li>
            </ul>
          </Card>
        </>
      );

    case "image":
      return (
        <>
          <div>
            <Label htmlFor="image-src">Image URL</Label>
            <Input
              id="image-src"
              value={block.content.src}
              onChange={(e) => updateContent({ src: e.target.value })}
              className="mt-1"
              placeholder="https://example.com/image.jpg" />
          </div>
          <div>
            <Label htmlFor="image-alt">Alt Text</Label>
            <Input
              id="image-alt"
              value={block.content.alt}
              onChange={(e) => updateContent({ alt: e.target.value })}
              className="mt-1"
              placeholder="Image description" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="image-width">Width</Label>
              <Input
                id="image-width"
                type="number"
                value={block.content.width}
                onChange={(e) => updateContent({ width: Number.parseInt(e.target.value) })}
                className="mt-1" />
            </div>
            <div>
              <Label htmlFor="image-height">Height</Label>
              <Input
                id="image-height"
                type="number"
                value={block.content.height}
                onChange={(e) => updateContent({ height: Number.parseInt(e.target.value) })}
                className="mt-1" />
            </div>
          </div>
        </>
      );

    case "button":
      return (
        <>
          <div>
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={block.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              className="mt-1" />
          </div>
          <div>
            <Label htmlFor="button-href">Link URL</Label>
            <Input
              id="button-href"
              value={block.content.href}
              onChange={(e) => updateContent({ href: e.target.value })}
              className="mt-1"
              placeholder="https://example.com" />
          </div>
          <div>
            <Label htmlFor="button-target">Link Target</Label>
            <Select
              value={block.content.target}
              onValueChange={(value) => updateContent({ target: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_blank">New Window</SelectItem>
                <SelectItem value="_self">Same Window</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );

    case "social":
      return (
        <>
          <div
            className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-300">
            <ExternalLink className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Social Media Manager</h3>
            <p className="text-sm text-blue-700 mb-4">
              Click the "Manage" button on your social block to add, edit, and organize your social media links.
            </p>
            <div className="space-y-2">
              <div className="text-xs text-blue-600">✨ Features available:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                <div>• Add custom platforms</div>
                <div>• Validate URLs</div>
                <div>• Custom colors & icons</div>
                <div>• Link targeting options</div>
              </div>
            </div>
          </div>
          <Card className="p-3 bg-green-50 border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-2">Quick Tips</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Use the hover controls on each icon for quick edits</li>
              <li>• Toggle platform visibility with the switches</li>
              <li>• Add tooltips to provide context for your links</li>
              <li>• Use brand colors to maintain consistency</li>
            </ul>
          </Card>
        </>
      );

    case "spacer":
      return (
        <div>
          <Label htmlFor="spacer-height">Height (px)</Label>
          <div className="mt-2">
            <Slider
              value={[block.content.height]}
              onValueChange={([value]) => updateContent({ height: value })}
              max={200}
              min={10}
              step={5}
              className="w-full" />
            <div className="text-sm text-gray-500 mt-1 text-center">{block.content.height}px</div>
          </div>
        </div>
      );

    default:
      return <div className="text-sm text-gray-500">No content options available</div>;
  }
}

function renderStyleTab(block, updateStyles) {
  return (
    <>
      {/* Colors */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-3">Colors</h4>
        <div className="space-y-3">
          {block.type === "text" && (
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <Input
                id="text-color"
                type="color"
                value={block.styles.color}
                onChange={(e) => updateStyles({ color: e.target.value })}
                className="mt-1 h-10" />
            </div>
          )}

          <div>
            <Label htmlFor="bg-color">Background Color</Label>
            <Input
              id="bg-color"
              type="color"
              value={block.styles.backgroundColor}
              onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
              className="mt-1 h-10" />
          </div>
        </div>
      </Card>
      {/* Typography */}
      {block.type === "text" && (
        <Card className="p-3">
          <h4 className="text-sm font-medium mb-3">Typography</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <div className="mt-2">
                <Slider
                  value={[block.styles.fontSize]}
                  onValueChange={([value]) => updateStyles({ fontSize: value })}
                  max={48}
                  min={8}
                  step={1}
                  className="w-full" />
                <div className="text-sm text-gray-500 mt-1 text-center">{block.styles.fontSize}px</div>
              </div>
            </div>

            <div>
              <Label htmlFor="text-align">Text Alignment</Label>
              <Select
                value={block.styles.textAlign}
                onValueChange={(value) => updateStyles({ textAlign: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="line-height">Line Height</Label>
              <div className="mt-2">
                <Slider
                  value={[block.styles.lineHeight]}
                  onValueChange={([value]) => updateStyles({ lineHeight: value })}
                  max={3}
                  min={1}
                  step={0.1}
                  className="w-full" />
                <div className="text-sm text-gray-500 mt-1 text-center">{block.styles.lineHeight}</div>
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Border Radius */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-3">Border Radius</h4>
        <div className="mt-2">
          <Slider
            value={[block.styles.borderRadius]}
            onValueChange={([value]) => updateStyles({ borderRadius: value })}
            max={50}
            min={0}
            step={1}
            className="w-full" />
          <div className="text-sm text-gray-500 mt-1 text-center">{block.styles.borderRadius}px</div>
        </div>
      </Card>
    </>
  );
}

function renderLayoutTab(block, updateStyles) {
  return (
    <>
      {/* Padding */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-3">Padding</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={block.styles.padding?.top || 0}
              onChange={(e) =>
                updateStyles({
                  padding: { ...block.styles.padding, top: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={block.styles.padding?.right || 0}
              onChange={(e) =>
                updateStyles({
                  padding: { ...block.styles.padding, right: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={block.styles.padding?.bottom || 0}
              onChange={(e) =>
                updateStyles({
                  padding: { ...block.styles.padding, bottom: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={block.styles.padding?.left || 0}
              onChange={(e) =>
                updateStyles({
                  padding: { ...block.styles.padding, left: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
        </div>
      </Card>
      {/* Margin */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-3">Margin</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={block.styles.margin?.top || 0}
              onChange={(e) =>
                updateStyles({
                  margin: { ...block.styles.margin, top: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={block.styles.margin?.right || 0}
              onChange={(e) =>
                updateStyles({
                  margin: { ...block.styles.margin, right: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={block.styles.margin?.bottom || 0}
              onChange={(e) =>
                updateStyles({
                  margin: { ...block.styles.margin, bottom: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={block.styles.margin?.left || 0}
              onChange={(e) =>
                updateStyles({
                  margin: { ...block.styles.margin, left: Number.parseInt(e.target.value) },
                })
              }
              className="mt-1" />
          </div>
        </div>
      </Card>
    </>
  );
}
