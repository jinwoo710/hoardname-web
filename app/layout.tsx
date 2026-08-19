import './globals.css';
import { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';

import { cn } from '@/lib/utils';

import Header from './components/Header';
import SideBar from './components/Sidebar';
import Footer from './components/Footer';
import { Providers } from './providers';
import { KakaoWebViewPopup } from './components/KakaoWebViewPopup';
import { BottomNav } from './components/common/BottomNav';
import { pretendard } from './fonts';

export const metadata: Metadata = {
  title: '호드네임 보드게임 페이지',
  description: 'made by 지누',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn('font-sans', pretendard.variable)}>
      <body className="antialiased mx-auto w-full max-w-screen-md lg:max-w-screen-xl bg-background text-foreground min-h-screen">
        <Providers>
          <KakaoWebViewPopup />
          <Header />
          <Toaster position="top-center" />
          <div className="flex flex-col lg:flex-row w-full">
            <aside className="hidden lg:block lg:w-[220px] lg:flex-shrink-0">
              <SideBar />
            </aside>
            <main className="flex-grow">{children}</main>
          </div>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
