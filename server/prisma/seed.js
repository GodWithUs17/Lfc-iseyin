const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@lfciseyin.org').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'winners2026';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Church Administrator',
      role: 'admin',
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
    create: {
      email: adminEmail,
      name: 'Church Administrator',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      name: 'Member',
      passwordHash: await bcrypt.hash('member123', 10),
      role: 'member',
    },
  });

  await prisma.sermon.upsert({
    where: { id: 'sermon-1' },
    update: {},
    create: {
      id: 'sermon-1',
      title: 'Grace and Truth',
      speaker: 'Pastor John',
      audioUrl: 'https://example.com/audio/grace-and-truth.mp3',
      date: new Date('2026-09-01T10:00:00Z'),
    },
  });

  await prisma.event.upsert({
    where: { id: 'event-1' },
    update: {},
    create: {
      id: 'event-1',
      title: 'Community Outreach',
      description: 'Neighborhood cleanup and outreach',
      bannerUrl: 'https://example.com/images/outreach.jpg',
      eventDate: new Date('2026-10-15T09:00:00Z'),
    },
  });

  await prisma.liveStream.upsert({
    where: { id: 'livestream-1' },
    update: {},
    create: {
      id: 'livestream-1',
      isLive: false,
      streamUrl: null,
    },
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
