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
        <SelectItem value="mailgun">MailGun</SelectItem>
        <SelectItem value="sendgrid">SendGrid</SelectItem>
        <SelectItem value="ses">AWS SES</SelectItem>
      </SelectContent>
    </Select>
  )
}

