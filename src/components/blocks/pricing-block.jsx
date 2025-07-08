"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"



export default function PricingBlock({ block, onUpdate, isSelected, previewMode }) {
  const content = block.content || {
    plans: [
      {
        name: "Basic",
        price: "$9",
        period: "month",
        description: "Perfect for individuals",
        features: ["5 Projects", "10GB Storage", "Email Support"],
        buttonText: "Get Started",
        popular: false,
      },
      {
        name: "Pro",
        price: "$29",
        period: "month",
        description: "Best for small teams",
        features: ["Unlimited Projects", "100GB Storage", "Priority Support", "Advanced Analytics"],
        buttonText: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "month",
        description: "For large organizations",
        features: ["Everything in Pro", "Custom Integrations", "Dedicated Manager", "SLA"],
        buttonText: "Contact Sales",
        popular: false,
      },
    ],
  }

  const styles = block.styles || {
    padding: { top: 40, right: 20, bottom: 40, left: 20 },
    backgroundColor: "transparent",
  }

  return (
    <motion.div
      className={`
        relative w-full
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
      style={{
        padding: `${styles.padding?.top || 40}px ${styles.padding?.right || 20}px ${styles.padding?.bottom || 40}px ${styles.padding?.left || 20}px`,
        backgroundColor: styles.backgroundColor,
        ...styles,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {content.plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`
              relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl
              ${plan.popular ? "border-blue-500 scale-105" : "border-gray-200 hover:border-gray-300"}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="p-8">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`
                  w-full py-3 text-lg font-semibold transition-all duration-300
                  ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                  }
                `}
              >
                {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                {plan.buttonText}
              </Button>
            </div>

            {/* Background Decoration */}
            {plan.popular && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl -z-10" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
