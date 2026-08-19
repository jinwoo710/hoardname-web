'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import SideBar from './Sidebar';
import { AuthMenu } from './common/AuthMenu';

interface MobileSidebarProps {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({
  isMobileMenuOpen,
  onClose,
}: MobileSidebarProps) {
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-72 flex-col p-0">
        <SheetHeader className="border-b">
          <SheetTitle>메뉴</SheetTitle>
        </SheetHeader>
        <SideBar onClose={onClose} />
        <div className="mt-auto border-t p-4">
          <AuthMenu variant="block" onNavigate={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
