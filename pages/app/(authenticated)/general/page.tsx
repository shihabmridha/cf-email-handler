'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useForwardToEmail } from '@/lib/hooks/useForwardToEmail';
import { Skeleton } from '@/components/ui/skeleton';

export default function GeneralSettingsPage() {
  const { email, isLoading, error } = useForwardToEmail();

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">General Settings</h1>

        <div className="space-y-2">
          <Label htmlFor="forwardTo">Forward To Email</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <Input id="forwardTo" value={email} readOnly className="bg-muted" />
          )}
        </div>

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
    </div>
  );
}
