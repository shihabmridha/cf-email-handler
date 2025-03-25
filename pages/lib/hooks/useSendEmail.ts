'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { SendMailDto } from '@/shared/dtos/mail';
import { TransportContent } from '@/shared/dtos/transport';
import { DraftDto } from '@/shared/dtos/draft';

export function useSendEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (draft: Partial<DraftDto>, providerConfigId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Convert DraftDto to SendMailDto format
      const content = new TransportContent();
      content.from = draft.sender || '';
      content.fromName = draft.sender?.split('@')[0] || 'User';
      content.to = draft.recipients || [];
      content.cc = draft.cc ? draft.cc.split(',').map(email => email.trim()) : [];
      content.subject = draft.subject || '';
      content.text = draft.body || '';
      content.html = draft.body || '';

      const payload: SendMailDto = {
        providerConfigId,
        content
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(errorData.error || 'Failed to send email');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmail,
    loading,
    error
  };
}