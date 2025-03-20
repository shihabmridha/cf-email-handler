import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function MailtrapSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mailtrap Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="mailtrap-host">SMTP Host</Label>
        <Input id="mailtrap-host" placeholder="Enter SMTP Host" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailtrap-port">SMTP Port</Label>
        <Input id="mailtrap-port" placeholder="Enter SMTP Port" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailtrap-username">SMTP Username</Label>
        <Input id="mailtrap-username" placeholder="Enter SMTP Username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mailtrap-password">SMTP Password</Label>
        <Input id="mailtrap-password" type="password" placeholder="Enter SMTP Password" />
      </div>
      <Button>Save Mailtrap Settings</Button>
    </div>
  )
}
