"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function EmailProviderDropdown() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Provider" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mailtrap">Mailtrap</SelectItem>
        <SelectItem value="resend">Resend</SelectItem>
      </SelectContent>
    </Select>
  )
}

