'use client';

import { useActionState } from 'react';
import { updateMeeting, State } from '@/lib/actions';
import { SacramentMeeting } from '@/lib/types';

const initialState: State = { message: '', errors: {} };

export default function EditMeetingForm({ meeting }: { meeting: SacramentMeeting }) {
  // Bind the numeric id to the action
  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);
  const [state, formAction, isPending] = useActionState(updateMeetingWithId, initialState);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Meeting</h1>
      <form action={formAction} className="space-y-4">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block font-medium">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={meeting.date}
            className="w-full border rounded px-3 py-2"
            aria-describedby="date-error"
          />
          <div id="date-error" aria-live="polite" aria-atomic="true">
            {state.errors?.date?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Meeting Type */}
        <div>
          <label htmlFor="type" className="block font-medium">Meeting Type</label>
          <input
            id="type"
            name="type"
            type="text"
            defaultValue={meeting.type}
            className="w-full border rounded px-3 py-2"
            aria-describedby="type-error"
          />
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Presiding */}
        <div>
          <label htmlFor="presiding" className="block font-medium">Presiding</label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            defaultValue={meeting.presiding || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="presiding-error"
          />
          <div id="presiding-error" aria-live="polite" aria-atomic="true">
            {state.errors?.presiding?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Conducting */}
        <div>
          <label htmlFor="conducting" className="block font-medium">Conducting</label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            defaultValue={meeting.conducting || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="conducting-error"
          />
          <div id="conducting-error" aria-live="polite" aria-atomic="true">
            {state.errors?.conducting?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Opening Hymn */}
        <div>
          <label htmlFor="openingHymn" className="block font-medium">Opening Hymn</label>
          <input
            id="openingHymn"
            name="openingHymn"
            type="text"
            defaultValue={meeting.hymns[0] || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="openingHymn-error"
          />
          <div id="openingHymn-error" aria-live="polite" aria-atomic="true">
            {state.errors?.openingHymn?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Sacrament Hymn */}
        <div>
          <label htmlFor="sacramentHymn" className="block font-medium">Sacrament Hymn</label>
          <input
            id="sacramentHymn"
            name="sacramentHymn"
            type="text"
            defaultValue={meeting.hymns[1] || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="sacramentHymn-error"
          />
          <div id="sacramentHymn-error" aria-live="polite" aria-atomic="true">
            {state.errors?.sacramentHymn?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Closing Hymn */}
        <div>
          <label htmlFor="closingHymn" className="block font-medium">Closing Hymn</label>
          <input
            id="closingHymn"
            name="closingHymn"
            type="text"
            defaultValue={meeting.hymns[2] || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="closingHymn-error"
          />
          <div id="closingHymn-error" aria-live="polite" aria-atomic="true">
            {state.errors?.closingHymn?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Opening Prayer */}
        <div>
          <label htmlFor="openingPrayer" className="block font-medium">Opening Prayer</label>
          <input
            id="openingPrayer"
            name="openingPrayer"
            type="text"
            defaultValue={meeting.prayers.opening || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="openingPrayer-error"
          />
          <div id="openingPrayer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.openingPrayer?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Closing Prayer */}
        <div>
          <label htmlFor="closingPrayer" className="block font-medium">Closing Prayer</label>
          <input
            id="closingPrayer"
            name="closingPrayer"
            type="text"
            defaultValue={meeting.prayers.closing || ''}
            className="w-full border rounded px-3 py-2"
            aria-describedby="closingPrayer-error"
          />
          <div id="closingPrayer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.closingPrayer?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {/* Other fields (speakers, announcements, etc.) can be added similarly */}

        {state.message && (
          <div className="text-red-500">{state.message}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isPending ? 'Updating...' : 'Update Meeting'}
        </button>
      </form>
    </div>
  );
}