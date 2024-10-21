import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  for (let i = 1; i <= 8; i++) {
    await prisma.group.upsert({
      where: { id: `group-${i}` },
      update: {},
      create: {
        groupNumber: i,
        name: `Group ${i}`,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })