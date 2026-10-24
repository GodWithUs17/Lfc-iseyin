const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fallbackSermons = [
  {
    id: 'fallback-sermon-1',
    title: 'Understanding the Wonders of Thanksgiving',
    preacher: 'Bishop David O. Oyedepo',
    date: '2026-10-01',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'Sunday Service',
  },
];

function normalizeSermonRecord(sermon) {
  if (!sermon || typeof sermon !== 'object') return null;

  const sermonDate = sermon.date ? new Date(sermon.date) : null;
  const safeDate = sermonDate && !Number.isNaN(sermonDate.getTime())
    ? sermonDate.toISOString().slice(0, 10)
    : (typeof sermon.date === 'string' ? sermon.date.slice(0, 10) : new Date().toISOString().slice(0, 10));

  const preacher = sermon.preacher || sermon.speaker || 'Bishop David O. Oyedepo';
  const youtubeUrl = sermon.youtubeUrl || sermon.audioUrl || '';

  return {
    ...sermon,
    id: sermon.id,
    title: sermon.title || 'Sermon Message',
    preacher,
    speaker: preacher,
    youtubeUrl,
    youtubeId: sermon.youtubeId || (youtubeUrl.includes('v=') ? youtubeUrl.split('v=')[1]?.split('&')[0] || '' : youtubeUrl.match(/[\w-]{11}/)?.[0] || ''),
    audioUrl: youtubeUrl,
    date: safeDate,
    category: sermon.category || 'Sunday Service',
  };
}

async function listSermons() {
  if (!process.env.DATABASE_URL) {
    return fallbackSermons;
  }

  const sermons = await prisma.sermon.findMany({
    orderBy: { date: 'desc' },
  });

  return sermons.map(normalizeSermonRecord).filter(Boolean);
}

async function createSermon(payload) {
  const { title, preacher, youtubeUrl, youtubeId, category, date } = payload || {};

  if (!title) {
    return {
      status: 400,
      payload: { message: 'Title is required.' },
    };
  }

  const normalizedPayload = {
    title,
    speaker: preacher || 'Bishop David O. Oyedepo',
    audioUrl: youtubeUrl || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : ''),
    date: date ? new Date(date) : new Date(),
    category: category || 'Sunday Service',
  };

  if (!process.env.DATABASE_URL) {
    return {
      status: 201,
      payload: {
        id: `sermon-${Date.now()}`,
        title,
        preacher: normalizedPayload.speaker,
        date: normalizedPayload.date.toISOString().slice(0, 10),
        youtubeUrl: normalizedPayload.audioUrl,
        youtubeId: youtubeId || '',
        category: normalizedPayload.category,
      },
    };
  }

  try {
    const sermon = await prisma.sermon.create({ data: normalizedPayload });
    return {
      status: 201,
      payload: normalizeSermonRecord(sermon),
    };
  } catch {
    return {
      status: 400,
      payload: { error: 'Failed to create sermon' },
    };
  }
}

async function updateSermon(id, payload) {
  const { title, preacher, youtubeUrl, youtubeId, category, date } = payload || {};

  if (!process.env.DATABASE_URL) {
    return {
      status: 200,
      payload: {
        id,
        title: title || 'Updated sermon',
        preacher: preacher || 'Bishop David O. Oyedepo',
        date: date || new Date().toISOString().slice(0, 10),
        youtubeUrl: youtubeUrl || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : ''),
        youtubeId: youtubeId || '',
        category: category || 'Sunday Service',
      },
    };
  }

  try {
    const sermon = await prisma.sermon.update({
      where: { id },
      data: {
        title,
        speaker: preacher,
        audioUrl: youtubeUrl || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined),
        date: date ? new Date(date) : undefined,
        category: category || 'Sunday Service',
      },
    });

    return {
      status: 200,
      payload: normalizeSermonRecord(sermon),
    };
  } catch {
    return {
      status: 400,
      payload: { error: 'Failed to update sermon' },
    };
  }
}

async function deleteSermon(id) {
  if (!process.env.DATABASE_URL) {
    return {
      status: 200,
      payload: { message: 'Sermon deleted successfully' },
    };
  }

  try {
    await prisma.sermon.delete({ where: { id } });
    return {
      status: 200,
      payload: { message: 'Sermon deleted successfully' },
    };
  } catch {
    return {
      status: 400,
      payload: { error: 'Failed to delete sermon' },
    };
  }
}

module.exports = {
  fallbackSermons,
  normalizeSermonRecord,
  listSermons,
  createSermon,
  updateSermon,
  deleteSermon,
};
