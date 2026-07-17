import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Sacrament Meeting Planner
          </h1>
          <div className="flex gap-4 text-sm">
            <Link href="/meetings" className="text-blue-600 hover:underline">
              Meetings
            </Link>
            <Link href="/meetings/current" className="text-blue-600 hover:underline">
              This Sunday
            </Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl p-4">{children}</main>
    </div>
  );
}