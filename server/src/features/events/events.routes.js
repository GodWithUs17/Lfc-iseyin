const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const { requireRole } = require('../../middleware/requireAuth');
const eventsController = require('./events.controller');

const router = express.Router();

router.get('/', eventsController.listEvents);
router.post('/', requireAuth, requireRole('admin'), eventsController.createEvent);
router.put('/:id', requireAuth, requireRole('admin'), eventsController.updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), eventsController.deleteEvent);

module.exports = router;
