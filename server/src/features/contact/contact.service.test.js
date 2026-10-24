const test = require('node:test');
const assert = require('node:assert/strict');

const prismaModulePath = require.resolve('@prisma/client');
const serviceModulePath = require.resolve('./contact.service');

function withFakePrisma(fn) {
  const original = require.cache[prismaModulePath];
  const originalDatabaseUrl = process.env.DATABASE_URL;
  let captured;

  process.env.DATABASE_URL = 'postgresql://example-db.local/test';

  const fakePrismaClient = function FakePrismaClient() {
    this.contactMessage = {
      update: async ({ where, data }) => {
        captured = { where, data };
        return { id: where.id, status: data.status };
      },
    };
  };

  require.cache[prismaModulePath] = {
    id: prismaModulePath,
    filename: prismaModulePath,
    loaded: true,
    exports: { PrismaClient: fakePrismaClient },
  };

  delete require.cache[serviceModulePath];

  try {
    return fn(() => captured, require(serviceModulePath));
  } finally {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }

    if (original) {
      require.cache[prismaModulePath] = original;
    } else {
      delete require.cache[prismaModulePath];
    }

    delete require.cache[serviceModulePath];
  }
}

test('toggleReadStatus updates message status via prisma', async () => {
  await withFakePrisma(async (getCaptured, service) => {
    const result = await service.toggleReadStatus('msg-123', true);

    assert.deepEqual(result, { id: 'msg-123', status: 'read' });
    assert.equal(getCaptured().where.id, 'msg-123');
    assert.equal(getCaptured().data.status, 'read');
  });
});
