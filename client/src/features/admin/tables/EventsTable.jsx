import Button from "@/components/ui/Button";

export default function EventsTable({ events, onEdit, onDelete, onCreateNew, pendingDeleteId = null }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Events</div>
          <h3 className="font-fraunces text-[24px] mt-1">Upcoming Programmes</h3>
        </div>
        <Button size="sm" onClick={onCreateNew}>Add Event</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
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
                <td className="px-5 py-4 flex justify-end gap-2">
                  <button type="button" onClick={() => onEdit(event)} className="px-3 py-1.5 text-[12px] rounded-full border border-slate-200 hover:bg-slate-50 font-semibold">Edit</button>
                  <button
                    type="button"
                    onClick={() => onDelete(event.id)}
                    disabled={pendingDeleteId === event.id}
                    className="px-3 py-1.5 text-[12px] rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pendingDeleteId === event.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
