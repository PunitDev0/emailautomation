"use client"

import { EmailHistoryPage } from "@/components/email-history-page"
import { useAuth } from "@/hooks/use-auth"

export default function EmailHistoryPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <EmailHistoryPage userRole={user.role} />;
}
