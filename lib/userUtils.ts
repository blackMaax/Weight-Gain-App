// Utility functions for managing user data, XP, and achievements

export interface User {
  id: string
  email: string
  name: string
  currentWeight: number
  goalWeight: number
  height: number
  age: number
  activityLevel: string
  goal: string
  xp: number
  level: number
  createdAt?: string
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  xp: number
  requirementType: 'first_weight_entry' | 'weight_gained_5' | 'weight_gained_10' | 'calories_logged_10' | 'calories_logged_50' | 'calories_logged_100' | 'streak_7' | 'streak_30' | 'goal_reached'
  requirementValue: number
  unlocked: boolean
  unlockedAt?: string
}

export interface WeightEntry {
  id: number
  weight: number
  date: string
  timestamp: number
  notes?: string
}

export interface CalorieEntry {
  id: number
  foodName: string
  calories: number
  icon: string
  category: string
  quantity: number
  unit: string
  date: string
  time: string
  photoUrl?: string
}

// Get user from localStorage
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

// Save user to localStorage
export function saveUser(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

// Get weight entries
export function getWeightEntries(): WeightEntry[] {
  if (typeof window === 'undefined') return []
  const entries = localStorage.getItem('weightEntries')
  return entries ? JSON.parse(entries) : []
}

// Save weight entries
export function saveWeightEntries(entries: WeightEntry[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('weightEntries', JSON.stringify(entries))
}

// Get calorie entries
export function getCalorieEntries(): CalorieEntry[] {
  if (typeof window === 'undefined') return []
  const entries = localStorage.getItem('calorieEntries')
  return entries ? JSON.parse(entries) : []
}

// Save calorie entries
export function saveCalorieEntries(entries: CalorieEntry[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('calorieEntries', JSON.stringify(entries))
}

// Get achievements
export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return getDefaultAchievements()
  const achievements = localStorage.getItem('achievements')
  return achievements ? JSON.parse(achievements) : getDefaultAchievements()
}

// Save achievements
export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('achievements', JSON.stringify(achievements))
}

// Get default achievements
export function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: 1,
      name: 'First Step',
      description: 'Log your first weight entry',
      icon: '🎯',
      xp: 50,
      requirementType: 'first_weight_entry',
      requirementValue: 1,
      unlocked: false,
    },
    {
      id: 2,
      name: 'Weight Warrior',
      description: 'Gain 5 pounds',
      icon: '💪',
      xp: 200,
      requirementType: 'weight_gained_5',
      requirementValue: 5,
      unlocked: false,
    },
    {
      id: 3,
      name: 'Weight Champion',
      description: 'Gain 10 pounds',
      icon: '🏆',
      xp: 400,
      requirementType: 'weight_gained_10',
      requirementValue: 10,
      unlocked: false,
    },
    {
      id: 4,
      name: 'Calorie Starter',
      description: 'Log 10 meals',
      icon: '📊',
      xp: 100,
      requirementType: 'calories_logged_10',
      requirementValue: 10,
      unlocked: false,
    },
    {
      id: 5,
      name: 'Calorie Counter',
      description: 'Log 50 meals',
      icon: '🍽️',
      xp: 300,
      requirementType: 'calories_logged_50',
      requirementValue: 50,
      unlocked: false,
    },
    {
      id: 6,
      name: 'Calorie Master',
      description: 'Log 100 meals',
      icon: '👑',
      xp: 500,
      requirementType: 'calories_logged_100',
      requirementValue: 100,
      unlocked: false,
    },
    {
      id: 7,
      name: 'Week Winner',
      description: 'Log weight 7 days in a row',
      icon: '🔥',
      xp: 150,
      requirementType: 'streak_7',
      requirementValue: 7,
      unlocked: false,
    },
    {
      id: 8,
      name: 'Consistency King',
      description: 'Maintain 30-day streak',
      icon: '⭐',
      xp: 350,
      requirementType: 'streak_30',
      requirementValue: 30,
      unlocked: false,
    },
    {
      id: 9,
      name: 'Goal Crusher',
      description: 'Reach your weight goal',
      icon: '🎉',
      xp: 500,
      requirementType: 'goal_reached',
      requirementValue: 1,
      unlocked: false,
    },
  ]
}

// Calculate total XP needed to reach a level
export function getXPForLevel(level: number): number {
  // Level 1: 0 XP, Level 2: 200 XP, Level 3: 450 XP, Level 4: 750 XP, etc.
  // Each level requires more XP: 200, 250, 300, 350...
  if (level <= 1) return 0
  let totalXP = 0
  for (let i = 2; i <= level; i++) {
    totalXP += 150 + (i - 2) * 50 // 200, 250, 300, 350...
  }
  return totalXP
}

// Calculate level from XP
export function getLevelFromXP(xp: number): number {
  let level = 1
  while (getXPForLevel(level + 1) <= xp) {
    level++
  }
  return level
}

// Add XP to user
export function addXP(amount: number): void {
  const user = getUser()
  if (!user) return

  const newXP = user.xp + amount
  const newLevel = getLevelFromXP(newXP)

  const updatedUser: User = {
    ...user,
    xp: newXP,
    level: newLevel,
  }

  saveUser(updatedUser)
}

// Check and unlock achievements
export function checkAchievements(): Achievement[] {
  const achievements = getAchievements()
  const weightEntries = getWeightEntries()
  const calorieEntries = getCalorieEntries()
  const user = getUser()

  if (!user) return achievements

  let updated = false
  const updatedAchievements = achievements.map((achievement) => {
    if (achievement.unlocked) return achievement

    let shouldUnlock = false

    switch (achievement.requirementType) {
      case 'first_weight_entry':
        shouldUnlock = weightEntries.length >= 1
        break
      case 'weight_gained_5':
        if (weightEntries.length >= 2) {
          const firstWeight = weightEntries[0].weight
          const lastWeight = weightEntries[weightEntries.length - 1].weight
          shouldUnlock = lastWeight - firstWeight >= 5
        }
        break
      case 'weight_gained_10':
        if (weightEntries.length >= 2) {
          const firstWeight = weightEntries[0].weight
          const lastWeight = weightEntries[weightEntries.length - 1].weight
          shouldUnlock = lastWeight - firstWeight >= 10
        }
        break
      case 'calories_logged_10':
        shouldUnlock = calorieEntries.length >= 10
        break
      case 'calories_logged_50':
        shouldUnlock = calorieEntries.length >= 50
        break
      case 'calories_logged_100':
        shouldUnlock = calorieEntries.length >= 100
        break
      case 'streak_7':
        shouldUnlock = calculateStreak(weightEntries) >= 7
        break
      case 'streak_30':
        shouldUnlock = calculateStreak(weightEntries) >= 30
        break
      case 'goal_reached':
        if (weightEntries.length > 0) {
          const lastWeight = weightEntries[weightEntries.length - 1].weight
          shouldUnlock = lastWeight >= user.goalWeight
        }
        break
    }

    if (shouldUnlock && !achievement.unlocked) {
      updated = true
      addXP(achievement.xp)
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      }
    }

    return achievement
  })

  if (updated) {
    saveAchievements(updatedAchievements)
  }

  return updatedAchievements
}

// Calculate streak from weight entries
export function calculateStreak(entries: WeightEntry[]): number {
  if (entries.length === 0) return 0

  // Sort by date
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  
  // Get unique dates
  const dates = [...new Set(sorted.map(e => e.date))].sort()
  
  if (dates.length === 0) return 0

  // Check if today or yesterday is in the list
  const today = new Date().toLocaleDateString()
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()
  
  if (!dates.includes(today) && !dates.includes(yesterday)) {
    return 0 // No recent entry, streak broken
  }

  // Calculate consecutive days
  let streak = 0
  let checkDate = dates[dates.length - 1]
  
  for (let i = dates.length - 1; i >= 0; i--) {
    const entryDate = new Date(dates[i])
    const expectedDate = new Date(checkDate)
    
    const diffDays = Math.floor((expectedDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0 || diffDays === 1) {
      streak++
      checkDate = new Date(entryDate.getTime() - 86400000).toLocaleDateString()
    } else {
      break
    }
  }

  return streak
}

// Get today's calories
export function getTodayCalories(): number {
  const entries = getCalorieEntries()
  const today = new Date().toLocaleDateString()
  return entries
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.calories, 0)
}

// Get calorie goal (can be customized per user)
export function getCalorieGoal(): number {
  const user = getUser()
  return user?.goalWeight ? 2500 : 2500 // Default 2500, can be calculated based on user stats
}

// Calculate weight gained from weight entries
export function calculateWeightGained(entries: WeightEntry[]): number {
  if (entries.length < 2) return 0
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  const firstWeight = sorted[0].weight
  const lastWeight = sorted[sorted.length - 1].weight
  return Math.max(0, lastWeight - firstWeight)
}

// Leaderboard entry interface
export interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  weightGained: number
  streak: number
  level: number
  isCurrentUser?: boolean
}

// Generate realistic sample users for leaderboard
function generateSampleUsers(): LeaderboardEntry[] {
  const realisticNames = [
    "Michael Chen",
    "Sarah Johnson",
    "David Martinez",
    "Emily Rodriguez",
    "James Wilson",
    "Jessica Brown",
    "Christopher Lee",
    "Amanda Taylor",
    "Daniel Anderson",
    "Nicole Garcia",
    "Matthew Thomas",
    "Lauren Jackson",
    "Ryan Moore",
    "Rachel White",
    "Kevin Harris",
  ]

  // Predefined stats for consistent leaderboard (varied but deterministic)
  const predefinedStats = [
    { xp: 2850, weightGained: 15, streak: 45 },
    { xp: 2620, weightGained: 12, streak: 38 },
    { xp: 2400, weightGained: 10, streak: 35 },
    { xp: 2150, weightGained: 9, streak: 28 },
    { xp: 1900, weightGained: 8, streak: 22 },
    { xp: 1650, weightGained: 7, streak: 18 },
    { xp: 1420, weightGained: 6, streak: 15 },
    { xp: 1200, weightGained: 5, streak: 12 },
    { xp: 980, weightGained: 4, streak: 10 },
    { xp: 750, weightGained: 3, streak: 8 },
    { xp: 620, weightGained: 2, streak: 6 },
    { xp: 500, weightGained: 2, streak: 5 },
    { xp: 420, weightGained: 1, streak: 4 },
    { xp: 350, weightGained: 1, streak: 3 },
    { xp: 280, weightGained: 1, streak: 2 },
  ]

  // Generate varied stats for realistic leaderboard
  const sampleUsers: LeaderboardEntry[] = realisticNames.map((name, index) => {
    const stats = predefinedStats[index] || { xp: 200, weightGained: 1, streak: 1 }
    const level = getLevelFromXP(stats.xp)
    
    return {
      rank: 0, // Will be set after sorting
      name,
      xp: stats.xp,
      weightGained: stats.weightGained,
      streak: stats.streak,
      level,
    }
  })

  return sampleUsers
}

// Get leaderboard data sorted by filter type
export function getLeaderboardData(filterType: "xp" | "weight" | "streak"): LeaderboardEntry[] {
  const currentUser = getUser()
  const weightEntries = getWeightEntries()
  const currentUserStreak = calculateStreak(weightEntries)
  const currentUserWeightGained = calculateWeightGained(weightEntries)
  
  // Get sample users
  const sampleUsers = generateSampleUsers()
  
  // Add current user to the list
  const currentUserEntry: LeaderboardEntry = {
    rank: 0,
    name: currentUser?.name || "You",
    xp: currentUser?.xp || 0,
    weightGained: currentUserWeightGained,
    streak: currentUserStreak,
    level: currentUser?.level || 1,
    isCurrentUser: true,
  }
  
  // Combine all users
  const allUsers = [...sampleUsers, currentUserEntry]
  
  // Sort based on filter type
  let sorted: LeaderboardEntry[]
  switch (filterType) {
    case "xp":
      sorted = allUsers.sort((a, b) => b.xp - a.xp)
      break
    case "weight":
      sorted = allUsers.sort((a, b) => b.weightGained - a.weightGained)
      break
    case "streak":
      sorted = allUsers.sort((a, b) => b.streak - a.streak)
      break
    default:
      sorted = allUsers.sort((a, b) => b.xp - a.xp)
  }
  
  // Assign ranks
  const ranked = sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
  }))
  
  // Limit to top 20, but always include current user
  const top20 = ranked.slice(0, 20)
  const currentUserInTop20 = top20.some(u => u.isCurrentUser)
  
  if (!currentUserInTop20 && currentUserEntry) {
    // Find current user's position
    const currentUserRanked = ranked.find(u => u.isCurrentUser)
    if (currentUserRanked) {
      // Replace last entry with current user if not in top 20
      top20[19] = currentUserRanked
    }
  }
  
  return top20
}

