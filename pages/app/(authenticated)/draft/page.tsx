'use client';

import { Button } from '@/components/ui/button';
import { useDrafts } from '@/lib/hooks/useDrafts';
import { DraftDto } from '@/shared/dtos/draft';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DraftPage() {
  const { drafts, loading, error, saveDraft, deleteDraft } = useDrafts();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftDto | null>(null);
  const [formData, setFormData] = useState<Partial<DraftDto>>({
    subject: '',
    body: '',
    sender: '',
    recipients: [],
    cc: '',
    userId: 0,
  });

  const handleSave = async () => {
    try {
      if (!formData.subject) {
        throw new Error('Subject is required');
      }

      const draftToSave: DraftDto = {
        ...formData,
        id: selectedDraft?.id,
        userId: selectedDraft?.userId || formData.userId || 0,
        sender: formData.sender?.trim() || undefined,
        recipients: formData.recipients || [],
        cc: formData.cc?.trim() || undefined,
        body: formData.body?.trim() || undefined,
      } as DraftDto;

      await saveDraft(draftToSave);
      setIsOpen(false);
      setSelectedDraft(null);
      setFormData({
        subject: '',
        body: '',
        sender: '',
        recipients: [],
        cc: '',
        userId: formData.userId,
      });
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

  const handleEdit = (draft: DraftDto) => {
    setSelectedDraft(draft);
    setFormData({
      ...draft,
      sender: draft.sender || '',
      body: draft.body || '',
      recipients: draft.recipients || [],
      cc: draft.cc || '',
    });
    setIsOpen(true);
  };

  const handleNew = () => {
    setSelectedDraft(null);
    setFormData({
      subject: '',
      body: '',
      sender: '',
      recipients: [],
      cc: '',
      userId: formData.userId,
    });
    setIsOpen(true);
  };

  const handleRecipientsChange = (value: string) => {
    const recipients = value
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      recipients,
    }));
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Drafts</h1>
          <Button
            variant="default"
            onClick={handleNew}
            className="cursor-pointer"
          >
            New Draft
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>CC</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell className="font-semibold">
                    {draft.subject}
                  </TableCell>
                  <TableCell>{draft.sender || '-'}</TableCell>
                  <TableCell>
                    {Array.isArray(draft.recipients) &&
                    draft.recipients.length > 0
                      ? draft.recipients.join(', ')
                      : '-'}
                  </TableCell>
                  <TableCell>{draft.cc || '-'}</TableCell>
                  <TableCell>
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(draft)}
                      className="cursor-pointer"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteDraft(draft.id)}
                      className="cursor-pointer"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {drafts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No drafts found. Create a new draft to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDraft ? 'Edit Draft' : 'New Draft'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Enter subject"
                required
              />
            </div>
            <div>
              <Label htmlFor="sender">From</Label>
              <Input
                id="sender"
                value={formData.sender || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sender: e.target.value || undefined,
                  }))
                }
                placeholder="Enter sender email"
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="recipients">To</Label>
              <Input
                id="recipients"
                value={
                  Array.isArray(formData.recipients)
                    ? formData.recipients.join(', ')
                    : ''
                }
                onChange={(e) => handleRecipientsChange(e.target.value)}
                placeholder="Enter recipient emails (comma-separated)"
              />
            </div>
            <div>
              <Label htmlFor="cc">CC</Label>
              <Input
                id="cc"
                value={formData.cc || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cc: e.target.value || undefined,
                  }))
                }
                placeholder="Enter CC email"
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={formData.body || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    body: e.target.value || undefined,
                  }))
                }
                placeholder="Enter email body"
                rows={5}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                className="cursor-pointer"
              >
                {selectedDraft ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
