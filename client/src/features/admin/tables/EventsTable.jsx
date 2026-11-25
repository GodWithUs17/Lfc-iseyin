import Button from "@/components/ui/Button";

export default function EventsTable({ events, onEdit, onDelete, onCreateNew, pendingDeleteId = null }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200">
        <div>
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Events</div>
          <h3 className="font-fraunces text-xl sm:text-2xl mt-0.5 sm:mt-1">Upcoming Programmes</h3>
        </div>
        <Button size="sm" onClick={onCreateNew} className="shrink-0 whitespace-nowrap text-[11px] sm:text-xs">Add Event</Button>
      </div>

      <div className="divide-y divide-slate-100 xl:hidden">
        {events.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-500">No events scheduled.</div>
        ) : (
          events.map((event) => (
            <article key={event.id} className="space-y-2.5 sm:space-y-3 p-3 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="min-w-0 break-words text-[13px] sm:text-sm font-semibold text-slate-900">
                  {event.title}
                </h4>
                <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-rose-700">
                  {event.time || "Time TBD"}
                </span>
              </div>
              <div className="space-y-1 text-[11px] sm:text-xs text-slate-600">
                <p><span className="font-semibold text-slate-700">Date:</span> {event.eventDate || event.date || "—"}</p>
                <p className="break-words"><span className="font-semibold text-slate-700">Location:</span> {event.location || "—"}</p>
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-2.5 sm:pt-3">
                <button
                  type="button"
                  onClick={() => onEdit(event)}
                  className="min-h-9 sm:min-h-10 flex-1 rounded-lg border border-slate-200 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  disabled={pendingDeleteId === event.id}
                  className="min-h-9 sm:min-h-10 flex-1 rounded-lg border border-red-200 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {pendingDeleteId === event.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="min-w-[900px] w-full text-left">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3 font-semibold">Location</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-slate-500">No events scheduled.</td>
              </tr>
            )}

            {events.map((event) => (
              <tr key={event.id} className="border-t border-slate-200 text-[13px] text-slate-700">
                <td className="px-5 py-4 font-semibold">{event.title}</td>
                <td className="px-5 py-4">{event.eventDate || event.date || "—"}</td>
                <td className="px-5 py-4">{event.time || "—"}</td>
                <td className="px-5 py-4">{event.location || "—"}</td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="inline-flex justify-end gap-2">
                  <button type="button" onClick={() => onEdit(event)} className="px-3 py-1.5 text-[12px] rounded-full border border-slate-200 hover:bg-slate-50 font-semibold">Edit</button>
                  <button
                    type="button"
                    onClick={() => onDelete(event.id)}
                    disabled={pendingDeleteId === event.id}
                    className="px-3 py-1.5 text-[12px] rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pendingDeleteId === event.id ? "Deleting..." : "Delete"}
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
