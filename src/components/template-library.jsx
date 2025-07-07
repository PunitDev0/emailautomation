"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Search,
  Star,
  Zap,
  Mail,
  ShoppingBag,
  Calendar,
  Users,
  TrendingUp,
  Briefcase,
  Heart,
  Building,
  Plane,
  Code,
  Palette,
  Coffee,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import LoadingSpinner from "./ui/loading-spinner"

const templates = [
  {
    id: "youtube-monthly",
    name: "YouTube Monthly Review",
    description: "Professional monthly newsletter for YouTube creators with stats and updates",
    category: "Social Media",
    thumbnail: "/templates/youtube-template.png",
    isPremium: false,
    tags: ["youtube", "monthly", "stats", "creator", "newsletter"],
    color: "#FF0000",
    // featured: true,
    blocks: [
      {
        id: "header-1",
        type: "text",
        content: {
          text: '<div style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #FF0000, #CC0000); color: white; padding: 20px; border-radius: 10px;"><div style="display: flex; align-items: center;"><div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;"><span style="color: #FF0000; font-weight: bold; font-size: 18px;">▶</span></div><div><h1 style="margin: 0; font-size: 24px;">YouTube</h1></div></div><div style="text-align: right;"><div style="font-size: 12px; opacity: 0.9;">Monthly Newsletter</div><div style="font-weight: bold; font-size: 18px;">June</div></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 20, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "left",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "profile-section",
        type: "text",
        content: {
          text: '<div style="text-align: center; padding: 40px 20px;"><div style="position: relative; display: inline-block; margin-bottom: 20px;"><div style="width: 120px; height: 120px; background: linear-gradient(135deg, #e879f9, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;"><div style="width: 80px; height: 80px; background: #1a1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 50%;"></div></div></div><div style="position: absolute; top: -10px; right: -10px; width: 20px; height: 20px; background: #e879f9; transform: rotate(45deg);"></div><div style="position: absolute; bottom: 10px; left: -15px; width: 15px; height: 15px; background: #a855f7; transform: rotate(45deg);"></div></div><div style="font-size: 14px; color: #666; margin-bottom: 5px;">Andrew Gaming</div><h1 style="font-size: 24px; font-weight: bold; color: #333; margin: 0; line-height: 1.2;">Your June Month in<br>Review is here</h1></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 100 },
      },
      {
        id: "stats-section",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #e879f9, #a855f7); border-radius: 20px; padding: 30px; margin: 20px; color: white;"><div style="background: white; border-radius: 15px; padding: 25px; color: #333;"><h3 style="text-align: center; margin: 0 0 20px 0; font-size: 18px;">Your channel updates from<br>last month</h3><div style="text-align: center; margin: 20px 0;"><div style="width: 40px; height: 40px; background: #e879f9; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">↑</div><div style="font-weight: bold; margin-bottom: 5px;">2 new uploads</div><div style="font-size: 12px; color: #666; line-height: 1.4;">Keep it up. Create a schedule that works for you to keep your audience engaged.</div></div><div style="margin: 20px 0;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;"><span style="font-size: 14px;">Total views</span><div style="background: #e879f9; color: white; padding: 5px 15px; border-radius: 15px; font-weight: bold;">153</div></div><div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 14px;">Minutes watched</span><div style="background: #a855f7; color: white; padding: 5px 15px; border-radius: 15px; font-weight: bold;">77</div></div></div><div style="text-align: center; margin-top: 25px;"><button style="background: #333; color: white; border: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; cursor: pointer;">See more stats</button></div></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "left",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 200 },
      },
      {
        id: "shorts-section",
        type: "text",
        content: {
          text: '<div style="text-align: center; padding: 30px 20px;"><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #e879f9, #a855f7); border-radius: 15px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><div style="color: white; font-size: 24px; font-weight: bold;">#</div></div><h3 style="margin: 0 0 10px 0; font-size: 18px; color: #333;">Your Shorts performance</h3><div style="display: flex; align-items: center; justify-content: center; margin: 15px 0;"><div style="width: 20px; height: 20px; background: #e879f9; border-radius: 50%; margin-right: 8px; display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div><span style="font-size: 16px; color: #333;">16 views</span></div><button style="background: #333; color: white; border: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; cursor: pointer; margin-top: 10px;">Take a look at more stats</button></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 300 },
      },
      {
        id: "footer-section",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #e879f9, #a855f7); border-radius: 20px 20px 0 0; padding: 30px; text-align: center; color: white; margin-top: 30px;"><h3 style="margin: 0; font-size: 20px; font-weight: bold;">YouTube updates</h3></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 400 },
      },
    ],
  },
  
  {
    id: "freelancer-portfolio",
    name: "Freelancer Portfolio Showcase",
    description: "Professional portfolio email template for freelancers to showcase their work and services",
    category: "Freelancer",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    tags: ["freelancer", "portfolio", "showcase", "professional", "services"],
    color: "#6366F1",
    featured: true,
    blocks: [
      {
        id: "freelancer-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 40px; text-align: center; border-radius: 15px;"><div style="width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 32px;">👨‍💻</span></div><h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">John Doe</h1><p style="margin: 0; font-size: 18px; opacity: 0.9;">Full-Stack Developer & UI/UX Designer</p><div style="margin-top: 20px;"><span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 14px;">Available for Projects</span></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "freelancer-services",
        type: "text",
        content: {
          text: '<div style="padding: 30px;"><h2 style="text-align: center; color: #6366F1; margin-bottom: 30px; font-size: 28px;">My Services</h2><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;"><div style="background: #F8FAFC; padding: 25px; border-radius: 12px; text-align: center; border: 2px solid #E2E8F0;"><div style="width: 50px; height: 50px; background: linear-gradient(135deg, #6366F1, #8B5CF6); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 20px;">💻</span></div><h3 style="margin: 0 0 10px 0; color: #1E293B;">Web Development</h3><p style="margin: 0; color: #64748B; font-size: 14px;">Custom websites and web applications built with modern technologies</p></div><div style="background: #F8FAFC; padding: 25px; border-radius: 12px; text-align: center; border: 2px solid #E2E8F0;"><div style="width: 50px; height: 50px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 20px;">🎨</span></div><h3 style="margin: 0 0 10px 0; color: #1E293B;">UI/UX Design</h3><p style="margin: 0; color: #64748B; font-size: 14px;">Beautiful and intuitive user interfaces that convert visitors to customers</p></div><div style="background: #F8FAFC; padding: 25px; border-radius: 12px; text-align: center; border: 2px solid #E2E8F0;"><div style="width: 50px; height: 50px; background: linear-gradient(135deg, #EC4899, #F59E0B); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 20px;">📱</span></div><h3 style="margin: 0 0 10px 0; color: #1E293B;">Mobile Apps</h3><p style="margin: 0; color: #64748B; font-size: 14px;">Native and cross-platform mobile applications for iOS and Android</p></div></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          backgroundColor: "#ffffff",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "left",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
        },
        position: { x: 0, y: 100 },
      },
      {
        id: "freelancer-cta",
        type: "button",
        content: {
          text: "Let's Work Together",
          href: "mailto:john@example.com",
          target: "_blank",
        },
        styles: {
          padding: { top: 18, right: 40, bottom: 18, left: 40 },
          margin: { top: 30, right: 0, bottom: 30, left: 0 },
          backgroundColor: "#6366F1",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: 50,
          border: "none",
          display: "inline-block",
        },
        position: { x: 0, y: 200 },
      },
    ],
  },
  {
    id: "wedding-invitation",
    name: "Wedding Invitation",
    description: "Elegant wedding invitation email template with beautiful typography and romantic design",
    category: "Event",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    tags: ["wedding", "invitation", "elegant", "romantic", "event"],
    color: "#F472B6",
    featured: true,
    blocks: [
      {
        id: "wedding-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 50px; text-align: center; border-radius: 20px; border: 2px solid #F9A8D4;"><div style="margin-bottom: 30px;"><span style="font-size: 60px;">💕</span></div><h1 style="margin: 0 0 20px 0; font-family: serif; font-size: 36px; color: #BE185D; font-weight: normal;">Sarah & Michael</h1><div style="width: 100px; height: 2px; background: linear-gradient(to right, #F472B6, #EC4899); margin: 0 auto 20px;"></div><p style="margin: 0; font-size: 18px; color: #BE185D; font-style: italic;">Together with our families, we invite you to celebrate our wedding</p></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "wedding-details",
        type: "text",
        content: {
          text: '<div style="padding: 40px; background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(244, 114, 182, 0.1);"><div style="text-align: center; margin-bottom: 40px;"><h2 style="margin: 0 0 30px 0; color: #BE185D; font-size: 28px;">Wedding Details</h2><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; text-align: center;"><div><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #F472B6, #EC4899); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 24px;">📅</span></div><h3 style="margin: 0 0 5px 0; color: #BE185D;">Date</h3><p style="margin: 0; color: #6B7280;">Saturday, June 15th, 2024</p></div><div><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #EC4899, #BE185D); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 24px;">⏰</span></div><h3 style="margin: 0 0 5px 0; color: #BE185D;">Time</h3><p style="margin: 0; color: #6B7280;">4:00 PM</p></div><div><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #BE185D, #A21CAF); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 24px;">📍</span></div><h3 style="margin: 0 0 5px 0; color: #BE185D;">Venue</h3><p style="margin: 0; color: #6B7280;">Garden Rose Chapel<br>123 Love Street</p></div></div></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "left",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
        },
        position: { x: 0, y: 100 },
      },
    ],
  },
  {
    id: "startup-launch",
    name: "Startup Product Launch",
    description: "Modern startup product launch announcement with bold design and call-to-action",
    category: "Business",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    tags: ["startup", "launch", "product", "announcement", "modern"],
    color: "#10B981",
    blocks: [
      {
        id: "startup-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #065F46, #10B981); color: white; padding: 50px; text-align: center; position: relative; overflow: hidden;"><div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div><div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div><div style="position: relative; z-index: 1;"><div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; margin-bottom: 20px; font-size: 14px; font-weight: bold;">🚀 NEW LAUNCH</div><h1 style="margin: 0 0 15px 0; font-size: 42px; font-weight: bold;">Revolutionary App</h1><p style="margin: 0; font-size: 20px; opacity: 0.9;">Transform your productivity with our AI-powered solution</p></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: "fitness-coach",
    name: "Fitness Coach Newsletter",
    description: "Energetic fitness coach newsletter with workout tips and motivation",
    category: "Health",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    tags: ["fitness", "coach", "health", "workout", "motivation"],
    color: "#F59E0B",
    blocks: [
      {
        id: "fitness-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 40px; text-align: center; border-radius: 15px;"><div style="margin-bottom: 20px;"><span style="font-size: 50px;">💪</span></div><h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">FitLife Weekly</h1><p style="margin: 0; font-size: 18px; opacity: 0.9;">Your weekly dose of fitness motivation and tips</p><div style="margin-top: 20px; display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 25px;"><span style="font-size: 14px; font-weight: bold;">Week 12 - March 2024</span></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: "restaurant-menu",
    name: "Restaurant Weekly Menu",
    description: "Delicious restaurant weekly menu showcase with food photography placeholders",
    category: "Food",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    tags: ["restaurant", "menu", "food", "weekly", "culinary"],
    color: "#DC2626",
    blocks: [
      {
        id: "restaurant-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; padding: 40px; text-align: center; border-radius: 15px;"><div style="margin-bottom: 20px;"><span style="font-size: 50px;">🍽️</span></div><h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: bold; font-family: serif;">Bella Vista</h1><p style="margin: 0; font-size: 18px; opacity: 0.9; font-style: italic;">Authentic Italian Cuisine</p><div style="width: 80px; height: 2px; background: rgba(255,255,255,0.5); margin: 20px auto;"></div><p style="margin: 0; font-size: 16px;">This Week\'s Special Menu</p></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: "travel-blog",
    name: "Travel Blog Newsletter",
    description: "Wanderlust-inspiring travel blog newsletter with destination highlights",
    category: "Travel",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    tags: ["travel", "blog", "wanderlust", "destinations", "adventure"],
    color: "#0EA5E9",
    blocks: [
      {
        id: "travel-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #0EA5E9, #0284C7); color: white; padding: 40px; text-align: center; border-radius: 15px; position: relative;"><div style="position: absolute; top: 10px; right: 10px; opacity: 0.3;"><span style="font-size: 100px;">✈️</span></div><div style="position: relative; z-index: 1;"><h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: bold;">Wanderlust Weekly</h1><p style="margin: 0 0 20px 0; font-size: 18px; opacity: 0.9;">Discover amazing destinations around the world</p><div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;"><span style="font-size: 14px;">🌍 March Adventures</span></div></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: "tech-newsletter",
    name: "Tech News Digest",
    description: "Modern tech newsletter with latest industry news and updates",
    category: "Technology",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    tags: ["tech", "news", "technology", "updates", "industry"],
    color: "#7C3AED",
    blocks: [
      {
        id: "tech-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #7C3AED, #5B21B6); color: white; padding: 40px; text-align: center; border-radius: 15px;"><div style="margin-bottom: 20px;"><span style="font-size: 50px;">⚡</span></div><h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">TechPulse</h1><p style="margin: 0; font-size: 18px; opacity: 0.9;">Your daily dose of tech innovation</p><div style="margin-top: 20px; display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;"><span style="font-size: 14px;">📅 March 15, 2024</span></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
    ],
  },
  {
    id: "socialsynk-launch",
    name: "SocialSynk App Launch",
    description: "Announce the launch of SocialSynk, the ultimate AI-powered social media management app",
    category: "Technology",
    thumbnail: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    tags: ["social media", "AI", "launch", "management", "dashboard", "analytics"],
    color: "#3B82F6",
    featured: true,
    blocks: [
      {
        id: "socialsynk-header",
        type: "text",
        content: {
          text: '<div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 50px; text-align: center; position: relative; overflow: hidden; border-radius: 15px;"><div style="position: absolute; top: -40px; right: -40px; width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div><div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div><div style="position: relative; z-index: 1;"><div style="display: inline-block; background: rgba(255,255,255,0.25); padding: 8px 20px; border-radius: 20px; margin-bottom: 20px; font-size: 14px; font-weight: bold;">🚀 APP LAUNCH</div><h1 style="margin: 0 0 15px 0; font-size: 40px; font-weight: bold;">Introducing SocialSynk</h1><p style="margin: 0; font-size: 20px; opacity: 0.9;">Your AI-Powered Social Media Management Solution</p></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 30, left: 0 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "socialsynk-features",
        type: "text",
        content: {
          text: '<div style="padding: 40px; background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);"><h2 style="text-align: center; color: #3B82F6; margin-bottom: 30px; font-size: 28px;">Why SocialSynk?</h2><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; text-align: center;"><div><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 24px;">📊</span></div><h3 style="margin: 0 0 10px 0; color: #1E293B;">AI Analytics</h3><p style="margin: 0; color: #64748B; font-size: 14px;">Leverage AI-driven insights to optimize your social media strategy.</p></div><div><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 24px;">📱</span></div><h3 style="margin: 0 0 10px 0; color: #1E293B;">Multi-Platform Management</h3><p style="margin: 0; color: #64748B; font-size: 14px;">Manage all your social media accounts from one intuitive dashboard.</p></div><div><div style="width: 60px; height: 60px; background: linear-gradient(135deg, #EC4899, #3B82F6); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 24px;">⚡</span></div><h3 style="margin: 0 0 10px 0; color: #1E293B;">Automated Scheduling</h3><p style="margin: 0; color: #64748B; font-size: 14px;">Schedule posts effortlessly with our smart automation tools.</p></div></div></div>',
          tag: "div",
          formatting: { bold: false, italic: false, underline: false },
        },
        styles: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          margin: { top: 0, right: 0, bottom: 20, left: 0 },
          backgroundColor: "transparent",
          borderRadius: 0,
          fontSize: 16,
          color: "#333333",
          textAlign: "left",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
        },
        position: { x: 0, y: 100 },
      },
      {
        id: "socialsynk-cta",
        type: "button",
        content: {
          text: "Try SocialSynk Now",
          href: "https://socialsynk.com",
          target: "_blank",
        },
        styles: {
          padding: { top: 18, right: 40, bottom: 18, left: 40 },
          margin: { top: 30, right: 0, bottom: 30, left: 0 },
          backgroundColor: "#3B82F6",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: 50,
          border: "none",
          display: "inline-block",
        },
        position: { x: 0, y: 200 },
      },
    ],
  },
]

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Social Media", icon: TrendingUp },
  { name: "Freelancer", icon: Briefcase },
  { name: "Welcome", icon: Users },
  { name: "Newsletter", icon: Mail },
  { name: "E-commerce", icon: ShoppingBag },
  { name: "Event", icon: Calendar },
  { name: "Business", icon: Building },
  { name: "Health", icon: Heart },
  { name: "Food", icon: Coffee },
  { name: "Travel", icon: Plane },
  { name: "Technology", icon: Code },
]

export default function TemplateLibrary({ isOpen, onClose, onSelectTemplate }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredTemplate, setHoveredTemplate] = useState(null)

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
      const matchesPremium = !showPremiumOnly || template.isPremium

      return matchesSearch && matchesCategory && matchesPremium
    })
  }, [searchQuery, selectedCategory, showPremiumOnly])

  const featuredTemplates = templates.filter((t) => t.featured)

  const handleTemplateSelect = async (template) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSelectTemplate(template)
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl w-full h-[90vh] bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Template Library
                </h2>
                <p className="text-gray-600 text-sm">Choose from our collection of professional email templates</p>
              </div>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates by name, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-white/40 focus:bg-white"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={showPremiumOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className={`flex items-center space-x-2 ${
                  showPremiumOnly
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    : "bg-white/70 backdrop-blur-sm border-white/40 hover:bg-white"
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Premium</span>
              </Button>
            </motion.div>
          </motion.div>

          {!searchQuery && selectedCategory === "All" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                Featured Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTemplates.slice(0, 3).map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoveredTemplate(template.id)}
                    onHoverEnd={() => setHoveredTemplate(null)}
                  >
                    <Card className="group cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm border-white/40 hover:shadow-2xl transition-all duration-500">
                      <div className="relative">
                        <div
                          className="h-32 bg-gradient-to-br opacity-90"
                          style={{
                            background: `linear-gradient(135deg, ${template.color}20, ${template.color}40)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{
                              scale: hoveredTemplate === template.id ? 1.1 : 1,
                              rotate: hoveredTemplate === template.id ? 5 : 0,
                            }}
                            className="text-4xl"
                          >
                            {template.category === "Freelancer" && "👨‍💻"}
                            {template.category === "Social Media" && "📺"}
                            {template.category === "Event" && "💕"}
                            {template.category === "Technology" && "⚡"}
                          </motion.div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" style={{ borderColor: template.color, color: template.color }}>
                            {template.category}
                          </Badge>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={() => handleTemplateSelect(template)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Use
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <TabsList className="grid grid-cols-6 lg:grid-cols-12 mb-6 bg-white/70 backdrop-blur-sm">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.name}
                    value={category.name}
                    className="flex items-center space-x-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    <category.icon className="w-3 h-3" />
                    <span className="hidden sm:inline text-xs">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            <TabsContent value={selectedCategory} className="flex-1">
              <ScrollArea className="h-[calc(90vh-300px)]">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-64"
                    >
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Loading template...</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {filteredTemplates.map((template, index) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          onHoverStart={() => setHoveredTemplate(template.id)}
                          onHoverEnd={() => setHoveredTemplate(null)}
                        >
                          <Card className="group cursor-pointer overflow-hidden bg-white/80 backdrop-blur-sm border-white/40 hover:shadow-2xl transition-all duration-500">
                            <div className="relative">
                              <div
                                className="h-40 bg-gradient-to-br"
                                style={{
                                  background: `linear-gradient(135deg, ${template.color}15, ${template.color}30)`,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                  animate={{
                                    scale: hoveredTemplate === template.id ? 1.2 : 1,
                                    rotate: hoveredTemplate === template.id ? 10 : 0,
                                  }}
                                  className="text-5xl opacity-80"
                                >
                                  {getCategoryEmoji(template.category)}
                                </motion.div>
                              </div>
                              {template.isPremium && (
                                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                  <Star className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileHover={{ opacity: 1, scale: 1 }}
                                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                  <Button
                                    onClick={() => handleTemplateSelect(template)}
                                    className="bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                                  >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Use Template
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                  {template.name}
                                </h4>
                                <div
                                  className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
                                  style={{ backgroundColor: template.color }}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {template.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {template.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{template.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <Badge
                                variant="outline"
                                className="w-full justify-center"
                                style={{ borderColor: template.color, color: template.color }}
                              >
                                {template.category}
                              </Badge>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {filteredTemplates.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No templates found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getCategoryEmoji(category) {
  const emojiMap = {
    "Social Media": "📺",
    Freelancer: "👨‍💻",
    Welcome: "👋",
    Newsletter: "📧",
    "E-commerce": "🛒",
    Event: "🎉",
    Business: "🏢",
    Health: "💪",
    Food: "🍽️",
    Travel: "✈️",
    Technology: "⚡",
  }
  return emojiMap[category] || "📄"
}