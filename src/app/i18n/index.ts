import 'server-only';

const dictionaries: {[key: string]: () => Promise<any>} = {
  en: () => import('./dictionaries/en.json').then(module => module.default),
  hi: () => import('./dictionaries/hi.json').then(module => module.default),
};

export const getDictionary = async (locale: string) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  // fallback to en
  return dictionaries['en']();
};

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'hi'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
