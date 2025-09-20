'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useDrafts } from '@/lib/hooks/useDrafts';
import { DraftDto } from '@/shared/dtos/draft';
import { PageHeader } from '@/components/page-header';
import { TableEmptyState } from '@/components/table-empty-state';
import { FileText, Loader2 } from 'lucide-react';

const createEmptyDraft = (userId = 0): Partial<DraftDto> => ({
  subject: '',
  body: '',
  sender: '',
  recipients: [],
  cc: '',
  userId,
});

export default function DraftPage() {
  const { drafts, loading, error, saveDraft, deleteDraft, fetchDrafts } =
    useDrafts();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftDto | null>(null);
  const [formData, setFormData] = useState<Partial<DraftDto>>(createEmptyDraft());
  const { toast } = useToast();

  const draftDialogTitle = useMemo(
    () => (selectedDraft ? 'Edit Draft' : 'New Draft'),
    [selectedDraft],
  );

  const resetForm = (userId = formData.userId ?? 0) => {
    setSelectedDraft(null);
    setFormData(createEmptyDraft(userId));
  };

  const handleSave = async () => {
    try {
      if (!formData.subject?.trim()) {
        throw new Error('Subject is required');
      }

      const draftToSave: DraftDto = {
        ...formData,
        id: selectedDraft?.id,
        userId: selectedDraft?.userId ?? formData.userId ?? 0,
        sender: formData.sender?.trim() || undefined,
        recipients: Array.isArray(formData.recipients)
          ? formData.recipients
          : [],
        cc: formData.cc?.trim() || undefined,
        body: formData.body?.trim() || undefined,
      } as DraftDto;

      await saveDraft(draftToSave);
      resetForm(draftToSave.userId);
      setIsOpen(false);
      toast({
        title: 'Draft saved',
        description: 'Your draft has been stored successfully.',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save draft';
      toast({
        title: 'Unable to save draft',
        description: message,
        variant: 'destructive',
      });
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
    resetForm(formData.userId ?? 0);
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

  const handleDelete = async (id: number) => {
    try {
      await deleteDraft(id);
      toast({
        title: 'Draft deleted',
        description: 'The draft has been removed.',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete draft';
      toast({
        title: 'Unable to delete draft',
        description: message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            fetchDrafts().catch(() => {
              /* handled in hook */
            });
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 py-6">
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

        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
          <div className="max-h-[70vh] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/30 backdrop-blur-md">
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
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span>{draft.subject}</span>
                      </div>
                    </TableCell>
                    <TableCell>{draft.sender || '-'}</TableCell>
                    <TableCell>
                      {Array.isArray(draft.recipients) && draft.recipients.length > 0
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
                          className="cursor-pointer opacity-60 transition-opacity group-hover:opacity-100"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(draft.id)}
                          className="cursor-pointer opacity-60 transition-opacity group-hover:opacity-100"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {drafts.length === 0 && (
                  <TableEmptyState
                    colSpan={6}
                    icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                    title="No drafts found"
                    description="Create your first draft to get started"
                  />
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draftDialogTitle}</DialogTitle>
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
                onClick={() => {
                  resetForm();
                  setIsOpen(false);
                }}
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
