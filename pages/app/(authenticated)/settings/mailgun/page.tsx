import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function MailgunSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">MailGun Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="mailgun-api">API Key</Label>
        <Input id="mailgun-api" type="password" placeholder="Enter MailGun API Key" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailgun-domain">Domain</Label>
        <Input id="mailgun-domain" placeholder="Enter MailGun Domain" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailgun-host">SMTP Host</Label>
        <Input id="mailgun-host" placeholder="Enter SMTP Host" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailgun-port">SMTP Port</Label>
        <Input id="mailgun-port" placeholder="Enter SMTP Port" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailgun-username">SMTP Username</Label>
        <Input id="mailgun-username" placeholder="Enter SMTP Username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailgun-password">SMTP Password</Label>
        <Input id="mailgun-password" type="password" placeholder="Enter SMTP Password" />
      </div>
      <Button>Save MailGun Settings</Button>
    </div>
  )
}

