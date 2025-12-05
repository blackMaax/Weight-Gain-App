"use client"

import type React from "react"

import Navigation from "@/components/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Navigation />
    </>
  )
}
