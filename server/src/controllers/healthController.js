const { sendSuccess } = require('../utils/response');

function getHealth(req, res) {
  return sendSuccess(res, 200, {
    ok: true,
    message: 'LFC Iseyin backend is running.',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
