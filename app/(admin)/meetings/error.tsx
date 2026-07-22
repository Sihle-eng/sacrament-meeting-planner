
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Meeting route error:', error);
  }, [error]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
      <p className="mt-2">{error.message || 'An unexpected error occurred.'}</p>
      <div className="mt-4 space-x-4">
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
        <Link href="/meetings" className="text-blue-600 underline">
          Go back to meetings
        </Link>
      </div>
    </div>
  );
}