"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X, Flame, Camera, Upload } from "lucide-react"
import { foodDatabase } from "@/data/foodDatabase"
import { getCalorieEntries, saveCalorieEntries, getTodayCalories, getCalorieGoal, checkAchievements } from "@/lib/userUtils"
import { analyzeMealPhoto } from "@/lib/foodRecognition"

type FoodItem = {
  name: string
  calories: number // per serving
  unit: string
  icon: string
}

type FoodCategory = {
  id: string
  name: string
  color: string
  items: FoodItem[]
}

const commonFoodsByCategory = {
  meat: [
    { name: "Chicken Breast", calories: 165, unit: "3.5 oz (100g)", icon: "🍗" },
    { name: "Eggs", calories: 155, unit: "2 large", icon: "🥚" },
    { name: "Salmon", calories: 208, unit: "3.5 oz (100g)", icon: "🐟" },
    { name: "Ground Beef", calories: 287, unit: "3.5 oz (100g)", icon: "🍔" },
    { name: "Turkey Breast", calories: 135, unit: "3.5 oz (100g)", icon: "🦃" },
    { name: "Steak (Lean)", calories: 271, unit: "3.5 oz (100g)", icon: "🥩" },
  ],
  carbs: [
    { name: "Brown Rice", calories: 216, unit: "1 cup cooked", icon: "🍚" },
    { name: "Sweet Potato", calories: 114, unit: "1 medium", icon: "🥔" },
    { name: "Pasta", calories: 200, unit: "1 cup cooked", icon: "🍝" },
    { name: "Oatmeal", calories: 300, unit: "1 cup cooked", icon: "🥣" },
    { name: "Whole Wheat Bread", calories: 80, unit: "1 slice", icon: "🍞" },
    { name: "Bagel", calories: 289, unit: "1 medium", icon: "🥯" },
  ],
  veggies: [
    { name: "Broccoli", calories: 55, unit: "1 cup chopped", icon: "🥦" },
    { name: "Spinach (Raw)", calories: 7, unit: "1 cup raw", icon: "🥬" },
    { name: "Carrots", calories: 25, unit: "1 medium", icon: "🥕" },
    { name: "Bell Peppers", calories: 24, unit: "1 medium", icon: "🫑" },
    { name: "Corn", calories: 177, unit: "1 cup cooked", icon: "🌽" },
    { name: "Green Beans", calories: 31, unit: "1 cup", icon: "🫘" },
  ],
  fruits: [
    { name: "Banana", calories: 105, unit: "1 medium", icon: "🍌" },
    { name: "Apple", calories: 95, unit: "1 medium", icon: "🍎" },
    { name: "Strawberries", calories: 49, unit: "1 cup", icon: "🍓" },
    { name: "Blueberries", calories: 84, unit: "1 cup", icon: "🫐" },
    { name: "Orange", calories: 62, unit: "1 medium", icon: "🍊" },
    { name: "Watermelon", calories: 46, unit: "1 cup chunks", icon: "🍉" },
  ],
  drinks: [
    { name: "Whole Milk", calories: 149, unit: "1 cup", icon: "🥛" },
    { name: "Almond Milk", calories: 30, unit: "1 cup", icon: "🥛" },
    { name: "Oat Milk", calories: 120, unit: "1 cup", icon: "🥛" },
    { name: "Orange Juice", calories: 112, unit: "1 cup", icon: "🧃" },
    { name: "Apple Juice", calories: 114, unit: "1 cup", icon: "🧃" },
    { name: "Protein Shake", calories: 120, unit: "1 scoop", icon: "🥤" },
  ],
  snacks: [
    { name: "Almonds", calories: 164, unit: "1 oz", icon: "🥜" },
    { name: "Peanut Butter", calories: 188, unit: "2 tbsp", icon: "🥜" },
    { name: "Greek Yogurt", calories: 100, unit: "1 cup", icon: "🥣" },
    { name: "Cheddar Cheese", calories: 113, unit: "1 slice", icon: "🧀" },
    { name: "Dark Chocolate", calories: 170, unit: "1 oz", icon: "🍫" },
    { name: "Protein Bar", calories: 250, unit: "1 bar", icon: "🫧" },
  ],
}

const categories = ["meat", "carbs", "veggies", "fruits", "drinks", "snacks"] as const

export default function CaloriesPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [todayLog, setTodayLog] = useState<any[]>([])
  const [allLogs, setAllLogs] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false)
  const [analyzedMeal, setAnalyzedMeal] = useState<any>(null)
  const [photoQuantity, setPhotoQuantity] = useState(1)
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("meat")
  const [editedCalories, setEditedCalories] = useState(0)


  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))

    const all = getCalorieEntries()
    setAllLogs(all)
    const today = all.filter((e: any) => e.date === new Date().toLocaleDateString())
    setTodayLog(today)
  }, [router])

  const handleCategoryClick = (category: FoodCategory) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
    setSelectedFood(null)
    setQuantity(1)
  }

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food)
    setQuantity(1)
  }

  const handleAddFoodFromPlate = () => {
    if (!selectedFood) return

    const totalCalories = Math.round(selectedFood.calories * quantity)
    const now = new Date()

    const newEntry = {
      id: Date.now(),
      foodName: selectedFood.name,
      calories: totalCalories,
      icon: selectedFood.icon,
      category: selectedCategory?.name,
      quantity: quantity,
      unit: selectedFood.unit,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
    }

    const updated = [...allLogs, newEntry]
    setAllLogs(updated)
    saveCalorieEntries(updated)

    const todayEntries = updated.filter((e: any) => e.date === new Date().toLocaleDateString())
    setTodayLog(todayEntries)

    // Check achievements
    checkAchievements()

    setIsDialogOpen(false)
    setSelectedFood(null)
    setQuantity(1)
  }

  const handleDeleteEntry = (id: number) => {
    const updated = allLogs.filter((e) => e.id !== id)
    setAllLogs(updated)
    saveCalorieEntries(updated)
    const todayEntries = updated.filter((e: any) => e.date === new Date().toLocaleDateString())
    setTodayLog(todayEntries)
  }

  const handleAnalyzeMealPhoto = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
      setPhotoModalOpen(true)
      setAnalyzingPhoto(true)
    }
    reader.readAsDataURL(file)

    try {
      // Analyze the meal photo
      const result = await analyzeMealPhoto(file)
      
      setAnalyzedMeal({
        icon: '🍽️',
        calories: result.calories,
        unit: "meal",
        category: "Photo Analysis",
      })
      setEditedCalories(result.calories)
      setAnalyzingPhoto(false)
      setPhotoQuantity(1)
    } catch (error) {
      console.error("Error analyzing meal:", error)
      setAnalyzingPhoto(false)
      // Show error or fallback
      alert("Could not analyze image. Please try again or add manually.")
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleAnalyzeMealPhoto(e.target.files[0])
    }
  }

  const handleAddAnalyzedMeal = () => {
    if (!analyzedMeal) {
      console.error("No analyzed meal to add")
      return
    }

    try {
      const totalCalories = Math.round((analyzedMeal.calories || editedCalories || 0) * photoQuantity)
      if (totalCalories <= 0) {
        alert("Please enter a valid calorie amount")
        return
      }

      const now = new Date()

      const newEntry = {
        id: Date.now(),
        foodName: "Meal",
        calories: totalCalories,
        icon: analyzedMeal.icon || '🍽️',
        category: analyzedMeal.category || "Photo Analysis",
        quantity: photoQuantity,
        unit: "meal",
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime(),
        photoUrl: photoPreview,
      }

      const updated = [...allLogs, newEntry]
      setAllLogs(updated)
      saveCalorieEntries(updated)

      const todayEntries = updated.filter((e: any) => e.date === new Date().toLocaleDateString())
      setTodayLog(todayEntries)

      // Check achievements
      checkAchievements()

      setPhotoModalOpen(false)
      setPhotoPreview(null)
      setAnalyzedMeal(null)
      setEditedCalories(0)
    } catch (error) {
      console.error("Error adding meal:", error)
      alert("Failed to add meal. Please try again.")
    }
  }

  const totalCaloriesToday = todayLog.reduce((sum, entry) => sum + entry.calories, 0)
  const dailyGoal = getCalorieGoal()
  const remaining = dailyGoal - totalCaloriesToday
  const percentage = dailyGoal > 0 ? (totalCaloriesToday / dailyGoal) * 100 : 0

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Daily Energy Card - Modern Design */}
        <Card className="p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <h2 className="text-lg font-semibold text-foreground mb-6">Daily Energy</h2>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl md:text-6xl font-bold text-primary">{totalCaloriesToday}</span>
            <span className="text-xl text-secondary mb-2 font-semibold">/ {dailyGoal} kcal</span>
          </div>

          {/* Progress Bar - Modern rounded */}
          <div className="w-full bg-muted h-6 mb-6 overflow-hidden rounded-full shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-1000 rounded-full shadow-md"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
            <div>
              <div className="text-sm text-secondary font-semibold mb-1">Remaining</div>
              <div className="text-2xl font-bold text-foreground">{Math.max(0, remaining)} kcal</div>
            </div>
            <div>
              <div className="text-sm text-secondary font-semibold mb-1">Status</div>
              <div className={`text-2xl font-bold uppercase ${
                remaining < 0 ? "text-primary" : "text-secondary"
              }`}>
                {remaining < 0 ? "Surplus" : "On Track"}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Food Plate Interface */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Quick Add Foods</h2>

              {/* Category Tabs - Modern pill design */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => {
                  const categoryLabels = {
                    meat: "🥩 Meat",
                    carbs: "🍚 Carbs",
                    veggies: "🥦 Veggies",
                    fruits: "🍌 Fruits",
                    drinks: "🥤 Drinks",
                    snacks: "🥜 Snacks",
                  }
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 font-semibold whitespace-nowrap transition-all rounded-full text-sm ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  )
                })}
              </div>

              {/* Food Grid - Responsive columns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3">
                {commonFoodsByCategory[activeCategory].map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const entry = {
                        id: Date.now(),
                        foodName: food.name,
                        calories: food.calories,
                        icon: food.icon,
                        category: activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1),
                        quantity: 1,
                        unit: food.unit,
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString(),
                      }

                      const updated = [...allLogs, entry]
                      setAllLogs(updated)
                      saveCalorieEntries(updated)

                      const todayEntries = updated.filter((e: any) => e.date === new Date().toLocaleDateString())
                      setTodayLog(todayEntries)

                      // Check achievements
                      checkAchievements()
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-card hover:bg-secondary hover:text-secondary-foreground rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-border hover:border-secondary group"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      {food.icon}
                    </span>
                    <span className="font-semibold text-sm text-center leading-tight text-foreground group-hover:text-secondary-foreground">{food.name}</span>
                    <span className="text-xs text-primary group-hover:text-secondary-foreground font-bold mt-1">
                      {food.calories} kcal
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Food Plate and Snap & Track */}
            <Card className="p-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Build Your Plate</h1>
              <p className="text-sm text-secondary mb-6 font-medium">
                Click a section to browse all foods in that category
              </p>

              <div className="aspect-square max-w-md mx-auto relative group mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden bg-white dark:bg-slate-800">
                  <div className="w-full h-full relative">
                    {/* Top Left: Carbs */}
                    <button
                      onClick={() => handleCategoryClick(foodDatabase[1])}
                      className="absolute top-0 left-0 w-1/2 h-1/2 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center justify-center border-r border-b border-white/50 dark:border-slate-700/50 group/section active:scale-95"
                    >
                      <div className="text-center transform group-hover/section:scale-110 transition-transform">
                        <div className="text-2xl md:text-3xl mb-1">🍞</div>
                        <span className="font-bold text-xs md:text-sm text-amber-700 dark:text-amber-300">Carbs</span>
                      </div>
                    </button>

                    {/* Top Right: Proteins */}
                    <button
                      onClick={() => handleCategoryClick(foodDatabase[0])}
                      className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center border-b border-white/50 dark:border-slate-700/50 group/section active:scale-95"
                    >
                      <div className="text-center transform group-hover/section:scale-110 transition-transform">
                        <div className="text-2xl md:text-3xl mb-1">🍗</div>
                        <span className="font-bold text-xs md:text-sm text-red-700 dark:text-red-300">Proteins</span>
                      </div>
                    </button>

                    {/* Bottom Left: Veggies */}
                    <button
                      onClick={() => handleCategoryClick(foodDatabase[2])}
                      className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center border-r border-white/50 dark:border-slate-700/50 group/section active:scale-95"
                    >
                      <div className="text-center transform group-hover/section:scale-110 transition-transform">
                        <div className="text-2xl md:text-3xl mb-1">🥦</div>
                        <span className="font-bold text-xs md:text-sm text-green-700 dark:text-green-300">Veggies</span>
                      </div>
                    </button>

                    {/* Bottom Right: Fruits */}
                    <button
                      onClick={() => handleCategoryClick(foodDatabase[3])}
                      className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors flex items-center justify-center group/section active:scale-95"
                    >
                      <div className="text-center transform group-hover/section:scale-110 transition-transform">
                        <div className="text-2xl md:text-3xl mb-1">🍎</div>
                        <span className="font-bold text-xs md:text-sm text-orange-700 dark:text-orange-300">
                          Fruits
                        </span>
                      </div>
                    </button>

                    {/* Center: Fats/Dairy (Overlay Circle) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full bg-white dark:bg-slate-800 shadow-xl flex flex-col overflow-hidden border-4 border-slate-100 dark:border-slate-700">
                      <button
                        onClick={() => handleCategoryClick(foodDatabase[4])}
                        className="flex-1 w-full bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors flex items-center justify-center group/section active:scale-95"
                      >
                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300 group-hover/section:scale-110 transition-transform">
                          Fats
                        </span>
                      </button>
                      <button
                        onClick={() => handleCategoryClick(foodDatabase[5])}
                        className="flex-1 w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center group/section active:scale-95"
                      >
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 group-hover/section:scale-110 transition-transform">
                          Dairy
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-gradient-to-br from-muted to-card border-dashed">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Snap & Track</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Take or upload a photo of your meal for automatic calorie detection
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => cameraInputRef.current?.click()}
                      size="sm"
                    >
                      <Camera size={18} />
                      <span>Camera</span>
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                    >
                      <Upload size={18} />
                      <span>Upload</span>
                    </Button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </Card>
            </Card>
          </div>

          {/* Right Column: Today's Meals */}
          <div className="lg:col-span-5">
            <Card className="flex-1 min-h-[400px] md:min-h-full flex flex-col">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
              </div>
              <ScrollArea className="flex-1 p-6 h-[400px] md:h-auto">
                {todayLog.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                    <p className="text-secondary font-medium text-base">
                      Your plate is empty.
                      <br />
                      <span className="text-sm">Click Quick Add Foods or Build Your Plate to start logging!</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayLog
                      .sort((a, b) => {
                        // Sort by timestamp (most recent first), fallback to id
                        if (a.timestamp && b.timestamp) {
                          return b.timestamp - a.timestamp
                        }
                        return (b.id || 0) - (a.id || 0)
                      })
                      .map((entry) => (
                      <div
                        key={entry.id}
                        className="group flex items-center justify-between p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border border-border"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          {entry.photoUrl ? (
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                              <img 
                                src={entry.photoUrl} 
                                alt={entry.foodName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                              {entry.icon || "🍽️"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-base truncate text-foreground">{entry.foodName}</div>
                            <div className="text-sm text-secondary flex items-center gap-1 truncate font-medium mt-0.5">
                              {entry.quantity}x {entry.unit} • {entry.category}
                            </div>
                            {entry.time && (
                              <div className="text-xs text-secondary font-medium mt-1">
                                {entry.time}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                          <span className="font-bold text-xl text-primary">{entry.calories}</span>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-2 text-secondary hover:text-primary hover:bg-muted rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* Photo Analysis Modal */}
        <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
          <DialogContent className="max-w-md bg-white border-0 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#003049] font-bold text-xl">Meal Analysis</DialogTitle>
              <DialogDescription className="text-[#669BBC] text-sm">
                Review the detected meal and adjust the quantity
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {photoPreview && (
                <div className="overflow-hidden rounded-xl shadow-md">
                  <img src={photoPreview || "/placeholder.svg"} alt="Meal" className="w-full h-72 object-cover" />
                </div>
              )}

              {analyzingPhoto ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="w-16 h-16 border-4 border-[#FDF0D5] border-t-[#C1121F] rounded-full animate-spin" />
                  <p className="text-[#003049] text-center font-medium">Analyzing your meal...</p>
                </div>
              ) : analyzedMeal ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-[#FDF0D5] to-white rounded-xl shadow-sm border border-[#E0E0E0]">
                    <div className="text-5xl">{analyzedMeal.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-[#669BBC] font-medium mb-1">Estimated Calories</p>
                      <p className="text-xs text-[#669BBC] italic">
                        Adjust calories if needed below
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-[#C1121F]">
                        {Math.round(analyzedMeal.calories * photoQuantity)}
                      </div>
                      <div className="text-sm text-[#669BBC] font-medium">kcal</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm text-[#003049] font-semibold">Adjust Calories</label>
                    <input
                      type="number"
                      value={editedCalories || analyzedMeal.calories || 0}
                      onChange={(e) => {
                        const newCalories = parseInt(e.target.value) || 0
                        setEditedCalories(newCalories)
                        setAnalyzedMeal({ ...analyzedMeal, calories: newCalories })
                      }}
                      className="w-full px-4 py-3 bg-white border-2 border-[#E0E0E0] text-[#003049] font-bold text-xl text-center rounded-xl focus:border-[#C1121F] focus:outline-none shadow-sm"
                      min="100"
                      max="2000"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#003049]">Servings: {photoQuantity}</span>
                      <span className="text-sm text-[#669BBC] font-medium">
                        {photoQuantity} x {editedCalories || analyzedMeal.calories || 0} kcal
                      </span>
                    </div>
                    <Slider
                      value={[photoQuantity]}
                      min={0.5}
                      max={3}
                      step={0.5}
                      onValueChange={(value) => setPhotoQuantity(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[#669BBC] font-medium px-1">
                      <span>0.5x</span>
                      <span>1x</span>
                      <span>2x</span>
                      <span>3x</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setPhotoModalOpen(false)} 
                      className="flex-1 bg-white border-2 border-[#669BBC] text-[#669BBC] hover:bg-[#669BBC] hover:text-white rounded-xl font-semibold shadow-sm"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddAnalyzedMeal()
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddAnalyzedMeal()
                      }}
                      disabled={!analyzedMeal || (analyzedMeal.calories || editedCalories || 0) <= 0}
                      className="flex-1 bg-[#C1121F] hover:bg-[#780000] active:bg-[#780000] text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      Add to Log
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        {/* Food Selection Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">{selectedCategory?.name}</DialogTitle>
              <DialogDescription>
                {!selectedFood ? "Select a food item to add to your plate" : "Adjust quantity and add to plate"}
              </DialogDescription>
            </DialogHeader>

            {!selectedFood ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-4">
                {selectedCategory?.items.map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFoodSelect(food)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-primary/10 transition-all group active:scale-95 shadow-sm hover:shadow-md"
                  >
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{food.icon}</span>
                    <span className="font-bold text-sm text-center leading-tight">{food.name}</span>
                    <span className="text-xs text-muted-foreground font-semibold mt-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {food.calories} kcal
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="text-5xl">{selectedFood.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedFood.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedFood.unit} per serving</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {Math.round(selectedFood.calories * quantity)}
                    </div>
                    <div className="text-xs text-muted-foreground">kcal</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Quantity: {quantity} serving{quantity !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {quantity} x {selectedFood.calories} kcal
                    </span>
                  </div>
                  <Slider
                    value={[quantity]}
                    min={0.5}
                    max={5}
                    step={0.5}
                    onValueChange={(vals) => setQuantity(vals[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>2x</span>
                    <span>3x</span>
                    <span>4x</span>
                    <span>5x</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedFood(null)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleAddFoodFromPlate}>
                    Add to Plate
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
