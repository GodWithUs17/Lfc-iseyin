const adminService = require('./admin.service');

async function getAdmins(req, res) {
  try {
    const admins = await adminService.getAllAdmins();
    return res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin accounts.' });
  }
}

async function createAdmin(req, res) {
  try {
    const { name, email, password, role } = req.body || {};
    const result = await adminService.createAdminUser({ name, email, password, role });
    return res.status(result.status).json(result.payload);
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'Failed to create admin account.' });
  }
}

async function deleteAdmin(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const currentAdminId = req.user?.id ? parseInt(req.user.id, 10) : null;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID provided.' });
    }

    const result = await adminService.deleteAdminUser({ id, currentAdminId });
    return res.status(result.status).json(result.payload);
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ error: 'Failed to delete admin account.' });
  }
}

module.exports = {
  getAdmins,
  createAdmin,
  deleteAdmin,
};