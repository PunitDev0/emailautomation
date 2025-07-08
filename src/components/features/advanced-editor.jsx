"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Palette, Type, Layout, Layers, Settings, Wand2, Eye, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast} from "sonner"


export default function AdvancedEditor({
  isOpen,
  onClose,
  selectedBlock,
  onUpdateBlock,
  previewMode = "desktop",
}) {
  const [customCSS, setCustomCSS] = useState("")
  const [localBlock, setLocalBlock] = useState(selectedBlock)
  const [hasChanges, setHasChanges] = useState(false)
console.log(isOpen);


  const [animations, setAnimations] = useState({
    enabled: false,
    type: "fadeIn",
    duration: 0.5,
    delay: 0,
    easing: "ease-in-out",
  })

  const [filters, setFilters] = useState({
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    opacity: 100,
  })

  const [transform, setTransform] = useState({
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    translateX: 0,
    translateY: 0,
  })

  useEffect(() => {
    if (selectedBlock) {
      setLocalBlock(selectedBlock)
      setCustomCSS(selectedBlock.customCSS || "")
      setAnimations(selectedBlock.animations || animations)
      setFilters(selectedBlock.filters || filters)
      setTransform(selectedBlock.transform || transform)
      setHasChanges(false)
    }
  }, [selectedBlock])

  const animationTypes = [
    { value: "fadeIn", label: "Fade In" },
    { value: "fadeOut", label: "Fade Out" },
    { value: "slideUp", label: "Slide Up" },
    { value: "slideDown", label: "Slide Down" },
    { value: "slideLeft", label: "Slide Left" },
    { value: "slideRight", label: "Slide Right" },
    { value: "zoomIn", label: "Zoom In" },
    { value: "zoomOut", label: "Zoom Out" },
    { value: "bounce", label: "Bounce" },
    { value: "pulse", label: "Pulse" },
    { value: "shake", label: "Shake" },
    { value: "flip", label: "Flip" },
    { value: "rotateIn", label: "Rotate In" },
    { value: "elastic", label: "Elastic" },
  ]

  const easingOptions = [
    { value: "ease", label: "Ease" },
    { value: "ease-in", label: "Ease In" },
    { value: "ease-out", label: "Ease Out" },
    { value: "ease-in-out", label: "Ease In Out" },
    { value: "linear", label: "Linear" },
    { value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", label: "Back" },
    { value: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", label: "Bounce" },
  ]

  const updateLocalBlock = (updates) => {
    setLocalBlock((prev) => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const applyChanges = () => {
    if (!selectedBlock) return

    const updates = {
      ...localBlock,
      customCSS,
      animations,
      filters,
      transform,
      styles: {
        ...localBlock.styles,
        filter: generateFilterString(),
        transform: generateTransformString(),
        animation: animations.enabled ? generateAnimationString() : "none",
      },
    }

    onUpdateBlock(selectedBlock.id, updates)
    setHasChanges(false)

    toast({
      title: "Changes Applied! ✨",
      description: "Your advanced styling has been applied to the element.",
      duration: 2000,
    })
  }

  const generateFilterString = () => {
    const filterParts = []
    if (filters.blur > 0) filterParts.push(`blur(${filters.blur}px)`)
    if (filters.brightness !== 100) filterParts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== 100) filterParts.push(`contrast(${filters.contrast}%)`)
    if (filters.saturate !== 100) filterParts.push(`saturate(${filters.saturate}%)`)
    if (filters.hueRotate !== 0) filterParts.push(`hue-rotate(${filters.hueRotate}deg)`)
    if (filters.opacity !== 100) filterParts.push(`opacity(${filters.opacity}%)`)
    return filterParts.length > 0 ? filterParts.join(" ") : "none"
  }

  const generateTransformString = () => {
    const transformParts = []
    if (transform.translateX !== 0) transformParts.push(`translateX(${transform.translateX}px)`)
    if (transform.translateY !== 0) transformParts.push(`translateY(${transform.translateY}px)`)
    if (transform.rotate !== 0) transformParts.push(`rotate(${transform.rotate}deg)`)
    if (transform.scaleX !== 1) transformParts.push(`scaleX(${transform.scaleX})`)
    if (transform.scaleY !== 1) transformParts.push(`scaleY(${transform.scaleY})`)
    if (transform.skewX !== 0) transformParts.push(`skewX(${transform.skewX}deg)`)
    if (transform.skewY !== 0) transformParts.push(`skewY(${transform.skewY}deg)`)
    return transformParts.length > 0 ? transformParts.join(" ") : "none"
  }

  const generateAnimationString = () => {
    return `${animations.type} ${animations.duration}s ${animations.easing} ${animations.delay}s`
  }

  const previewAnimation = () => {
    if (!selectedBlock) return

    const tempElement = document.getElementById(`block-${selectedBlock.id}`)
    if (tempElement) {
      tempElement.style.animation = generateAnimationString()
      setTimeout(
        () => {
          tempElement.style.animation = ""
        },
        (animations.duration + animations.delay) * 1000,
      )
    }
  }

  if (!isOpen || !selectedBlock) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Advanced Editor</h2>
                <p className="text-gray-600 dark:text-gray-400">Fine-tune your element with advanced settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <Button onClick={applyChanges} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
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
                  <TabsTrigger value="effects" className="flex items-center space-x-1">
                    <Layers className="w-4 h-4" />
                    <span className="hidden sm:inline">Effects</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center space-x-1">
                    <Code className="w-4 h-4" />
                    <span className="hidden sm:inline">Code</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="styling" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Colors & Backgrounds</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            className="h-10 mt-1"
                            value={localBlock?.styles?.backgroundColor || "#ffffff"}
                            onChange={(e) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, backgroundColor: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            className="h-10 mt-1"
                            value={localBlock.styles?.color || "#333333"}
                            onChange={(e) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, color: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Background Type</Label>
                        <Select
                          value={localBlock.styles?.backgroundType || "solid"}
                          onValueChange={(value) =>
                            updateLocalBlock({
                              styles: { ...localBlock.styles, backgroundType: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid Color</SelectItem>
                            <SelectItem value="gradient">Linear Gradient</SelectItem>
                            <SelectItem value="radial">Radial Gradient</SelectItem>
                            <SelectItem value="image">Background Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {localBlock.styles?.backgroundType === "gradient" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Gradient Start</Label>
                              <Input type="color" className="h-10 mt-1" />
                            </div>
                            <div>
                              <Label>Gradient End</Label>
                              <Input type="color" className="h-10 mt-1" />
                            </div>
                          </div>
                          <div>
                            <Label>Gradient Direction: {localBlock.styles?.gradientDirection || 45}°</Label>
                            <Slider
                              value={[localBlock.styles?.gradientDirection || 45]}
                              onValueChange={([value]) =>
                                updateLocalBlock({
                                  styles: { ...localBlock.styles, gradientDirection: value },
                                })
                              }
                              max={360}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Borders & Shadows</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Border Width: {localBlock.styles?.borderWidth || 0}px</Label>
                          <Slider
                            value={[localBlock.styles?.borderWidth || 0]}
                            onValueChange={([value]) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, borderWidth: value },
                              })
                            }
                            max={20}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Border Radius: {localBlock.styles?.borderRadius || 0}px</Label>
                          <Slider
                            value={[localBlock.styles?.borderRadius || 0]}
                            onValueChange={([value]) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, borderRadius: value },
                              })
                            }
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Border Color</Label>
                          <Input
                            type="color"
                            className="h-10 mt-1"
                            value={localBlock.styles?.borderColor || "#e5e7eb"}
                            onChange={(e) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, borderColor: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Box Shadow</Label>
                        <Select
                          value={localBlock.styles?.boxShadow || "none"}
                          onValueChange={(value) =>
                            updateLocalBlock({
                              styles: { ...localBlock.styles, boxShadow: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="0 1px 3px rgba(0,0,0,0.1)">Small</SelectItem>
                            <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">Medium</SelectItem>
                            <SelectItem value="0 10px 15px rgba(0,0,0,0.1)">Large</SelectItem>
                            <SelectItem value="0 20px 25px rgba(0,0,0,0.1)">Extra Large</SelectItem>
                            <SelectItem value="0 0 20px rgba(0,0,0,0.2)">Glow</SelectItem>
                            <SelectItem value="inset 0 2px 4px rgba(0,0,0,0.1)">Inset</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Position & Transform</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Translate X: {transform.translateX}px</Label>
                          <Slider
                            value={[transform.translateX]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, translateX: value }))
                              setHasChanges(true)
                            }}
                            min={-200}
                            max={200}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Translate Y: {transform.translateY}px</Label>
                          <Slider
                            value={[transform.translateY]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, translateY: value }))
                              setHasChanges(true)
                            }}
                            min={-200}
                            max={200}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Rotate: {transform.rotate}°</Label>
                          <Slider
                            value={[transform.rotate]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, rotate: value }))
                              setHasChanges(true)
                            }}
                            min={-180}
                            max={180}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Scale X: {transform.scaleX}</Label>
                          <Slider
                            value={[transform.scaleX]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, scaleX: value }))
                              setHasChanges(true)
                            }}
                            min={0.1}
                            max={3}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Scale Y: {transform.scaleY}</Label>
                          <Slider
                            value={[transform.scaleY]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, scaleY: value }))
                              setHasChanges(true)
                            }}
                            min={0.1}
                            max={3}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Skew X: {transform.skewX}°</Label>
                          <Slider
                            value={[transform.skewX]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, skewX: value }))
                              setHasChanges(true)
                            }}
                            min={-45}
                            max={45}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Skew Y: {transform.skewY}°</Label>
                          <Slider
                            value={[transform.skewY]}
                            onValueChange={([value]) => {
                              setTransform((prev) => ({ ...prev, skewY: value }))
                              setHasChanges(true)
                            }}
                            min={-45}
                            max={45}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Typography</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Font Weight</Label>
                          <Select
                            value={localBlock.styles?.fontWeight || "normal"}
                            onValueChange={(value) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, fontWeight: value },
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="100">Thin (100)</SelectItem>
                              <SelectItem value="200">Extra Light (200)</SelectItem>
                              <SelectItem value="300">Light (300)</SelectItem>
                              <SelectItem value="400">Normal (400)</SelectItem>
                              <SelectItem value="500">Medium (500)</SelectItem>
                              <SelectItem value="600">Semi Bold (600)</SelectItem>
                              <SelectItem value="700">Bold (700)</SelectItem>
                              <SelectItem value="800">Extra Bold (800)</SelectItem>
                              <SelectItem value="900">Black (900)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Text Transform</Label>
                          <Select
                            value={localBlock.styles?.textTransform || "none"}
                            onValueChange={(value) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, textTransform: value },
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="uppercase">UPPERCASE</SelectItem>
                              <SelectItem value="lowercase">lowercase</SelectItem>
                              <SelectItem value="capitalize">Capitalize</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Letter Spacing: {localBlock.styles?.letterSpacing || 0}px</Label>
                          <Slider
                            value={[localBlock.styles?.letterSpacing || 0]}
                            onValueChange={([value]) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, letterSpacing: value },
                              })
                            }
                            min={-2}
                            max={10}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Word Spacing: {localBlock.styles?.wordSpacing || 0}px</Label>
                          <Slider
                            value={[localBlock.styles?.wordSpacing || 0]}
                            onValueChange={([value]) =>
                              updateLocalBlock({
                                styles: { ...localBlock.styles, wordSpacing: value },
                              })
                            }
                            min={-5}
                            max={20}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Text Shadow</Label>
                        <Select
                          value={localBlock.styles?.textShadow || "none"}
                          onValueChange={(value) =>
                            updateLocalBlock({
                              styles: { ...localBlock.styles, textShadow: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="1px 1px 2px rgba(0,0,0,0.3)">Subtle</SelectItem>
                            <SelectItem value="2px 2px 4px rgba(0,0,0,0.5)">Medium</SelectItem>
                            <SelectItem value="3px 3px 6px rgba(0,0,0,0.7)">Strong</SelectItem>
                            <SelectItem value="0 0 10px rgba(255,255,255,0.8)">Glow</SelectItem>
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
                          onCheckedChange={(checked) => {
                            setAnimations((prev) => ({ ...prev, enabled: checked }))
                            setHasChanges(true)
                          }}
                        />
                        <Label>Enable Animations</Label>
                      </div>

                      {animations.enabled && (
                        <>
                          <div>
                            <Label>Animation Type</Label>
                            <Select
                              value={animations.type}
                              onValueChange={(value) => {
                                setAnimations((prev) => ({ ...prev, type: value }))
                                setHasChanges(true)
                              }}
                            >
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
                              <Label>Duration: {animations.duration}s</Label>
                              <Slider
                                value={[animations.duration]}
                                onValueChange={([value]) => {
                                  setAnimations((prev) => ({ ...prev, duration: value }))
                                  setHasChanges(true)
                                }}
                                min={0.1}
                                max={5}
                                step={0.1}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label>Delay: {animations.delay}s</Label>
                              <Slider
                                value={[animations.delay]}
                                onValueChange={([value]) => {
                                  setAnimations((prev) => ({ ...prev, delay: value }))
                                  setHasChanges(true)
                                }}
                                min={0}
                                max={3}
                                step={0.1}
                                className="mt-2"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Easing</Label>
                            <Select
                              value={animations.easing}
                              onValueChange={(value) => {
                                setAnimations((prev) => ({ ...prev, easing: value }))
                                setHasChanges(true)
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {easingOptions.map((easing) => (
                                  <SelectItem key={easing.value} value={easing.value}>
                                    {easing.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button onClick={previewAnimation} className="w-full bg-transparent" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Animation
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="effects" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Effects & Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Blur: {filters.blur}px</Label>
                          <Slider
                            value={[filters.blur]}
                            onValueChange={([value]) => {
                              setFilters((prev) => ({ ...prev, blur: value }))
                              setHasChanges(true)
                            }}
                            min={0}
                            max={20}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Brightness: {filters.brightness}%</Label>
                          <Slider
                            value={[filters.brightness]}
                            onValueChange={([value]) => {
                              setFilters((prev) => ({ ...prev, brightness: value }))
                              setHasChanges(true)
                            }}
                            min={0}
                            max={200}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Contrast: {filters.contrast}%</Label>
                          <Slider
                            value={[filters.contrast]}
                            onValueChange={([value]) => {
                              setFilters((prev) => ({ ...prev, contrast: value }))
                              setHasChanges(true)
                            }}
                            min={0}
                            max={200}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Saturation: {filters.saturate}%</Label>
                          <Slider
                            value={[filters.saturate]}
                            onValueChange={([value]) => {
                              setFilters((prev) => ({ ...prev, saturate: value }))
                              setHasChanges(true)
                            }}
                            min={0}
                            max={200}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Hue Rotate: {filters.hueRotate}°</Label>
                          <Slider
                            value={[filters.hueRotate]}
                            onValueChange={([value]) => {
                              setFilters((prev) => ({ ...prev, hueRotate: value }))
                              setHasChanges(true)
                            }}
                            min={0}
                            max={360}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Opacity: {filters.opacity}%</Label>
                          <Slider
                            value={[filters.opacity]}
                            onValueChange={([value]) => {
                              setFilters((prev) => ({ ...prev, opacity: value }))
                              setHasChanges(true)
                            }}
                            min={0}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
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
                        onChange={(e) => {
                          setCustomCSS(e.target.value)
                          setHasChanges(true)
                        }}
                        placeholder="/* Enter custom CSS here */
.my-element {
  /* Your custom styles */
}"
                        className="font-mono text-sm min-h-[300px] resize-none"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xs text-gray-500">Add custom CSS to override default styles</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            updateLocalBlock({ customCSS })
                            toast({
                              title: "CSS Applied! 🎨",
                              description: "Your custom CSS has been applied.",
                              duration: 2000,
                            })
                          }}
                        >
                          Apply CSS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Styles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm max-h-[200px] overflow-auto">
                        <pre>
                          {JSON.stringify(
                            {
                              ...localBlock.styles,
                              filter: generateFilterString(),
                              transform: generateTransformString(),
                              animation: animations.enabled ? generateAnimationString() : "none",
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                      <Button
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(localBlock.styles, null, 2))
                          toast({
                            title: "Copied! 📋",
                            description: "Styles copied to clipboard.",
                            duration: 2000,
                          })
                        }}
                      >
                        Copy Styles
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-500">{hasChanges ? "You have unsaved changes" : "All changes saved"}</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={applyChanges}
                disabled={!hasChanges}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
