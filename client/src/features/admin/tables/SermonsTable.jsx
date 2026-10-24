// src/components/admin/SermonsTable.jsx
import React from "react";
import Button from "@/components/ui/Button";

export default function SermonsTable({ sermons = [], onEdit, onDelete, onCreateNew }) {
  // Category styling helper
  const getCategoryBadge = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("sunday") || cat.includes("service")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (cat.includes("midweek") || cat.includes("bible")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (cat.includes("youth") || cat.includes("special")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Sermons Library
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Published Messages
          </h3>
        </div>
        <Button
          size="sm"
          onClick={onCreateNew}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all text-xs sm:text-sm self-start sm:self-auto w-full sm:w-auto text-center"
        >
          + Add New Sermon
        </Button>
      </div>

      {/* Empty State */}
      {sermons.length === 0 ? (
        <div className="py-12 sm:py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
            📖
          </div>
          <p className="text-sm font-medium text-slate-600">No sermons found</p>
          <p className="text-xs text-slate-400 mt-1">
            Click "Add New Sermon" to publish your first message.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: Responsive Card Stack (Visible on mobile/tablet up to md breakpoint) */}
          <div className="divide-y divide-slate-100 md:hidden">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="p-4 sm:p-5 space-y-3 bg-white">
                {/* Top Row: Category Badge + Date */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadge(
                      sermon.category
                    )}`}
                  >
                    {sermon.category || "Sunday Service"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {sermon.date || "—"}
                  </span>
                </div>

                {/* Title & Series */}
                <div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {sermon.title}
                  </h4>
                  {sermon.series && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Series: {sermon.series}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    <span className="text-slate-400 font-normal">Preacher: </span>
                    {sermon.preacher || "Pastor"}
                  </p>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onEdit(sermon)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-center transition-all"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(sermon.id)}
                    className="flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50/50 border border-red-100 rounded-lg hover:bg-red-100 text-center transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Full Data Table (Hidden on mobile, visible on desktop md+) */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Title & Info</th>
                  <th className="py-3.5 px-6">Preacher</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sermons.map((sermon) => (
                  <tr
                    key={sermon.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Title & Metadata */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {sermon.title}
                      </div>
                      {sermon.series && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          Series: {sermon.series}
                        </div>
                      )}
                    </td>

                    {/* Preacher */}
                    <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">
                      {sermon.preacher || "Pastor"}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-slate-500 text-xs whitespace-nowrap">
                      {sermon.date || "—"}
                    </td>

                    {/* Category Pill */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryBadge(
                          sermon.category
                        )}`}
                      >
                        {sermon.category || "Sunday Service"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(sermon)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(sermon.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50/50 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}