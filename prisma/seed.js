import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('bishop123', 10)
  await prisma.user.upsert({
    where: { email: 'bishop@ward.org' },
    update: {},
    create: {
      email: 'bishop@ward.org',
      passwordHash,
      name: 'Bishop',
    },
  })
  console.log('Seeded user: bishop@ward.org / bishop123')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())