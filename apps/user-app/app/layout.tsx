import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import { Provider, ThemeProvider } from "@/components/Provider";
import { Analytics } from "@vercel/analytics/react";
// import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/common/Toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RupeeRush",
  description: "Send and Recieve money, rushingly fast! ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider session={session}>
            <div className="h-full">{children}</div>
            <Analytics />
          </Provider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
