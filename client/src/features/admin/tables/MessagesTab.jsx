// src/components/admin/MessagesTab.jsx
import React, { useState } from "react";

export default function MessagesTab({ messages = [], toggleMessageRead, onToggleRead }) {
  const [filter, setFilter] = useState("ALL");

  const handleToggleRead = (id, currentStatus) => {
    const handler = onToggleRead || toggleMessageRead;
    if (typeof handler === "function") {
      // Calculate boolean state directly: true if currently "read", false otherwise
      const isCurrentlyRead = currentStatus === "read";
      handler(id, isCurrentlyRead);
    }
  };

  const formatMessageDate = (rawDate) => {
    if (!rawDate) return "Received recently";
    try {
      const parsed = new Date(rawDate);
      if (isNaN(parsed.getTime())) return String(rawDate);

      return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Received recently";
    }
  };

  const getBadgeStyle = (type = "") => {
    const normalized = type.toUpperCase();
    if (normalized.includes("PRAYER")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (normalized.includes("WORKFORCE") || normalized.includes("JOIN")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (
      normalized.includes("NEW_MEMBER") ||
      normalized.includes("MEMBER") ||
      normalized.includes("CONVERT") ||
      normalized.includes("VISITOR")
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const filteredMessages = messages.filter((msg) => {
    const msgType = msg.type?.toUpperCase() || "";
    if (filter === "PRAYER") return msgType.includes("PRAYER");
    if (filter === "WORKFORCE")
      return msgType.includes("WORKFORCE") || msgType.includes("JOIN");
    if (filter === "NEW_MEMBER")
      return (
        msgType.includes("NEW_MEMBER") ||
        msgType.includes("MEMBER") ||
        msgType.includes("CONVERT") ||
        msgType.includes("FIRST")
      );
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header & Filter Controls */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Inbox
          </span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Prayer & Contact Requests
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl text-xs font-medium self-start sm:self-auto flex-wrap">
          {[
            { key: "ALL", label: "All Messages" },
            { key: "PRAYER", label: "Prayer" },
            { key: "WORKFORCE", label: "Workforce" },
            { key: "NEW_MEMBER", label: "New Member" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="divide-y divide-slate-100">
        {filteredMessages.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-slate-600">No messages found</p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const id = msg.id || index;
            const isRead = msg.status === "read";
            const phoneNumber = msg.phone || msg.phoneNumber || msg.phone_number;
            const messageDate = msg.createdAt || msg.created_at || msg.date;

            return (
              <div
                key={id}
                className={`p-6 transition-colors hover:bg-slate-50/80 ${
                  !isRead ? "bg-slate-50/40" : "bg-white"
                }`}
              >
                {/* Top Row: Contact Details + Category Badge */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        !isRead
                          ? "bg-red-500 ring-4 ring-red-100"
                          : "bg-slate-200"
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {msg.name || "Anonymous"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 mt-0.5">
                        {msg.email ? (
                          <a
                            href={`mailto:${msg.email}`}
                            className="hover:text-indigo-600"
                          >
                            {msg.email}
                          </a>
                        ) : (
                          <span>No email</span>
                        )}

                        <span className="text-slate-300">•</span>

                        {phoneNumber ? (
                          <a
                            href={`tel:${phoneNumber}`}
                            className="font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-1"
                          >
                            <svg
                              className="w-3 h-3 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {phoneNumber}
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">
                            No phone provided
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getBadgeStyle(
                      msg.type
                    )}`}
                  >
                    {msg.type || "General"}
                  </span>
                </div>

                {/* Subject & Message Content */}
                <div className="pl-5 border-l-2 border-slate-200 ml-1 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {msg.type || "Contact Message"}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {msg.message || "No message content."}
                  </p>
                </div>

                {/* Footer Toolbar */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">
                    {formatMessageDate(messageDate)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(id, msg.status)}
                      className="text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer font-medium"
                    >
                      {isRead ? "Mark as Unread" : "Mark as Read"}
                    </button>

                    {phoneNumber && (
                      <a
                        href={`tel:${phoneNumber}`}
                        className="bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Call Phone
                      </a>
                    )}

                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                          msg.type || "Church Request"
                        )}`}
                        className="bg-slate-900 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Reply Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}