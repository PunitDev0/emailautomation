"use client"

import { Upload, Mail, Send, History, Settings, Shield, BarChart3, Users, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Contacts", icon: Users, id: "contacts", roles: ["admin", "user"] },
  { title: "Upload Contacts", icon: Upload, id: "upload-contacts", roles: ["admin", "user"] },
  { title: "Email Templates", icon: Mail, id: "email-templates", roles: ["admin", "user"] },
  { title: "Send Emails", icon: Send, id: "send-emails", roles: ["admin", "user"] },
  { title: "Automation", icon: Zap, id: "automation", roles: ["admin", "user"] },
  { title: "Analytics", icon: BarChart3, id: "analytics", roles: ["admin", "user"] },
  { title: "Email History", icon: History, id: "email-history", roles: ["admin", "user"] },
  { title: "Settings", icon: Settings, id: "settings", roles: ["admin"] },
]

export function DashboardSidebar({ currentPage, onPageChange, userRole }) {
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <Sidebar className=" text-gray-900 border-r border-gray-200 h-full w-64 fixed p-2">
      <SidebarContent className="py-6 bg-bl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-3 px-6 py-4 text-2xl font-extrabold tracking-tight text-gray-800">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">Mail Synk</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} className="my-1">
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      flex items-center gap-3 px-6 py-3 rounded-lg
                      ${currentPage === item.id 
                        ? 'bg-black text-white font-semibold' 
                        : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'}
                      transition-all duration-300 ease-in-out
                      group relative overflow-hidden
                    `}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200/0 group-hover:bg-gray-300 transition-all duration-300" />
                    <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200 text-gray-700" />
                    <span className="text-sm tracking-wide">{item.title}</span>
                    {item.roles.includes("admin") && userRole === "admin" && item.id === "settings" && (
                      <Shield className="ml-auto h-4 w-4 text-gray-500 group-hover:text-gray-700 group-hover:scale-110 transition-transform duration-200" />
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