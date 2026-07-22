export type MeetingType = 'Sacrament' | 'Testimony' | 'Conference' | 'Special';

export interface Hymn {
  number: number;
  title: string;
  selectedBy?: string;
}

export interface SpeakerItem {
  name: string;
  topic?: string;
}

export interface WardBusinessItem {
  title: string;
  description?: string;
}

// lib/types.ts
export interface SacramentMeeting {
  id: number;                // your DB uses integer ids
  date: string;              // YYYY-MM-DD
  type: string;              // e.g., "Sacrament", "Testimony", etc.
  presiding: string | null;
  conducting: string | null;
  hymns: string[];           // array of hymn numbers or names
  prayers: {
    opening: string | null;
    closing: string | null;
  };
  speakers: Array<{ name: string; topic?: string }>; // JSONB
  announcements: string[];   // JSONB
  wardBusiness: string[];    // JSONB
  stakeBusiness: boolean;
  musicalNumbers: string[];  // JSONB
}