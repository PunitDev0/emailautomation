"use client";
import { Upload, Mail, Send, History } from "lucide-react"
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
    title: "Upload Contacts",
    icon: Upload,
    id: "upload-contacts",
  },
  {
    title: "Email Templates",
    icon: Mail,
    id: "email-templates",
  },
  {
    title: "Send Emails",
    icon: Send,
    id: "send-emails",
  },
  {
    title: "Email History",
    icon: History,
    id: "email-history",
  },
]

export function AppSidebar({
  currentPage,
  onPageChange
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Email Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={currentPage === item.id} onClick={() => onPageChange(item.id)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
