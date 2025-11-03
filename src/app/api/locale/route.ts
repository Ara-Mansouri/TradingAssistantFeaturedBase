// src/app/api/locale/route.ts
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  const {locale} = await req.json();
  const locales = ['en', 'fa', 'fr'];
  if (!locales.includes(locale)) {
    return NextResponse.json({error: 'Unsupported locale'}, {status: 400});
  }

  const res = new NextResponse(null, {status: 204});
  res.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 180
  });
  return res;
}
