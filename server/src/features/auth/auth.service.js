const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fallbackUsers = new Map();

// Helper to validate and normalize roles according to schema enum
const VALID_ROLES = ['ADMIN', 'SECRETARY', 'MEDIA'];

function normalizeRole(role) {
  if (!role) return 'ADMIN';
  const upperRole = String(role).trim().toUpperCase();
  return VALID_ROLES.includes(upperRole) ? upperRole : null;
}

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || 'admin@lfciseyin.org').toLowerCase();
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'winners2026';
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'lfc-iseyin-dev-secret';
}

function getFallbackAdminUser() {
  const email = getAdminEmail();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(getAdminPassword(), 10);
  const adminUser = {
    email,
    name: 'Church Administrator',
    role: 'ADMIN',
    passwordHash,
  };

  fallbackUsers.set(email, adminUser);
  return adminUser;
}

function getFallbackUserByEmail(email) {
  if (!email) return null;
  const normalizedEmail = String(email).trim().toLowerCase();
  return fallbackUsers.get(normalizedEmail) || null;
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.email,
      role: user.role,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: '8h' }
  );
}

function sanitizeUser(user) {
  return {
    email: user.email,
    name: user.name || 'Church Administrator',
    role: user.role || 'ADMIN',
  };
}

async function ensureAdminUser() {
  if (!process.env.DATABASE_URL) return null;

  try {
    const adminEmail = getAdminEmail();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash(getAdminPassword(), 10);
    return await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: 'Church Administrator',
        role: 'ADMIN',
        passwordHash,
      },
      create: {
        email: adminEmail,
        name: 'Church Administrator',
        role: 'ADMIN',
        passwordHash,
      },
    });
  } catch {
    return null;
  }
}

async function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return null;

  const cachedFallbackUser = getFallbackUserByEmail(normalizedEmail);
  if (cachedFallbackUser) return cachedFallbackUser;

  const adminEmail = getAdminEmail();

  try {
    if (!process.env.DATABASE_URL) {
      if (normalizedEmail === adminEmail) {
        return getFallbackAdminUser();
      }
      return null;
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (user) return user;

    if (normalizedEmail === adminEmail) {
      return await ensureAdminUser();
    }

    return null;
  } catch {
    if (normalizedEmail === adminEmail) {
      return getFallbackAdminUser();
    }
    return cachedFallbackUser || null;
  }
}

async function registerUser({ name, email, password, role }) {
  const trimmedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedRole = normalizeRole(role);

  if (!trimmedName || !normalizedEmail || !password) {
    return {
      status: 400,
      payload: { message: 'Name, email, and password are required.' },
    };
  }

  if (password.length < 6) {
    return {
      status: 400,
      payload: { message: 'Password must be at least 6 characters long.' },
    };
  }

  if (!normalizedRole) {
    return {
      status: 400,
      payload: { message: 'Role must be ADMIN, SECRETARY, or MEDIA.' },
    };
  }

  const existingFallbackUser = getFallbackUserByEmail(normalizedEmail);
  if (existingFallbackUser) {
    return {
      status: 409,
      payload: { message: 'An account with this email already exists.' },
    };
  }

  try {
    if (!process.env.DATABASE_URL) {
      const user = {
        email: normalizedEmail,
        name: trimmedName,
        role: normalizedRole,
        passwordHash: await bcrypt.hash(password, 12),
      };

      fallbackUsers.set(normalizedEmail, user);
      const safeUser = sanitizeUser(user);
      return {
        status: 201,
        payload: {
          token: signToken(safeUser),
          user: safeUser,
        },
      };
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return {
        status: 409,
        payload: { message: 'An account with this email already exists.' },
      };
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: trimmedName,
        role: normalizedRole,
        passwordHash: await bcrypt.hash(password, 12),
      },
    });

    const safeUser = sanitizeUser(user);
    return {
      status: 201,
      payload: {
        token: signToken(safeUser),
        user: safeUser,
      },
    };
  } catch {
    const user = {
      email: normalizedEmail,
      name: trimmedName,
      role: normalizedRole,
      passwordHash: await bcrypt.hash(password, 12),
    };

    fallbackUsers.set(normalizedEmail, user);
    const safeUser = sanitizeUser(user);
    return {
      status: 201,
      payload: {
        token: signToken(safeUser),
        user: safeUser,
      },
    };
  }
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    return {
      status: 400,
      payload: { message: 'Email and password are required.' },
    };
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const adminEmail = getAdminEmail();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return {
      status: 401,
      payload: { message: 'Invalid credentials.' },
    };
  }

  const storedHash = user.passwordHash || '';
  const envHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash(getAdminPassword(), 10);
  const storedMatch = storedHash ? await bcrypt.compare(password, storedHash) : false;
  const adminEnvMatch = normalizedEmail === adminEmail && await bcrypt.compare(password, envHash);

  if (!storedMatch && !adminEnvMatch) {
    return {
      status: 401,
      payload: { message: 'Invalid credentials.' },
    };
  }

  if (normalizedEmail === adminEmail && envHash && storedHash !== envHash) {
    try {
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: {
          passwordHash: envHash,
          name: 'Church Administrator',
          role: 'ADMIN',
        },
      });
    } catch {
      // Ignore DB sync failures and continue with the login request.
    }
  }

  const safeUser = sanitizeUser({
    ...user,
    email: normalizedEmail,
    name: user.name || 'Church Administrator',
    role: user.role || 'ADMIN',
    passwordHash: envHash,
  });

  return {
    status: 200,
    payload: {
      token: signToken(safeUser),
      user: safeUser,
    },
  };
}

module.exports = {
  signToken,
  sanitizeUser,
  ensureAdminUser,
  findUserByEmail,
  registerUser,
  loginUser,
};