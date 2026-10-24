import { useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import EventModal from "./modals/EventModal";
import SermonModal from "./modals/SermonModal";
import LiveBroadcastModal from "./modals/LiveBroadcastModal";
import OverviewTab from "./views/OverviewTab";
import LiveSettingsTab from "./views/LiveSettingsTab";
import EventsTable from "./tables/EventsTable";
import SermonsTable from "./tables/SermonsTable";
import MessagesTab from "./tables/MessagesTab";
import AdminManagement from "./views/AdminManagement";
import useAdminData from "./hooks/useAdminData";

const emptyEvent = {
  id: "",
  title: "",
  eventDate: "",
  date: "",
  time: "08:00",
  location: "LFC Iseyin Auditorium",
  description: "",
  category: "Main Auditorium • Free",
  bannerUrl: "",
};

const emptySermon = {
  id: "",
  title: "",
  preacher: "Bishop David Oyedepo",
  date: "",
  youtubeUrl: "",
  youtubeId: "",
  category: "Sunday Service",
};

export default function AdminDashboard() {
  const admin = useAdminData();
  const [eventDraft, setEventDraft] = useState(emptyEvent);
  const [sermonDraft, setSermonDraft] = useState(emptySermon);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isSermonModalOpen, setSermonModalOpen] = useState(false);
  const [liveModal, setLiveModal] = useState({ isOpen: false, actionType: "preview" });
  const [liveBusy, setLiveBusy] = useState(false);
  const [eventBusy, setEventBusy] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "live", label: "Live Stream" },
    { id: "sermons", label: "Sermons" },
    { id: "events", label: "Events" },
    { id: "messages", label: "Messages" },
    { id: "admins", label: "Admins" },
  ];

  const unreadMessagesCount = (admin.messages || []).filter((message) => {
    const status = String(message?.status || "").toLowerCase();
    return status !== "read";
  }).length;

  const summary = [
    { label: "Events", value: admin.events.length, sub: "upcoming" },
    { label: "Sermons", value: admin.sermons.length, sub: "published" },
    { label: "Messages", value: unreadMessagesCount, sub: "unread" },
    { label: "Live", value: admin.liveData.isLive ? "Live" : "Offline", sub: "stream state" },
  ];

  if (!admin.authed) {
    return (
      <AdminLogin
        email={admin.email}
        setEmail={admin.setEmail}
        pass={admin.pass}
        setPass={admin.setPass}
        err={admin.err}
        errMessage={admin.errMessage}
        isLoading={admin.isLoading}
        onLogin={admin.login}
      />
    );
  }

  const handleOpenAddEvent = () => {
    setEventDraft(emptyEvent);
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (event) => {
    setEventDraft({
      ...emptyEvent,
      ...event,
      eventDate: event.eventDate || event.date || "",
      date: event.eventDate || event.date || "",
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (payload) => {
    setEventBusy(true);
    try {
      await admin.saveEvent(payload, eventDraft?.id || null);
      toast.success(eventDraft?.id ? "Event updated successfully!" : "New event created!");
    } catch (error) {
      toast.error(error.message || "Failed to save event.");
    } finally {
      setEventBusy(false);
      setEventModalOpen(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setDeletingEventId(id);
    try {
      await admin.deleteEvent(id);
      toast.success("Event deleted.");
    } catch (error) {
      toast.error(error.message || "Failed to delete event.");
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleOpenAddSermon = () => {
    setSermonDraft(emptySermon);
    setSermonModalOpen(true);
  };

  const handleOpenEditSermon = (sermon) => {
    setSermonDraft({ ...emptySermon, ...sermon });
    setSermonModalOpen(true);
  };

  const handleSaveSermon = async (payload) => {
    try {
      await admin.saveSermon(payload, sermonDraft?.id || null);
      toast.success(sermonDraft?.id ? "Sermon updated!" : "New sermon published!");
      setSermonModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save sermon.");
    }
  };

  const handleDeleteSermon = async (id) => {
    try {
      await admin.deleteSermon(id);
      toast.success("Sermon removed.");
    } catch (error) {
      toast.error(error.message || "Failed to delete sermon.");
    }
  };

  const handleLiveChange = (key, value) => {
    admin.setLiveData((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenLiveModal = (actionType = "preview") => {
    setLiveModal({ isOpen: true, actionType });
  };

  const handlePreviewLive = async () => {
    const streamUrl = admin.liveData.youtubeUrl || (admin.liveData.youtubeId ? `https://www.youtube.com/watch?v=${admin.liveData.youtubeId}` : "https://www.youtube.com/@winnerschapel");

    window.open(streamUrl, "_blank", "noopener,noreferrer");
    toast.success("Live preview link opened.");
    setLiveModal({ isOpen: false, actionType: "preview" });
  };

  const handleGoLive = async () => {
    try {
      setLiveBusy(true);
      const nextLiveData = { ...admin.liveData, isLive: true };
      admin.setLiveData(nextLiveData);
      await admin.saveLiveSettings(nextLiveData);
      toast.success("Broadcast is now live.");
      setLiveModal({ isOpen: false, actionType: "preview" });
    } catch (error) {
      toast.error(error.message || "Unable to go live right now.");
    } finally {
      setLiveBusy(false);
    }
  };

  const handleLiveSave = async () => {
    try {
      setLiveBusy(true);
      await admin.saveLiveSettings(admin.liveData);
      toast.success("Livestream settings saved successfully!");
    } catch (error) {
      toast.error(error.message || "Unable to save live settings.");
    } finally {
      setLiveBusy(false);
    }
  };

  const renderTab = () => {
    switch (admin.tab) {
      case "live":
        return (
          <LiveSettingsTab
            liveData={admin.liveData}
            onChange={handleLiveChange}
            onSave={handleLiveSave}
            isSaving={liveBusy}
          />
        );
      case "sermons":
        return (
          <SermonsTable
            sermons={admin.sermons}
            onCreateNew={handleOpenAddSermon}
            onEdit={handleOpenEditSermon}
            onDelete={handleDeleteSermon}
          />
        );
      case "events":
        return (
          <EventsTable
            events={admin.events}
            onCreateNew={handleOpenAddEvent}
            onEdit={handleOpenEditEvent}
            onDelete={handleDeleteEvent}
            pendingDeleteId={deletingEventId}
          />
        );
      case "messages":
        return (
          <MessagesTab
            messages={admin.messages}
            toggleMessageRead={admin.toggleMessageRead}
          />
        );
      case "admins":
        return (
          <AdminManagement
            admins={admin.admins || []}
            onAddAdmin={admin.register}
            onDeleteAdmin={admin.deleteAdmin}
          />
        );
      default:
        return (
          <OverviewTab
            summary={summary}
            events={admin.events}
            sermons={admin.sermons}
            messages={admin.messages}
            liveData={admin.liveData}
            onOpenAddEvent={handleOpenAddEvent}
            onOpenAddSermon={handleOpenAddSermon}
            onPreviewLive={() => handleOpenLiveModal("preview")}
            onGoLive={() => handleOpenLiveModal("go-live")}
          />
        );
    }
  };

  return (
    <>
      <AdminLayout
        title="LFC Iseyin"
        subtitle="Executive Admin"
        summary={summary}
        onLogout={admin.logout}
        tab={admin.tab}
        setTab={admin.setTab}
        tabs={tabs}
      >
        {renderTab()}
      </AdminLayout>

      <EventModal
        initialValues={eventDraft}
        isOpen={isEventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSubmit={handleSaveEvent}
        isSaving={eventBusy}
        saveLabel={eventDraft?.id ? "Save Changes" : "Create Event"}
      />

      <SermonModal
        initialValues={sermonDraft}
        isOpen={isSermonModalOpen}
        onClose={() => setSermonModalOpen(false)}
        onSubmit={handleSaveSermon}
      />

      <LiveBroadcastModal
        isOpen={liveModal.isOpen}
        actionType={liveModal.actionType}
        liveData={admin.liveData}
        onClose={() => setLiveModal({ isOpen: false, actionType: "preview" })}
        onConfirm={liveModal.actionType === "preview" ? handlePreviewLive : handleGoLive}
        isBusy={liveBusy}
      />
    </>
  );
}