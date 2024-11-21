import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import { Provider } from "@/components/Provider";
import { Analytics } from "@vercel/analytics/react";
// import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

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
        <Provider session={session}>
          <div className="h-full">
            {children}
            <Analytics />
          </div>
        </Provider>
      </body>
    </html>
  );
}
