import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  const user = await prisma.users.create({
    data: {
      email: 'test@mailinator.com',
      password: 'xyz',
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
