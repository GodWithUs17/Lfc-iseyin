const test = require('node:test');
const assert = require('node:assert/strict');

const { requireRole } = require('./requireAuth');

test('requireRole matches role names without case sensitivity', () => {
  let nextCalled = false;
  const response = {
    statusCode: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  requireRole('admin')({ user: { role: 'ADMIN' } }, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, null);
});
