
import { neon } from '@neondatabase/serverless';
import { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

type MeetingRow = {
  id: number;
  date: string;
  meeting_type: string;
  presiding: string | null;
  conducting: string | null;
  opening_hymn: string | null;
  sacrament_hymn: string | null;
  closing_hymn: string | null;
  opening_prayer: string | null;
  closing_prayer: string | null;
  speakers: unknown[];
  announcements: unknown[];
  ward_business: unknown[];
  stake_business: boolean;
};

function rowToMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    type: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    hymns: [row.opening_hymn, row.sacrament_hymn, row.closing_hymn].filter(Boolean) as string[],
    prayers: {
      opening: row.opening_prayer,
      closing: row.closing_prayer,
    },
    speakers: row.speakers as Array<{ name: string; topic?: string }>,
    announcements: row.announcements as string[],
    wardBusiness: row.ward_business as string[],
    stakeBusiness: row.stake_business,
    musicalNumbers: [],
  };
}

// ---- getMeetings (unchanged, works) ----
export async function getMeetings(
  query?: string,
  page: number = 1,
  limit: number = 5
): Promise<{ meetings: SacramentMeeting[]; total: number }> {
  const offset = (page - 1) * limit;

  let whereClause = '';
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (query) {
    const searchTerm = `%${query}%`;
    whereClause = `
      WHERE
        meeting_type ILIKE $${paramIndex}
        OR presiding ILIKE $${paramIndex}
        OR conducting ILIKE $${paramIndex}
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(speakers) AS speaker
          WHERE speaker->>'name' ILIKE $${paramIndex}
        )
    `;
    params.push(searchTerm);
    paramIndex++;
  }

  const countQuery = `SELECT COUNT(*) FROM meetings ${whereClause}`;
  const countResult = await sql.query(countQuery, params);
  const total = parseInt(countResult[0].count, 10);

  const mainQuery = `
    SELECT * FROM meetings
    ${whereClause}
    ORDER BY date DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  const mainParams = [...params, limit, offset];
  const rows = await sql.query(mainQuery, mainParams);

  const meetings = (rows as MeetingRow[]).map(rowToMeeting);
  return { meetings, total };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = await sql`SELECT * FROM meetings WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToMeeting(rows[0] as MeetingRow);
}

// ---- addMeeting: explicit casts for every parameter ----
export async function addMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  const {
    date, type, presiding, conducting, hymns, prayers,
    speakers, announcements, wardBusiness, stakeBusiness,
  } = meeting;

  const [openingHymn, sacramentHymn, closingHymn] = hymns;
  const openingPrayer = prayers.opening;
  const closingPrayer = prayers.closing;

  const speakersJson = JSON.stringify(speakers);
  const wardBusinessJson = JSON.stringify(wardBusiness);
  const openingHymnJson = openingHymn == null ? null : JSON.stringify(openingHymn);
  const sacramentHymnJson = sacramentHymn == null ? null : JSON.stringify(sacramentHymn);
  const closingHymnJson = closingHymn == null ? null : JSON.stringify(closingHymn);
  const openingPrayerJson = openingPrayer == null ? null : JSON.stringify(openingPrayer);
  const closingPrayerJson = closingPrayer == null ? null : JSON.stringify(closingPrayer);

  const query = `
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting,
      opening_hymn, sacrament_hymn, closing_hymn,
      opening_prayer, closing_prayer,
      speakers, announcements, ward_business, stake_business
    ) VALUES (
      $1::date, $2::text, $3::text, $4::text,
      $5::jsonb, $6::jsonb, $7::jsonb,
      $8::jsonb, $9::jsonb,
      $10::jsonb, $11::text[], $12::jsonb, $13::boolean
    )
    RETURNING *;
  `;

  const result = await sql.query(query, [
    date,
    type,
    presiding,
    conducting,
    openingHymnJson,
    sacramentHymnJson,
    closingHymnJson,
    openingPrayerJson,
    closingPrayerJson,
    speakersJson,
    announcements,
    wardBusinessJson,
    stakeBusiness,
  ]);
  return rowToMeeting(result[0] as MeetingRow);
}

// ---- updateMeeting: explicit casts ----
export async function updateMeeting(id: number, meeting: Partial<Omit<SacramentMeeting, 'id'>>): Promise<SacramentMeeting> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  const addField = (sql: string, value: unknown) => {
    fields.push(sql);
    values.push(value);
    paramIndex++;
  };

  if (meeting.date !== undefined)       addField(`date = $${paramIndex}::date`, meeting.date);
  if (meeting.type !== undefined)       addField(`meeting_type = $${paramIndex}::text`, meeting.type);
  if (meeting.presiding !== undefined)  addField(`presiding = $${paramIndex}::text`, meeting.presiding);
  if (meeting.conducting !== undefined) addField(`conducting = $${paramIndex}::text`, meeting.conducting);

  if (meeting.hymns !== undefined) {
    const [opening, sacrament, closing] = meeting.hymns;
    addField(`opening_hymn = $${paramIndex}::jsonb`, opening == null ? null : JSON.stringify(opening));
    addField(`sacrament_hymn = $${paramIndex}::jsonb`, sacrament == null ? null : JSON.stringify(sacrament));
    addField(`closing_hymn = $${paramIndex}::jsonb`, closing == null ? null : JSON.stringify(closing));
  }

  if (meeting.prayers !== undefined) {
    addField(`opening_prayer = $${paramIndex}::jsonb`, meeting.prayers.opening == null ? null : JSON.stringify(meeting.prayers.opening));
    addField(`closing_prayer = $${paramIndex}::jsonb`, meeting.prayers.closing == null ? null : JSON.stringify(meeting.prayers.closing));
  }

  if (meeting.speakers !== undefined) {
    addField(`speakers = $${paramIndex}::jsonb`, JSON.stringify(meeting.speakers));
  }

  if (meeting.announcements !== undefined) {
    addField(`announcements = $${paramIndex}::text[]`, meeting.announcements);
  }

  if (meeting.wardBusiness !== undefined) {
    addField(`ward_business = $${paramIndex}::jsonb`, JSON.stringify(meeting.wardBusiness));
  }

  if (meeting.stakeBusiness !== undefined) {
    addField(`stake_business = $${paramIndex}::boolean`, meeting.stakeBusiness);
  }

  if (fields.length === 0) throw new Error('No fields to update');

  // Add id as the last parameter for WHERE
  values.push(id);

  const query = `
    UPDATE meetings
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *;
  `;

  const result = await sql.query(query, values);
  return rowToMeeting(result[0] as MeetingRow);
}

export async function deleteMeeting(id: number): Promise<void> {
  await sql`DELETE FROM meetings WHERE id = ${id};`;
}