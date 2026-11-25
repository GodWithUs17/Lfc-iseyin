const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const adminController = require('./admin.controller');

router.use(requireAuth);
router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;