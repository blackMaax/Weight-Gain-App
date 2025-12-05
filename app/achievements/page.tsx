"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { getAchievements, checkAchievements, getUser } from "@/lib/userUtils"
import { Trophy } from "lucide-react"

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(userData)

    const updateAchievements = () => {
      const updated = checkAchievements()
      setAchievements(updated)
    }
    
    updateAchievements()
    
    // Check periodically
    const interval = setInterval(updateAchievements, 2000)
    
    return () => clearInterval(interval)
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalXP = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0)

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">Achievements</div>
            <div className="text-4xl font-bold text-foreground">
              {unlockedCount}/{achievements.length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">Total XP</div>
            <div className="text-4xl font-bold text-foreground">{totalXP}</div>
          </Card>
          <Card className="p-6">
            <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">Progress</div>
            <div className="text-4xl font-bold text-foreground">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
          </Card>
        </div>

        <Card className="p-8">
          <h1 className="text-3xl font-semibold text-foreground mb-8">Achievements</h1>
          {achievements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No achievements available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    achievement.unlocked
                      ? "border-primary bg-card hover:bg-muted hover:border-primary-hover"
                      : "border-border bg-card opacity-60"
                  }`}
                >
                  <div className="mb-3">
                    <Trophy 
                      size={32} 
                      className={achievement.unlocked ? "text-primary" : "text-muted-foreground"} 
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-medium">{achievement.description}</p>
                  <div
                    className={`text-sm font-semibold ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`}
                  >
                    +{achievement.xp} XP
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-gray-400 mt-2 font-semibold uppercase">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
