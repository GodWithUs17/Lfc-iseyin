// src/components/admin/MessagesTab.jsx
import React, { useState } from "react";

export default function MessagesTab({ messages = [], loadError = "", toggleMessageRead, onToggleRead }) {
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
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-red-600">
            Inbox
          </span>
          <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Prayer & Contact Requests
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-200/60 p-1 text-[11px] sm:w-auto sm:text-xs font-medium self-stretch sm:self-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              className={`shrink-0 whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
      <div className="space-y-3 p-3 sm:space-y-0 sm:p-0 sm:divide-y sm:divide-slate-100">
        {loadError && filteredMessages.length > 0 && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 sm:mx-4 sm:mt-4 sm:text-sm">
            Could not refresh messages: {loadError}
          </div>
        )}
        {filteredMessages.length === 0 ? (
          <div className="px-3 py-10 text-center sm:px-6 sm:py-16">
            <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-400">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h8M8 14h5m-8 6 2.5-2H18a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v13z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">{loadError ? "Messages could not be loaded" : "No messages found"}</p>
            <p className="mt-1 text-xs text-slate-500">{loadError || "New prayer and contact requests will appear here."}</p>
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
                className={`rounded-xl border border-slate-200 p-3 shadow-xs transition-colors hover:bg-slate-50/80 sm:rounded-none sm:border-0 sm:p-6 sm:shadow-none ${
                  !isRead ? "bg-slate-50/40" : "bg-white"
                }`}
              >
                {/* Top Row: Contact Details + Category Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        !isRead
                          ? "bg-red-500 ring-4 ring-red-100"
                          : "bg-slate-200"
                      }`}
                    />
                    <div>
                      <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 leading-snug">
                        {msg.name || "Anonymous"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 text-[11px] sm:text-xs text-slate-500 mt-0.5">
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
                    className={`self-start text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getBadgeStyle(
                      msg.type
                    )}`}
                  >
                    {msg.type || "General"}
                  </span>
                </div>

                {/* Subject & Message Content */}
                <div className="pl-4 sm:pl-5 border-l-2 border-slate-200 ml-1 space-y-1">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                    {msg.type || "Contact Message"}
                  </p>
                  <p className="text-[13px] sm:text-sm text-slate-700 leading-relaxed">
                    {msg.message || "No message content."}
                  </p>
                </div>

                {/* Footer Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 text-[11px] sm:text-xs">
                  <span className="text-slate-400">
                    {formatMessageDate(messageDate)}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
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