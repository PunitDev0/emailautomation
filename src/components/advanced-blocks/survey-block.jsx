"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import  { EmailBlock } from "../email-template-maker"


export default function SurveyBlock({ block, onUpdate }) {
  const [selectedOption, setSelectedOption] = useState("")
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const containerStyles = {
    padding: `${block.styles.padding?.top || 20}px ${block.styles.padding?.right || 20}px ${block.styles.padding?.bottom || 20}px ${block.styles.padding?.left || 20}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 16}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor || "#ffffff",
    borderRadius: `${block.styles.borderRadius}px`,
    border: "1px solid #e5e7eb",
  }

  const handleSubmit = () => {
    setSubmitted(true)
    // In a real implementation, this would send data to a server
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={containerStyles}
        className="text-center"
      >
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank you!</h3>
        <p className="text-gray-600">Your feedback has been submitted.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={containerStyles}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{block.content.title || "We'd love your feedback!"}</h3>

      {block.content.type === "rating" && (
        <div className="mb-6">
          <p className="text-gray-600 mb-3">How would you rate your experience?</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-1 hover:scale-110 transition-transform">
                <Star className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {block.content.type === "multiple-choice" && (
        <div className="mb-6">
          <p className="text-gray-600 mb-3">{block.content.question}</p>
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {block.content.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="mb-6">
        <Label htmlFor="feedback" className="text-gray-600 mb-2 block">
          Additional comments (optional)
        </Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us more about your experience..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={block.content.type === "rating" && rating === 0}
      >
        Submit Feedback
      </Button>
    </motion.div>
  )
}
