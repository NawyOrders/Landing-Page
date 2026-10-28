import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/500.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/800.css';
import '@fontsource/yellowtail/400.css';
import '../globals.css';
import ScrollReveal from '../../components/ScrollReveal';
import StartRedirect from '../../components/StartRedirect';
import PwaRegister from '../../components/PwaRegister';
import { localeConfig } from '@/lib/i18n/config';
import { locales, defaultLocale, type Locale } from '@/lib/i18n';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

const baseMetadata: Metadata = {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
  const isArabic = loc === 'ar';

  return {
    ...baseMetadata,
    title: isArabic
      ? 'ناوي أوردرز — مطعمك. طلباتك. كلها في مكان واحد.'
      : baseMetadata.title,
    description: isArabic
      ? 'أدر طلبات مطعمك، بسّط عملياتك اليومية، وقدم تجربة أفضل لعملائك — كل ذلك من منصة واحدة قوية. بدون عمولة، لوحة تحكم ذكية، وتطبيق بهوية مطعمك.'
      : baseMetadata.description,
    alternates: {
      canonical: `/${loc}`,
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
  const config = localeConfig[loc];

  return (
    <html lang={loc} dir={config.direction}>
      <body>
        <a className="skip-link" href="#main">
          {loc === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}
        </a>
        <ScrollReveal />
        <StartRedirect />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
