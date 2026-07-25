import { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  // Handle date formatting safely
  const formattedDate = meeting.date
    ? new Date(meeting.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date not set';

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{formattedDate}</h1>
      <p className="text-sm text-gray-500 mb-6">Meeting Type: {meeting.type}</p>

      <div className="space-y-6">
        {/* Presiding & Conducting */}
        <Section title="Presiding & Conducting">
          <p><span className="font-medium">Presiding:</span> {meeting.presiding || '—'}</p>
          <p><span className="font-medium">Conducting:</span> {meeting.conducting || '—'}</p>
        </Section>

        {/* Hymns – now just strings */}
        <Section title="Hymns">
          {meeting.hymns && meeting.hymns.length > 0 ? (
            meeting.hymns.map((hymn, idx) => (
              <p key={idx}>{hymn}</p>
            ))
          ) : (
            <p>No hymns listed</p>
          )}
        </Section>

        {/* Prayers */}
        <Section title="Prayers">
          <p><span className="font-medium">Opening:</span> {meeting.prayers.opening || '—'}</p>
          <p><span className="font-medium">Closing:</span> {meeting.prayers.closing || '—'}</p>
        </Section>

        {/* Speakers */}
        <Section title="Speakers">
          {meeting.speakers && meeting.speakers.length > 0 ? (
            meeting.speakers.map((speaker, idx) => (
              <p key={idx}>
                {speaker.name}
                {speaker.topic && ` – ${speaker.topic}`}
              </p>
            ))
          ) : (
            <p>No speakers listed</p>
          )}
        </Section>

        {/* Musical Numbers – array of strings */}
        {meeting.musicalNumbers && meeting.musicalNumbers.length > 0 && (
          <Section title="Musical Numbers">
            {meeting.musicalNumbers.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </Section>
        )}

        {/* Ward Business – array of strings */}
        {meeting.wardBusiness && meeting.wardBusiness.length > 0 && (
          <Section title="Ward Business">
            {meeting.wardBusiness.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </Section>
        )}

        {/* Stake Business – boolean */}
        {meeting.stakeBusiness && (
          <Section title="Stake Business">
            <p>Stake business will be discussed.</p>
          </Section>
        )}

        {/* Announcements – array of strings */}
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