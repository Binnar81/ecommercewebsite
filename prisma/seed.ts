import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  const existingCount = await prisma.category.count();
  
  if (existingCount === 0) {
    const categories = Array.from({ length: 100 }, () => ({
      name: faker.commerce.department(),
    }));

    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });

    console.log(`Seeded ${categories.length} categories`);
  } else {
    console.log(`Database already contains ${existingCount} categories. Skipping seed.`);
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