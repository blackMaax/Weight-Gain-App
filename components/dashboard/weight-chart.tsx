"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getWeightEntries, getUser } from "@/lib/userUtils"

export default function WeightChart({ className = "" }: { className?: string }) {
  const [entries, setEntries] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const updateData = () => {
      const weightEntries = getWeightEntries()
      const userData = getUser()
      setUser(userData)
      
      if (weightEntries.length === 0) {
        setEntries([])
        return
      }
      
      // Group by week or use all entries if less than 7
      const sorted = [...weightEntries].sort((a, b) => a.timestamp - b.timestamp)
      
      if (sorted.length <= 7) {
        // Use all entries
        setEntries(sorted.map((e, i) => ({
          week: `Day ${i + 1}`,
          weight: e.weight,
          date: e.date,
        })))
      } else {
        // Group by week
        const weekly: any[] = []
        const weekStart = new Date(sorted[0].timestamp)
        weekStart.setHours(0, 0, 0, 0)
        
        let currentWeek = 1
        let weekEntries: any[] = []
        
        sorted.forEach((entry) => {
          const entryDate = new Date(entry.timestamp)
          const daysDiff = Math.floor((entryDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff < 7) {
            weekEntries.push(entry)
          } else {
            if (weekEntries.length > 0) {
              const avgWeight = weekEntries.reduce((sum, e) => sum + e.weight, 0) / weekEntries.length
              weekly.push({
                week: `Week ${currentWeek}`,
                weight: avgWeight,
                date: weekEntries[0].date,
              })
            }
            currentWeek++
            weekEntries = [entry]
            weekStart.setTime(entryDate.getTime())
            weekStart.setHours(0, 0, 0, 0)
          }
        })
        
        if (weekEntries.length > 0) {
          const avgWeight = weekEntries.reduce((sum, e) => sum + e.weight, 0) / weekEntries.length
          weekly.push({
            week: `Week ${currentWeek}`,
            weight: avgWeight,
            date: weekEntries[0].date,
          })
        }
        
        setEntries(weekly)
      }
    }
    
    updateData()
    
    const handleStorageChange = () => {
      updateData()
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(updateData, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const data = entries

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (data.length === 0) {
    return (
      <Card className={`p-6 ${className} bg-[#1a1a1a] border-2 border-red-600/20`}>
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider">Weight Progress</h2>
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-bold uppercase">No data yet</p>
          <p className="text-sm font-semibold uppercase">Start logging your weight to see your progress!</p>
        </div>
      </Card>
    )
  }

  const minWeight = Math.min(...data.map((d) => d.weight)) - 0.5
  const maxWeight = Math.max(...data.map((d) => d.weight)) + 0.5
  const range = maxWeight - minWeight

  const chartWidth = 800
  const chartHeight = 256
  const padding = 40

  const getX = (index: number) => {
    return padding + (index / (data.length - 1)) * (chartWidth - padding * 2)
  }

  const getY = (weight: number) => {
    return chartHeight - padding - ((weight - minWeight) / range) * (chartHeight - padding * 2)
  }

  // Create SVG path for the line
  const linePath = data
    .map((d, i) => {
      const x = getX(i)
      const y = getY(d.weight)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  // Create area fill path
  const areaPath =
    linePath + ` L ${getX(data.length - 1)} ${chartHeight - padding} L ${getX(0)} ${chartHeight - padding} Z`

  return (
    <Card
      className={`p-6 ${className} bg-[#1a1a1a] border-2 border-red-600/20`}
    >
      <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider">Weight Progress</h2>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-64"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid lines */}
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

          {/* Area fill with gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Data points */}
          {data.map((entry, idx) => {
            const x = getX(idx)
            const y = getY(entry.weight)
            const isHovered = hoveredIndex === idx

            return (
              <g key={idx}>
                {/* Hover area */}
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                />

                {/* Tooltip */}
                {isHovered && (
                  <g className="animate-in fade-in zoom-in duration-200">
                    <rect
                      x={x - 45}
                      y={y - 60}
                      width="90"
                      height="50"
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text x={x} y={y - 35} textAnchor="middle" className="fill-white font-black text-sm">
                      {entry.weight} lbs
                    </text>
                    <text x={x} y={y - 20} textAnchor="middle" className="fill-white/80 text-xs font-bold">
                      {entry.week}
                    </text>
                  </g>
                )}

                {/* Point circle */}
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

          {/* X-axis labels */}
          {data.map((entry, idx) => {
            const x = getX(idx)
            return (
              <text
                key={idx}
                x={x}
                y={chartHeight - 10}
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-400 text-xs"
              >
                {entry.week}
              </text>
            )
          })}

          {/* Y-axis labels */}
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
                {weight.toFixed(0)}
              </text>
            )
          })}
        </svg>
      </div>
      {data.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-400">
          {(() => {
            const firstWeight = data[0].weight
            const lastWeight = data[data.length - 1].weight
            const totalGain = lastWeight - firstWeight
            return totalGain > 0 ? (
              <>Total gain: <span className="font-black text-red-500 uppercase">+{totalGain.toFixed(1)} lbs</span></>
            ) : totalGain < 0 ? (
              <>Total change: <span className="font-black text-red-500 uppercase">{totalGain.toFixed(1)} lbs</span></>
            ) : (
              <span className="uppercase font-bold">No change yet</span>
            )
          })()}
        </div>
      )}
    </Card>
  )
}
