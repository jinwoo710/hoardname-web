'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Megaphone,
  Dices,
  ShoppingBag,
  User,
  LayoutGrid,
  Lock,
  Mail,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface SideBarItemProps {
  icon: LucideIcon;
  title: string;
  href: string;
  onClose?: () => void;
  muted?: boolean;
}

function SideBarItem({
  icon: Icon,
  title,
  href,
  onClose,
  muted,
}: SideBarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex h-11 w-full items-center space-x-2 rounded-lg px-4 hover:bg-muted',
        muted && 'text-muted-foreground'
      )}
      onClick={onClose}
    >
      <Icon className="size-5" />
      <span>{title}</span>
    </Link>
  );
}

interface SideBarProps {
  onClose?: () => void;
}

export default function SideBar({ onClose }: SideBarProps) {
  const { data: session } = useSession();

  return (
    <div className="sticky flex w-full shrink-0 flex-col items-center space-y-1 overflow-y-auto p-4 lg:h-[calc(100vh-60px)]">
      <SideBarItem
        icon={Megaphone}
        title="공지사항"
        href="/notice"
        onClose={onClose}
      />
      <SideBarItem
        icon={Dices}
        title="게임 리스트"
        href="/game"
        onClose={onClose}
      />
      <SideBarItem
        icon={ShoppingBag}
        title="중고 장터"
        href="/shop"
        onClose={onClose}
      />
      {session && (
        <>
          <SideBarItem
            icon={User}
            title="회원 정보"
            href="/user"
            onClose={onClose}
          />
          <SideBarItem
            icon={LayoutGrid}
            title="My 게임"
            href="/userGame"
            onClose={onClose}
          />
          <SideBarItem
            icon={Lock}
            title="My 장터"
            href="/userShop"
            onClose={onClose}
          />
        </>
      )}
      <SideBarItem
        icon={Mail}
        title="버그/문의"
        href="/email"
        onClose={onClose}
      />
      <SideBarItem
        icon={ScrollText}
        title="패치 노트"
        href="/patchNotes"
        onClose={onClose}
        muted
      />
    </div>
  );
}
