import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexProvider";
import AccessProvider from "@/components/providers/AccessProvider";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Śpiewnik",
  description: "Śpiewnik na każdą okazję!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" closeButton />
          <ConvexClientProvider>
            <AccessProvider>
              <Header />
              {children}
            </AccessProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
