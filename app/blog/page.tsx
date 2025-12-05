"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

export default function BlogPage() {
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

  const blogPosts = [
    {
      id: 1,
      title: "The Science of Healthy Weight Gain",
      excerpt: "Understanding how to gain weight in a healthy, sustainable way.",
      author: "Dr. Smith",
      date: "Nov 5, 2024",
      category: "Nutrition",
      readTime: 5,
    },
    {
      id: 2,
      title: "10 High-Calorie Foods for Weight Gain",
      excerpt: "Discover nutrient-dense foods that help you reach your calorie goals.",
      author: "Chef Maria",
      date: "Nov 3, 2024",
      category: "Recipes",
      readTime: 7,
    },
    {
      id: 3,
      title: "Strength Training for Muscle Growth",
      excerpt: "Learn the best exercises and programming for gaining muscle mass.",
      author: "Coach John",
      date: "Nov 1, 2024",
      category: "Training",
      readTime: 8,
    },
    {
      id: 4,
      title: "Recovery: The Key to Gains",
      excerpt: "Why sleep and recovery are just as important as training and nutrition.",
      author: "Dr. Lisa",
      date: "Oct 28, 2024",
      category: "Health",
      readTime: 6,
    },
    {
      id: 5,
      title: "Meal Prep for Weight Gainers",
      excerpt: "Simple meal prep strategies to stay consistent with your nutrition plan.",
      author: "Coach Alex",
      date: "Oct 25, 2024",
      category: "Meal Prep",
      readTime: 9,
    },
    {
      id: 6,
      title: "Supplements: Do You Really Need Them?",
      excerpt: "Breaking down the truth about supplements and what actually works.",
      author: "Dr. Brown",
      date: "Oct 22, 2024",
      category: "Supplements",
      readTime: 7,
    },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#FDF0D5] pb-20">

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blog & Resources</h1>
          <p className="text-lg text-muted-foreground">Learn from experts about nutrition, training, and weight gain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {post.category}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2 flex-1">{post.title}</h3>

              <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>

              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
                <div className="text-xs text-muted-foreground">{post.readTime} min read</div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-primary/5 border-primary">
          <h2 className="text-2xl font-bold mb-4">Daily Tip</h2>
          <p className="text-lg mb-4">
            Did you know? Eating in a calorie surplus combined with resistance training is the most effective way to
            gain muscle mass. Aim to eat 300-500 calories above your maintenance level.
          </p>
          <p className="text-sm text-muted-foreground">Tip updated: {new Date().toLocaleDateString()}</p>
        </Card>
      </div>
    </main>
  )
}
