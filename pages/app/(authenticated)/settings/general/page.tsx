import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">General Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="signature">Signature</Label>
        <Textarea 
          id="signature" 
          placeholder="Enter your email signature" 
          className="min-h-[100px]"
        />
      </div>
      <Button>Save General Settings</Button>
    </div>
  )
}

