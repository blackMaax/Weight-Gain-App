"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    setFormData(parsed)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: isNaN(Number.parseFloat(value)) ? value : Number.parseFloat(value),
    }))
  }

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData))
    setUser(formData)
    setEditing(false)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#FDF0D5] pb-20">

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button variant={editing ? "default" : "outline"} onClick={() => setEditing(!editing)}>
              {editing ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Name</label>
                {editing ? (
                  <Input name="name" value={formData?.name || ""} onChange={handleChange} />
                ) : (
                  <div className="text-lg font-semibold">{user?.name}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Email</label>
                {editing ? (
                  <Input type="email" name="email" value={formData?.email || ""} onChange={handleChange} />
                ) : (
                  <div className="text-lg font-semibold">{user?.email}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Current Weight (lbs)</label>
                {editing ? (
                  <Input
                    type="number"
                    name="currentWeight"
                    value={formData?.currentWeight || ""}
                    onChange={handleChange}
                    step="0.1"
                  />
                ) : (
                  <div className="text-lg font-semibold">{user?.currentWeight} lbs</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Goal Weight (lbs)</label>
                {editing ? (
                  <Input
                    type="number"
                    name="goalWeight"
                    value={formData?.goalWeight || ""}
                    onChange={handleChange}
                    step="0.1"
                  />
                ) : (
                  <div className="text-lg font-semibold">{user?.goalWeight} lbs</div>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            )}

            <div className="pt-6 border-t space-y-4">
              <h2 className="text-lg font-bold">Account Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Weight to Gain</div>
                  <div className="text-2xl font-bold">{user?.goalWeight - user?.currentWeight} lbs</div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Progress</div>
                  <div className="text-2xl font-bold">
                    {((2 / (user?.goalWeight - user?.currentWeight)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
