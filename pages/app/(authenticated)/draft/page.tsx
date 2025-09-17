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
import { PageHeader } from '@/components/page-header';

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
      <div className="py-6 space-y-6">
        <PageHeader
          title="Drafts"
          description="Manage your saved drafts"
          actions={
            <Button
              variant="default"
              onClick={handleNew}
              className="cursor-pointer"
            >
              New Draft
            </Button>
          }
        />

        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="max-h-[70vh] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/30 backdrop-blur-md z-10">
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
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span>{draft.subject}</span>
                      </div>
                    </TableCell>
                    <TableCell>{draft.sender || '-'}</TableCell>
                    <TableCell>
                      {Array.isArray(draft.recipients) &&
                        draft.recipients.length > 0
                        ? draft.recipients.join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell>{draft.cc || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <time className="text-xs">
                        {new Date(draft.updatedAt).toLocaleDateString()}
                      </time>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(draft)}
                          className="cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteDraft(draft.id)}
                          className="cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {drafts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-foreground">No drafts found</h3>
                          <p className="text-xs text-muted-foreground mt-1">Create your first draft to get started</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
