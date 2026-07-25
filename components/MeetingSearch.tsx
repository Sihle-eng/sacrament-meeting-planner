
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function MeetingSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Read query from URL
  const query = searchParams.get('query') ?? '';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams);
      const value = e.target.value;
      if (value) {
        params.set('query', value);
      } else {
        params.delete('query');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <input
      type="search"
      value={query}
      onChange={handleChange}
      placeholder="Search meetings..."
      className="border rounded px-3 py-2 w-full max-w-sm"
    />
  );
}