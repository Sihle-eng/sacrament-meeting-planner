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

export interface SacramentMeeting {
  id: number;
  date: string; // ISO date string, e.g., "2026-05-03"
  type: MeetingType;
  presiding: string;
  conducting: string;
  hymns: Hymn[];
  prayers: {
    opening: string;
    closing: string;
  };
  speakers: SpeakerItem[];
  musicalNumbers?: Hymn[];
  wardBusiness?: WardBusinessItem[];
  stakeBusiness?: WardBusinessItem[];
  announcements?: string[];
}