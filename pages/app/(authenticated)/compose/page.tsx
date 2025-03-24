'use client';

import { EmailForm } from '@/components/email-form';
import { useToast } from '@/components/ui/use-toast';
import { useDrafts } from '@/lib/hooks/useDrafts';
import { DraftDto } from '@/shared/dtos/draft';

export default function ComposePage() {
  const { saveDraft } = useDrafts();
  const { toast } = useToast();

  const handleSave = async (data: Partial<DraftDto>) => {
    try {
      await saveDraft(data as DraftDto);
      toast({
        title: 'Success',
        description: 'Draft saved successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save draft',
        variant: 'destructive',
      });
    }
  };

  const handleSend = async (data: Partial<DraftDto>) => {
    // Implement send functionality
    toast({
      title: 'Info',
      description: 'Send functionality will be implemented in a future update',
    });
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Compose Email</h1>
      <EmailForm onSave={handleSave} onSend={handleSend} />
    </div>
  );
}
