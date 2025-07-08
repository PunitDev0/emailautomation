"use client"

import  React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, User, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"



export default function FormBlock({ block, onUpdate, isSelected, previewMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const content = block.content || {
    title: "Contact Us",
    subtitle: "We'd love to hear from you",
    fields: ["name", "email", "message"],
    buttonText: "Send Message",
    buttonStyle: "primary",
  }

  const styles = block.styles || {
    padding: { top: 30, right: 30, bottom: 30, left: 30 },
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getFieldIcon = (field) => {
    const icons = {
      name: User,
      email: Mail,
      message: MessageSquare,
    }
    return icons[field] || User
  }

  const getFieldLabel = (field) => {
    const labels = {
      name: "Full Name",
      email: "Email Address",
      message: "Message",
    }
    return labels[field] || field
  }

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      name: "Enter your full name",
      email: "Enter your email address",
      message: "Enter your message here...",
    }
    return placeholders[field] || `Enter ${field}`
  }

  return (
    <motion.div
      className={`
        relative w-full max-w-md mx-auto
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
      style={{
        padding: `${styles.padding?.top || 30}px ${styles.padding?.right || 30}px ${styles.padding?.bottom || 30}px ${styles.padding?.left || 30}px`,
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        border: styles.borderWidth ? `${styles.borderWidth}px solid ${styles.borderColor || "#e5e7eb"}` : "none",
        ...styles,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
        {content.subtitle && <p className="text-gray-600">{content.subtitle}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {content.fields.map((field) => {
          const Icon = getFieldIcon(field)

          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Icon className="w-4 h-4" />
                <span>{getFieldLabel(field)}</span>
              </Label>

              {field === "message" ? (
                <Textarea
                  id={field}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={getFieldPlaceholder(field)}
                  className="min-h-[100px] resize-none"
                  required
                />
              ) : (
                <Input
                  id={field}
                  type={field === "email" ? "email" : "text"}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={getFieldPlaceholder(field)}
                  required
                />
              )}
            </div>
          )
        })}

        <Button
          type="submit"
          className={`
            w-full mt-6 flex items-center justify-center space-x-2
            ${
              content.buttonStyle === "primary"
                ? "bg-blue-600 hover:bg-blue-700"
                : content.buttonStyle === "secondary"
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          <Send className="w-4 h-4" />
          <span>{content.buttonText}</span>
        </Button>
      </form>

      {/* Success Message */}
      <motion.div
        className="absolute inset-0 bg-green-50 rounded-lg flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0, scale: 0.9 }}
        style={{ display: "none" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h4>
          <p className="text-green-600">Thank you for contacting us. We'll get back to you soon.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
