const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fallbackLive = {
  id: 'fallback-live',
  isLive: false,
  title: 'Sunday Service Live',
  preacher: 'Bishop David Oyedepo',
  scheduledFor: 'Sunday 8:00 AM',
  youtubeId: '',
  youtubeUrl: '',
  date: 'Sunday 8:00 AM',
};

async function getLiveState() {
  if (!process.env.DATABASE_URL) {
    return fallbackLive;
  }

  let liveState = await prisma.liveStream.findFirst();
  if (!liveState) {
    liveState = await prisma.liveStream.create({
      data: { isLive: false },
    });
  }

  return {
    ...fallbackLive,
    ...liveState,
    isLive: Boolean(liveState.isLive),
    youtubeUrl: liveState.streamUrl || '',
    youtubeId: (liveState.streamUrl || '').includes('youtube') ? (liveState.streamUrl.match(/[?&]v=([^&]+)/)?.[1] || '') : '',
  };
}

async function updateLiveState(payload) {
  const { isLive, title, preacher, scheduledFor, youtubeId, youtubeUrl } = payload || {};
  const normalizedYoutubeUrl = youtubeUrl || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : '');

  if (!process.env.DATABASE_URL) {
    return {
      id: 'fallback-live',
      isLive: Boolean(isLive),
      title: title || 'Sunday Service Live',
      preacher: preacher || 'Bishop David Oyedepo',
      scheduledFor: scheduledFor || 'Sunday 8:00 AM',
      youtubeId: youtubeId || '',
      youtubeUrl: normalizedYoutubeUrl,
    };
  }

  let liveState = await prisma.liveStream.findFirst();
  if (!liveState) {
    liveState = await prisma.liveStream.create({
      data: { isLive: Boolean(isLive), streamUrl: normalizedYoutubeUrl },
    });
  }

  const updated = await prisma.liveStream.update({
    where: { id: liveState.id },
    data: {
      isLive: Boolean(isLive),
      streamUrl: normalizedYoutubeUrl,
    },
  });

  return {
    ...updated,
    isLive: Boolean(updated.isLive),
    youtubeUrl: updated.streamUrl || '',
    youtubeId: (updated.streamUrl || '').match(/[?&]v=([^&]+)/)?.[1] || '',
  };
}

module.exports = {
  fallbackLive,
  getLiveState,
  updateLiveState,
};
