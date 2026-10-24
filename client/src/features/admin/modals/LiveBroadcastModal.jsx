import Button from '@/components/ui/Button';

// Helper: Ignore template placeholders and build a clean preview URL
const getStreamUrl = (liveData = {}) => {
  const rawUrl = liveData.youtubeUrl || '';
  const rawId = liveData.youtubeId || '';

  // Check if current values are invalid/placeholders
  const isPlaceholderUrl = rawUrl.includes('YOUR_VIDEO_ID');
  const isPlaceholderId = rawId === 'YOUR_VIDEO_ID';

  if (rawUrl && !isPlaceholderUrl) return rawUrl;

  if (rawId && !isPlaceholderId) {
    // If rawId is already a full link, use it; otherwise build youtube watch link
    return rawId.startsWith('http')
      ? rawId
      : `https://www.youtube.com/watch?v=${rawId}`;
  }

  return 'https://www.youtube.com/@winnerschapel';
};

export default function LiveBroadcastModal({
  isOpen,
  actionType = 'preview',
  liveData = {},
  onClose,
  onConfirm,
  isBusy = false,
}) {
  if (!isOpen) return null;

  const isPreview = actionType === 'preview';
  const streamUrl = getStreamUrl(liveData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Live broadcast
            </div>
            <h3 className="mt-1 font-fraunces text-[26px] text-slate-900">
              {isPreview ? 'Preview stream' : 'Go live'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation"
            className="rounded-full border border-slate-200 px-2.5 py-1 text-sm font-semibold text-slate-500 transition hover:border-slate-900 hover:text-slate-900 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-[13px] text-slate-600">
            <span>Session</span>
            <strong className="text-right text-slate-900">{liveData.title || 'Sunday Service Live'}</strong>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-[13px] text-slate-600">
            <span>Preacher</span>
            <strong className="text-right text-slate-900">{liveData.preacher || 'Bishop David Oyedepo'}</strong>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-[13px] text-slate-600">
            <span>Schedule</span>
            <strong className="text-right text-slate-900">{liveData.scheduledFor || 'Sunday 8:00 AM'}</strong>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-500">
            {isPreview
              ? 'This will open the live stream link so you can preview the session before publishing it to the site.'
              : 'This will activate the live broadcast state for your church site and show the stream as live.'}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-[12px] text-amber-800 border border-amber-200">
          <span className="font-medium">Confirmation required</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]">
            {isPreview ? 'Preview' : 'Live'}
          </span>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="min-w-[100px]">
            Cancel
          </Button>
          <Button
            variant={isPreview ? 'outline' : 'primary'}
            size="sm"
            onClick={onConfirm}
            disabled={isBusy}
            className={isPreview ? 'min-w-[110px]' : 'min-w-[120px]'}
          >
            {isBusy ? 'Processing...' : isPreview ? 'Confirm Preview' : 'Confirm Go Live'}
          </Button>
        </div>

        <div className="mt-4 text-[11px] text-slate-500">
          Active link:{' '}
          <a
            href={streamUrl}
            className="text-rose-600 underline break-all"
            target="_blank"
            rel="noreferrer"
          >
            {streamUrl}
          </a>
        </div>
      </div>
    </div>
  );
}