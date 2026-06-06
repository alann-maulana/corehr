import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeProvider from "@/components/ui/ThemeProvider";
import ServiceWorkerRegistration from "@/components/ui/ServiceWorkerRegistration";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CoreHR - Sistem Informasi Manajemen HR",
    template: "%s | CoreHR",
  },
  description:
    "Sistem Informasi Manajemen Human Resource untuk pencatatan absensi karyawan, manajemen hari kerja, dan laporan kehadiran.",
  keywords: ["HR", "absensi", "manajemen", "karyawan", "human resource"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CoreHR",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body>
        {/* AppRouterCacheProvider fixes MUI Emotion hydration mismatch in Next.js App Router */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <SessionProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
            <ServiceWorkerRegistration />
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
