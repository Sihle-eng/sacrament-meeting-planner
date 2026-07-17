import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';

function getThisSunday(): Date {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const diff = day === 0 ? 0 : 7 - day;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + diff);
  return sunday;
}

export default async function CurrentMeetingPage() {
  const thisSunday = getThisSunday();
  const dateString = thisSunday.toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch all meetings (or search by date) to find the one for this Sunday
  const { meetings } = await getMeetings(); // Get all meetings, filter in memory
  const meeting = meetings.find(
    (m) => new Date(m.date).toISOString().split('T')[0] === dateString
  );

  if (meeting) {
    redirect(`/meetings/${meeting.id}`);
  } else {
    // If no meeting is scheduled for this Sunday, redirect to the main list
    redirect('/meetings');
  }
}