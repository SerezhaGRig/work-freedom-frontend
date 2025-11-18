import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/i18n-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title:
    "AshxatanqKa.am — Jobs in Armenia | Ashxatanq | Աշխատանք Հայաստանում",
  description:
    "Job search platform for Armenia. Աշխատանք Հայաստանում. Работа в Армении. Find jobs, hire talent, and explore opportunities. Supports Armenian, Russian, and English.",
  metadataBase: new URL("https://www.ashxatanqka.am"),
  alternates: {
    canonical: "https://www.ashxatanqka.am",
  },
  keywords: [
    "աշխատանք", "աշխատանք Երևանում", "աշխատանք Հայաստանում", "աշխատանք IT",
    "работа Армения", "вакансии Армения", "работа Ереван", "ashxatanq hayastanum",
    "jobs Armenia", "jobs in Armenia", "Armenia jobs", "Yerevan jobs", "IT jobs Armenia",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },

  openGraph: {
    title: "AshxatanqKa.am — Jobs in Armenia",
    description:
      "Find jobs and opportunities in Armenia. Armenian, Russian and English supported.",
    url: "https://www.ashxatanqka.am",
    siteName: "AshxatanqKa.am",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AshxatanqKa.am — Find Jobs in Armenia",
    description:
      "Find job opportunities in Armenia. Supports Armenian, Russian, English.",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        

      <body className={inter.className}> <I18nProvider>{children}</I18nProvider></body>
            

    </html>
  );
}