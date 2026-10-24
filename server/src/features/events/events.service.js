const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fallbackEvents = [
  {
    id: 'fallback-event-1',
    title: 'Covenant Day of Financial fortune',
    description: 'Every siege of barrenness is declared broken. Come with your family and invite the barren around you.',
    bannerUrl: '',
    eventDate: '2026-11-13T00:00:00.000Z',
    time: '8:00 AM',
    location: 'church auditorium',
    category: 'Main Auditorium • Free',
    day: '13',
    monthYear: 'November • Friday • 8:00 AM',
    tag: 'Main Auditorium • Free',
    color: 'dark',
  },
];

function formatDisplayTime(value) {
  if (!value) return '8:00 AM';

  const trimmed = String(value).trim();
  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = timeMatch[2];
    const suffix = hours >= 12 ? 'PM' : 'AM';
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
  if (!event) return null;
  const eventDate = new Date(event.eventDate || event.date || Date.now());
  const day = String(eventDate.getDate()).padStart(2, '0');

  const formattedMonth = eventDate.toLocaleString('en-US', { month: 'long' });
  const formattedDay = eventDate.toLocaleString('en-US', { weekday: 'long' });
  const timeStr = formatDisplayTime(event.time || eventDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));

  const monthYear = event.monthYear || `${formattedMonth} • ${formattedDay} • ${timeStr}`;

  return {
    id: event.id || `event-${Date.now()}`,
    title: event.title || 'Church Event',
    description: event.description || '',
    bannerUrl: event.bannerUrl || '',
    eventDate: eventDate.toISOString(),
    time: timeStr,
    location: event.location || 'LFC Iseyin Auditorium',
    category: event.category || 'Church Event',
    day,
    monthYear,
    tag: event.category || 'Main Auditorium • Free',
    color: event.color || 'dark',
  };
}

async function listEvents() {
  if (!process.env.DATABASE_URL) {
    return fallbackEvents.map(normalizeEvent);
  }

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
  });

  if (!events.length) {
    return fallbackEvents.map(normalizeEvent);
  }

  return events.map(normalizeEvent);
}

async function createEvent(data) {
  const { title, description, bannerUrl, eventDate, time, location, category } = data || {};

  if (!process.env.DATABASE_URL) {
    return normalizeEvent({ title, description, bannerUrl, eventDate, time, location, category });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      bannerUrl,
      eventDate: new Date(eventDate || new Date()),
      time: time || '8:00 AM',
      location: location || 'church auditorium',
      category: category || 'Main Auditorium • Free',
    },
  });

  return normalizeEvent(event);
}

async function updateEvent(id, data) {
  const { title, description, bannerUrl, eventDate, time, location, category } = data || {};

  if (!process.env.DATABASE_URL) {
    return normalizeEvent({ id, title, description, bannerUrl, eventDate, time, location, category });
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      bannerUrl,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      time,
      location,
      category,
    },
  });

  return normalizeEvent(event);
}

async function deleteEvent(id) {
  if (!process.env.DATABASE_URL) {
    return { message: 'Event deleted successfully' };
  }

  await prisma.event.delete({ where: { id } });
  return { message: 'Event deleted successfully' };
}

module.exports = {
  normalizeEvent,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
