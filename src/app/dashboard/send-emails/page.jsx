"use client"

import { SendEmailsPage } from "@/components/send-emails-page"
import { useAuth } from "@/hooks/use-auth"

export default function SendEmailsPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <SendEmailsPage userRole={user.role} />;
}
