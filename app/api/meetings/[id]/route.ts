import { NextRequest, NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check for non-numeric ID -> 400
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return NextResponse.json(
      { error: 'Invalid meeting ID. ID must be a number.' },
      { status: 400 }
    );
  }

  const meeting = getMeetingById(meetingId);

  // Check for not found -> 404
  if (!meeting) {
    return NextResponse.json(
      { error: `Meeting with ID ${meetingId} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(meeting);
}