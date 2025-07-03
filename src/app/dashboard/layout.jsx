"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, User, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getCurrentPage = () => {
    const path = pathname.split("/").pop()
    if (path === "dashboard") return "email-templates"
    return path || "email-templates"
  }

  const handlePageChange = (page) => {
    router.push(`/dashboard/${page}`)
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <SidebarProvider>
        <DashboardSidebar currentPage={getCurrentPage()} onPageChange={handlePageChange} userRole={user.role} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 glass-panel border-b border-white/20">
            <SidebarTrigger className="-ml-1 glass-button" />
            <div className="flex items-center gap-2 flex-1">
              <h1 className="text-lg font-semibold gradient-text">EmailFlow Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="glass-button">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 glass-button">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs glass-badge">
                      {user.role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-white/30">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="hover:bg-white/20">Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/20">Billing</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/20">Support</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/20 text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
