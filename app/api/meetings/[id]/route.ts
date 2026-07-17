import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }
  const meeting = await getMeetingById(id);
  if (!meeting) {
    return new Response('Not found', { status: 404 });
  }
  return Response.json(meeting);
}