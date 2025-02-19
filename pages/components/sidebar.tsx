"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pencil, FileText, Settings, ChevronDown, ChevronRight } from 'lucide-react'
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
              <Link href="/settings/mailgun" className={cn("block p-2 hover:bg-gray-200 rounded", pathname === "/settings/mailgun" && "bg-gray-200")}>
                MailGun
              </Link>
              <Link href="/settings/sendgrid" className={cn("block p-2 hover:bg-gray-200 rounded", pathname === "/settings/sendgrid" && "bg-gray-200")}>
                SendGrid
              </Link>
              <Link href="/settings/aws-ses" className={cn("block p-2 hover:bg-gray-200 rounded", pathname === "/settings/aws-ses" && "bg-gray-200")}>
                AWS SES
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

