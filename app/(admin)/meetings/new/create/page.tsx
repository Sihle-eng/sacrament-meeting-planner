'use client';

import { useActionState } from 'react';
import { createMeeting, State } from '@/lib/actions';

const initialState: State = { message: '', errors: {} };

export default function CreateMeetingPage() {
  const [state, formAction, isPending] = useActionState(createMeeting, initialState);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Meeting</h1>
      <form action={formAction} className="space-y-4">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block font-medium">Date</label>
          <input
            id="date"
            name="date"
            type="date"
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
            placeholder="e.g., Sacrament, Testimony"
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
            className="w-full border rounded px-3 py-2"
            aria-describedby="closingPrayer-error"
          />
          <div id="closingPrayer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.closingPrayer?.map((error) => (
              <p key={error} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        </div>

        {state.message && (
          <div className="text-red-500">{state.message}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Meeting'}
        </button>
      </form>
    </div>
  );
}