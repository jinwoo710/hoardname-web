'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dices, ShoppingBag, LayoutGrid, Lock, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';

import MobileSidebar from '../MobileSidebar';

const items = [
  { href: '/game', label: '게임', icon: Dices },
  { href: '/shop', label: '장터', icon: ShoppingBag },
  { href: '/userGame', label: 'My게임', icon: LayoutGrid },
  { href: '/userShop', label: 'My장터', icon: Lock },
];

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t bg-background pb-[env(safe-area-inset-bottom)] lg:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px]',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground"
        >
          <Menu className="size-5" />
          더보기
        </button>
      </nav>
      <MobileSidebar
        isMobileMenuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
