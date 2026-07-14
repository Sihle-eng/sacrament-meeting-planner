import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { SacramentMeeting } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    notFound();
  }

  // Use a relative URL - works on localhost and Vercel
  const res = await fetch(`/api/meetings/${meetingId}`, { cache: 'no-store' });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Failed to load meeting details.');
  }

  const meeting: SacramentMeeting = await res.json();

  return <MeetingDetail meeting={meeting} />;
}