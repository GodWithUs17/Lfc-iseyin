const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const { requireRole } = require('../../middleware/requireAuth');
const liveController = require('./live.controller');

const router = express.Router();

router.get('/', liveController.getLiveStatus);
router.put('/', requireAuth, requireRole('admin'), liveController.updateLiveStatus);

module.exports = router;
