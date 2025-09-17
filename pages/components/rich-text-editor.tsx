'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Attachment {
  id: string;
  name: string;
}

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
}

export function RichTextEditor({
  initialContent = '',
  onChange,
  attachments = [],
  onRemoveAttachment,
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);

  // Memoize the onChange callback to prevent unnecessary re-renders
  const handleContentChange = useCallback((newContent: string) => {
    if (onChange) {
      onChange(newContent);
    }
  }, [onChange]);

  // Only trigger onChange when content changes
  useEffect(() => {
    handleContentChange(content);
  }, [content, handleContentChange]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-background">
        <textarea
          className="w-full min-h-[240px] resize-y rounded-md border-0 p-4 outline-none focus:ring-1 focus:ring-ring"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {attachments.length > 0 && (
        <div className="rounded-md border bg-card p-4">
          <h3 className="mb-2 font-semibold">Attachments</h3>
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between rounded border bg-muted/50 px-3 py-2"
              >
                <span className="truncate pr-2 text-sm text-foreground">
                  {attachment.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAttachment?.(attachment.id)}
                  className="cursor-pointer"
                >
                  <X size={16} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
