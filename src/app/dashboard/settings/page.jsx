"use client"

import { SettingsPage } from "@/components/settings-page"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <SettingsPage userRole={user.role} />;
}
