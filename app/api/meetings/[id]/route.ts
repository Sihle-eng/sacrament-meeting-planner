import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);

  if (isNaN(meetingId)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    return new Response('Not found', { status: 404 });
  }

  return Response.json(meeting);
}