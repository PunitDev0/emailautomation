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

  // Check if the path is exactly "/dashboard/email-templates"
  const hideLayout = pathname === "/dashboard/email-templates"

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-white text-black flex">
      <SidebarProvider>
        <DashboardSidebar currentPage={getCurrentPage()} onPageChange={handlePageChange} userRole={user.role} />
        <div className="flex-1 flex flex-col">
          <header className="fixed w-full top-0 left-64 right-0 z-50 h-16 flex items-center gap-4 px-6 bg-white border-b border-black/10 shadow-md">
            <SidebarTrigger className="p-2 rounded-lg hover:bg-black/5 transition-all duration-300">
              <svg className="h-5 w-5 text-black/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </SidebarTrigger>
            <div className="flex items-center gap-3 flex-1">
              <h1 className="text-xl font-extrabold tracking-tight text-black/90">EmailFlow Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 rounded-lg hover:bg-black/5 text-black/80 hover:text-black transition-all duration-300"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-black rounded-full animate-pulse" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-black/5 text-black/80 hover:text-black transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={`
                        text-xs font-semibold tracking-wide px-2 py-0.5
                        ${user.role === "admin" ? "bg-black/20 text-black" : "bg-black/10 text-black/80"}
                        border border-black/30 rounded-full
                      `}
                    >
                      {user.role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/95 border border-black/20 rounded-lg shadow-xl mt-2 w-48"
                >
                  <DropdownMenuLabel className="text-black/90 font-semibold px-4 py-2">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/20" />
                  <DropdownMenuItem className="text-black/80 hover:bg-black/10 px-4 py-2 focus:bg-black/20 transition-all duration-200">
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-black/80 hover:bg-black/10 px-4 py-2 focus:bg-black/20 transition-all duration-200">
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-black/80 hover:bg-black/10 px-4 py-2 focus:bg-black/20 transition-all duration-200">
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/20" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-500/10 px-4 py-2 focus:bg-red-500/20 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="pt-20 p-10 bg-gradient-to-br from-blue-50 to-purple-50">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  )
}
