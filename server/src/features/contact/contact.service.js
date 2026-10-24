const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const fallbackMessages = [];

async function listMessages() {
  if (!process.env.DATABASE_URL) {
    return fallbackMessages;
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return messages;
}

async function toggleReadStatus(id, isRead) {
  const newStatus = isRead ? "read" : "unread";

  if (!process.env.DATABASE_URL) {
    const index = fallbackMessages.findIndex((msg) => String(msg.id) === String(id));
    if (index === -1) {
      return { id, status: newStatus };
    }

    const updated = { ...fallbackMessages[index], status: newStatus };
    fallbackMessages[index] = updated;
    return updated;
  }

  return await prisma.contactMessage.update({
    where: { id },
    data: { status: newStatus },
  });
}

async function createMessage(payload) {
  const name = String(payload.name || '').trim();
  const phone = String(payload.phone || '').trim();
  const email = String(payload.email || '').trim();
  const type = String(payload.type || 'General').trim();
  const message = String(payload.message || '').trim();
  const church = String(payload.church || 'LFC Iseyin').trim();

  if (!name || !phone || !message) {
    return {
      status: 400,
      payload: { message: 'Name, phone, and message are required.' },
    };
  }

  if (!process.env.DATABASE_URL) {
    const saved = {
      id: `contact-${Date.now()}`,
      name,
      phone,
      email: email || null,
      type,
      message,
      church,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    fallbackMessages.unshift(saved);
    return {
      status: 201,
      payload: saved,
    };
  }

  try {
    const saved = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        email: email || null,
        type,
        message,
        church,
        status: 'new',
      },
    });

    return {
      status: 201,
      payload: saved,
    };
  } catch {
    return {
      status: 400,
      payload: { error: 'Failed to save contact message' },
    };
  }
}

module.exports = {
  toggleReadStatus,
  fallbackMessages,
  listMessages,
  createMessage,
};
