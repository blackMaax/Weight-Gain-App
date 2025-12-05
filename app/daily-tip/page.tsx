"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export default function DailyTipPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const dailyFacts = [
    {
      id: 1,
      fact: "A surplus of 300-500 calories daily combined with resistance training is the optimal way to gain muscle mass.",
      category: "Nutrition",
      date: "Today",
    },
    {
      id: 2,
      fact: "Protein requirements for muscle gain are approximately 0.7-1g per pound of body weight.",
      category: "Nutrition",
      date: "Yesterday",
    },
    {
      id: 3,
      fact: "Getting 7-9 hours of sleep per night is crucial for recovery and muscle growth.",
      category: "Recovery",
      date: "2 days ago",
    },
    {
      id: 4,
      fact: "Compound exercises like squats, deadlifts, and bench presses build more muscle than isolation exercises.",
      category: "Training",
      date: "3 days ago",
    },
    {
      id: 5,
      fact: "Eating within 1-2 hours after a workout can enhance muscle protein synthesis.",
      category: "Nutrition",
      date: "4 days ago",
    },
    {
      id: 6,
      fact: "Tracking your weight weekly rather than daily helps you see the real trend avoiding water weight fluctuations.",
      category: "Tracking",
      date: "5 days ago",
    },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] pb-20">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Daily Facts & Tips</h1>
          <p className="text-lg text-muted-foreground">Learn something new every day about weight gain and fitness</p>
        </div>

        <div className="space-y-4">
          {dailyFacts.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-2">{item.fact}</div>
                  <div className="flex items-center gap-4">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
