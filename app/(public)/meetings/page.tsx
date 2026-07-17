import Link from 'next/link';
import { getMeetings } from '@/lib/meetings-db';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const query = searchParams.query || '';
  const page = Number(searchParams.page) || 1;
  const limit = 5;

  const { meetings, total } = await getMeetings(query, page, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No meetings found.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="p-4 hover:bg-gray-50">
              <Link href={`/meetings/${meeting.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(meeting.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: <span className="capitalize">{meeting.type}</span> • Presiding:{' '}
                      {meeting.presiding}
                    </p>
                    <p className="text-sm text-gray-500">
                      Speakers: {meeting.speakers.map((s: any) => s.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-sm text-blue-600">View →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}