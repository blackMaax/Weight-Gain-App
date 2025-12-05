"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    currentWeight: "",
    goalWeight: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (Number.parseFloat(formData.currentWeight) >= Number.parseFloat(formData.goalWeight)) {
        setError("Goal weight must be greater than current weight")
        return
      }

      // Store user data locally for now
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          email: formData.email,
          name: formData.name,
          currentWeight: Number.parseFloat(formData.currentWeight),
          goalWeight: Number.parseFloat(formData.goalWeight),
        }),
      )

      router.push("/dashboard")
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Start Your Journey</h1>
          <p className="text-muted-foreground">Create your weight gain account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Weight (lbs)</label>
            <Input
              type="number"
              name="currentWeight"
              placeholder="170"
              value={formData.currentWeight}
              onChange={handleChange}
              step="0.1"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Weight (lbs)</label>
            <Input
              type="number"
              name="goalWeight"
              placeholder="190"
              value={formData.goalWeight}
              onChange={handleChange}
              step="0.1"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
