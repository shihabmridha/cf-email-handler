'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/rich-text-editor';
import { DraftDto } from '@/shared/dtos/draft';

interface EmailFormProps {
  initialData?: Partial<DraftDto>;
  onSave?: (data: Partial<DraftDto>) => Promise<void>;
  onSend?: (data: Partial<DraftDto>) => Promise<void>;
  onCancel?: () => void;
}

export function EmailForm({
  initialData,
  onSave,
  onSend,
  onCancel,
}: EmailFormProps) {
  const [formData, setFormData] = useState<Partial<DraftDto>>({
    subject: '',
    body: '',
    sender: '',
    recipients: [],
    cc: '',
    ...initialData,
  });

  const handleChange = (
    field: keyof DraftDto,
    value: string | string[] | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecipientsChange = (value: string) => {
    const recipients = value
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    handleChange('recipients', recipients);
  };

  const handleBodyChange = (content: string) => {
    handleChange('body', content);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
  };

  const handleSend = async () => {
    if (onSend) {
      await onSend(formData);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="From"
        value={formData.sender || ''}
        onChange={(e) => handleChange('sender', e.target.value)}
      />
      <Input
        placeholder="To"
        value={
          Array.isArray(formData.recipients)
            ? formData.recipients.join(', ')
            : ''
        }
        onChange={(e) => handleRecipientsChange(e.target.value)}
      />
      <Input
        placeholder="CC"
        value={formData.cc || ''}
        onChange={(e) => handleChange('cc', e.target.value)}
      />
      <Input
        placeholder="Subject"
        value={formData.subject || ''}
        onChange={(e) => handleChange('subject', e.target.value)}
      />
      <RichTextEditor
        initialContent={formData.body || ''}
        onChange={handleBodyChange}
      />
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          {onSend && <Button onClick={handleSend}>Send</Button>}
          {onSave && (
            <Button variant="outline" onClick={handleSave}>
              Save as Draft
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
