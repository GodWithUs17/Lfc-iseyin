const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;