import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

export default async function MeetingsPage() {
  // Directly import data - NO fetch() needed!
  const meetings = getMeetings();

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