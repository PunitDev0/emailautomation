"use client";
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { UploadContactsPage } from "@/components/upload-contacts-page"
import { EmailTemplatesPage } from "@/components/email-templates-page"
import { SendEmailsPage } from "@/components/send-emails-page"
import { EmailHistoryPage } from "@/components/email-history-page"
import { SettingsPage } from "@/components/settings-page"
import { DashboardOverview } from "@/components/dashboard-overview"
import { AutomationPage } from "@/components/automation-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { ContactsPage } from "@/components/contacts-page"
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

export function Dashboard({
  user,
  currentPage,
  onPageChange,
  onLogout
}) {
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "overview":
        return <DashboardOverview userRole={user.role} />;
      case "contacts":
        return <ContactsPage userRole={user.role} />;
      case "upload-contacts":
        return <UploadContactsPage />;
      case "email-templates":
        return <EmailTemplatesPage />;
      case "send-emails":
        return <SendEmailsPage userRole={user.role} />;
      case "automation":
        return <AutomationPage userRole={user.role} />;
      case "analytics":
        return <AnalyticsPage userRole={user.role} />;
      case "email-history":
        return <EmailHistoryPage userRole={user.role} />;
      case "settings":
        return <SettingsPage userRole={user.role} />;
      default:
        return <DashboardOverview userRole={user.role} />;
    }
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        userRole={user.role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <h1 className="text-lg font-semibold">EmailFlow Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="text-xs">
                    {user.role}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderCurrentPage()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
