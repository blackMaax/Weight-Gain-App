"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { 
  LayoutDashboard, 
  TrendingUp, 
  UtensilsCrossed, 
  Users,
  MoreVertical,
  Dumbbell, 
  Trophy, 
  BookOpen, 
  User,
  LogOut
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/calories", label: "Calories", icon: UtensilsCrossed },
    { href: "/weight-tracking", label: "Weight", icon: TrendingUp },
    { href: "/leaderboard", label: "Ranking", icon: Users },
  ]

  const moreLinks = [
    { href: "/workouts", label: "Workouts", icon: Dumbbell },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/profile", label: "Account", icon: User },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
    setMoreMenuOpen(false)
  }

  const isMoreActive = moreLinks.some(link => pathname === link.href)

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-[#E0E0E0] bg-white shadow-lg z-50 safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-around py-2 px-2">
          {mainLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] transition-all font-medium text-xs rounded-xl ${
                  isActive
                    ? "bg-[#C1121F] text-white"
                    : "text-[#669BBC] hover:bg-[#FDF0D5]"
                }`}
              >
                <Icon size={22} className={isActive ? "text-white" : "text-current"} />
                <span className="text-[10px] font-semibold">{link.label}</span>
              </Link>
            )
          })}
          
          {/* More Menu */}
          <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] transition-all font-medium text-xs rounded-xl ${
                  isMoreActive
                    ? "bg-[#C1121F] text-white"
                    : "text-[#669BBC] hover:bg-[#FDF0D5]"
                }`}
              >
                <MoreVertical size={22} />
                <span className="text-[10px] font-semibold">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              side="top" 
              align="end"
              className="mb-2 w-48 bg-white border border-[#E0E0E0] shadow-xl rounded-xl p-2"
            >
              {moreLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      onClick={() => setMoreMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                        isActive
                          ? "bg-[#FDF0D5] text-[#C1121F] font-semibold"
                          : "text-[#003049] hover:bg-[#FDF0D5] font-medium"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator className="my-2 bg-[#E0E0E0]" />
              <DropdownMenuItem asChild>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all w-full text-left text-[#C1121F] hover:bg-[#FDF0D5] font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
