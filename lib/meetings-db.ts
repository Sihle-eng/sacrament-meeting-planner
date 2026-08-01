import { PrismaClient } from '@prisma/client';
import { SacramentMeeting } from './types';

const prisma = new PrismaClient();

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
  speakers: string | null;
  announcements: string | null;
  ward_business: string | null;
  stake_business: number;
};

async function ensureMeetingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      meeting_type TEXT NOT NULL,
      presiding TEXT,
      conducting TEXT,
      opening_hymn TEXT,
      sacrament_hymn TEXT,
      closing_hymn TEXT,
      opening_prayer TEXT,
      closing_prayer TEXT,
      speakers TEXT NOT NULL DEFAULT '[]',
      announcements TEXT NOT NULL DEFAULT '[]',
      ward_business TEXT NOT NULL DEFAULT '[]',
      stake_business INTEGER NOT NULL DEFAULT 0
    )
  `);
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToMeeting(row: MeetingRow): SacramentMeeting {
  const hymns = [row.opening_hymn, row.sacrament_hymn, row.closing_hymn].filter(Boolean) as string[];

  return {
    id: row.id,
    date: row.date,
    type: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    hymns,
    prayers: {
      opening: row.opening_prayer,
      closing: row.closing_prayer,
    },
    speakers: parseJson<Array<{ name: string; topic?: string }>>(row.speakers, []),
    announcements: parseJson<string[]>(row.announcements, []),
    wardBusiness: parseJson<string[]>(row.ward_business, []),
    stakeBusiness: Boolean(row.stake_business),
    musicalNumbers: [],
  };
}

export async function getMeetings(
  query?: string,
  page: number = 1,
  limit: number = 5
): Promise<{ meetings: SacramentMeeting[]; total: number }> {
  await ensureMeetingsTable();

  const offset = (page - 1) * limit;
  const params: string[] = [];
  let whereClause = '';

  if (query) {
    const searchTerm = `%${query}%`;
    whereClause = `WHERE meeting_type LIKE ? OR presiding LIKE ? OR conducting LIKE ? OR speakers LIKE ?`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  const countResult = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM meetings ${whereClause}`,
    ...params
  );
  const total = Number(countResult[0]?.count ?? 0);

  const rows = await prisma.$queryRawUnsafe<MeetingRow[]>(
    `SELECT * FROM meetings ${whereClause} ORDER BY date DESC LIMIT ? OFFSET ?`,
    ...params,
    limit,
    offset
  );

  return {
    meetings: rows.map(rowToMeeting),
    total,
  };
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  await ensureMeetingsTable();
  const rows = await prisma.$queryRawUnsafe<MeetingRow[]>(`SELECT * FROM meetings WHERE id = ?`, id);
  if (rows.length === 0) return null;
  return rowToMeeting(rows[0]);
}

export async function addMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  await ensureMeetingsTable();

  const {
    date,
    type,
    presiding,
    conducting,
    hymns,
    prayers,
    speakers,
    announcements,
    wardBusiness,
    stakeBusiness,
  } = meeting;

  const [openingHymn, sacramentHymn, closingHymn] = hymns;
  const openingPrayer = prayers.opening;
  const closingPrayer = prayers.closing;

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO meetings (
        date, meeting_type, presiding, conducting,
        opening_hymn, sacrament_hymn, closing_hymn,
        opening_prayer, closing_prayer,
        speakers, announcements, ward_business, stake_business
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    date,
    type,
    presiding,
    conducting,
    openingHymn ?? null,
    sacramentHymn ?? null,
    closingHymn ?? null,
    openingPrayer ?? null,
    closingPrayer ?? null,
    JSON.stringify(speakers),
    JSON.stringify(announcements),
    JSON.stringify(wardBusiness),
    stakeBusiness ? 1 : 0
  );

  const [created] = await prisma.$queryRawUnsafe<MeetingRow[]>(`SELECT * FROM meetings WHERE id = last_insert_rowid()`);
  return rowToMeeting(created);
}

export async function updateMeeting(id: number, meeting: Partial<Omit<SacramentMeeting, 'id'>>): Promise<SacramentMeeting> {
  await ensureMeetingsTable();

  const fields: string[] = [];
  const values: unknown[] = [];

  const addField = (sql: string, value: unknown) => {
    fields.push(sql);
    values.push(value);
  };

  if (meeting.date !== undefined) addField('date = ?', meeting.date);
  if (meeting.type !== undefined) addField('meeting_type = ?', meeting.type);
  if (meeting.presiding !== undefined) addField('presiding = ?', meeting.presiding);
  if (meeting.conducting !== undefined) addField('conducting = ?', meeting.conducting);

  if (meeting.hymns !== undefined) {
    const [opening, sacrament, closing] = meeting.hymns;
    addField('opening_hymn = ?', opening ?? null);
    addField('sacrament_hymn = ?', sacrament ?? null);
    addField('closing_hymn = ?', closing ?? null);
  }

  if (meeting.prayers !== undefined) {
    addField('opening_prayer = ?', meeting.prayers.opening ?? null);
    addField('closing_prayer = ?', meeting.prayers.closing ?? null);
  }

  if (meeting.speakers !== undefined) {
    addField('speakers = ?', JSON.stringify(meeting.speakers));
  }

  if (meeting.announcements !== undefined) {
    addField('announcements = ?', JSON.stringify(meeting.announcements));
  }

  if (meeting.wardBusiness !== undefined) {
    addField('ward_business = ?', JSON.stringify(meeting.wardBusiness));
  }

  if (meeting.stakeBusiness !== undefined) {
    addField('stake_business = ?', meeting.stakeBusiness ? 1 : 0);
  }

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE meetings SET ${fields.join(', ')} WHERE id = ?`;
  await prisma.$executeRawUnsafe(query, ...values);

  const [updated] = await prisma.$queryRawUnsafe<MeetingRow[]>(`SELECT * FROM meetings WHERE id = ?`, id);
  return rowToMeeting(updated);
}

export async function deleteMeeting(id: number): Promise<void> {
  await ensureMeetingsTable();
  await prisma.$executeRawUnsafe(`DELETE FROM meetings WHERE id = ?`, id);
}