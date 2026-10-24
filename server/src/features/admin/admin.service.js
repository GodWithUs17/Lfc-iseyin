const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const VALID_ROLES = ['ADMIN', 'SECRETARY', 'MEDIA'];

async function getAllAdmins() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function createAdminUser({ name, email, password, role }) {
  const trimmedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const rawRole = String(role || 'ADMIN').trim().toUpperCase();

  if (!trimmedName || !normalizedEmail || !password) {
    return { status: 400, payload: { error: 'Name, email, and password are required.' } };
  }

  const userRole = VALID_ROLES.includes(rawRole) ? rawRole : 'ADMIN';

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { status: 409, payload: { error: 'An account with this email already exists.' } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      role: userRole,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return { status: 201, payload: { message: 'Admin created successfully.', admin } };
}

async function deleteAdminUser({ id, currentAdminId }) {
  if (currentAdminId && currentAdminId === id) {
    return { status: 400, payload: { error: 'You cannot delete your own account.' } };
  }

  const adminToDelete = await prisma.user.findUnique({ where: { id } });
  if (!adminToDelete) {
    return { status: 404, payload: { error: 'Admin account not found.' } };
  }

  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  if (adminToDelete.role === 'ADMIN' && adminCount <= 1) {
    return { status: 400, payload: { error: 'Cannot delete the last remaining ADMIN account.' } };
  }

  await prisma.user.delete({ where: { id } });
  return { status: 200, payload: { message: 'Admin account deleted successfully.' } };
}

module.exports = {
  getAllAdmins,
  createAdminUser,
  deleteAdminUser,
};