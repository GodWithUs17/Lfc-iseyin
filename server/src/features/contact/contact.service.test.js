const test = require('node:test');
const assert = require('node:assert/strict');

const prismaModulePath = require.resolve('@prisma/client');
const serviceModulePath = require.resolve('./contact.service');

async function withFakePrisma(fn) {
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
      create: async ({ data }) => {
        captured = { create: data };
        return { id: 'contact-123', ...data };
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
    return await fn(() => captured, require(serviceModulePath));
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

test('createMessage accepts Nigerian local and +234 phone numbers', async () => {
  await withFakePrisma(async (getCaptured, service) => {
    const localResult = await service.createMessage({
      name: 'Test User',
      phone: '08031234567',
      message: 'Please contact me.',
    });
    const internationalResult = await service.createMessage({
      name: 'Test User',
      phone: '+2348031234567',
      email: 'test@example.com',
      message: 'Please contact me.',
    });

    assert.equal(localResult.status, 201);
    assert.equal(internationalResult.status, 201);
    assert.equal(getCaptured().create.phone, '+2348031234567');
    assert.equal(getCaptured().create.email, 'test@example.com');
  });
});

test('createMessage rejects invalid phone numbers and malformed optional email', async () => {
  await withFakePrisma(async (getCaptured, service) => {
    const invalidPhone = await service.createMessage({
      name: 'Test User',
      phone: '12345',
      message: 'Please contact me.',
    });
    const invalidEmail = await service.createMessage({
      name: 'Test User',
      phone: '08031234567',
      email: 'not-an-email',
      message: 'Please contact me.',
    });

    assert.equal(invalidPhone.status, 400);
    assert.equal(invalidEmail.status, 400);
    assert.equal(getCaptured(), undefined);
  });
});
