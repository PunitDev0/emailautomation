"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const quickPrompts = [
  "Create a professional newsletter template",
  "Design a product launch announcement",
  "Make a welcome email for new subscribers",
  "Generate a holiday promotion template",
  "Create a webinar invitation email",
  "Design a customer feedback survey",
]

export default function AIAssistant({
  isOpen,
  onClose,
  onGenerateTemplate,
  onOptimizeContent
}) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your AI email design assistant. I can help you create templates, optimize content, and suggest improvements. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: ["Generate Template", "Optimize Content", "Design Tips", "Best Practices"],
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(input),
        timestamp: new Date(),
        suggestions: generateSuggestions(input),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = prompt => {
    const responses = {
      template:
        "I'll help you create a professional email template! Based on your request, I recommend using a clean layout with a compelling header, engaging content sections, and a clear call-to-action. Would you like me to generate this template for you?",
      optimize:
        "Great! I can help optimize your email content for better engagement. I'll focus on improving subject lines, personalizing content, and enhancing readability. Share your content and I'll provide specific suggestions.",
      design:
        "For effective email design, consider these key principles: mobile-first approach, clear hierarchy, consistent branding, and strategic use of white space. What specific design aspect would you like to improve?",
      default:
        "I understand you're looking for help with email design. I can assist with template generation, content optimization, design suggestions, and best practices. What specific area would you like to focus on?",
    }

    if (prompt.toLowerCase().includes("template") || prompt.toLowerCase().includes("create")) {
      return responses.template
    } else if (prompt.toLowerCase().includes("optimize") || prompt.toLowerCase().includes("improve")) {
      return responses.optimize
    } else if (prompt.toLowerCase().includes("design") || prompt.toLowerCase().includes("layout")) {
      return responses.design
    }
    return responses.default
  }

  const generateSuggestions = prompt => {
    return ["Generate Template", "Show Examples", "Best Practices", "More Options"]
  }

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Header */}
            <div
              className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">AI Design Assistant</h2>
                  <p className="text-sm text-gray-600">Powered by advanced AI</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Prompts */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm text-gray-600 mb-3">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.slice(0, 3).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                    className="text-xs">
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                      }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs bg-white/20 hover:bg-white/30"
                              onClick={() => setInput(suggestion)}>
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }} />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about email design..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1" />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
