// lib/meetings-db.ts
import { neon } from '@neondatabase/serverless';
import { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

// ===================== EXISTING GET FUNCTIONS (unchanged) =====================
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

  const countResult = await sql`
    SELECT COUNT(*) FROM meetings ${whereClause ? sql`${whereClause}` : sql``}
  `;
  const total = parseInt(countResult[0].count);

  const rows = await sql`
    SELECT * FROM meetings
    ${whereClause ? sql`${whereClause}` : sql``}
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

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

// ===================== LIVE MUTATIONS =====================

export async function addMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  const {
    date, type, presiding, conducting, hymns, prayers,
    speakers, announcements, wardBusiness, stakeBusiness, musicalNumbers
  } = meeting;

  // Extract hymn and prayer values
  const [openingHymn, sacramentHymn, closingHymn] = hymns;
  const openingPrayer = prayers.opening;
  const closingPrayer = prayers.closing;

  const result = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting,
      opening_hymn, sacrament_hymn, closing_hymn,
      opening_prayer, closing_prayer,
      speakers, announcements, ward_business, stake_business, musical_numbers
    ) VALUES (
      ${date}, ${type}, ${presiding}, ${conducting},
      ${openingHymn}, ${sacramentHymn}, ${closingHymn},
      ${openingPrayer}, ${closingPrayer},
      ${speakers}, ${announcements}, ${wardBusiness}, ${stakeBusiness}, ${musicalNumbers}
    )
    RETURNING *;
  `;

  const row = result[0];
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

export async function updateMeeting(id: number, meeting: Partial<Omit<SacramentMeeting, 'id'>>): Promise<SacramentMeeting> {
  // Build dynamic SET clause – map camelCase fields to snake_case columns
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Special handling for nested fields
  if (meeting.date !== undefined) {
    fields.push(`date = $${paramIndex++}`);
    values.push(meeting.date);
  }
  if (meeting.type !== undefined) {
    fields.push(`meeting_type = $${paramIndex++}`);
    values.push(meeting.type);
  }
  if (meeting.presiding !== undefined) {
    fields.push(`presiding = $${paramIndex++}`);
    values.push(meeting.presiding);
  }
  if (meeting.conducting !== undefined) {
    fields.push(`conducting = $${paramIndex++}`);
    values.push(meeting.conducting);
  }
  if (meeting.hymns !== undefined) {
    const [opening, sacrament, closing] = meeting.hymns;
    fields.push(`opening_hymn = $${paramIndex++}`);
    values.push(opening || null);
    fields.push(`sacrament_hymn = $${paramIndex++}`);
    values.push(sacrament || null);
    fields.push(`closing_hymn = $${paramIndex++}`);
    values.push(closing || null);
  }
  if (meeting.prayers !== undefined) {
    fields.push(`opening_prayer = $${paramIndex++}`);
    values.push(meeting.prayers.opening || null);
    fields.push(`closing_prayer = $${paramIndex++}`);
    values.push(meeting.prayers.closing || null);
  }
  if (meeting.speakers !== undefined) {
    fields.push(`speakers = $${paramIndex++}`);
    values.push(meeting.speakers);
  }
  if (meeting.announcements !== undefined) {
    fields.push(`announcements = $${paramIndex++}`);
    values.push(meeting.announcements);
  }
  if (meeting.wardBusiness !== undefined) {
    fields.push(`ward_business = $${paramIndex++}`);
    values.push(meeting.wardBusiness);
  }
  if (meeting.stakeBusiness !== undefined) {
    fields.push(`stake_business = $${paramIndex++}`);
    values.push(meeting.stakeBusiness);
  }
  if (meeting.musicalNumbers !== undefined) {
    fields.push(`musical_numbers = $${paramIndex++}`);
    values.push(meeting.musicalNumbers);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  // Add id as last parameter
  values.push(id);

  const query = `
    UPDATE meetings
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;

  const result = await sql.query(query, values);
  const row = result[0];
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

export async function deleteMeeting(id: number): Promise<void> {
  await sql`DELETE FROM meetings WHERE id = ${id};`;
}