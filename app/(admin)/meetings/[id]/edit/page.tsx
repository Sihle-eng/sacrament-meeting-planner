import { getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';
import EditMeetingForm from './EditMeetingForm';

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  // Convert string id to number
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound(); // invalid ID (not a number)
  }

  const meeting = await getMeetingById(id);
  if (!meeting) {
    notFound();
  }

  return <EditMeetingForm meeting={meeting} />;
}