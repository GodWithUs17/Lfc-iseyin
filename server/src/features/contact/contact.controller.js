const contactService = require('./contact.service');

async function listMessages(req, res) {
  try {
    const messages = await contactService.listMessages();
    return res.json(messages);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
}

async function createMessage(req, res) {
  const result = await contactService.createMessage(req.body || {});
  return res.status(result.status).json(result.payload);
}

// TOGGLE READ STATUS HANDLER
async function toggleReadStatus(req, res) {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const updated = await contactService.toggleReadStatus(id, isRead);
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update message read status' });
  }
}

module.exports = {
  listMessages,
  createMessage,
  toggleReadStatus,
};
