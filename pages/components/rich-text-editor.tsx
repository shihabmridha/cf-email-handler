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
}

export function RichTextEditor({
  initialContent = '',
  onChange,
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Only trigger onChange when content changes, not when the onChange function itself changes
  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content]);

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

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <textarea
          className="w-full min-h-[200px] p-4 focus:outline-none border rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <input
          type="file"
          multiple
          onChange={handleAttachmentUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Attach Files
        </label>
      </div>
      {attachments.length > 0 && (
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-2">Attachments:</h3>
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
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
