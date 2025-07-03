"use client"

import { Upload, Mail, Send, History, Settings, Shield, BarChart3, Users, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Contacts",
    icon: Users,
    id: "contacts",
    roles: ["admin", "user"],
  },
  {
    title: "Upload Contacts",
    icon: Upload,
    id: "upload-contacts",
    roles: ["admin", "user"],
  },
  {
    title: "Email Templates",
    icon: Mail,
    id: "email-templates",
    roles: ["admin", "user"],
  },
  {
    title: "Send Emails",
    icon: Send,
    id: "send-emails",
    roles: ["admin", "user"],
  },
  {
    title: "Automation",
    icon: Zap,
    id: "automation",
    roles: ["admin", "user"],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    id: "analytics",
    roles: ["admin", "user"],
  },
  {
    title: "Email History",
    icon: History,
    id: "email-history",
    roles: ["admin", "user"],
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
    roles: ["admin"],
  },
]

export function DashboardSidebar({ currentPage, onPageChange, userRole }) {
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <Sidebar className="glass-panel border-r border-white/20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-lg font-bold gradient-text">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Mail className="h-4 w-4 text-white" />
            </div>
            EmailFlow
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => onPageChange(item.id)}
                    className="glass-button hover:glass-card-hover transition-all duration-300"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.roles.includes("admin") && userRole === "admin" && item.id === "settings" && (
                      <Shield className="ml-auto h-3 w-3 text-blue-600" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
