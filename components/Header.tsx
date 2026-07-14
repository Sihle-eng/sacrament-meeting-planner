import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">⛪</span>
          <span className="text-xl font-bold text-gray-800">Sacrament Planner</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}