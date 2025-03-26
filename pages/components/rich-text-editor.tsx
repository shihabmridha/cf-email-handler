'use client';

import { useState, useEffect } from 'react';
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

  // Only trigger onChange when content changes, not when the onChange function itself changes
  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content]);

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <textarea
          className="w-full min-h-[200px] p-4 focus:outline-none border rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {attachments.length > 0 && (
        <div className="border rounded-md p-4 bg-card">
          <h3 className="font-semibold mb-2">Attachments:</h3>
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between bg-muted p-2 rounded"
              >
                <span className="text-foreground">{attachment.name}</span>
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
