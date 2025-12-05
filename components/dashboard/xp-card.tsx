"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getUser, getXPForLevel, getLevelFromXP } from "@/lib/userUtils"

export default function XPCard() {
  const [user, setUser] = useState<any>(null)
  const [displayXP, setDisplayXP] = useState(0)

  useEffect(() => {
    const userData = getUser()
    setUser(userData)
    if (userData) {
      setDisplayXP(userData.xp || 0)
    }
  }, [])

  useEffect(() => {
    // Listen for storage changes to update XP
    const handleStorageChange = () => {
      const userData = getUser()
      if (userData) {
        setUser(userData)
        setDisplayXP(userData.xp || 0)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      const userData = getUser()
      if (userData && userData.xp !== user?.xp) {
        setUser(userData)
        setDisplayXP(userData.xp || 0)
      }
    }, 1000)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user])

  if (!user) return null

  const level = user.level || 1
  const currentXP = user.xp || 0
  const xpForCurrentLevel = getXPForLevel(level)
  const xpForNextLevel = getXPForLevel(level + 1)
  const xpInCurrentLevel = currentXP - xpForCurrentLevel
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel
  const percentage = xpNeededForNextLevel > 0 ? Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100) : 100

  return (
    <Card className="p-6 bg-[#1a1a1a] border-2 border-red-600/20 hover:border-red-600/50 transition-all duration-200 group cursor-pointer">
      <div className="text-xs text-red-500 font-bold mb-2 uppercase tracking-wider">Level & XP</div>
      <div className="text-4xl font-black text-white mb-4 group-hover:text-red-500 transition-colors">
        {level}
      </div>
      <div className="space-y-2">
        <div className="w-full bg-[#0f0f0f] border-2 border-red-600/20 h-4 overflow-hidden">
          <div
            className="bg-red-600/80 h-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 font-semibold uppercase">
          {displayXP} / {xpForNextLevel} XP
        </div>
      </div>
    </Card>
  )
}
