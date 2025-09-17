'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/rich-text-editor';
import { DraftDto } from '@/shared/dtos/draft';
import { Label } from '@/components/ui/label';

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
  // Memoize the initial form data to prevent re-initialization on every render
  const initialFormData = useMemo(() => ({
    subject: '',
    body: '',
    sender: '',
    recipients: [],
    cc: '',
    ...initialData,
  }), [initialData]);

  const [formData, setFormData] = useState<Partial<DraftDto>>(initialFormData);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleChange = useCallback((
    field: keyof DraftDto,
    value: string | string[] | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleRecipientsChange = useCallback((value: string) => {
    const recipients = value
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    handleChange('recipients', recipients);
  }, [handleChange]);

  const handleBodyChange = useCallback((content: string) => {
    handleChange('body', content);
  }, [handleChange]);

  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave(formData);
    }
  }, [onSave, formData]);

  const handleSend = useCallback(async () => {
    if (onSend) {
      await onSend(formData);
    }
  }, [onSend, formData]);

  const handleAttachmentUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  }, []);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter((attachment) => attachment.id !== id));
  }, []);

  const handleFileUploadClick = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  // Memoize the recipients display value to prevent unnecessary re-renders
  const recipientsDisplayValue = useMemo(() => {
    return Array.isArray(formData.recipients)
      ? formData.recipients.join(', ')
      : '';
  }, [formData.recipients]);

  // Memoized onChange handlers for input fields
  const handleSenderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('sender', e.target.value);
  }, [handleChange]);

  const handleCcChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('cc', e.target.value);
  }, [handleChange]);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('subject', e.target.value);
  }, [handleChange]);

  const handleRecipientsInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleRecipientsChange(e.target.value);
  }, [handleRecipientsChange]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sender">From</Label>
          <Input
            id="sender"
            placeholder="name@domain.com"
            value={formData.sender || ''}
            onChange={handleSenderChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipients">To</Label>
          <Input
            id="recipients"
            placeholder="recipient@domain.com, other@domain.com"
            value={recipientsDisplayValue}
            onChange={handleRecipientsInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cc">CC</Label>
          <Input
            id="cc"
            placeholder="optional@domain.com"
            value={formData.cc || ''}
            onChange={handleCcChange}
          />
        </div>
        <div className="space-y-2 md:col-span-1 md:[grid-column:_1/-1]">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Write a clear, concise subject"
            value={formData.subject || ''}
            onChange={handleSubjectChange}
          />
        </div>
      </div>
      <RichTextEditor
        initialContent={formData.body || ''}
        onChange={handleBodyChange}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
      />
      <div className="flex items-center justify-between">
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
            variant="outline"
            onClick={handleFileUploadClick}
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
