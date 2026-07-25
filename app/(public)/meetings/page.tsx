import { getMeetings } from '@/lib/meetings-db';
import Link from 'next/link';
import { deleteMeeting } from '@/lib/actions';
import MeetingSearch from '@/components/MeetingSearch';

// Helper to format date safely
function formatDate(date: string | Date): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || '';
  const page = parseInt(params.page || '1', 10);

  let meetingsData;
  try {
    meetingsData = await getMeetings(query, page, 5);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return (
      <div className="p-4 text-red-600">
        <h2>Error loading meetings</h2>
        <p>{message}</p>
      </div>
    );
  }

  const { meetings, total } = meetingsData;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sacrament Meetings</h1>
        <Link href="/meetings/new/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create New
        </Link>
      </div>

      <MeetingSearch />

      {meetings.length === 0 ? (
        <p>No meetings found.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{meeting.type}</h2>
                <p className="text-sm text-gray-600">
                  {formatDate(meeting.date)} {/* ✅ format date */}
                </p>
                <p>Conducting: {meeting.conducting || '—'}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/meetings/${meeting.id}/edit`} className="text-blue-600 underline">
                  Edit
                </Link>
                <form action={deleteMeeting.bind(null, meeting.id)}>
                  <button type="submit" className="text-red-600 underline">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 text-sm">Total: {total} meetings</div>
    </div>
  );
}