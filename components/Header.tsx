import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/church-logo.svg" // You need to add this SVG or replace with a PNG in /public
            alt="Church Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-gray-800">Sacrament Planner</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}