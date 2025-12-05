"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { getLeaderboardData, type LeaderboardEntry } from "@/lib/userUtils"

export default function LeaderboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [filterType, setFilterType] = useState<"xp" | "weight" | "streak">("xp")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (user) {
      // Update leaderboard data when filter changes or user data changes
      const data = getLeaderboardData(filterType)
      setLeaderboardData(data)
    }
  }, [filterType, user])

  // Also listen for storage changes to update leaderboard in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
        const data = getLeaderboardData(filterType)
        setLeaderboardData(data)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Check periodically for same-tab updates
    const interval = setInterval(() => {
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsed = JSON.parse(userData)
        if (parsed.xp !== user?.xp) {
          setUser(parsed)
          const data = getLeaderboardData(filterType)
          setLeaderboardData(data)
        }
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [filterType, user])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#FDF0D5] pb-20">

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">Ranking</h1>

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setFilterType("xp")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === "xp" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              By XP
            </button>
            <button
              onClick={() => setFilterType("weight")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === "weight"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              By Weight Gained
            </button>
            <button
              onClick={() => setFilterType("streak")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === "streak"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              By Streak
            </button>
          </div>

          <div className="space-y-3">
            {leaderboardData.map((player) => (
              <div
                key={`${player.rank}-${player.name}`}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  player.isCurrentUser
                    ? "bg-primary/10 border-primary border-2 shadow-md"
                    : "bg-card hover:bg-secondary"
                }`}
              >
                <div className="text-2xl font-bold text-muted-foreground w-10 text-center">
                  {player.rank === 1 && "🥇"}
                  {player.rank === 2 && "🥈"}
                  {player.rank === 3 && "🥉"}
                  {player.rank > 3 && player.rank}
                </div>

                <div className="flex-1">
                  <div className="font-bold">{player.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Level {player.level} • {player.streak} day streak
                  </div>
                </div>

                <div className="text-right">
                  {filterType === "xp" && (
                    <div>
                      <div className="font-bold">{player.xp} XP</div>
                      <div className="text-xs text-muted-foreground">{player.weightGained} lbs gained</div>
                    </div>
                  )}
                  {filterType === "weight" && (
                    <div>
                      <div className="font-bold">{player.weightGained} lbs</div>
                      <div className="text-xs text-muted-foreground">{player.xp} XP</div>
                    </div>
                  )}
                  {filterType === "streak" && (
                    <div>
                      <div className="font-bold">{player.streak} days</div>
                      <div className="text-xs text-muted-foreground">{player.xp} XP</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
