import { ar } from './ar';
import { en } from './en';
import type { Dictionary } from './dictionary';

export const dictionaries: Record<string, Dictionary> = {
  ar,
  en,
};

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

