const eventsService = require('./events.service');

async function listEvents(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const events = await eventsService.listEvents();
    return res.json(events);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

async function createEvent(req, res) {
  const { title, description, bannerUrl, eventDate, time, location, category } = req.body || {};

  try {
    const event = await eventsService.createEvent({ title, description, bannerUrl, eventDate, time, location, category });
    return res.status(201).json(event);
  } catch {
    return res.status(400).json({ error: 'Failed to create event' });
  }
}

async function updateEvent(req, res) {
  const { id } = req.params;
  const { title, description, bannerUrl, eventDate, time, location, category } = req.body || {};

  try {
    const event = await eventsService.updateEvent(id, { title, description, bannerUrl, eventDate, time, location, category });
    return res.json(event);
  } catch {
    return res.status(400).json({ error: 'Failed to update event' });
  }
}

async function deleteEvent(req, res) {
  const { id } = req.params;

  try {
    const result = await eventsService.deleteEvent(id);
    return res.json(result);
  } catch {
    return res.status(400).json({ error: 'Failed to delete event' });
  }
}

module.exports = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
