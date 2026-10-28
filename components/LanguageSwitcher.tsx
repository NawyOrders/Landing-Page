'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeConfig } from '@/lib/i18n/config';

export default function LanguageSwitcher({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale || !locales.includes(newLocale)) return;

    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax${secure}`;

    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push('/' + segments.join('/'));
  };

  return (
    <div className={className} role="group" aria-label="Language switcher">
      {locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            className={`lang-btn${isActive ? ' is-active' : ''}`}
            aria-pressed={isActive}
            aria-label={`Switch to ${localeConfig[loc as keyof typeof localeConfig]?.name ?? loc}`}
            lang={loc}
          >
            {loc === 'ar' ? 'عربي' : 'EN'}
          </button>
        );
      })}
    </div>
  );
}
