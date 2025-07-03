"use client"

import { AnalyticsPage } from "@/components/analytics-page"
import { useAuth } from "@/hooks/use-auth"

export default function AnalyticsPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <AnalyticsPage userRole={user.role} />;
}
