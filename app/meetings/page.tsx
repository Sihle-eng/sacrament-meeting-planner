import  MeetingCard  from '@/components/MeetingCard';
import { SacramentMeeting } from '@/lib/types';

export default async function MeetingsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });

  if (!res.ok) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-red-600">Failed to load meetings</h2>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  const meetings: SacramentMeeting[] = await res.json();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upcoming Meetings</h1>
      {meetings.length === 0 ? (
        <p className="text-gray-500">No meetings scheduled.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}