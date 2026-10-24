import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function OverviewTab({
  summary,
  events,
  sermons,
  messages,
  liveData,
  onOpenAddEvent,
  onOpenAddSermon,
  onPreviewLive,
  onGoLive,
}) {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-300">Operations</div>
              <h2 className="font-fraunces text-[28px] mt-2">Welcome back, church team.</h2>
            </div>
            <Badge variant="dark" withDot>{liveData.isLive ? "Live now" : "Offline"}</Badge>
          </div>

          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <button type="button" onClick={onOpenAddEvent} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left hover:bg-white/10 transition-all">
              <div className="text-[10px] uppercase tracking-[0.18em] text-rose-200">Events</div>
              <div className="font-fraunces text-[24px] mt-2">{summary.totalEvents}</div>
              <div className="text-[12px] text-slate-300">Add a new celebration</div>
            </button>
            <button type="button" onClick={onOpenAddSermon} className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left hover:bg-white/10 transition-all">
              <div className="text-[10px] uppercase tracking-[0.18em] text-rose-200">Sermons</div>
              <div className="font-fraunces text-[24px] mt-2">{summary.totalSermons}</div>
              <div className="text-[12px] text-slate-300">Publish a message</div>
            </button>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-rose-200">Messages</div>
              <div className="font-fraunces text-[24px] mt-2">{summary.totalMessages}</div>
              <div className="text-[12px] text-slate-300">Prayer & contact requests</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Live broadcast</div>
          <div className="mt-3 space-y-3 text-[13px] text-slate-600">
            <div className="flex items-center justify-between"><span>Status</span><strong>{liveData.isLive ? "On air" : "Offline"}</strong></div>
            <div className="flex items-center justify-between"><span>Session</span><strong>{liveData.title || "Sunday Service Live"}</strong></div>
            <div className="flex items-center justify-between"><span>Preacher</span><strong>{liveData.preacher || "Bishop David Oyedepo"}</strong></div>
            <div className="flex items-center justify-between"><span>Schedule</span><strong>{liveData.scheduledFor || "Sunday 8:00 AM"}</strong></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onPreviewLive}>
              Preview
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={onGoLive}>
              Go Live
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Latest event</div>
          <div className="mt-4 font-fraunces text-[24px] leading-snug">
            {events[0]?.title || "No upcoming event"}
          </div>
          <div className="mt-2 text-[13px] text-slate-500">{events[0]?.eventDate || "---"} • {events[0]?.time || "---"}</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Latest sermon</div>
          <div className="mt-4 font-fraunces text-[24px] leading-snug">
            {sermons[0]?.title || "No sermon published"}
          </div>
          <div className="mt-2 text-[13px] text-slate-500">{sermons[0]?.preacher || "---"}</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Prayer / contact</div>
          <div className="mt-4 font-fraunces text-[24px] leading-snug">{messages[0]?.name || "No new requests"}</div>
          <div className="mt-2 text-[13px] text-slate-500">{messages[0]?.subject || "Awaiting messages"}</div>
        </div>
      </div>
    </div>
  );
}
