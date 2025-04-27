"use client"

import { useUser } from "@auth0/nextjs-auth0"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  return user ? <div>{children}</div> : <></>;
}
