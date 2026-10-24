const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const { requireRole } = require('../../middleware/requireAuth');
const contactController = require('./contact.controller');

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), contactController.listMessages);
router.post('/', contactController.createMessage);
router.patch('/messages/:id/read', contactController.toggleReadStatus);

module.exports = router;
