import '@/app/ui/global.css';
import type { Metadata } from "next";
import { notoSansTC } from '@/app/ui/fonts';
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { customTheme } from "./theme";
import { twMerge } from "tailwind-merge";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { SidebarProvider } from "@/app/lib/sidebar-context";
import { DashboardNavbar } from "@/app/ui/dashboard/navbar";
import { DashboardSidebar } from "@/app/ui/dashboard/sidebar";
import { sidebarCookie } from "@/app/lib/sidebar-cookie";
import { LayoutContent } from "@/app/lib/layout-content";
import { SessionProvider } from "next-auth/react";
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Dashboard Description",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await auth();
  let isLoginPage = true;
  if(session?.user){
    isLoginPage = false;
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <ThemeModeScript />
      </head>
      <body className={twMerge("bg-gray-50 dark:bg-gray-900", notoSansTC.className)}>
            <NextIntlClientProvider messages={messages}>
              <Flowbite theme={{ theme: customTheme }}>
                {isLoginPage ? (
                  <div className="flex justify-center items-center min-h-screen">
                    {children}
                  </div>
                ) : (
                  <SessionProvider>
                    <SidebarProvider initialCollapsed={(await sidebarCookie.get()).isCollapsed}>
                      <DashboardNavbar />
                      <div className="mt-16 flex items-start">
                        <DashboardSidebar />
                        <LayoutContent>{children}</LayoutContent>
                      </div>
                    </SidebarProvider>
                  </SessionProvider>
                )}
              </Flowbite>
            </NextIntlClientProvider>
      </body>
    </html>
  );
}
