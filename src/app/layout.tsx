import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { SearchProvider } from "@/components/search/search-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zishan Jawed - Backend Engineer & Fintech Specialist",
    template: "%s | Zishan Jawed"
  },
  description: "Backend engineer specializing in fintech, payment systems, and scalable architecture. Expert in Node.js, Python, and cloud technologies with experience building high-performance systems.",
  keywords: [
    "backend engineer",
    "fintech",
    "payment systems",
    "Node.js",
    "Python",
    "microservices",
    "scalable architecture",
    "cloud computing",
    "AWS",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes"
  ],
  authors: [{ name: "Zishan Jawed" }],
  creator: "Zishan Jawed",
  publisher: "Zishan Jawed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zishanjawed.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zishanjawed.com",
    siteName: "Zishan Jawed",
    title: "Zishan Jawed - Backend Engineer & Fintech Specialist",
    description: "Backend engineer specializing in fintech, payment systems, and scalable architecture. Expert in Node.js, Python, and cloud technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zishan Jawed - Backend Engineer & Fintech Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@zishanjawed",
    creator: "@zishanjawed",
    title: "Zishan Jawed - Backend Engineer & Fintech Specialist",
    description: "Backend engineer specializing in fintech, payment systems, and scalable architecture.",
    images: ["/og-image.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
