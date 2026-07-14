import { NextRequest, NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idParam = params.id;

  // Check for non-numeric ID -> 400
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid meeting ID. ID must be a number.' },
      { status: 400 }
    );
  }

  const meeting = getMeetingById(id);

  // Check for not found -> 404
  if (!meeting) {
    return NextResponse.json(
      { error: `Meeting with ID ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(meeting);
}