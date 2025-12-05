"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function WorkoutsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const workoutPlans = [
    {
      id: 1,
      title: "Beginner Push/Pull/Legs",
      description: "Perfect for beginners. 3 days/week split focused on compound movements.",
      difficulty: "Beginner",
      duration: 8,
      exercises: [
        { day: "Push", name: "Bench Press", sets: 4, reps: "6-8" },
        { day: "Push", name: "Incline Dumbbell Press", sets: 3, reps: "8-10" },
        { day: "Pull", name: "Barbell Rows", sets: 4, reps: "6-8" },
        { day: "Pull", name: "Pull-ups", sets: 3, reps: "Max" },
        { day: "Legs", name: "Squats", sets: 4, reps: "6-8" },
        { day: "Legs", name: "Leg Press", sets: 3, reps: "8-10" },
      ],
    },
    {
      id: 2,
      title: "Upper/Lower Split",
      description: "Intermediate level. Hit each muscle group twice per week.",
      difficulty: "Intermediate",
      duration: 6,
      exercises: [
        { day: "Upper A", name: "Deadlifts", sets: 3, reps: "5" },
        { day: "Upper A", name: "Bench Press", sets: 4, reps: "6-8" },
        { day: "Lower A", name: "Squats", sets: 4, reps: "6-8" },
        { day: "Lower A", name: "Romanian Deadlifts", sets: 3, reps: "8-10" },
      ],
    },
    {
      id: 3,
      title: "Full Body 3x/Week",
      description: "Efficient full-body workouts 3 times per week.",
      difficulty: "Beginner",
      duration: 12,
      exercises: [
        { day: "Full Body", name: "Squats", sets: 3, reps: "8-10" },
        { day: "Full Body", name: "Bench Press", sets: 3, reps: "8-10" },
        { day: "Full Body", name: "Rows", sets: 3, reps: "8-10" },
        { day: "Full Body", name: "Overhead Press", sets: 3, reps: "6-8" },
      ],
    },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#FDF0D5] pb-20">

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">Workout Plans</h1>

          {selectedPlan === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="text-xs text-muted-foreground">Difficulty: {plan.difficulty}</div>
                    <div className="text-xs text-muted-foreground">Duration: {plan.duration} weeks</div>
                  </div>
                  <Button onClick={() => setSelectedPlan(plan.id)} className="w-full">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Button variant="outline" onClick={() => setSelectedPlan(null)} className="mb-6">
                Back to Plans
              </Button>

              {workoutPlans.find((p) => p.id === selectedPlan) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{workoutPlans.find((p) => p.id === selectedPlan)?.title}</h2>

                  <div className="space-y-6">
                    {workoutPlans
                      .find((p) => p.id === selectedPlan)
                      ?.exercises.map((exercise, idx) => (
                        <Card key={idx} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Day</div>
                              <div className="font-semibold">{exercise.day}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Exercise</div>
                              <div className="font-semibold">{exercise.name}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Sets × Reps</div>
                              <div className="font-semibold">
                                {exercise.sets} × {exercise.reps}
                              </div>
                            </div>
                            <div>
                              <Button className="w-full">Log</Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
