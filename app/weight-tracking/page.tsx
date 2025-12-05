"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Plus, Target, Calendar, Trash2 } from "lucide-react"
import { getWeightEntries, saveWeightEntries, checkAchievements } from "@/lib/userUtils"

export default function WeightTrackingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [entries, setEntries] = useState<any[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [sliderAdjustment, setSliderAdjustment] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/onboarding")
      return
    }
    setUser(JSON.parse(userData))

    const storedEntries = getWeightEntries()
    storedEntries.sort((a: any, b: any) => a.timestamp - b.timestamp)
    setEntries(storedEntries)
  }, [router])

  const applySliderAdjustment = () => {
    const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : user?.currentWeight || 0
    setWeight((currentWeight + sliderAdjustment).toFixed(1))
  }

  useEffect(() => {
    if (sliderAdjustment !== 0) {
      const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : user?.currentWeight || 0
      setWeight((currentWeight + sliderAdjustment).toFixed(1))
    }
  }, [sliderAdjustment, entries, user])

  const handleAddEntry = () => {
    if (!weight) return

    const entryDate = new Date(selectedDate)
    const newEntry = {
      id: Date.now(),
      weight: Number.parseFloat(weight),
      date: entryDate.toLocaleDateString(),
      timestamp: entryDate.getTime(),
      notes,
    }

    const updated = [...entries, newEntry].sort((a, b) => a.timestamp - b.timestamp)
    setEntries(updated)
    saveWeightEntries(updated)
    
    // Update user's current weight if this is the latest entry
    if (user) {
      const latestEntry = updated[updated.length - 1]
      if (latestEntry.timestamp >= (updated.find(e => e.id === newEntry.id)?.timestamp || 0)) {
        const updatedUser = { ...user, currentWeight: latestEntry.weight }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    }
    
    // Check achievements
    checkAchievements()
    
    setWeight("")
    setNotes("")
    setSliderAdjustment(0)
    setSelectedDate(new Date().toISOString().split("T")[0])
  }

  const handleDeleteEntry = (id: number) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    saveWeightEntries(updated)
  }

  const calculateStats = () => {
    if (entries.length === 0) return { trend: 0, avgChange: 0, totalChange: 0, daysTracking: 0 }

    const firstWeight = entries[0].weight
    const lastWeight = entries[entries.length - 1].weight
    const totalChange = lastWeight - firstWeight

    const changes = entries.slice(1).map((entry, idx) => entry.weight - entries[idx].weight)
    const avgChange = changes.length > 0 ? changes.reduce((a, b) => a + b, 0) / changes.length : 0

    const firstDate = new Date(entries[0].timestamp)
    const lastDate = new Date(entries[entries.length - 1].timestamp)
    const daysTracking = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))

    return { trend: totalChange, avgChange, totalChange, daysTracking }
  }

  const renderChart = () => {
    if (entries.length === 0) return null

    const weights = entries.map((e) => e.weight)
    const minWeight = Math.min(...weights) - 0.5
    const maxWeight = Math.max(...weights) + 0.5
    const range = maxWeight - minWeight
    const goalWeight = user?.goalWeight || maxWeight

    const chartWidth = 1000
    const chartHeight = 320
    const padding = 60

    const getX = (index: number) => {
      return padding + (index / (entries.length - 1)) * (chartWidth - padding * 2)
    }

    const getY = (weight: number) => {
      return chartHeight - padding - ((weight - minWeight) / range) * (chartHeight - padding * 2)
    }

    const linePath = entries
      .map((entry, i) => {
        const x = getX(i)
        const y = getY(entry.weight)
        return `${i === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")

    const areaPath =
      linePath + ` L ${getX(entries.length - 1)} ${chartHeight - padding} L ${getX(0)} ${chartHeight - padding} Z`

    const goalY = getY(goalWeight)

    return (
      <div className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-80"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (i * (chartHeight - padding * 2)) / 4
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-200 dark:text-slate-700"
                strokeDasharray="4 4"
              />
            )
          })}

          <line
            x1={padding}
            y1={goalY}
            x2={chartWidth - padding}
            y2={goalY}
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="opacity-50"
          />
          <text
            x={chartWidth - padding - 10}
            y={goalY - 10}
            textAnchor="end"
            className="fill-green-600 text-xs font-semibold"
          >
            Goal: {goalWeight} lbs
          </text>

          <defs>
            <linearGradient id="areaGradientMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGradientMain)" />

          <path
            d={linePath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {entries.map((entry, idx) => {
            const x = getX(idx)
            const y = getY(entry.weight)
            const isHovered = hoveredPoint === idx
            const prevWeight = idx > 0 ? entries[idx - 1].weight : entry.weight
            const change = entry.weight - prevWeight

            return (
              <g key={entry.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={25}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(idx)}
                />

                {isHovered && (
                  <g className="animate-in fade-in zoom-in duration-200">
                    <rect
                      x={x - 60}
                      y={y - 90}
                      width="120"
                      height="80"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text x={x} y={y - 60} textAnchor="middle" className="fill-white font-black text-base">
                      {entry.weight} lbs
                    </text>
                    <text x={x} y={y - 45} textAnchor="middle" className="fill-white/80 text-xs font-bold">
                      {entry.date}
                    </text>
                    {change !== 0 && (
                      <text
                        x={x}
                        y={y - 30}
                        textAnchor="middle"
                        className="fill-white text-xs font-black"
                      >
                        {change > 0 ? "+" : ""}
                        {change.toFixed(1)} lbs
                      </text>
                    )}
                    {entry.notes && (
                      <text x={x} y={y - 15} textAnchor="middle" className="fill-white/60 text-xs font-semibold">
                        {entry.notes.substring(0, 15)}
                        {entry.notes.length > 15 ? "..." : ""}
                      </text>
                    )}
                  </g>
                )}

                <rect
                  x={x - (isHovered ? 6 : 4)}
                  y={y - (isHovered ? 6 : 4)}
                  width={isHovered ? 12 : 8}
                  height={isHovered ? 12 : 8}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200 cursor-pointer"
                />
              </g>
            )
          })}

          {entries.map((entry, idx) => {
            const x = getX(idx)
            if (entries.length > 10 && idx % 2 !== 0) return null
            return (
              <text
                key={idx}
                x={x}
                y={chartHeight - 20}
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-400 text-xs"
              >
                {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            )
          })}

          {[maxWeight, (maxWeight + minWeight) / 2, minWeight].map((weight, i) => {
            const y = padding + (i * (chartHeight - padding * 2)) / 2
            return (
              <text
                key={i}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-600 dark:fill-slate-400 text-xs"
              >
                {weight.toFixed(1)}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const stats = calculateStats()
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:border-primary transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Current Weight</div>
                <div className="text-3xl font-bold text-foreground">
                  {lastEntry ? lastEntry.weight : user?.currentWeight} <span className="text-lg">lbs</span>
                </div>
              </div>
              <Target className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 hover:border-primary transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Total Progress</div>
                <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                  {stats.totalChange > 0 ? (
                    <TrendingUp className="w-6 h-6 text-primary" />
                  ) : stats.totalChange < 0 ? (
                    <TrendingDown className="w-6 h-6 text-primary" />
                  ) : (
                    <Minus className="w-6 h-6 text-muted-foreground" />
                  )}
                  {stats.totalChange > 0 ? "+" : ""}
                  {stats.totalChange.toFixed(1)} <span className="text-lg">lbs</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:border-primary transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">To Goal</div>
                <div className="text-3xl font-bold text-foreground">
                  {(user?.goalWeight - (lastEntry ? lastEntry.weight : user?.currentWeight)).toFixed(1)}{" "}
                  <span className="text-lg">lbs</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:border-primary transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Days Tracking</div>
                <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {stats.daysTracking || 0}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Weight Progress Chart</h2>
          <p className="text-sm text-muted-foreground mb-4 font-medium">Hover over points to see details</p>
          {entries.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Target className="w-16 h-16 mx-auto mb-4 text-primary/50" />
              <p className="text-lg font-semibold">No data yet</p>
              <p className="text-sm font-medium">Start logging your weight to see your progress!</p>
            </div>
          ) : (
            renderChart()
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Log Weight</h2>

          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Entry Date
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground mt-2">You can backdate entries to track historical data</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">Quick Adjust</label>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={sliderAdjustment}
                  onChange={(e) => setSliderAdjustment(Number.parseFloat(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-200 via-slate-200 to-green-200 dark:from-red-900 dark:via-slate-700 dark:to-green-900 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background:
                      sliderAdjustment < 0
                        ? "linear-gradient(to right, #fecaca 0%, #e5e7eb 50%, #e5e7eb 100%)"
                        : sliderAdjustment > 0
                          ? "linear-gradient(to right, #e5e7eb 0%, #e5e7eb 50%, #bbf7d0 100%)"
                          : "linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%)",
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                  <span className="text-red-600 dark:text-red-400 font-semibold">-5 lbs</span>
                  <span className="font-semibold">0</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">+5 lbs</span>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg border-2 border-slate-300 dark:border-slate-600">
                <div className="text-sm text-muted-foreground mb-1">Adjustment</div>
                <div
                  className={`text-4xl font-bold transition-all duration-300 ${
                    sliderAdjustment > 0
                      ? "text-green-600 dark:text-green-400 scale-110"
                      : sliderAdjustment < 0
                        ? "text-red-600 dark:text-red-400 scale-110"
                        : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {sliderAdjustment > 0 ? "+" : ""}
                  {sliderAdjustment.toFixed(1)} lbs
                </div>
                {sliderAdjustment !== 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSliderAdjustment(0)} className="mt-2 text-xs">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Weight (lbs)</label>
              <Input
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
                className="text-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
              <Input placeholder="How do you feel?" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <Button 
            onClick={handleAddEntry} 
            className="w-full" 
            size="lg" 
            disabled={!weight}
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Weight Entry
          </Button>
        </Card>

        {entries.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Weight History ({entries.length} entries)</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries
                .slice()
                .reverse()
                .map((entry, idx) => {
                  const reverseIdx = entries.length - 1 - idx
                  const prevEntry = reverseIdx > 0 ? entries[reverseIdx - 1] : null
                  const change = prevEntry ? entry.weight - prevEntry.weight : 0

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 bg-card border border-border hover:border-primary transition-all duration-200 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-foreground">{entry.weight} lbs</div>
                          {change !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 border-2 rounded-lg ${
                                change > 0
                                  ? "border-primary bg-primary/20 text-primary"
                                  : "border-border bg-muted text-muted-foreground"
                              }`}
                            >
                              {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {entry.date}
                          {entry.notes && ` • ${entry.notes}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
