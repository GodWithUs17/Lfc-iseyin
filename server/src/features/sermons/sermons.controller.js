const sermonsService = require('./sermons.service');

async function listSermons(req, res) {
  try {
    const sermons = await sermonsService.listSermons();
    return res.json(sermons);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch sermons' });
  }
}

async function createSermon(req, res) {
  const result = await sermonsService.createSermon(req.body || {});
  return res.status(result.status).json(result.payload);
}

async function updateSermon(req, res) {
  const result = await sermonsService.updateSermon(req.params.id, req.body || {});
  return res.status(result.status).json(result.payload);
}

async function deleteSermon(req, res) {
  const result = await sermonsService.deleteSermon(req.params.id);
  return res.status(result.status).json(result.payload);
}

module.exports = {
  listSermons,
  createSermon,
  updateSermon,
  deleteSermon,
};
