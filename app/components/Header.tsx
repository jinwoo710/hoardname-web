import Link from 'next/link';

import { AuthMenu } from './common/AuthMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          HoardName
        </Link>
        <div className="hidden lg:flex">
          <AuthMenu variant="inline" />
        </div>
      </div>
    </header>
  );
}
