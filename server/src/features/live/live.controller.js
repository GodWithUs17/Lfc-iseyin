const liveService = require('./live.service');

async function getLiveStatus(req, res) {
  try {
    const liveState = await liveService.getLiveState();
    return res.json(liveState);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch live status' });
  }
}

async function updateLiveStatus(req, res) {
  const { isLive, title, preacher, scheduledFor, youtubeId, youtubeUrl } = req.body || {};

  try {
    const liveState = await liveService.updateLiveState({ isLive, title, preacher, scheduledFor, youtubeId, youtubeUrl });
    return res.json(liveState);
  } catch {
    return res.status(400).json({ error: 'Failed to update live status' });
  }
}

module.exports = {
  getLiveStatus,
  updateLiveStatus,
};
