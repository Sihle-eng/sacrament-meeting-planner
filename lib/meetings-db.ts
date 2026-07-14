import { SacramentMeeting } from './types';

// 5+ complete meeting records
const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    type: 'Sacrament',
    presiding: 'Bishop John Smith',
    conducting: 'Brother David Brown',
    hymns: [
      { number: 1, title: 'The Morning Breaks' },
      { number: 193, title: 'I Stand All Amazed', selectedBy: 'Sister Jane Doe' },
    ],
    prayers: {
      opening: 'Brother Michael Green',
      closing: 'Sister Emily White',
    },
    speakers: [
      { name: 'Brother Thomas Clark', topic: 'Faith' },
      { name: 'Sister Sarah Adams', topic: 'Charity' },
    ],
    musicalNumbers: [{ number: 301, title: 'I Am a Child of God' }],
    wardBusiness: [{ title: 'New Member Welcome', description: 'Welcomed the Wilson family.' }],
    announcements: ['Next week is Fast Sunday.'],
  },
  {
    id: 2,
    date: '2026-05-10',
    type: 'Sacrament',
    presiding: 'Bishop John Smith',
    conducting: 'Brother David Brown',
    hymns: [
      { number: 2, title: 'The Spirit of God' },
      { number: 102, title: 'Jesus, Lover of My Soul' },
    ],
    prayers: {
      opening: 'Sister Laura Martinez',
      closing: 'Brother James Wilson',
    },
    speakers: [
      { name: 'Brother Robert Taylor', topic: 'Repentance' },
      { name: 'Sister Mary Johnson', topic: 'Service' },
    ],
    announcements: ['Ward temple trip scheduled for May 20.'],
  },
  {
    id: 3,
    date: '2026-05-17',
    type: 'Testimony',
    presiding: 'Bishop John Smith',
    conducting: 'Brother Richard Lee',
    hymns: [
      { number: 4, title: 'Truth Eternal' },
      { number: 163, title: 'Lord, Dismiss Us with Thy Blessing' },
    ],
    prayers: {
      opening: 'Brother Kevin Brown',
      closing: 'Sister Patricia Davis',
    },
    speakers: [
      { name: 'Sister Nancy Wilson', topic: 'Gratitude' },
      { name: 'Brother Steven Harris', topic: 'Prayer' },
    ],
    wardBusiness: [{ title: 'Budget Approval', description: 'Quarterly budget reviewed and approved.' }],
    stakeBusiness: [{ title: 'Stake Conference', description: 'Stake Conference will be June 1.' }],
  },
  {
    id: 4,
    date: '2026-05-24',
    type: 'Sacrament',
    presiding: 'Bishop John Smith',
    conducting: 'Brother David Brown',
    hymns: [
      { number: 5, title: 'High on the Mountain Top' },
      { number: 185, title: 'Reverently and Meekly Now' },
    ],
    prayers: {
      opening: 'Sister Amanda Clark',
      closing: 'Brother Daniel White',
    },
    speakers: [
      { name: 'Sister Elizabeth Moore', topic: 'Endurance' },
      { name: 'Brother William Jones', topic: 'Temples' },
    ],
    musicalNumbers: [{ number: 220, title: 'Lord, I Would Follow Thee' }],
    announcements: ['Potluck after church next Sunday.'],
  },
  {
    id: 5,
    date: '2026-05-31',
    type: 'Sacrament',
    presiding: 'Bishop John Smith',
    conducting: 'Brother Richard Lee',
    hymns: [
      { number: 3, title: 'Now Let Us Rejoice' },
      { number: 140, title: 'Did You Think to Pray?' },
    ],
    prayers: {
      opening: 'Brother James Anderson',
      closing: 'Sister Karen Taylor',
    },
    speakers: [
      { name: 'Brother Mark Robinson', topic: 'Obedience' },
      { name: 'Sister Linda Wright', topic: 'Hope' },
    ],
    wardBusiness: [{ title: 'Youth Camp', description: 'Youth camp registrations are open.' }],
    stakeBusiness: [{ title: 'Stake Youth Activity', description: 'Stake youth activity on June 5.' }],
    announcements: ['Please pick up new ward directories.'],
  },
];

export function getMeetings(date?: string): SacramentMeeting[] {
  if (date) {
    return meetings.filter((m) => m.date === date);
  }
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((m) => m.id === id);
}