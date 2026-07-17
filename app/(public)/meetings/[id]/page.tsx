import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';

interface Props {
  params: { id: string };
}

export default async function MeetingDetailPage({ params }: Props) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const meeting = await getMeetingById(id);
  if (!meeting) notFound();

  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {new Date(meeting.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h1>
        <button
          onClick={() => window.print()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          🖨️ Print
        </button>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Meeting Type</dt>
          <dd className="capitalize text-gray-900">{meeting.meeting_type}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Presiding</dt>
          <dd className="text-gray-900">{meeting.presiding}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Conducting</dt>
          <dd className="text-gray-900">{meeting.conducting}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Opening Prayer</dt>
          <dd className="text-gray-900">{meeting.opening_prayer}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Closing Prayer</dt>
          <dd className="text-gray-900">{meeting.closing_prayer}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Opening Hymn</dt>
          <dd className="text-gray-900">
            #{meeting.opening_hymn.number} - {meeting.opening_hymn.title}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Sacrament Hymn</dt>
          <dd className="text-gray-900">
            #{meeting.sacrament_hymn.number} - {meeting.sacrament_hymn.title}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Closing Hymn</dt>
          <dd className="text-gray-900">
            #{meeting.closing_hymn.number} - {meeting.closing_hymn.title}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">Speakers</h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {meeting.speakers.map((speaker: any, idx: number) => (
            <li key={idx} className="text-gray-700">
              <strong>{speaker.name}</strong> – {speaker.topic || 'No topic'}
            </li>
          ))}
        </ul>
      </div>

      {meeting.announcements.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {meeting.announcements.map((announcement: string, idx: number) => (
              <li key={idx} className="text-gray-700">{announcement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}