import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AwsSesSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">AWS SES Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="aws-ses-key">Access Key</Label>
        <Input id="aws-ses-key" type="password" placeholder="Enter AWS SES Access Key" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aws-ses-secret">Secret Key</Label>
        <Input id="aws-ses-secret" type="password" placeholder="Enter AWS SES Secret Key" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aws-ses-region">Region</Label>
        <Input id="aws-ses-region" placeholder="Enter AWS Region" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aws-ses-host">SMTP Host</Label>
        <Input id="aws-ses-host" placeholder="Enter SMTP Host" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="aws-ses-port">SMTP Port</Label>
        <Input id="aws-ses-port" placeholder="Enter SMTP Port" />
      </div>
      <Button>Save AWS SES Settings</Button>
    </div>
  )
}

