'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmailProviderDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function EmailProviderDropdown({
  value,
  onChange,
}: EmailProviderDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Provider" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mailtrap">Mailtrap</SelectItem>
        <SelectItem value="resend">Resend</SelectItem>
      </SelectContent>
    </Select>
  );
}
