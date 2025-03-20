"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pencil, FileText, Settings, ChevronDown, ChevronRight, Route } from 'lucide-react'
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="w-64 bg-gray-100 h-full overflow-auto flex-shrink-0">
      <nav className="space-y-2">
        <Link href="/compose" className={cn("flex items-center space-x-2 p-2 hover:bg-gray-200 rounded", pathname === "/compose" && "bg-gray-200")}>
          <Pencil size={20} />
          <span>Compose</span>
        </Link>
        <Link href="/draft" className={cn("flex items-center space-x-2 p-2 hover:bg-gray-200 rounded", pathname === "/draft" && "bg-gray-200")}>
          <FileText size={20} />
          <span>Draft</span>
        </Link>
        <Link href="/routes" className={cn("flex items-center space-x-2 p-2 hover:bg-gray-200 rounded", pathname === "/routes" && "bg-gray-200")}>
          <Route size={20} />
          <span>Routes</span>
        </Link>
        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={cn("flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded", pathname.startsWith("/settings") && "bg-gray-200")}
          >
            <div className="flex items-center space-x-2">
              <Settings size={20} />
              <span>Settings</span>
            </div>
            {settingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {settingsOpen && (
            <div className="ml-4 mt-2 space-y-2">
              <Link href="/settings/general" className={cn("block p-2 hover:bg-gray-200 rounded", pathname === "/settings/general" && "bg-gray-200")}>
                General
              </Link>
              <Link href="/settings/mailtrap" className={cn("block p-2 hover:bg-gray-200 rounded", pathname === "/settings/mailtrap" && "bg-gray-200")}>
                Mailtrap
              </Link>
              <Link href="/settings/resend" className={cn("block p-2 hover:bg-gray-200 rounded", pathname === "/settings/resend" && "bg-gray-200")}>
                Resend
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

