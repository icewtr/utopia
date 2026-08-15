// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminSlackIds = (process.env.ADMIN_SLACK_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  for (const slackId of adminSlackIds) {
    await prisma.user.upsert({
      where: { slackId },
      update: { role: 'ADMIN' },
      create: {
        slackId,
        username: 'Admin User',
        role: 'ADMIN',
        hcaVerified: true,
      },
    });
    console.log(`Promoted Slack ID ${slackId} to ADMIN`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });