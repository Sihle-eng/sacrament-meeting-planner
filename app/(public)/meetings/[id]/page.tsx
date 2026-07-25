import { getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function MeetingDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  let meeting;
  try {
    meeting = await getMeetingById(id);
  } catch (error) {
    // ✅ No `any` – using unknown
    console.error('Failed to fetch meeting:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return (
      <div className="p-4 text-red-600">
        <h2>Error loading meeting</h2>
        <p>{message}</p>
        <Link href="/meetings">Back to meetings</Link>
      </div>
    );
  }

  if (!meeting) notFound();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{meeting.type}</h1>
      <p>Date: {meeting.date}</p>
      <p>Presiding: {meeting.presiding || '—'}</p>
      {/* ... rest of meeting details */}
    </div>
  );
}