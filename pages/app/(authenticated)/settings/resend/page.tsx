import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ResendSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resend Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="resend-api">API Key</Label>
        <Input id="resend-api" type="password" placeholder="Enter Resend API Key" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resend-domain">Domain</Label>
        <Input id="resend-domain" placeholder="Enter Domain" />
      </div>
      <Button>Save Resend Settings</Button>
    </div>
  )
}
