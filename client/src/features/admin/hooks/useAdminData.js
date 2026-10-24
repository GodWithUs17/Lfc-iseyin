import { useEffect, useMemo, useState } from "react";
import useSiteData from "@/hooks/useSiteData";
import { STORAGE_KEYS } from "@/config/constants";
import { apiRequest } from "@/lib/api";

const DEFAULT_LIVE_DATA = {
  isLive: false,
  title: "Sunday Service Live",
  youtubeId: "",
  youtubeUrl: "",
  scheduledFor: "Sunday 8:00 AM",
  preacher: "Bishop David Oyedepo",
};

// Helper: Extract valid 11-char YouTube ID from full URLs or raw IDs
const extractYouTubeId = (input = "") => {
  if (!input) return "";
  const str = String(input).trim();
  const match = str.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/|shorts\/|^)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : (str.length === 11 ? str : "");
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

const normalizeEvent = (event) => {
  if (!event || typeof event !== "object") return null;

  const rawDate = event.eventDate || event.date || new Date().toISOString();
  const date = new Date(rawDate);
  const resolvedDate = Number.isNaN(date.getTime()) ? new Date() : date;

  const formattedDate = `${resolvedDate.getFullYear()}-${String(resolvedDate.getMonth() + 1).padStart(2, "0")}-${String(resolvedDate.getDate()).padStart(2, "0")}`;
  const timeText = formatDisplayTime(event.time || "08:00");

  return {
    ...event,
    id: event.id || `event-${Date.now()}`,
    title: event.title || "Church Event",
    description: event.description || "",
    date: formattedDate,
    eventDate: formattedDate,
    time: timeText,
    location: event.location || "LFC Iseyin Auditorium",
    category: event.category || event.tag || "Main Auditorium • Free",
    bannerUrl: event.bannerUrl || "",
  };
};

const normalizeSermon = (sermon) => {
  if (!sermon || typeof sermon !== "object") return null;

  const rawDate = sermon.date || new Date().toISOString();
  const date = new Date(rawDate);
  const resolvedDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const formattedDate = `${resolvedDate.getFullYear()}-${String(resolvedDate.getMonth() + 1).padStart(2, "0")}-${String(resolvedDate.getDate()).padStart(2, "0")}`;
  const youtubeUrl = sermon.youtubeUrl || sermon.audioUrl || "";
  const youtubeId = sermon.youtubeId || extractYouTubeId(youtubeUrl);

  return {
    ...sermon,
    id: sermon.id || `sermon-${Date.now()}`,
    title: sermon.title || "Sermon Message",
    preacher: sermon.preacher || sermon.speaker || "Bishop David Oyedepo",
    date: formattedDate,
    youtubeUrl,
    youtubeId,
    category: sermon.category || "Sunday Service",
  };
};

export default function useAdminData() {
  const { data } = useSiteData();

  const [authed, setAuthed] = useState(() => !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(() => localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || "admin@lfciseyin.org");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [tab, setTab] = useState("overview");

  // Admin and Staff Management State
  const [admins, setAdmins] = useState([]);

  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]");
    } catch {
      return [];
    }
  });

  const [sermons, setSermons] = useState(() => {
    try {
      const saved = localStorage.getItem("LFC_SERMONS");
      const raw = saved ? JSON.parse(saved) : [];
      return Array.isArray(raw) ? raw.map(normalizeSermon).filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  const [liveData, setLiveData] = useState(() => {
    const saved = localStorage.getItem("LFC_LIVE_DATA");
    return saved ? JSON.parse(saved) : data?.live || DEFAULT_LIVE_DATA;
  });

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("LFC_EVENTS");
      const raw = saved ? JSON.parse(saved) : [];
      return Array.isArray(raw) ? raw.map(normalizeEvent).filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  // Verify authentication session on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return;

    apiRequest("/api/auth/me")
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then((payload) => {
        setAuthed(true);
        if (payload?.user) {
          setCurrentUser(payload.user);
          if (payload.user.email) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, payload.user.email);
            setEmail(payload.user.email);
          }
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        setAuthed(false);
        setCurrentUser(null);
      });
  }, []);

  // Fetch initial server data when authenticated
  useEffect(() => {
    if (!authed) return;

    let active = true;

    const loadServerData = async () => {
      try {
        const [sermonsResponse, eventsResponse, messagesResponse, adminsResponse] = await Promise.all([
          apiRequest("/api/sermons"),
          apiRequest("/api/events"),
          apiRequest("/api/contact/messages"),
          apiRequest("/api/admins"),
        ]);

        if (!active) return;

        if (sermonsResponse.ok) {
          const payload = await sermonsResponse.json();
          const nextSermons = Array.isArray(payload) ? payload.map(normalizeSermon).filter(Boolean) : [];
          setSermons(nextSermons);
          localStorage.setItem("LFC_SERMONS", JSON.stringify(nextSermons));
        }

        if (eventsResponse.ok) {
          const payload = await eventsResponse.json();
          const nextEvents = Array.isArray(payload) ? payload.map(normalizeEvent).filter(Boolean) : [];
          setEvents(nextEvents);
          localStorage.setItem("LFC_EVENTS", JSON.stringify(nextEvents));
        }

        if (messagesResponse.ok) {
          const payload = await messagesResponse.json();
          const list = Array.isArray(payload) ? payload : [];
          setMessages(list);
          localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
        }

        if (adminsResponse.ok) {
          const payload = await adminsResponse.json();
          setAdmins(Array.isArray(payload) ? payload : []);
        }
      } catch {
        if (!active) return;

        const savedSermons = JSON.parse(localStorage.getItem("LFC_SERMONS") || "[]");
        const savedEvents = JSON.parse(localStorage.getItem("LFC_EVENTS") || "[]");
        const savedMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]");
        setSermons(Array.isArray(savedSermons) ? savedSermons.map(normalizeSermon).filter(Boolean) : []);
        setEvents(Array.isArray(savedEvents) ? savedEvents.map(normalizeEvent).filter(Boolean) : []);
        setMessages(Array.isArray(savedMessages) ? savedMessages : []);
      }
    };

    loadServerData();

    return () => {
      active = false;
    };
  }, [authed]);

  useEffect(() => {
    localStorage.setItem("LFC_SERMONS", JSON.stringify(sermons));
  }, [sermons]);

  useEffect(() => {
    localStorage.setItem("LFC_LIVE_DATA", JSON.stringify(liveData));
  }, [liveData]);

  useEffect(() => {
    localStorage.setItem("LFC_EVENTS", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Messages Handlers
  const refreshMessages = async () => {
    try {
      const response = await apiRequest("/api/contact/messages");
      if (!response.ok) return messages;
      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : [];
      setMessages(list);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
      return list;
    } catch {
      return messages;
    }
  };

  const toggleMessageRead = async (id, currentIsRead) => {
    const nextIsRead = !currentIsRead;
    const nextStatus = nextIsRead ? "read" : "unread";

    // Optimistic UI state update
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id || msg._id === id
          ? { ...msg, status: nextStatus, isRead: nextIsRead }
          : msg
      )
    );

    try {
      const response = await apiRequest(`/api/contact/messages/${id}/read`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: nextIsRead }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status on server");
      }
    } catch (error) {
      console.error("Failed to sync message status:", error);
      // Rollback optimistic state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id || msg._id === id
            ? { ...msg, status: currentIsRead ? "read" : "unread", isRead: currentIsRead }
            : msg
        )
      );
    }
  };

  // Authentication Handlers
  const login = async () => {
    setErr(false);
    setErrMessage("");

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pass }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || payload.message || "Invalid credentials.");

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, payload.token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, payload.user.email);
      setAuthed(true);
      setCurrentUser(payload.user);
      setPass("");
      await Promise.all([refreshEvents(), refreshSermons(), refreshAdmins(), refreshMessages()]);
    } catch (error) {
      setErr(true);
      setErrMessage(error.message || "Login failed.");
    }
  };

  const register = async () => {
    setErr(false);
    setErrMessage("");

    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password: pass, role }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || payload.message || "Registration failed.");

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, payload.token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, payload.user.email);
      setAuthed(true);
      setCurrentUser(payload.user);
      setPass("");
      setName("");
      await Promise.all([refreshEvents(), refreshSermons(), refreshAdmins(), refreshMessages()]);
    } catch (error) {
      setErr(true);
      setErrMessage(error.message || "Registration failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setAuthed(false);
    setCurrentUser(null);
    setTab("overview");
  };

  // Staff / Admin Management Handlers
  const refreshAdmins = async () => {
    try {
      const response = await apiRequest("/api/admins");
      if (!response.ok) return [];
      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : [];
      setAdmins(list);
      return list;
    } catch {
      return [];
    }
  };

  const createAdmin = async (adminData) => {
    const response = await apiRequest("/api/admins", {
      method: "POST",
      body: JSON.stringify({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        role: adminData.role || "ADMIN",
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || payload.message || "Failed to create admin account.");
    }

    await refreshAdmins();
    return payload;
  };

  const deleteAdmin = async (id) => {
    const response = await apiRequest(`/api/admins/${id}`, {
      method: "DELETE",
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || payload.message || "Failed to delete admin account.");
    }

    setAdmins((prev) => prev.filter((item) => item.id !== id));
    return true;
  };

  // Event Handlers
  const refreshEvents = async () => {
    try {
      const response = await apiRequest("/api/events");
      if (!response.ok) {
        const saved = JSON.parse(localStorage.getItem("LFC_EVENTS") || "[]");
        const fallback = Array.isArray(saved) ? saved.map(normalizeEvent).filter(Boolean) : [];
        setEvents(fallback);
        return fallback;
      }

      const payload = await response.json();
      const nextEvents = Array.isArray(payload) ? payload.map(normalizeEvent).filter(Boolean) : [];
      setEvents(nextEvents);
      localStorage.setItem("LFC_EVENTS", JSON.stringify(nextEvents));
      return nextEvents;
    } catch {
      const saved = JSON.parse(localStorage.getItem("LFC_EVENTS") || "[]");
      const fallback = Array.isArray(saved) ? saved.map(normalizeEvent).filter(Boolean) : [];
      setEvents(fallback);
      return fallback;
    }
  };

  const saveEvent = async (payload, eventId = null) => {
    const url = eventId ? `/api/events/${eventId}` : "/api/events";
    const method = eventId ? "PUT" : "POST";

    const response = await apiRequest(url, {
      method,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to save event.");
    }

    const saved = await response.json();
    const normalizedSaved = normalizeEvent({ ...payload, ...(saved || {}), id: saved?.id || payload.id || `event-${Date.now()}` });

    setEvents((prev) => {
      if (eventId) {
        return prev.map((item) => (item.id === eventId ? normalizedSaved : item));
      }
      return [normalizedSaved, ...prev];
    });

    await refreshEvents();
    return normalizedSaved;
  };

  const deleteEvent = async (id) => {
    const response = await apiRequest(`/api/events/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete event.");

    setEvents((prev) => prev.filter((item) => item.id !== id));
    return true;
  };

  // Sermon Handlers
  const refreshSermons = async () => {
    try {
      const response = await apiRequest("/api/sermons");
      if (!response.ok) {
        const saved = JSON.parse(localStorage.getItem("LFC_SERMONS") || "[]");
        const fallback = Array.isArray(saved) ? saved.map(normalizeSermon).filter(Boolean) : [];
        setSermons(fallback);
        return fallback;
      }

      const payload = await response.json();
      const nextSermons = Array.isArray(payload) ? payload.map(normalizeSermon).filter(Boolean) : [];
      setSermons(nextSermons);
      localStorage.setItem("LFC_SERMONS", JSON.stringify(nextSermons));
      return nextSermons;
    } catch {
      const saved = JSON.parse(localStorage.getItem("LFC_SERMONS") || "[]");
      const fallback = Array.isArray(saved) ? saved.map(normalizeSermon).filter(Boolean) : [];
      setSermons(fallback);
      return fallback;
    }
  };

  const saveSermon = async (payload, sermonId = null) => {
    const url = sermonId ? `/api/sermons/${sermonId}` : "/api/sermons";
    const method = sermonId ? "PUT" : "POST";

    const body = {
      title: payload.title?.trim() || "",
      preacher: payload.preacher?.trim() || "Bishop David Oyedepo",
      date: payload.date || new Date().toISOString(),
      youtubeUrl: payload.youtubeUrl || payload.youtubeId || "",
      youtubeId: extractYouTubeId(payload.youtubeId || payload.youtubeUrl || ""),
      category: payload.category || "Sunday Service",
    };

    const response = await apiRequest(url, {
      method,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Unable to save sermon.");
    }

    const saved = await response.json();
    const nextSermon = normalizeSermon({
      ...payload,
      ...(saved || {}),
      id: saved?.id || payload.id || `sermon-${Date.now()}`,
      title: payload.title?.trim() || saved?.title || "Sermon Message",
      preacher: payload.preacher?.trim() || saved?.preacher || saved?.speaker || "Bishop David Oyedepo",
      youtubeUrl: payload.youtubeUrl || payload.youtubeId ? payload.youtubeUrl || payload.youtubeId : saved?.youtubeUrl || saved?.audioUrl || "",
      youtubeId: extractYouTubeId(payload.youtubeId || payload.youtubeUrl || saved?.youtubeId || ""),
      category: payload.category || saved?.category || "Sunday Service",
    });

    setSermons((prev) => {
      if (sermonId) {
        return prev.map((item) => (item.id === sermonId ? nextSermon : item));
      }
      return [nextSermon, ...prev];
    });

    await refreshSermons();
    return nextSermon;
  };

  const deleteSermon = async (id) => {
    const response = await apiRequest(`/api/sermons/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete sermon.");

    setSermons((prev) => prev.filter((item) => item.id !== id));
    await refreshSermons();
    return true;
  };


// Live Settings Handler in useAdminData.js
const saveLiveSettings = async (payload) => {
  const rawInput = payload.youtubeUrl || payload.youtubeId || payload.streamUrl || "";
  const extractedId = extractYouTubeId(rawInput);
  const fullUrl = extractedId 
    ? `https://www.youtube.com/watch?v=${extractedId}` 
    : (rawInput.startsWith("http") ? rawInput : "");

  // Payload formatted specifically for your Prisma backend schema
  const apiPayload = {
    isLive: Boolean(payload.isLive),
    streamUrl: fullUrl || rawInput,
  };

  const response = await apiRequest("/api/live", {
    method: "PUT",
    body: JSON.stringify(apiPayload),
  });

  if (!response.ok) throw new Error("Update failed");

  const updated = await response.json().catch(() => ({}));

  // Map server response (streamUrl) back to frontend properties
  const savedStreamUrl = updated.streamUrl || fullUrl || rawInput;
  const savedId = extractYouTubeId(savedStreamUrl) || extractedId;

  const finalLiveData = {
    ...payload,
    isLive: updated.isLive !== undefined ? Boolean(updated.isLive) : Boolean(payload.isLive),
    streamUrl: savedStreamUrl,
    youtubeUrl: savedStreamUrl,
    youtubeId: savedId,
    title: payload.title?.trim() || "Sunday Service Live",
    preacher: payload.preacher?.trim() || "Bishop David Oyedepo",
    scheduledFor: payload.scheduledFor?.trim() || "Sunday 8:00 AM",
  };

  setLiveData(finalLiveData);
  localStorage.setItem("LFC_LIVE_DATA", JSON.stringify(finalLiveData));

  // Sync SiteDataContext local storage for instant homepage updates
  try {
    const siteDataRaw = localStorage.getItem(STORAGE_KEYS.SITE_DATA);
    if (siteDataRaw) {
      const siteParsed = JSON.parse(siteDataRaw);
      siteParsed.live = finalLiveData;
      localStorage.setItem(STORAGE_KEYS.SITE_DATA, JSON.stringify(siteParsed));
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.SITE_DATA, newValue: JSON.stringify(siteParsed) }));
    }
  } catch {}

  window.dispatchEvent(new StorageEvent("storage", { key: "LFC_LIVE_DATA", newValue: JSON.stringify(finalLiveData) }));

  return finalLiveData;
};

  const summary = useMemo(
    () => ({
      totalEvents: events.length,
      totalMessages: messages.length,
      totalSermons: sermons.length,
      totalAdmins: admins.length,
      liveStatus: liveData.isLive ? "Live" : "Offline",
    }),
    [events.length, messages.length, sermons.length, admins.length, liveData.isLive]
  );

  return {
    authed,
    currentUser,
    mode,
    setMode,
    name,
    setName,
    email,
    setEmail,
    pass,
    setPass,
    role,
    setRole,
    err,
    setErr,
    errMessage,
    setErrMessage,
    tab,
    setTab,
    admins,
    messages,
    setMessages,
    refreshMessages,
    toggleMessageRead,
    sermons,
    liveData,
    setLiveData,
    events,
    setEvents,
    summary,
    login,
    register,
    logout,
    refreshAdmins,
    createAdmin,
    deleteAdmin,
    saveEvent,
    deleteEvent,
    saveSermon,
    deleteSermon,
    refreshEvents,
    refreshSermons,
    saveLiveSettings,
  };
}