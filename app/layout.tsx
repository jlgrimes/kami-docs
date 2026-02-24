import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kamiui.com'),
  title: {
    default: 'Kami UI — Mobile-first React UI for Capacitor',
    template: '%s · Kami UI',
  },
  description:
    'Kami UI is a mobile-first React component library for Capacitor and web apps, with iOS-style interactions, sheets, toggles, and navigation primitives.',
  keywords: [
    'React UI library',
    'Capacitor UI',
    'mobile React components',
    'iOS style components',
    'Kami UI',
  ],
  openGraph: {
    title: 'Kami UI',
    description:
      'Mobile-first React UI for Capacitor and modern web apps.',
    url: 'https://kamiui.com',
    siteName: 'Kami UI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kami UI',
    description:
      'Mobile-first React UI for Capacitor and modern web apps.',
  },
  alternates: {
    canonical: 'https://kamiui.com',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
