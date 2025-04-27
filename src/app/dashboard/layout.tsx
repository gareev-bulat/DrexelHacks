"use client"

import { useUser } from "@auth0/nextjs-auth0"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const router = useRouter()

  return user ? <div>{children}</div> : <></>;
}
