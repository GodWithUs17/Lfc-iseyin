// src/components/admin/views/LiveSettingsTab.jsx
import React from "react";
import Button from "@/components/ui/Button";

function SpinnerIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function LiveSettingsTab({
  liveData = {},
  onChange,
  onSave,
  isSaving = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return;
    onSave();
  };

  // Ensure placeholders like "YOUR_VIDEO_ID" are ignored in input display
  const currentVideoValue = 
    liveData.youtubeUrl?.includes("YOUR_VIDEO_ID") || liveData.youtubeId === "YOUR_VIDEO_ID"
      ? ""
      : liveData.youtubeUrl || liveData.youtubeId || "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-xl font-bold text-slate-900">Livestream Broadcast Control</h3>
        <p className="text-sm text-slate-500 mt-1">
          Configure active stream links and scheduled broadcast details for the website homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Live Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <p className="text-sm font-bold text-slate-900">Broadcast Status</p>
            <p className="text-xs text-slate-500">Enable when service goes live on YouTube</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("isLive", !liveData.isLive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              liveData.isLive ? "bg-red-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                liveData.isLive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Stream Title
          </label>
          <input
            type="text"
            value={liveData.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g., Sunday Service Live"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 text-sm"
          />
        </div>

        {/* YouTube Link / ID */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            YouTube Video Link or ID
          </label>
          <input
            type="text"
            value={currentVideoValue}
            onChange={(e) => {
              const val = e.target.value;
              onChange("youtubeId", val);
              onChange("youtubeUrl", val);
            }}
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 text-sm"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            You can paste full YouTube URLs or just the 11-character video ID.
          </p>
        </div>

        {/* Preacher */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Preacher / Minister
          </label>
          <input
            type="text"
            value={liveData.preacher || ""}
            onChange={(e) => onChange("preacher", e.target.value)}
            placeholder="e.g., Bishop David Oyedepo"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 text-sm"
          />
        </div>

        {/* Scheduled Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Schedule Text
          </label>
          <input
            type="text"
            value={liveData.scheduledFor || ""}
            onChange={(e) => onChange("scheduledFor", e.target.value)}
            placeholder="e.g., Sunday 8:00 AM"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 text-sm"
          />
        </div>

        {/* Submit Button with Loading Spinner */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <SpinnerIcon className="text-white" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}