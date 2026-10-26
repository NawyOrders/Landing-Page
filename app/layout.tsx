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
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Nawy Orders — Your Restaurant. Your Orders. All in One Place.',
  description:
    'Manage orders, simplify daily operations, and deliver a better customer experience — all from one powerful platform. Zero commission, smart dashboard, and a branded app for your restaurant.',
};

export const viewport: Viewport = {
  themeColor: '#e43820',
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
          {children}
        </UiProvider>
      </body>
    </html>
  );
}
