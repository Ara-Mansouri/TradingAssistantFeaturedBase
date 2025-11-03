export const locales = ["en", "fa", "fr"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";
export const localeCookieName = "locale";
export const localeCookieMaxAge = 60 * 60 * 24 * 365; // 1 