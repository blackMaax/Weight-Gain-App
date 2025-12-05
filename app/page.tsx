"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter">Gain with Purpose</h1>
            <p className="text-xl text-gray-400 font-semibold uppercase tracking-wider">
              Track your weight gain journey with gamified goals, community support, and expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Link href="/auth/login" className="w-full">
              <Button className="w-full h-12 text-base bg-red-600/80 hover:bg-red-600 text-white font-black uppercase border-2 border-red-600/60 hover:border-red-600">Sign In</Button>
            </Link>
            <Link href="/onboarding" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base bg-[#1a1a1a] border-2 border-red-600/60 text-red-500 hover:bg-red-600/80 hover:text-white hover:border-red-600/80 font-black uppercase">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
            <div className="p-6 bg-[#1a1a1a] border-2 border-red-600/20">
              <h3 className="font-black mb-2 text-white uppercase tracking-wider">Track Progress</h3>
              <p className="text-sm text-gray-400 font-semibold uppercase">Monitor weight, calories, and milestones</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border-2 border-red-600/20">
              <h3 className="font-black mb-2 text-white uppercase tracking-wider">Gamified Goals</h3>
              <p className="text-sm text-gray-400 font-semibold uppercase">Earn XP, unlock achievements, climb leaderboards</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] border-2 border-red-600/20">
              <h3 className="font-black mb-2 text-white uppercase tracking-wider">Community</h3>
              <p className="text-sm text-gray-400 font-semibold uppercase">Connect with others on similar journeys</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
