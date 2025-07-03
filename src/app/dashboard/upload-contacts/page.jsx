"use client"

import { UploadContactsPage } from "@/components/upload-contacts-page"
import { useAuth } from "@/hooks/use-auth"

export default function UploadContactsPageRoute() {
  const { user } = useAuth()

  if (!user) return null

  return <UploadContactsPage />;
}
