import { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{formattedDate}</h1>
      <p className="text-sm text-gray-500 mb-6">Meeting Type: {meeting.type}</p>

      <div className="space-y-6">
        <Section title="Presiding & Conducting">
          <p><span className="font-medium">Presiding:</span> {meeting.presiding}</p>
          <p><span className="font-medium">Conducting:</span> {meeting.conducting}</p>
        </Section>

        <Section title="Hymns">
          {meeting.hymns.map((hymn, idx) => (
            <p key={idx}>
              #{hymn.number} – {hymn.title}
              {hymn.selectedBy && ` (Selected by: ${hymn.selectedBy})`}
            </p>
          ))}
        </Section>

        <Section title="Prayers">
          <p><span className="font-medium">Opening:</span> {meeting.prayers.opening}</p>
          <p><span className="font-medium">Closing:</span> {meeting.prayers.closing}</p>
        </Section>

        <Section title="Speakers">
          {meeting.speakers.map((speaker, idx) => (
            <p key={idx}>
              {speaker.name} – {speaker.topic || 'No topic specified'}
            </p>
          ))}
        </Section>

        {meeting.musicalNumbers && meeting.musicalNumbers.length > 0 && (
          <Section title="Musical Numbers">
            {meeting.musicalNumbers.map((hymn, idx) => (
              <p key={idx}>#{hymn.number} – {hymn.title}</p>
            ))}
          </Section>
        )}

        {meeting.wardBusiness && meeting.wardBusiness.length > 0 && (
          <Section title="Ward Business">
            {meeting.wardBusiness.map((item, idx) => (
              <p key={idx}>
                <span className="font-medium">{item.title}</span>
                {item.description && ` – ${item.description}`}
              </p>
            ))}
          </Section>
        )}

        {meeting.stakeBusiness && meeting.stakeBusiness.length > 0 && (
          <Section title="Stake Business">
            {meeting.stakeBusiness.map((item, idx) => (
              <p key={idx}>
                <span className="font-medium">{item.title}</span>
                {item.description && ` – ${item.description}`}
              </p>
            ))}
          </Section>
        )}

        {meeting.announcements && meeting.announcements.length > 0 && (
          <Section title="Announcements">
            {meeting.announcements.map((ann, idx) => (
              <p key={idx}>• {ann}</p>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// Helper component for sections
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-3">
        {title}
      </h3>
      <div className="text-gray-700 space-y-1">{children}</div>
    </div>
  );
}