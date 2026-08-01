const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.meeting.create({
    data: {
      date: '2026-08-02',
      meeting_type: 'Sacrament',
      presiding: 'Bishop',
      conducting: 'Elder Smith',
      opening_hymn: '123',
      sacrament_hymn: '124',
      closing_hymn: '125',
      opening_prayer: 'Opening prayer',
      closing_prayer: 'Closing prayer',
      speakers: '[]',
      announcements: '[]',
      ward_business: '[]',
      stake_business: 0,
    },
  });
  console.log('seeded meeting');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
