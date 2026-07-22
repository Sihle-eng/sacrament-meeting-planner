
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as dbUpdateMeeting,
  deleteMeeting as dbDeleteMeeting,
} from './meetings-db';
import { SacramentMeeting } from './types';  // ✅ import the type

// Zod schema (matches your form fields)
export const MeetingFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  type: z.string().min(1, 'Meeting type is required'),
  presiding: z.string().optional(),
  conducting: z.string().optional(),
  openingHymn: z.string().optional(),
  sacramentHymn: z.string().optional(),
  closingHymn: z.string().optional(),
  openingPrayer: z.string().optional(),
  closingPrayer: z.string().optional(),
});

export type State = {
  message?: string;
  errors?: {
    date?: string[];
    type?: string[];
    presiding?: string[];
    conducting?: string[];
    openingHymn?: string[];
    sacramentHymn?: string[];
    closingHymn?: string[];
    openingPrayer?: string[];
    closingPrayer?: string[];
  };
};

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

// CREATE
export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
  const result = validateMeetingForm(formData);
  if (!result.success) {
    return {
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { date, type, presiding, conducting, openingHymn, sacramentHymn, closingHymn, openingPrayer, closingPrayer } = result.data;

  // Build the meeting object (without id)
  const meeting: Omit<SacramentMeeting, 'id'> = {
    date,
    type,
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

// UPDATE (id is a number, but route param is string – convert)
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
    type,
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

// DELETE
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