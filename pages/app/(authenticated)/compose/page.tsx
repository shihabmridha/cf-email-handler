'use client';

import { EmailForm } from '@/components/email-form';
import { EmailProviderDropdown } from '@/components/email-provider-dropdown';
import { useToast } from '@/components/ui/use-toast';
import { useDrafts } from '@/lib/hooks/useDrafts';
import { DraftDto } from '@/shared/dtos/draft';
import { SendMailDto } from '@/shared/dtos/mail';
import { apiClient } from '@/lib/api-client';
import { useState } from 'react';

export default function ComposePage() {
  const { saveDraft } = useDrafts();
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string>('');

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
    try {
      if (!data.sender || !data.recipients?.length || !data.subject) {
        throw new Error('Sender, recipients, and subject are required');
      }

      if (!selectedProvider) {
        throw new Error('Please select an email provider');
      }

      const providerConfigId = parseInt(selectedProvider, 10);
      if (isNaN(providerConfigId)) {
        throw new Error('Invalid provider configuration');
      }

      const sendMailData = new SendMailDto();
      sendMailData.providerConfigId = providerConfigId;
      sendMailData.content.from = data.sender;
      sendMailData.content.fromName = data.sender.split('@')[0];
      sendMailData.content.to = data.recipients;
      if (data.cc) {
        sendMailData.content.cc = [data.cc];
      }
      sendMailData.content.subject = data.subject;
      if (data.body) {
        sendMailData.content.text = data.body;
        sendMailData.content.html = `<div>${data.body}</div>`;
      }

      await apiClient.sendEmail(sendMailData);

      toast({
        title: 'Success',
        description: 'Email sent successfully',
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to send email',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compose Email</h1>
        <EmailProviderDropdown
          value={selectedProvider}
          onChange={setSelectedProvider}
        />
      </div>
      <EmailForm onSave={handleSave} onSend={handleSend} />
    </div>
  );
}
