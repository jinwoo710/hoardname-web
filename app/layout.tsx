import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { KakaoWebViewPopup } from "./components/KakaoWebViewPopup";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const metadata: Metadata = {
  title: "호드네임 보드게임 페이지",
  description: "made by 지누",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <html lang="ko">
      <body className="antialiased mx-auto w-full max-w-screen-md lg:max-w-screen-xl text-dark bg-white min-h-screen">
        <QueryClientProvider client={queryClient}>
          <Providers>
            <KakaoWebViewPopup />
            <Header />
            <Toaster position="top-center" />
            <div className="flex flex-col lg:flex-row w-full">
              <aside className="hidden lg:block lg:w-[220px] lg:flex-shrink-0">
                <SideBar />
              </aside>
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}
