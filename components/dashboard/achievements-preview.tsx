"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getAchievements, checkAchievements } from "@/lib/userUtils"
import { Trophy } from "lucide-react"

export default function AchievementsPreview() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    const updateAchievements = () => {
      // Check and update achievements
      const updated = checkAchievements()
      // Get top 4 unlocked achievements, or top 4 total if less than 4 unlocked
      const unlocked = updated.filter(a => a.unlocked).sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || ''))
      const locked = updated.filter(a => !a.unlocked)
      const display = [...unlocked.slice(0, 4), ...locked.slice(0, 4 - unlocked.length)].slice(0, 4)
      setAchievements(display)
    }
    
    updateAchievements()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateAchievements()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Check periodically
    const interval = setInterval(updateAchievements, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <Card className="p-6 bg-[#1a1a1a] border-2 border-red-600/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Recent Achievements</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push("/achievements")}
          className="border-2 border-red-600/60 text-red-500 hover:bg-red-600/80 hover:text-white hover:border-red-600/80 font-bold uppercase text-xs bg-[#1a1a1a]"
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.length === 0 ? (
          <div className="col-span-4 text-center text-gray-400 py-4">
            <p className="font-bold uppercase text-sm">No achievements yet.</p>
            <p className="font-semibold uppercase text-xs mt-1">Start tracking to unlock!</p>
          </div>
        ) : (
          achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 text-center border-2 transition-all duration-200 cursor-pointer ${
                ach.unlocked
                  ? "border-red-600/50 bg-[#1a1a1a] hover:bg-red-600/10 hover:border-red-600/70"
                  : "border-gray-700 bg-[#1a1a1a] opacity-40 hover:opacity-60"
              }`}
              onMouseEnter={() => setHoveredId(ach.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="mb-2 flex justify-center">
                <Trophy 
                  size={24} 
                  className={ach.unlocked ? "text-red-500" : "text-gray-600"} 
                />
              </div>
              <div className={`text-xs font-bold uppercase ${ach.unlocked ? "text-white" : "text-gray-600"}`}>
                {ach.name}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
