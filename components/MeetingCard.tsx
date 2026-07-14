import Link from 'next/link';
import { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-800">{formattedDate}</h3>
        <p className="text-sm text-gray-500">Type: {meeting.type}</p>
        <p className="text-sm text-gray-500">Presiding: {meeting.presiding}</p>
        <p className="mt-3 inline-block text-blue-600 hover:underline">View Details →</p>
      </div>
    </Link>
  );
}