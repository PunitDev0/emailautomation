"use client";
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CountdownBlock({
  block,
  onUpdate
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date(block.content.targetDate || Date.now() + 7 * 24 * 60 * 60 * 1000)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer);
  }, [block.content.targetDate])

  const containerStyles = {
    padding: `${block.styles.padding?.top || 20}px ${block.styles.padding?.right || 20}px ${block.styles.padding?.bottom || 20}px ${block.styles.padding?.left || 20}px`,
    margin: `${block.styles.margin?.top || 0}px ${block.styles.margin?.right || 0}px ${block.styles.margin?.bottom || 16}px ${block.styles.margin?.left || 0}px`,
    backgroundColor: block.styles.backgroundColor || "#f8fafc",
    borderRadius: `${block.styles.borderRadius}px`,
    textAlign: "center",
  }

  const timeBoxStyle = {
    backgroundColor: block.styles.timeBoxColor || "#3b82f6",
    color: block.styles.timeTextColor || "#ffffff",
    borderRadius: "8px",
    padding: "16px",
    minWidth: "80px",
    display: "inline-block",
    margin: "0 8px",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={containerStyles}>
      <h3
        className="text-xl font-bold mb-4"
        style={{ color: block.styles.titleColor || "#333" }}>
        {block.content.title || "Limited Time Offer"}
      </h3>
      <div className="flex justify-center items-center flex-wrap gap-2">
        <motion.div
          style={timeBoxStyle}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-sm opacity-80">Days</div>
        </motion.div>

        <motion.div
          style={timeBoxStyle}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.25 }}>
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm opacity-80">Hours</div>
        </motion.div>

        <motion.div
          style={timeBoxStyle}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}>
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm opacity-80">Minutes</div>
        </motion.div>

        <motion.div
          style={timeBoxStyle}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.75 }}>
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm opacity-80">Seconds</div>
        </motion.div>
      </div>
      {block.content.subtitle && <p className="mt-4 text-gray-600">{block.content.subtitle}</p>}
    </motion.div>
  );
}
