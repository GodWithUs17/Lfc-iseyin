// import { createContext, useState, useEffect } from "react";
// import fallbackData from "@/data/data.json";
// import { STORAGE_KEYS } from "@/config/constants";

import { createContext, useState, useEffect } from "react";
import fallbackData from "@/data/data.json";
import { STORAGE_KEYS } from "@/config/constants";
import { apiRequest } from "@/lib/api";

export const SiteDataContext = createContext(null);

function formatDisplayTime(value) {
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
}

function normalizeEvent(event) {
  if (!event || typeof event !== "object") return null;

  const rawDate = event.eventDate || event.date || Date.now();
  const date = new Date(rawDate);
  const day = event.day || String(date.getDate()).padStart(2, "0");
  const formattedTime = formatDisplayTime(event.time || date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
  const monthYear = event.monthYear || `${date.toLocaleString("en-US", { month: "long" })} ${date.toLocaleString("en-US", { weekday: "long" })} ${formattedTime}`;

  return {
    ...event,
    id: event.id || `event-${Date.now()}`,
    title: event.title || "Church Event",
    description: event.description || "Upcoming church event.",
    day,
    monthYear,
    date: event.date || date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: formattedTime,
    location: event.location || "LFC Iseyin Auditorium",
    tag: event.tag || event.category || "Church Event",
    color: event.color || "dark",
    eventDate: event.eventDate || date.toISOString(),
  };
}

async function loadRemoteData() {
  try {
    // Cache-busting timestamp prevents Chrome HTTP cache retention
    const timestamp = Date.now();
    // const [sermonsRes, liveRes, eventsRes] = await Promise.all([
    //   fetch(`/api/sermons?t=${timestamp}`, { cache: "no-store", headers: { "Pragma": "no-cache" } }),
    //   fetch(`/api/live?t=${timestamp}`, { cache: "no-store", headers: { "Pragma": "no-cache" } }),
    //   fetch(`/api/events?t=${timestamp}`, { cache: "no-store", headers: { "Pragma": "no-cache" } }),
    // ]);
   
 const [sermonsRes, liveRes, eventsRes] = await Promise.all([
  apiRequest(`/api/sermons?t=${timestamp}`, {
    cache: "no-store",
    headers: { Pragma: "no-cache" },
  }),
  apiRequest(`/api/live?t=${timestamp}`, {
    cache: "no-store",
    headers: { Pragma: "no-cache" },
  }),
  apiRequest(`/api/events?t=${timestamp}`, {
    cache: "no-store",
    headers: { Pragma: "no-cache" },
  }),
]);

    const rawSermons = sermonsRes.ok ? await sermonsRes.json() : fallbackData.sermons;
    const sermons = Array.isArray(rawSermons)
      ? rawSermons.map((sermon) => ({
          ...sermon,
          preacher: sermon.preacher || sermon.speaker || "Bishop David Oyedepo",
          speaker: sermon.preacher || sermon.speaker || "Bishop David Oyedepo",
        }))
      : fallbackData.sermons;

    const remoteLive = liveRes.ok ? await liveRes.json() : null;
    const rawLiveObj = Array.isArray(remoteLive) ? remoteLive[0] : remoteLive;

    // Check local admin override FIRST
    let localLiveOverride = null;
    try {
      const savedLive = localStorage.getItem("LFC_LIVE_DATA");
      if (savedLive) localLiveOverride = JSON.parse(savedLive);
    } catch {}

    const liveStreamUrl =
      localLiveOverride?.streamUrl ||
      localLiveOverride?.youtubeUrl ||
      rawLiveObj?.streamUrl ||
      rawLiveObj?.youtubeUrl ||
      "";

    const live = {
      ...fallbackData.live,
      ...(rawLiveObj || {}),
      ...(localLiveOverride || {}),
      streamUrl: liveStreamUrl,
      youtubeUrl: liveStreamUrl,
      youtubeId: localLiveOverride?.youtubeId || rawLiveObj?.youtubeId || "",
    };

    const remoteEvents = eventsRes.ok ? await eventsRes.json() : fallbackData.events;
    const events = Array.isArray(remoteEvents)
      ? remoteEvents.map(normalizeEvent).filter(Boolean)
      : fallbackData.events;

    const serverData = {
      ...fallbackData,
      sermons,
      live,
      events,
    };

    localStorage.setItem(STORAGE_KEYS.SITE_DATA, JSON.stringify(serverData));
    return serverData;
  } catch {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.SITE_DATA);
      if (local) {
        const parsed = JSON.parse(local);
        const savedLive = localStorage.getItem("LFC_LIVE_DATA");
        if (savedLive) parsed.live = JSON.parse(savedLive);
        return parsed;
      }
    } catch {}
    return fallbackData;
  }
}

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.SITE_DATA);
      const savedLive = localStorage.getItem("LFC_LIVE_DATA");

      let baseData = fallbackData;
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.events) baseData = parsed;
      }

      if (savedLive) {
        baseData.live = JSON.parse(savedLive);
      }

      return baseData;
    } catch {
      return fallbackData;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRemoteData()
      .then((serverData) => setData(serverData))
      .catch(() => setData(fallbackData))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Cross-tab storage listener
    const onStorage = (e) => {
      if ((e.key === STORAGE_KEYS.SITE_DATA || e.key === "LFC_LIVE_DATA") && e.newValue) {
        try {
          if (e.key === "LFC_LIVE_DATA") {
            const newLive = JSON.parse(e.newValue);
            setData((prev) => ({ ...prev, live: newLive }));
          } else {
            setData(JSON.parse(e.newValue));
          }
        } catch {}
      }
    };

    // Same-tab custom event listener (critical for Chrome single-tab updates)
    const onCustomLiveUpdate = (e) => {
      const detail = e.detail;
      if (detail) {
        setData((prev) => ({ ...prev, live: detail }));
      } else {
        try {
          const saved = localStorage.getItem("LFC_LIVE_DATA");
          if (saved) {
            const parsed = JSON.parse(saved);
            setData((prev) => ({ ...prev, live: parsed }));
          }
        } catch {}
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("lfc_live_updated", onCustomLiveUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lfc_live_updated", onCustomLiveUpdate);
    };
  }, []);

  const updateData = (newData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEYS.SITE_DATA, JSON.stringify(newData));
  };

  return (
    <SiteDataContext.Provider value={{ data, loading, updateData, setData }}>
      {children}
    </SiteDataContext.Provider>
  );
}