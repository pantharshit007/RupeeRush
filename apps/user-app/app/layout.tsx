import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import { UseProvider } from "@/hooks/UseProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UseProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <div className="h-full">{children}</div>
        </body>
      </UseProvider>
    </html>
  );
}
