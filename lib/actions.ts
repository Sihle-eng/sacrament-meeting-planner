'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as dbUpdateMeeting,
  deleteMeeting as dbDeleteMeeting,
} from './meetings-db';
import { MeetingFormSchema, type State } from './schemas';
import { SacramentMeeting } from './types';

// ✅ Helper – now uses imported schema
function validateMeetingForm(formData: FormData) {
  const raw = {
    date: formData.get('date') as string,
    type: formData.get('type') as string,
    presiding: (formData.get('presiding') as string) || undefined,
    conducting: (formData.get('conducting') as string) || undefined,
    openingHymn: (formData.get('openingHymn') as string) || undefined,
    sacramentHymn: (formData.get('sacramentHymn') as string) || undefined,
    closingHymn: (formData.get('closingHymn') as string) || undefined,
    openingPrayer: (formData.get('openingPrayer') as string) || undefined,
    closingPrayer: (formData.get('closingPrayer') as string) || undefined,
  };
  return MeetingFormSchema.safeParse(raw);
}

const meetingTypeMap: [string, string][] = [
  ['sacrament', 'regular'],
  ['regular', 'regular'],
  ['testimony', 'testimony'],
  ['stake', 'stake'],
  ['general', 'general'],
  ['special', 'special'],
];

function normalizeMeetingType(value: string) {
  const normalized = value.trim().toLowerCase();
  const match = meetingTypeMap.find(
    ([key]) => normalized === key || normalized.startsWith(key) || normalized.includes(key)
  );
  return match ? match[1] : 'regular';
}

export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
  const result = validateMeetingForm(formData);
  if (!result.success) {
    return {
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { date, type, presiding, conducting, openingHymn, sacramentHymn, closingHymn, openingPrayer, closingPrayer } = result.data;

  const meeting: Omit<SacramentMeeting, 'id'> = {
    date,
    type: normalizeMeetingType(type),
    presiding: presiding || null,
    conducting: conducting || null,
    hymns: [openingHymn || '', sacramentHymn || '', closingHymn || ''].filter(Boolean),
    prayers: {
      opening: openingPrayer || null,
      closing: closingPrayer || null,
    },
    speakers: [],
    announcements: [],
    wardBusiness: [],
    stakeBusiness: false,
    musicalNumbers: [],
  };

  try {
    await addMeeting(meeting);
  } catch (error) {
    console.error('Create meeting error:', error);
    return { message: 'Failed to create meeting. Please try again later.' };
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(id: number, prevState: State, formData: FormData): Promise<State> {
  const result = validateMeetingForm(formData);
  if (!result.success) {
    return {
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { date, type, presiding, conducting, openingHymn, sacramentHymn, closingHymn, openingPrayer, closingPrayer } = result.data;

  const updateData: Partial<Omit<SacramentMeeting, 'id'>> = {
    date,
    type: normalizeMeetingType(type),
    presiding: presiding || null,
    conducting: conducting || null,
    hymns: [openingHymn || '', sacramentHymn || '', closingHymn || ''].filter(Boolean),
    prayers: {
      opening: openingPrayer || null,
      closing: closingPrayer || null,
    },
  };

  try {
    await dbUpdateMeeting(id, updateData);
  } catch (error) {
    console.error('Update meeting error:', error);
    return { message: 'Failed to update meeting. Please try again later.' };
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  try {
    await dbDeleteMeeting(id);
  } catch (error) {
    console.error('Delete meeting error:', error);
    throw new Error('Failed to delete meeting. Please try again.');
  }
  revalidatePath('/meetings');
  redirect('/meetings');
}