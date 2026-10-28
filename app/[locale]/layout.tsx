import { localeConfig } from '@/lib/i18n/config';
import type { Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const config = localeConfig[loc];

  return (
    <html lang={loc} dir={config.direction}>
      <body>
        {children}
      </body>
    </html>
  );
}

