"use client"

import { ContactsPage } from "@/components/contacts-page"
import { useAuth } from "@/hooks/use-auth"

export default function ContactsPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <ContactsPage userRole={user.role} />;
}
