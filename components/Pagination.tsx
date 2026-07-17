'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={() => replace(createPageURL(currentPage - 1))}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage <= 1
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="flex items-center text-sm text-gray-700">
          Page <span className="mx-1 font-semibold">{currentPage}</span> of{' '}
          <span className="mx-1 font-semibold">{totalPages}</span>
        </span>
        <button
          onClick={() => replace(createPageURL(currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage >= totalPages
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}