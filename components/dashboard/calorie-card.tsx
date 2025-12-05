"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getTodayCalories, getCalorieGoal } from "@/lib/userUtils"

export default function CalorieCard() {
  const [caloriesToday, setCaloriesToday] = useState(0)
  const [calorieGoal, setCalorieGoal] = useState(2500)

  useEffect(() => {
    const updateCalories = () => {
      setCaloriesToday(getTodayCalories())
      setCalorieGoal(getCalorieGoal())
    }
    updateCalories()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateCalories()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Check periodically for same-tab updates
    const interval = setInterval(updateCalories, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const percentage = calorieGoal > 0 ? (caloriesToday / calorieGoal) * 100 : 0
  const remaining = Math.max(0, calorieGoal - caloriesToday)

  return (
    <Card className="p-6 bg-[#1a1a1a] border-2 border-red-600/20 hover:border-red-600/50 transition-all duration-200">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Today's Calories</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Consumed</span>
          <span className="font-black text-2xl text-white">{caloriesToday}</span>
        </div>
        <div className="w-full bg-[#0f0f0f] border-2 border-red-600/20 h-4 overflow-hidden">
          <div
            className="bg-red-600/80 h-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-semibold uppercase">Goal: {calorieGoal}</span>
          <span className={`font-bold uppercase transition-all text-red-500`}>
            {remaining} remaining
          </span>
        </div>
      </div>
    </Card>
  )
}
