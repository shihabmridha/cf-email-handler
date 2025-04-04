'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/lib/hooks/useSettings';
import { SettingKeys } from '@/shared/enums/settings-key';
import { SettingsDto } from '@/shared/dtos/settings.dto';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function GeneralSettingsPage() {
  const {
    forwardTo,
    setForwardTo,
    signature,
    setSignature,
    updateSetting,
    isLoading,
    error,
  } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const forwardToSetting = new SettingsDto();
      forwardToSetting.key = SettingKeys.EMAIL_FORWARD_TO;
      forwardToSetting.value = forwardTo;
      forwardToSetting.description =
        'Default email address to forward emails to';

      const signatureSetting = new SettingsDto();
      signatureSetting.key = SettingKeys.EMAIL_SIGNATURE;
      signatureSetting.value = signature;
      signatureSetting.description =
        'Email signature to be used in outgoing emails';

      await Promise.all([
        updateSetting(forwardToSetting),
        updateSetting(signatureSetting),
      ]);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (saveError) {
      console.error('Failed to save settings:', saveError);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            <Input
              id="forwardTo"
              value={forwardTo}
              onChange={(e) => setForwardTo(e.target.value)}
              placeholder="Enter email address to forward emails to"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature">Signature</Label>
          {isLoading ? (
            <Skeleton className="h-[100px] w-full" />
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <Textarea
              id="signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter your email signature"
              className="min-h-[100px]"
            />
          )}
        </div>

        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? 'Saving...' : 'Save General Settings'}
        </Button>
      </div>
    </div>
  );
}
