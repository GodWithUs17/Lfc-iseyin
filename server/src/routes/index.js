const express = require('express');
const authRoutes = require('../features/auth/auth.routes');
const adminRoutes = require('../features/admin/admin.routes');
const sermonsRoutes = require('../features/sermons/sermons.routes');
const liveRoutes = require('../features/live/live.routes');
const eventsRoutes = require('../features/events/events.routes');
const contactRoutes = require('../features/contact/contact.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sermons', sermonsRoutes);
router.use('/live', liveRoutes);
router.use('/events', eventsRoutes);
router.use('/contact', contactRoutes);
router.use('/admins', adminRoutes);
module.exports = router;
