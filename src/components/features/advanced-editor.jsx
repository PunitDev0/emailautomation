"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Palette, Type, Layout, Layers, Settings, Wand2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AdvancedEditor({
  isOpen,
  onClose,
  selectedBlock,
  onUpdateBlock
}) {
  const [customCSS, setCustomCSS] = useState("")
  const [animations, setAnimations] = useState({
    enabled: false,
    type: "fadeIn",
    duration: 0.5,
    delay: 0,
  })

  const animationTypes = [
    { value: "fadeIn", label: "Fade In" },
    { value: "slideUp", label: "Slide Up" },
    { value: "slideDown", label: "Slide Down" },
    { value: "slideLeft", label: "Slide Left" },
    { value: "slideRight", label: "Slide Right" },
    { value: "zoomIn", label: "Zoom In" },
    { value: "zoomOut", label: "Zoom Out" },
    { value: "bounce", label: "Bounce" },
    { value: "pulse", label: "Pulse" },
    { value: "shake", label: "Shake" },
  ]

  const responsiveBreakpoints = [
    { name: "Mobile", width: 320, active: true },
    { name: "Tablet", width: 768, active: true },
    { name: "Desktop", width: 1024, active: true },
    { name: "Large", width: 1440, active: false },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
            {/* Header */}
            <div
              className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Advanced Editor</h2>
                  <p className="text-gray-600">Fine-tune your block with advanced settings</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="styling" className="h-full flex flex-col">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="styling" className="flex items-center space-x-1">
                      <Palette className="w-4 h-4" />
                      <span className="hidden sm:inline">Styling</span>
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="flex items-center space-x-1">
                      <Layout className="w-4 h-4" />
                      <span className="hidden sm:inline">Layout</span>
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="flex items-center space-x-1">
                      <Type className="w-4 h-4" />
                      <span className="hidden sm:inline">Typography</span>
                    </TabsTrigger>
                    <TabsTrigger value="animations" className="flex items-center space-x-1">
                      <Wand2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Animations</span>
                    </TabsTrigger>
                    <TabsTrigger value="responsive" className="flex items-center space-x-1">
                      <Layers className="w-4 h-4" />
                      <span className="hidden sm:inline">Responsive</span>
                    </TabsTrigger>
                    <TabsTrigger value="code" className="flex items-center space-x-1">
                      <Code className="w-4 h-4" />
                      <span className="hidden sm:inline">Code</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <TabsContent value="styling" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Colors & Backgrounds</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Background Color</Label>
                            <Input type="color" className="h-10 mt-1" />
                          </div>
                          <div>
                            <Label>Text Color</Label>
                            <Input type="color" className="h-10 mt-1" />
                          </div>
                        </div>

                        <div>
                          <Label>Background Type</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select background type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">Solid Color</SelectItem>
                              <SelectItem value="gradient">Gradient</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="pattern">Pattern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Opacity</Label>
                          <Slider defaultValue={[100]} max={100} step={1} className="mt-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Borders & Shadows</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Border Width</Label>
                            <Slider defaultValue={[0]} max={10} step={1} className="mt-2" />
                          </div>
                          <div>
                            <Label>Border Radius</Label>
                            <Slider defaultValue={[0]} max={50} step={1} className="mt-2" />
                          </div>
                        </div>

                        <div>
                          <Label>Border Color</Label>
                          <Input type="color" className="h-10 mt-1" />
                        </div>

                        <div>
                          <Label>Box Shadow</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select shadow" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="sm">Small</SelectItem>
                              <SelectItem value="md">Medium</SelectItem>
                              <SelectItem value="lg">Large</SelectItem>
                              <SelectItem value="xl">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Spacing & Positioning</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label>Margin Top</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Margin Right</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Margin Bottom</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Margin Left</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label>Padding Top</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Padding Right</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Padding Bottom</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Padding Left</Label>
                            <Input type="number" placeholder="0" className="mt-1" />
                          </div>
                        </div>

                        <div>
                          <Label>Display</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select display type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="block">Block</SelectItem>
                              <SelectItem value="inline">Inline</SelectItem>
                              <SelectItem value="inline-block">Inline Block</SelectItem>
                              <SelectItem value="flex">Flex</SelectItem>
                              <SelectItem value="grid">Grid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Font Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Font Family</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="arial">Arial</SelectItem>
                              <SelectItem value="helvetica">Helvetica</SelectItem>
                              <SelectItem value="times">Times New Roman</SelectItem>
                              <SelectItem value="georgia">Georgia</SelectItem>
                              <SelectItem value="verdana">Verdana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Font Size</Label>
                            <Slider defaultValue={[16]} min={8} max={72} step={1} className="mt-2" />
                          </div>
                          <div>
                            <Label>Line Height</Label>
                            <Slider defaultValue={[1.5]} min={1} max={3} step={0.1} className="mt-2" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>Bold</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>Italic</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label>Underline</Label>
                          </div>
                        </div>

                        <div>
                          <Label>Text Align</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                              <SelectItem value="justify">Justify</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="animations" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Animation Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={animations.enabled}
                            onCheckedChange={(checked) => setAnimations((prev) => ({ ...prev, enabled: checked }))} />
                          <Label>Enable Animations</Label>
                        </div>

                        {animations.enabled && (
                          <>
                            <div>
                              <Label>Animation Type</Label>
                              <Select
                                value={animations.type}
                                onValueChange={(value) => setAnimations((prev) => ({ ...prev, type: value }))}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {animationTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Duration (seconds)</Label>
                                <Slider
                                  value={[animations.duration]}
                                  onValueChange={([value]) => setAnimations((prev) => ({ ...prev, duration: value }))}
                                  min={0.1}
                                  max={3}
                                  step={0.1}
                                  className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">{animations.duration}s</p>
                              </div>
                              <div>
                                <Label>Delay (seconds)</Label>
                                <Slider
                                  value={[animations.delay]}
                                  onValueChange={([value]) => setAnimations((prev) => ({ ...prev, delay: value }))}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">{animations.delay}s</p>
                              </div>
                            </div>

                            <Button className="w-full bg-transparent" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview Animation
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="responsive" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Responsive Breakpoints</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {responsiveBreakpoints.map((breakpoint) => (
                          <div
                            key={breakpoint.name}
                            className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Switch defaultChecked={breakpoint.active} />
                              <div>
                                <p className="font-medium">{breakpoint.name}</p>
                                <p className="text-sm text-gray-500">{breakpoint.width}px and up</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Custom CSS</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={customCSS}
                          onChange={(e) => setCustomCSS(e.target.value)}
                          placeholder="Enter custom CSS here..."
                          className="font-mono text-sm min-h-[200px]" />
                        <div className="flex justify-between items-center mt-4">
                          <p className="text-xs text-gray-500">Add custom CSS to override default styles</p>
                          <Button size="sm">Apply CSS</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Generated HTML</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="bg-gray-100 rounded-lg p-4 font-mono text-sm max-h-[200px] overflow-auto">
                          <pre>{`<div class="email-block">
  <!-- Generated HTML will appear here -->
  <p>Your block content...</p>
</div>`}</pre>
                        </div>
                        <Button size="sm" className="mt-4">
                          Copy HTML
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button>Apply Changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
