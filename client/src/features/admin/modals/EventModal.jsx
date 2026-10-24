import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";

const CATEGORY_OPTIONS = [
  "Main Auditorium • Free",
  "Sunday Service",
  "Midweek Service",
  "Special Program",
  "Youth Fellowship",
  "Custom...",
];

const defaultEvent = {
  id: "",
  title: "",
  eventDate: "",
  date: "",
  time: "08:00",
  location: "LFC Iseyin Auditorium",
  description: "",
  category: "Main Auditorium • Free",
  categoryPreset: "Main Auditorium • Free",
  customCategory: "",
  bannerUrl: "",
};

const resolveCategoryPreset = (value) => {
  const normalized = value || "Main Auditorium • Free";
  return CATEGORY_OPTIONS.includes(normalized) ? normalized : "Custom...";
};

const toISODate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (typeof value === "string" && value.includes("T")) return value.split("T")[0];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toTimeInput = (value) => {
  if (!value) return "08:00";
  if (/^\d{2}:\d{2}$/.test(value)) return value;

  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return "08:00";

  let hours = Number(match[1]);
  const minutes = match[2];
  const modifier = match[3]?.toUpperCase();

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const formatDisplayTime = (value) => {
  if (!value) return "8:00 AM";

  const trimmed = String(value).trim();

  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = timeMatch[2];
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${minutes} ${suffix}`;
  }

  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    const hours = Number(amPmMatch[1]);
    const minutes = amPmMatch[2];
    const suffix = amPmMatch[3].toUpperCase();
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${minutes} ${suffix}`;
  }

  return trimmed;
};

export default function EventModal({ initialValues, isOpen, onClose, onSubmit, isSaving = false, saveLabel = "Create Event" }) {
  const [form, setForm] = useState({ ...defaultEvent, ...initialValues });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    if (!isOpen) return;
    const resolvedCategory = resolveCategoryPreset(initialValues?.category || "Main Auditorium • Free");
    setForm({
      ...defaultEvent,
      ...initialValues,
      eventDate: toISODate(initialValues?.eventDate || initialValues?.date || ""),
      date: toISODate(initialValues?.eventDate || initialValues?.date || ""),
      time: initialValues?.time || "08:00",
      categoryPreset: resolvedCategory,
      customCategory: resolvedCategory === "Custom..." ? initialValues?.category || "" : "",
      category: initialValues?.category || "Main Auditorium • Free",
    });
    setStatus({ type: "idle", message: "" });
  }, [isOpen, initialValues]);

  const previewDate = useMemo(() => {
    const value = form.eventDate || form.date;
    if (!value) return new Date();
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }, [form.eventDate, form.date]);

  const finalCategory =
    form.categoryPreset === "Custom..."
      ? (form.customCategory || "").trim()
      : (form.categoryPreset || form.category || "Main Auditorium • Free");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setStatus({ type: "error", message: "Please enter an event title before saving." });
      return;
    }

    if (form.categoryPreset === "Custom..." && !finalCategory) {
      setStatus({ type: "error", message: "Please type the category name before saving." });
      return;
    }

    setStatus({ type: "loading", message: "Saving event..." });

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        eventDate: form.eventDate || form.date,
        date: form.eventDate || form.date,
        time: formatDisplayTime(form.time || "08:00"),
        location: form.location.trim() || "LFC Iseyin Auditorium",
        category: finalCategory || "Main Auditorium • Free",
        bannerUrl: form.bannerUrl || "",
      });
      setStatus({ type: "success", message: initialValues?.id ? "Event updated successfully." : "Event created successfully." });
      onClose();
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "The event could not be saved.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[900px] rounded-2xl p-5 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-fraunces text-[20px] font-bold text-slate-900">
              {initialValues?.id ? "Edit Church Event" : "Add New Event"}
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Preview the public event card before saving.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close modal">
            ✕
          </button>
        </div>

        {status.type !== "idle" && (
          <div className={`mb-4 rounded-xl border px-3 py-2 text-[12px] font-medium ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : status.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
            {status.message}
          </div>
        )}

        <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Event Title <span className="text-winners-red">*</span></label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Event Date <span className="text-winners-red">*</span></label>
                <input
                  type="date"
                  required
                  value={toISODate(form.eventDate || form.date || new Date())}
                  onChange={(e) => setForm((prev) => ({ ...prev, eventDate: e.target.value, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  value={toTimeInput(form.time || "08:00")}
                  onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Main Auditorium"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.categoryPreset || "Main Auditorium • Free"}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    categoryPreset: e.target.value,
                    category: e.target.value === "Custom..." ? prev.category : e.target.value,
                  }))}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option === "Custom..." ? "Custom category" : option}</option>
                  ))}
                </select>
                {form.categoryPreset === "Custom..." && (
                  <input
                    type="text"
                    value={form.customCategory}
                    onChange={(e) => setForm((prev) => ({ ...prev, customCategory: e.target.value, category: e.target.value }))}
                    placeholder="Type a category name"
                    className="mt-2 w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Banner Image URL <span className="text-[11px] font-normal text-slate-400">(Optional)</span></label>
              <input
                type="url"
                placeholder="https://example.com/banner.jpg"
                value={form.bannerUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, bannerUrl: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Event details or announcement summary..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-winners-red/20 focus:border-winners-red transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-3 mt-5 border-t border-slate-100">
              <Button type="button" variant="outline" className="w-full rounded-xl py-2.5 text-[13px] font-semibold border-slate-200 hover:bg-slate-50" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="w-full rounded-xl py-2.5 text-[13px] font-semibold bg-winners-red hover:bg-winners-red-dark text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70" disabled={status.type === "loading" || isSaving}>
                {status.type === "loading" || isSaving ? "Saving event..." : initialValues?.id ? "Save Changes" : "Create Event"}
              </Button>
            </div>
          </form>

          <div className="rounded-2xl overflow-hidden border border-rose-100 bg-slate-50">
            <div className="bg-slate-900 text-white px-4 py-3 font-bold text-[13px] flex items-center gap-2.5">
              <span className="bg-white text-slate-900 w-8 h-8 grid place-items-center rounded-lg font-fraunces text-[14px]">
                {String(previewDate.getDate()).padStart(2, "0")}
              </span>
              <span className="truncate text-[12px]">
                {previewDate.toLocaleString("en-US", { month: "short", weekday: "short" })} • {formatDisplayTime(form.time || "08:00")}
              </span>
            </div>
            <div className="p-4">
              <span className="inline-block px-2.5 py-0.5 mb-3 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-winners-red border border-rose-100">
                {form.category || "Main Auditorium • Free"}
              </span>
              <h4 className="font-fraunces text-[22px] text-slate-900 leading-snug mb-2">{form.title || "Church Event"}</h4>
              <p className="text-[13px] text-slate-500 leading-relaxed min-h-[72px]">
                {form.description || "Event summary preview appears here before it is published to the public website."}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[12px] font-semibold text-slate-600">
                📍 {form.location || "LFC Iseyin Auditorium"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
