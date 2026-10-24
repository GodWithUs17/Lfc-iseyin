
const authService = require('./auth.service');

async function register(req, res) {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  // Pass the raw role through; service handles uppercase normalization & validation
  const role = String(req.body?.role || 'ADMIN').trim();

  const result = await authService.registerUser({ name, email, password, role });
  return res.status(result.status).json(result.payload);
}

async function login(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  const result = await authService.loginUser({ email, password });
  return res.status(result.status).json(result.payload);
}

function getCurrentUser(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  getCurrentUser,
};