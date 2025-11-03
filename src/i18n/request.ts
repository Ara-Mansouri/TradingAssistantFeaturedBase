import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  const currentLocale = locale ?? 'en';
  try {
    return {
      locale: currentLocale,
      messages: (await import(`../i18n/messages/${currentLocale}.json`)).default
    };
  } catch {
    return {
      locale: 'en',
      messages: (await import('../i18n/messages/en.json')).default
    };
  }
});
