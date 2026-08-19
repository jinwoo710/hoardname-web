'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  contentTestId?: string;
  closeTestId?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  className,
  contentTestId,
  closeTestId,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid={contentTestId}
        showCloseButton={false}
        className={cn(
          'sm:max-w-lg w-full max-h-[90vh] overflow-y-auto p-0 gap-0',
          className
        )}
      >
        <DialogHeader className="relative border-b px-4 py-4">
          <DialogTitle className="text-center text-base font-semibold">
            {title}
          </DialogTitle>
          <DialogClose
            data-testid={closeTestId}
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 size-11 -translate-y-1/2"
                aria-label="닫기"
              />
            }
          >
            <X className="size-4" />
            <span className="sr-only">닫기</span>
          </DialogClose>
        </DialogHeader>
        <div className="px-4 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
