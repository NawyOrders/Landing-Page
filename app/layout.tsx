import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/yellowtail/400.css';
import './globals.css';
import UiProvider from '../components/UiProvider';
import ScrollReveal from '../components/ScrollReveal';
import PwaRegister from '../components/PwaRegister';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Nawy Orders — Your Restaurant. Your Orders. All in One Place.',
  description:
    'Manage orders, simplify daily operations, and deliver a better customer experience — all from one powerful platform. Zero commission, smart dashboard, and a branded app for your restaurant.',
  applicationName: 'Nawy Orders',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Nawy Orders',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#e43820',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <UiProvider>
          <ScrollReveal />
          <PwaRegister />
          {children}
        </UiProvider>
      </body>
    </html>
  );
}
