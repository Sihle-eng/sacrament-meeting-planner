import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';

export default function CurrentMeetingPage() {
  // Find today's Sunday (or the most recent Sunday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const diff = today.getDate() - dayOfWeek;
  const sunday = new Date(today);
  sunday.setDate(diff);
  const dateStr = sunday.toISOString().split('T')[0];

  const meetings = getMeetings(dateStr);

  if (meetings.length > 0) {
    redirect(`/meetings/${meetings[0].id}`);
  } else {
    // Fallback: redirect to the general meetings list
    redirect('/meetings');
  }
}