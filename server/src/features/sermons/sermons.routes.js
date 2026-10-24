const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const { requireRole } = require('../../middleware/requireAuth');
const sermonsController = require('./sermons.controller');

const router = express.Router();

router.get('/', sermonsController.listSermons);
router.post('/', requireAuth, requireRole('admin'), sermonsController.createSermon);
router.put('/:id', requireAuth, requireRole('admin'), sermonsController.updateSermon);
router.delete('/:id', requireAuth, requireRole('admin'), sermonsController.deleteSermon);

module.exports = router;
