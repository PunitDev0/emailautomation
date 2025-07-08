"use client"

import { useState } from "react"
import { MessageSquare, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function SurveyBlock({ block, isSelected, onUpdate, onSelect, previewMode }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [title, setTitle] = useState(block.content.title || "")
  const [question, setQuestion] = useState(block.content.question || "")
  const [type, setType] = useState(block.content.type || "rating")
  const [options, setOptions] = useState(block.content.options || [])
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedOption, setSelectedOption] = useState("")

  const handleSave = () => {
    onUpdate(block.id, {
      content: {
        ...block.content,
        title,
        question,
        type,
        options,
      },
    })
    setShowEditDialog(false)
  }

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`])
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const getResponsiveStyles = () => {
    const baseStyles = block.styles || {}
    const responsiveStyles = block.responsive?.[previewMode] || {}
    return { ...baseStyles, ...responsiveStyles }
  }

  const styles = getResponsiveStyles()

  const renderSurveyContent = () => {
    switch (block.content.type) {
      case "rating":
        return (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`p-2 rounded-full transition-colors ${
                    selectedRating >= rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setSelectedRating(rating)}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              {selectedRating > 0 && `You rated ${selectedRating} star${selectedRating > 1 ? "s" : ""}`}
            </p>
          </div>
        )

      case "multiple-choice":
        return (
          <div className="space-y-3">
            {block.content.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`survey-${block.id}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case "text":
        return <Textarea placeholder="Enter your feedback here..." className="min-h-[100px]" />

      default:
        return <div className="text-center text-gray-500 py-8">Configure your survey in the settings</div>
    }
  }

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onClick={() => onSelect(block.id)}
      style={{
        padding: `${styles.padding?.top || 16}px ${styles.padding?.right || 16}px ${styles.padding?.bottom || 16}px ${styles.padding?.left || 16}px`,
        margin: `${styles.margin?.top || 0}px ${styles.margin?.right || 0}px ${styles.margin?.bottom || 16}px ${styles.margin?.left || 0}px`,
        backgroundColor: styles.backgroundColor || "#ffffff",
        borderRadius: `${styles.borderRadius || 8}px`,
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Survey Content */}
      <div className="text-center space-y-4">
        {/* Title */}
        {block.content.title && <h3 className="text-xl font-bold text-gray-800">{block.content.title}</h3>}

        {/* Question */}
        {block.content.question && <p className="text-gray-600">{block.content.question}</p>}

        {/* Survey Input */}
        {renderSurveyContent()}

        {/* Submit Button */}
        <Button className="mt-4">Submit Response</Button>
      </div>

      {/* Edit Button */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-black hover:bg-gray-100 shadow-lg">
                <Settings className="w-4 h-4 mr-2" />
                Edit Survey
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Survey</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="survey-title">Title</Label>
                  <Input
                    id="survey-title"
                    placeholder="We'd love your feedback!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="survey-question">Question</Label>
                  <Input
                    id="survey-question"
                    placeholder="How satisfied are you with our service?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="survey-type">Survey Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Star Rating</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="text">Text Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === "multiple-choice" && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {options.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button size="sm" variant="outline" onClick={() => removeOption(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addOption} variant="outline" className="w-full bg-transparent">
                      Add Option
                    </Button>
                  </div>
                )}

                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Block Type Indicator */}
      {isSelected && (
        <div className="absolute -top-6 -right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <MessageSquare className="w-3 h-3" />
          <span>Survey</span>
        </div>
      )}
    </div>
  )
}
