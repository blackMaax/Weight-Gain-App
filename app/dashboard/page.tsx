"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WeightChart from "@/components/dashboard/weight-chart"
import CalorieCard from "@/components/dashboard/calorie-card"
import XPCard from "@/components/dashboard/xp-card"
import AchievementsPreview from "@/components/dashboard/achievements-preview"
import { getCalorieGoal } from "@/lib/userUtils"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
    
    // Refresh data periodically
    const interval = setInterval(() => {
      const updated = localStorage.getItem("user")
      if (updated) {
        setUser(JSON.parse(updated))
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  // Get real data
  const weightEntries = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('weightEntries') || '[]') : []
  const calorieEntries = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('calorieEntries') || '[]') : []
  const today = new Date().toLocaleDateString()
  const todayCalories = calorieEntries.filter((e: any) => e.date === today).reduce((sum: number, e: any) => sum + e.calories, 0)
  const lastWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : user.currentWeight
  const firstWeight = weightEntries.length > 0 ? weightEntries[0].weight : user.currentWeight
  const totalWeightGained = lastWeight - firstWeight
  const weightToGo = user.goalWeight - lastWeight

  const statCards = [
    {
      label: "Current Weight",
      value: `${lastWeight.toFixed(1)} lbs`,
      secondary: totalWeightGained > 0 ? `+${totalWeightGained.toFixed(1)} lbs gained` : "Start tracking!",
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20",
    },
    {
      label: "Goal Weight",
      value: `${user.goalWeight} lbs`,
      secondary: `${weightToGo.toFixed(1)} lbs to go`,
      color: "from-green-50 to-green-100 dark:from-green-900/20",
    },
    {
      label: "Daily Calories",
      value: todayCalories.toLocaleString(),
      secondary: `of ${getCalorieGoal()} today`,
      color: "from-orange-50 to-orange-100 dark:from-orange-900/20",
    },
  ]

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <Card
              key={idx}
              className="p-6 hover:border-primary transition-all duration-200 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-xs mt-2 text-muted-foreground font-medium">
                {stat.secondary}
              </div>
            </Card>
          ))}
          <XPCard />
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WeightChart className="lg:col-span-2" />
          <CalorieCard />
        </div>

        {/* Achievements */}
        <AchievementsPreview />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Weight Tracking", route: "/weight-tracking" },
            { label: "Calorie Center", route: "/calories" },
            { label: "Workouts", route: "/workouts" },
            { label: "Ranking", route: "/leaderboard" },
          ].map((link, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="h-16 text-left group"
              onClick={() => router.push(link.route)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary uppercase tracking-wide">{link.label}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </main>
  )
}
