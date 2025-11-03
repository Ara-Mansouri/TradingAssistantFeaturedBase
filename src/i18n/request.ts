import { getRequestConfig } from "next-intl/server";
import { AppLocale, defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale: AppLocale =
    locale && locales.includes(locale as AppLocale)
      ? (locale as AppLocale)
      : defaultLocale;

  try {
    return {
      locale: normalizedLocale,
      messages: (await import(`./messages/${normalizedLocale}.json`)).default,
    };
  } catch {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default,
    };
  }
});