'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/rich-text-editor';
import { DraftDto } from '@/shared/dtos/draft';

interface Attachment {
  id: string;
  name: string;
}

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
  const [attachments, setAttachments] = useState<Attachment[]>([]);

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

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
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
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
      />
      <div className="flex justify-between items-center">
        <div>
          {onSave && (
            <Button
              variant="outline"
              onClick={handleSave}
              className="cursor-pointer"
            >
              Save as Draft
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <input
            type="file"
            multiple
            onChange={handleAttachmentUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="default"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="cursor-pointer"
          >
            Attach Files
          </Button>
          {onSend && (
            <Button onClick={handleSend} className="cursor-pointer">
              Send
            </Button>
          )}
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
