import { Metadata } from "next";

const TITLE = "RupeeRush | Money Transfer becomes easier";
const DESCRIPTION = "Send and Recieve money, rushingly fast! ";
const PREVIEW_URL =
  "https://res.cloudinary.com/di0av3xly/image/upload/v1735986671/RupeeRush/banner_rr.png";
const BASE_URL = "https://rupeerush.vercel.app";
const ALT_TITLE = "Take control of your money with RupeeRush";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "RupeeRush",
  twitter: {
    creator: "@RupeeRush",
    title: TITLE,
    description: DESCRIPTION,
    card: "summary_large_image",
    images: [
      {
        url: PREVIEW_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "RupeeRush",
    url: BASE_URL,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: PREVIEW_URL,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  category: "Finance",
  keywords: "RupeeRush, Rupee, Banking, Payment, Transfer, Send, Recieve, Money",
  metadataBase: new URL(BASE_URL),
};
