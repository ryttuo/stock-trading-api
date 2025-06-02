import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  const user = await prisma.users.create({
    data: {
      email: 'andres.solano@fusefinance.com',
      password: '$2b$10$K8BvQZ9X2Y3W4V5U6T7S8O9P0Q1R2S3T4U5V6W7X8Y9Z0A1B2C3D4E',
    },
  });

  console.log('Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
