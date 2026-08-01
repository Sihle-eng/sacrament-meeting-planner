import { PrismaClient } from '@prisma/client';
import { SacramentMeeting } from './types';

let prisma: PrismaClient | null = null;

function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}

async function withPrisma<T>(
  operation: (client: PrismaClient) => Promise<T>,
  fallback: T
): Promise<T> {
  const client = getPrismaClient();
  if (!client) {
    return fallback;
  }

  try {
    return await operation(client);
  } catch (error) {
    console.warn('Prisma database unavailable, using fallback data.', error);
    return fallback;
  }
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToMeeting(row: {
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
}): SacramentMeeting {
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
  const offset = (page - 1) * limit;

  const where = query
    ? {
        OR: [
          { meeting_type: { contains: query } },
          { presiding: { contains: query } },
          { conducting: { contains: query } },
        ],
      }
    : undefined;

  return withPrisma(
    async (client) => {
      const [total, rows] = await Promise.all([
        client.meeting.count({ where }),
        client.meeting.findMany({
          where,
          orderBy: { date: 'desc' },
          skip: offset,
          take: limit,
        }),
      ]);

      return {
        meetings: rows.map(rowToMeeting),
        total,
      };
    },
    { meetings: [], total: 0 }
  );
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  return withPrisma(
    async (client) => {
      const row = await client.meeting.findUnique({ where: { id } });
      if (!row) return null;
      return rowToMeeting(row);
    },
    null
  );
}

export async function addMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
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

  return withPrisma(
    async (client) => {
      const row = await client.meeting.create({
        data: {
          date,
          meeting_type: type,
          presiding,
          conducting,
          opening_hymn: openingHymn ?? null,
          sacrament_hymn: sacramentHymn ?? null,
          closing_hymn: closingHymn ?? null,
          opening_prayer: openingPrayer ?? null,
          closing_prayer: closingPrayer ?? null,
          speakers: JSON.stringify(speakers),
          announcements: JSON.stringify(announcements),
          ward_business: JSON.stringify(wardBusiness),
          stake_business: stakeBusiness ? 1 : 0,
        },
      });

      return rowToMeeting(row);
    },
    meeting as SacramentMeeting
  );
}

export async function updateMeeting(id: number, meeting: Partial<Omit<SacramentMeeting, 'id'>>): Promise<SacramentMeeting> {
  return withPrisma(
    async (client) => {
      const row = await client.meeting.update({
        where: { id },
        data: {
          date: meeting.date,
          meeting_type: meeting.type,
          presiding: meeting.presiding,
          conducting: meeting.conducting,
          opening_hymn: meeting.hymns?.[0] ?? undefined,
          sacrament_hymn: meeting.hymns?.[1] ?? undefined,
          closing_hymn: meeting.hymns?.[2] ?? undefined,
          opening_prayer: meeting.prayers?.opening ?? undefined,
          closing_prayer: meeting.prayers?.closing ?? undefined,
          speakers: meeting.speakers ? JSON.stringify(meeting.speakers) : undefined,
          announcements: meeting.announcements ? JSON.stringify(meeting.announcements) : undefined,
          ward_business: meeting.wardBusiness ? JSON.stringify(meeting.wardBusiness) : undefined,
          stake_business: meeting.stakeBusiness !== undefined ? (meeting.stakeBusiness ? 1 : 0) : undefined,
        },
      });

      return rowToMeeting(row);
    },
    meeting as SacramentMeeting
  );
}

export async function deleteMeeting(id: number): Promise<void> {
  await withPrisma(async (client) => {
    await client.meeting.delete({ where: { id } });
    return undefined;
  }, undefined);
}