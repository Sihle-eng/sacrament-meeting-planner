'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/meetings', label: 'Meetings' },
  ];

  return (
    <nav className="flex gap-6">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-blue-700 ${
              isActive ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}