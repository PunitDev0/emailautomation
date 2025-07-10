"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Mail,
  Users,
  Layers,
  Workflow,
  FileText,
  Settings,
  HelpCircle,
  Home,
  Send,
  Target,
  TrendingUp,
  Database,
  Zap,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Campaigns", url: "/", icon: Mail },
  { title: "Subscribers", url: "/subscribers", icon: Users },
  { title: "Segments", url: "/segments", icon: Layers },
  { title: "Templates", url: "/templates", icon: FileText },
]

const automationItems = [
  { title: "Workflows", url: "/automation", icon: Workflow },
  { title: "Triggers", url: "/triggers", icon: Zap },
  { title: "Sequences", url: "/sequences", icon: Send },
]

const analyticsItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: TrendingUp },
  { title: "A/B Tests", url: "/ab-tests", icon: Target },
]

const systemItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()

  const renderMenuItems = (items) =>
    items.map((item) => {
      const isActive = pathname === item.url
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className={`
              text-white hover:text-gray-300 hover:bg-white/5 transition-all duration-200
              ${isActive ? "border-l-4 border-white bg-white/10 text-white font-semibold" : "border-l-4 border-transparent"}
            `}
          >
            <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })

  return (
    <Sidebar className="bg-black border-r-2 border-white/20 w-64 flex-shrink-0">
      <SidebarHeader className="p-6 border-b border-white/20 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <Mail className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Mail Automation</h1>
            <p className="text-xs text-gray-400">Professional Edition</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(mainMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Automation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(automationItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(analyticsItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(systemItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/20 bg-black">
        <div className="flex items-center gap-3 p-3 border border-white/20 bg-white/5">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <Database className="h-4 w-4 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Status: Connected</p>
            <p className="text-xs text-gray-400">SMTP Active</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
