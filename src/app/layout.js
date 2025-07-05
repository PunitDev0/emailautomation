import { Jost, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Suspense } from "react";

// Jost Font
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallbacks: true,
});

// Inter Font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallbacks: true,
});

export const metadata = {
  title: {
    default: "SocialSynk - Multi-Social Media & Email Automation Tool",
    template: "%s | SocialSynk",
  },
  description:
    "SocialSynk helps you manage multiple social media platforms and automate email campaigns from a single dashboard. Save time, increase engagement, and streamline your marketing.",
  keywords: [
    "SocialSynk",
    "social media management",
    "email automation",
    "marketing tool",
    "LinkedIn automation",
    "Instagram scheduling",
    "email campaigns",
    "digital marketing",
  ],
  authors: [{ name: "SocialSynk Team", url: "https://www.socialsynk.in" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.socialsynk.in",
  },
  openGraph: {
    title: "SocialSynk - All-in-One Social Media & Email Automation",
    description:
      "Manage your social media and automate email campaigns with SocialSynk. One platform for all your marketing needs.",
    url: "https://www.socialsynk.in",
    siteName: "SocialSynk",
    images: [
      {
        url: "https://www.socialsynk.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SocialSynk Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialSynk - All-in-One Social Media & Email Automation",
    description:
      "Manage your social media and automate email campaigns with SocialSynk. One platform for all your marketing needs.",
    images: ["https://www.socialsynk.in/og-image.jpg"],
    creator: "@SocialSynk",
  },
};

// Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${jost.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-light dark:bg-dark transition-colors duration-300">
        <AuthProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}