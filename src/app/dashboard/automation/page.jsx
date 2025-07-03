"use client"

import { AutomationPage } from "@/components/automation-page"
import { useAuth } from "@/hooks/use-auth"

export default function AutomationPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <AutomationPage userRole={user.role} />;
}
