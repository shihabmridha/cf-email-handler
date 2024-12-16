import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/rich-text-editor"
import { EmailProviderDropdown } from "@/components/email-provider-dropdown"

export default function ComposePage() {
  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Compose Email</h1>
      <Input placeholder="From" />
      <Input placeholder="To" />
      <Input placeholder="CC" />
      <Input placeholder="Subject" />
      <RichTextEditor />
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button>Send</Button>
          <Button variant="outline">Save as Draft</Button>
        </div>
        <EmailProviderDropdown />
      </div>
    </div>
  )
}

