import { z } from 'zod';

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

// Export the State type from here if you want, but you can also keep it in actions.ts
// (types are fine, they don't exist at runtime).
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