"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveUser, getDefaultAchievements, saveAchievements } from "@/lib/userUtils"

type OnboardingStep = "goal" | "current-weight" | "goal-weight" | "height" | "age" | "activity" | "profile"

interface OnboardingData {
  goal: string
  currentWeight: string
  goalWeight: string
  height: string
  age: string
  activityLevel: string
  name: string
  email: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("goal")
  const [fadeIn, setFadeIn] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    goal: "",
    currentWeight: "",
    goalWeight: "",
    height: "",
    age: "",
    activityLevel: "",
    name: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFadeIn(false)
    const timer = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(timer)
  }, [currentStep])

  const steps: OnboardingStep[] = ["goal", "current-weight", "goal-weight", "height", "age", "activity", "profile"]
  const currentStepIndex = steps.indexOf(currentStep)
  const isLastStep = currentStepIndex === steps.length - 1

  const goNext = () => {
    setError("")
    if (!isValidCurrentStep()) return

    if (isLastStep) {
      handleSubmit()
    } else {
      setCurrentStep(steps[currentStepIndex + 1])
    }
  }

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1])
      setError("")
    }
  }

  const isValidCurrentStep = (): boolean => {
    switch (currentStep) {
      case "goal":
        if (!data.goal) {
          setError("Please select a goal")
          return false
        }
        return true
      case "current-weight":
        if (!data.currentWeight || Number.parseFloat(data.currentWeight) <= 0) {
          setError("Please enter a valid current weight")
          return false
        }
        return true
      case "goal-weight":
        if (!data.goalWeight || Number.parseFloat(data.goalWeight) <= 0) {
          setError("Please enter a valid goal weight")
          return false
        }
        if (Number.parseFloat(data.goalWeight) <= Number.parseFloat(data.currentWeight)) {
          setError("Goal weight must be greater than current weight")
          return false
        }
        return true
      case "height":
        if (!data.height || Number.parseFloat(data.height) <= 0) {
          setError("Please enter a valid height")
          return false
        }
        return true
      case "age":
        if (!data.age || Number.parseFloat(data.age) < 13 || Number.parseFloat(data.age) > 120) {
          setError("Please enter a valid age (13-120)")
          return false
        }
        return true
      case "activity":
        if (!data.activityLevel) {
          setError("Please select an activity level")
          return false
        }
        return true
      case "profile":
        if (!data.name || !data.email) {
          setError("Please fill in all fields")
          return false
        }
        if (!data.email.includes("@")) {
          setError("Please enter a valid email")
          return false
        }
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      // Store user data locally for now
      const newUser = {
        id: "1",
        email: data.email,
        name: data.name,
        currentWeight: Number.parseFloat(data.currentWeight),
        goalWeight: Number.parseFloat(data.goalWeight),
        height: Number.parseFloat(data.height),
        age: Number.parseFloat(data.age),
        activityLevel: data.activityLevel,
        goal: data.goal,
        xp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
      }
      
      saveUser(newUser)
      
      // Initialize achievements if not already set
      const existingAchievements = localStorage.getItem("achievements")
      if (!existingAchievements) {
        saveAchievements(getDefaultAchievements())
      }

      router.push("/dashboard")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes progress-fill {
          from { width: 0; }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        .slider-track {
          height: 8px;
          border-radius: 5px;
          background: linear-gradient(to right, #e2e8f0, #cbd5e1);
          outline: none;
        }
        .slider-track::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          transition: all 0.2s;
        }
        .slider-track::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
        }
        .slider-track::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          transition: all 0.2s;
        }
        .slider-track::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
        }
      `}</style>

      <div className="w-full max-w-2xl">
        {/* Progress Indicator with Animation */}
        <div className="mb-12">
          <div className="flex gap-1 justify-center items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  index <= currentStepIndex ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
                }`}
                style={{
                  animation: index === currentStepIndex ? "pulse-scale 1s ease-in-out infinite" : "none",
                }}
              />
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {/* Content Container with Fade-in Animation */}
        <div className={`transition-all duration-500 ${fadeIn ? "animate-slide-in opacity-100" : "opacity-0"}`}>
          {/* Step: Goal */}
          {currentStep === "goal" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">What's your primary goal?</h1>
                <p className="text-lg text-gray-500 font-semibold uppercase">
                  Choose the goal that best describes your journey
                </p>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                {[
                  { value: "bulk", label: "💪 Bulk Up", desc: "Gain muscle mass" },
                  { value: "recovery", label: "🏥 Recovery", desc: "Regain lost weight" },
                  { value: "general", label: "❤️ General Health", desc: "Improve wellness" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, goal: option.value })}
                    className={`w-full p-6 border-2 transition-all text-left ${
                      data.goal === option.value
                        ? "border-red-600/60 bg-red-600/10"
                        : "border-red-600/20 bg-[#1a1a1a] hover:border-red-600/50"
                    }`}
                  >
                    <div className="text-lg font-black text-white mb-1 uppercase">{option.label.replace(/[^\w\s]/g, '').trim()}</div>
                    <div className="text-sm text-gray-500 font-semibold uppercase">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Current Weight with Interactive Slider */}
          {currentStep === "current-weight" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">What's your current weight?</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">We'll use this to track your progress</p>
              </div>

              <div className="max-w-sm mx-auto space-y-8">
                {/* Interactive Slider */}
                <div className="space-y-4">
                  <input
                    type="range"
                    min="80"
                    max="400"
                    step="1"
                    value={data.currentWeight || "150"}
                    onChange={(e) => setData({ ...data, currentWeight: e.target.value })}
                    className="slider-track w-full"
                  />
                  <div className="text-5xl font-bold text-blue-600 animate-pulse-scale">
                    {data.currentWeight || "150"}{" "}
                    <span className="text-3xl text-slate-600 dark:text-slate-400">lbs</span>
                  </div>
                </div>

                {/* Alternative Input */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Or type here"
                    value={data.currentWeight}
                    onChange={(e) => setData({ ...data, currentWeight: e.target.value })}
                    className="text-center text-xl py-6"
                    step="0.1"
                  />
                  <div className="flex items-center text-xl font-semibold px-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    lbs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Goal Weight with Interactive Slider */}
          {currentStep === "goal-weight" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">What's your goal weight?</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">This is your target weight</p>
                {data.currentWeight && (
                  <p className="text-base text-blue-600 font-semibold">Current: {data.currentWeight} lbs</p>
                )}
              </div>

              <div className="max-w-sm mx-auto space-y-8">
                {/* Interactive Slider */}
                <div className="space-y-4">
                  <input
                    type="range"
                    min={Math.ceil(Number.parseFloat(data.currentWeight) || 100) + 5}
                    max="500"
                    step="1"
                    value={data.goalWeight || Math.ceil(Number.parseFloat(data.currentWeight) || 100) + 20}
                    onChange={(e) => setData({ ...data, goalWeight: e.target.value })}
                    className="slider-track w-full"
                  />
                  <div className="text-5xl font-bold text-green-600 animate-pulse-scale">
                    {data.goalWeight || Math.ceil(Number.parseFloat(data.currentWeight) || 100) + 20}{" "}
                    <span className="text-3xl text-slate-600 dark:text-slate-400">lbs</span>
                  </div>
                  {data.currentWeight && data.goalWeight && (
                    <div className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                      +{Number.parseFloat(data.goalWeight) - Number.parseFloat(data.currentWeight)} lbs to gain
                    </div>
                  )}
                </div>

                {/* Alternative Input */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Or type here"
                    value={data.goalWeight}
                    onChange={(e) => setData({ ...data, goalWeight: e.target.value })}
                    className="text-center text-xl py-6"
                    step="0.1"
                  />
                  <div className="flex items-center text-xl font-semibold px-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    lbs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Height with Interactive Slider */}
          {currentStep === "height" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">What's your height?</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">In inches (e.g., 70 for 5'10")</p>
              </div>

              <div className="max-w-sm mx-auto space-y-8">
                {/* Interactive Slider */}
                <div className="space-y-4">
                  <input
                    type="range"
                    min="48"
                    max="84"
                    step="1"
                    value={data.height || "66"}
                    onChange={(e) => {
                      const inches = Number.parseFloat(e.target.value)
                      setData({ ...data, height: e.target.value })
                    }}
                    className="slider-track w-full"
                  />
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-blue-600 animate-pulse-scale">
                      {data.height || "66"} <span className="text-3xl text-slate-600 dark:text-slate-400">in</span>
                    </div>
                    <div className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                      {Math.floor((Number.parseFloat(data.height) || 66) / 12)}'
                      {(Number.parseFloat(data.height) || 66) % 12}"
                    </div>
                  </div>
                </div>

                {/* Alternative Input */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Or type here"
                    value={data.height}
                    onChange={(e) => setData({ ...data, height: e.target.value })}
                    className="text-center text-xl py-6"
                    step="0.1"
                  />
                  <div className="flex items-center text-xl font-semibold px-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    in
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Age with Interactive Slider */}
          {currentStep === "age" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">How old are you?</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  We use this for personalized recommendations
                </p>
              </div>

              <div className="max-w-sm mx-auto space-y-8">
                {/* Interactive Slider */}
                <div className="space-y-4">
                  <input
                    type="range"
                    min="13"
                    max="120"
                    step="1"
                    value={data.age || "25"}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    className="slider-track w-full"
                  />
                  <div className="text-6xl font-bold text-purple-600 animate-pulse-scale">{data.age || "25"}</div>
                </div>

                {/* Alternative Input */}
                <Input
                  type="number"
                  placeholder="Or type here"
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  className="text-center text-xl py-6"
                />
              </div>
            </div>
          )}

          {/* Step: Activity Level */}
          {currentStep === "activity" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">What's your activity level?</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">How active are you in a typical day?</p>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                {[
                  { value: "sedentary", label: "😴 Sedentary", desc: "Little or no exercise" },
                  { value: "light", label: "🚶 Light", desc: "1-3 days per week" },
                  { value: "moderate", label: "🏃 Moderate", desc: "3-5 days per week" },
                  { value: "very-active", label: "⚡ Very Active", desc: "6-7 days per week" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, activityLevel: option.value })}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left transform hover:scale-105 ${
                      data.activityLevel === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg scale-105"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.label}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Profile */}
          {currentStep === "profile" && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Create your profile</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">One last step to get started</p>
              </div>

              <div className="max-w-sm mx-auto space-y-4">
                <div className="text-left space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="py-6 text-base"
                  />
                </div>

                <div className="text-left space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="py-6 text-base"
                  />
                </div>
              </div>

              {/* Summary Preview */}
              <div className="max-w-sm mx-auto p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-3">
                <h3 className="font-semibold mb-4">Your Journey Ahead:</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Goal:</span>
                  <span className="font-medium capitalize">{data.goal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Weight to Gain:</span>
                  <span className="font-medium">
                    {data.goalWeight && data.currentWeight
                      ? `+${Number.parseFloat(data.goalWeight) - Number.parseFloat(data.currentWeight)} lbs`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Activity Level:</span>
                  <span className="font-medium capitalize">{data.activityLevel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 text-sm text-center font-medium animate-slide-in">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12 justify-center">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStepIndex === 0}
            className="px-8 py-6 text-base bg-transparent"
          >
            Back
          </Button>
          <Button 
            onClick={goNext} 
            disabled={loading} 
            className="px-8 py-6 text-base min-w-32 bg-red-600/80 hover:bg-red-600 text-white font-black uppercase border-2 border-red-600/60 hover:border-red-600"
          >
            {loading ? "Creating..." : isLastStep ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </main>
  )
}
