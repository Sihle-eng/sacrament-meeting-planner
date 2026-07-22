
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold">Meeting Not Found</h2>
      <p className="mt-2">The meeting you are trying to edit does not exist.</p>
      <Link href="/meetings" className="mt-4 inline-block text-blue-600 underline">
        Go back to meetings
      </Link>
    </div>
  );
}