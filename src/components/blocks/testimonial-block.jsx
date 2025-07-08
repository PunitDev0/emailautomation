"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



export default function TestimonialBlock({ block, onUpdate, isSelected, previewMode }) {
  const content = block.content || {
    quote:
      "This product has completely transformed how we work. The team is more productive and our clients are happier than ever.",
    author: "Sarah Johnson",
    title: "CEO, TechCorp",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    style: "card",
  }

  const styles = block.styles || {
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <motion.div
      className={`
        relative w-full max-w-2xl mx-auto
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
      style={{
        padding: `${styles.padding?.top || 40}px ${styles.padding?.right || 40}px ${styles.padding?.bottom || 40}px ${styles.padding?.left || 40}px`,
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        textAlign: styles.textAlign,
        border: styles.borderWidth ? `${styles.borderWidth}px solid ${styles.borderColor || "#e5e7eb"}` : "none",
        ...styles,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content.style === "quote" && (
        <div className="absolute top-4 left-4 text-6xl text-gray-200">
          <Quote className="w-12 h-12" />
        </div>
      )}

      {/* Rating */}
      <div className="flex justify-center space-x-1 mb-6">{renderStars(content.rating)}</div>

      {/* Quote */}
      <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
        "{content.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center justify-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={content.avatar || "/placeholder.svg"} alt={content.author} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {content.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <div className="font-semibold text-gray-800">{content.author}</div>
          <div className="text-sm text-gray-600">{content.title}</div>
        </div>
      </div>

      {/* Decorative Elements */}
      {content.style === "modern" && (
        <>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full translate-y-8 -translate-x-8" />
        </>
      )}
    </motion.div>
  )
}
