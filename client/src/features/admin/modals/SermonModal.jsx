import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

const createDefaultSermon = () => ({
  id: "",
  title: "",
  preacher: "Bishop David Oyedepo",
  date: "",
  youtubeUrl: "",
  youtubeId: "",
  category: "Sunday Service",
});

export default function SermonModal({ initialValues, isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(createDefaultSermon());
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...createDefaultSermon(), ...initialValues });
    setStatus({ type: "idle", message: "" });
  }, [initialValues, isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setStatus({ type: "error", message: "Please enter a sermon title before saving." });
      return;
    }

    setStatus({ type: "saving", message: "Saving sermon..." });
    toast.loading("Saving sermon...", { id: "sermon-save" });

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        preacher: form.preacher || "Bishop David Oyedepo",
        category: form.category || "Sunday Service",
        youtubeUrl: form.youtubeUrl || form.youtubeId || "",
        youtubeId: form.youtubeId || form.youtubeUrl || "",
        date: form.date || new Date().toISOString(),
      };

      await onSubmit(payload);
      setStatus({ type: "success", message: initialValues?.id ? "Sermon saved successfully." : "Sermon created successfully." });
      toast.success(initialValues?.id ? "Sermon saved successfully." : "Sermon created successfully.", { id: "sermon-save" });
      onClose();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to save sermon." });
      toast.error(error.message || "Unable to save sermon.", { id: "sermon-save" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[480px] rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-fraunces text-[20px] font-bold text-slate-900">{initialValues?.id ? "Edit Sermon" : "Add New Sermon"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-[18px]">✕</button>
        </div>

        {status.type !== "idle" && (
          <div className={`mb-3 rounded-xl border px-3 py-2 text-[12px] font-medium ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : status.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">Sermon Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-winners-red"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Preacher</label>
              <input
                type="text"
                value={form.preacher}
                onChange={(e) => setForm((prev) => ({ ...prev, preacher: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-winners-red"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">Date</label>
              <input
                type="text"
                placeholder="e.g. Oct 12, 2026"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-winners-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">YouTube Link or Video ID</label>
            <input
              type="text"
              value={form.youtubeUrl || form.youtubeId}
              onChange={(e) => {
                const nextValue = e.target.value;
                setForm((prev) => ({ ...prev, youtubeUrl: nextValue, youtubeId: nextValue }));
              }}
              className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-winners-red font-mono"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-winners-red"
            />
          </div>

          <div className="flex gap-2 pt-3 mt-4 border-t border-slate-100">
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="w-full" disabled={status.type === "saving"}>
              {status.type === "saving" ? "Saving..." : "Save Sermon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
