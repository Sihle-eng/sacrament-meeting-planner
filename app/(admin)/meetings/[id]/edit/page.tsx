import { getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';
import EditMeetingForm from './EditMeetingForm';

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    notFound(); // invalid ID (not a number)
  }

  const meeting = await getMeetingById(id);
  if (!meeting) {
    notFound();
  }

  return <EditMeetingForm meeting={meeting} />;
}