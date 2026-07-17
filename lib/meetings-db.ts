import { neon } from '@neondatabase/serverless';
import { SacramentMeeting } from '@/lib/types';

const sql = neon(process.env.DATABASE_URL!);

// Get meetings with optional search + pagination
export async function getMeetings(
  query?: string,
  page: number = 1,
  limit: number = 5
): Promise<{ meetings: SacramentMeeting[]; total: number }> {
  const offset = (page - 1) * limit;
  let whereClause = '';
  const params: any[] = [];

  if (query) {
    whereClause = `
      WHERE
        meeting_type ILIKE $1
        OR presiding ILIKE $1
        OR conducting ILIKE $1
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
          WHERE speaker->>'name' ILIKE $1
        )
    `;
    params.push(`%${query}%`);
  }

  // Count total
  const countResult = await sql`
    SELECT COUNT(*) FROM meetings ${whereClause ? sql`${whereClause}` : sql``}
  `;
  const total = parseInt(countResult[0].count);

  // Fetch paginated rows
  const rows = await sql`
    SELECT * FROM meetings
    ${whereClause ? sql`${whereClause}` : sql``}
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  // Map DB rows to the existing SacramentMeeting type
  const meetings = rows.map((row: any) => ({
    id: row.id,
    date: row.date,
    type: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    hymns: [row.opening_hymn, row.sacrament_hymn, row.closing_hymn].filter(Boolean),
    prayers: {
      opening: row.opening_prayer,
      closing: row.closing_prayer,
    },
    speakers: row.speakers || [],
    announcements: row.announcements || [],
    wardBusiness: row.ward_business || [],
    stakeBusiness: row.stake_business || false,
    musicalNumbers: row.musical_numbers || [],
  }));

  return { meetings, total };
}

// Get a single meeting by ID
export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT * FROM meetings WHERE id = ${id}
  `;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    date: row.date,
    type: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    hymns: [row.opening_hymn, row.sacrament_hymn, row.closing_hymn].filter(Boolean),
    prayers: {
      opening: row.opening_prayer,
      closing: row.closing_prayer,
    },
    speakers: row.speakers || [],
    announcements: row.announcements || [],
    wardBusiness: row.ward_business || [],
    stakeBusiness: row.stake_business || false,
    musicalNumbers: row.musical_numbers || [],
  };
}

// Stubs for Week 04 (keep these as-is for now)
export async function addMeeting(data: any) {
  // Will be implemented in Week 04
}

export async function updateMeeting(id: number, data: any) {
  // Will be implemented in Week 04
}

export async function deleteMeeting(id: number) {
  // Will be implemented in Week 04
}