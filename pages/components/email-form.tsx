'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DraftDto } from '@/shared/dtos/draft';
import { RichTextEditor } from '@/components/rich-text-editor';

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

const getAttachmentId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export function EmailForm({ initialData, onSave, onSend, onCancel }: EmailFormProps) {
  const subject = initialData?.subject ?? '';
  const body = initialData?.body ?? '';
  const sender = initialData?.sender ?? '';
  const cc = initialData?.cc ?? '';

  const recipients = useMemo(() => {
    if (Array.isArray(initialData?.recipients)) {
      return initialData.recipients;
    }
    return [] as string[];
  }, [initialData?.recipients]);

  const memoizedInitialData = useMemo(
    () => ({
      subject,
      body,
      sender,
      recipients,
      cc,
    }),
    [subject, body, sender, recipients, cc],
  );

  const initialKey = useMemo(
    () =>
      JSON.stringify({
        subject,
        body,
        sender,
        cc,
        recipients: recipients.join(','),
      }),
    [subject, body, sender, cc, recipients],
  );

  const [formData, setFormData] = useState<Partial<DraftDto>>(memoizedInitialData);
  const lastInitialKeyRef = useRef(initialKey);
  const initialDataRef = useRef(memoizedInitialData);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    initialDataRef.current = memoizedInitialData;
  }, [memoizedInitialData]);

  useEffect(() => {
    if (initialKey !== lastInitialKeyRef.current) {
      lastInitialKeyRef.current = initialKey;
      setFormData(initialDataRef.current);
    }
  }, [initialKey]);

  const handleChange = useCallback(
    (field: keyof DraftDto, value: string | string[] | undefined) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleRecipientsChange = useCallback(
    (value: string) => {
      const recipients = value
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);
      handleChange('recipients', recipients);
    },
    [handleChange],
  );

  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave(formData);
    }
  }, [formData, onSave]);

  const handleSend = useCallback(async () => {
    if (onSend) {
      await onSend(formData);
    }
  }, [formData, onSend]);

  const handleAttachmentUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const nextAttachments = Array.from(files).map((file) => ({
      id: getAttachmentId(),
      name: file.name,
    }));

    setAttachments((prev) => [...prev, ...nextAttachments]);
  }, []);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  }, []);

  const handleFileUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const recipientsDisplayValue = useMemo(() => {
    return Array.isArray(formData.recipients)
      ? formData.recipients.join(', ')
      : '';
  }, [formData.recipients]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sender">From</Label>
          <Input
            id="sender"
            placeholder="name@domain.com"
            value={formData.sender || ''}
            onChange={(e) => handleChange('sender', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipients">To</Label>
          <Input
            id="recipients"
            placeholder="recipient@domain.com, other@domain.com"
            value={recipientsDisplayValue}
            onChange={(e) => handleRecipientsChange(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Write a clear, concise subject"
            value={formData.subject || ''}
            onChange={(e) => handleChange('subject', e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cc">CC</Label>
          <Input
            id="cc"
            placeholder="optional@domain.com"
            value={formData.cc || ''}
            onChange={(e) => handleChange('cc', e.target.value)}
          />
        </div>
      </div>
      <RichTextEditor
        initialContent={formData.body || ''}
        onChange={(content) => handleChange('body', content)}
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
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleAttachmentUpload}
            className="hidden"
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
