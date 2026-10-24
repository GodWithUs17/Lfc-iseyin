function getServerStatus() {
  return {
    ok: true,
    message: 'LFC Iseyin backend is running.',
  };
}

module.exports = {
  getServerStatus,
};
