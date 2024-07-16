import { faker } from '@faker-js/faker';
import { prisma } from '../server/db';

export const seedCategories = async () => {
  const categories = Array.from({ length: 100 }, () => ({
    name: faker.commerce.department(),
  }));

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log('Categories seeded successfully');
};