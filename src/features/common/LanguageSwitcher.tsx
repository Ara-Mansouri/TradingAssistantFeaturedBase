// src/features/common/LanguageSwitcher.tsx
'use client';

import {useRouter} from 'next/navigation';
import {useTransition} from 'react';

const supported: Array<{code: 'en' | 'fa' | 'fr'; label: string}> = [
  {code: 'en', label: 'English'},
  {code: 'fa', label: 'فارسی'},
  {code: 'fr', label: 'Français'}
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = async (code: 'en' | 'fa' | 'fr') => {
    await fetch('/api/locale', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({locale: code})
    });
    // Soft refresh (Server Components re-render with new messages),
    // Client Providers remain mounted → context state preserved.
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex gap-2">
      {supported.map(l => (
        <button
          key={l.code}
          onClick={() => changeLocale(l.code)}
          disabled={isPending}
          className="px-3 py-1 rounded border border-white/20 hover:bg-white/10"
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
