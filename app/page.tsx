// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        Welcome to the <span className="text-blue-700">Sacrament Planner</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        View upcoming sacrament meetings, speakers, hymns, prayers, and ward business all in one place.
      </p>
      <Link
        href="/meetings"
        className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition text-lg font-medium shadow-md hover:shadow-lg"
      >
        Browse Meetings →
      </Link>
    </div>
  );
}