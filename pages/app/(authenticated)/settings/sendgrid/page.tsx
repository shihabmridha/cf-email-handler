import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SendgridSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">SendGrid Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="sendgrid-api">API Key</Label>
        <Input id="sendgrid-api" type="password" placeholder="Enter SendGrid API Key" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sendgrid-host">SMTP Host</Label>
        <Input id="sendgrid-host" placeholder="Enter SMTP Host" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sendgrid-port">SMTP Port</Label>
        <Input id="sendgrid-port" placeholder="Enter SMTP Port" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sendgrid-username">SMTP Username</Label>
        <Input id="sendgrid-username" placeholder="Enter SMTP Username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sendgrid-password">SMTP Password</Label>
        <Input id="sendgrid-password" type="password" placeholder="Enter SMTP Password" />
      </div>
      <Button>Save SendGrid Settings</Button>
    </div>
  )
}

