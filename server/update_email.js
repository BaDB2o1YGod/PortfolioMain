import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const newEmail = 'bestktz12@gmail.com';
  
  // See if any owner exists
  const owners = await prisma.owner.findMany();
  
  if (owners.length > 0) {
    const owner = owners[0];
    await prisma.owner.update({
      where: { id: owner.id },
      data: { email: newEmail }
    });
    console.log('Updated existing owner email to:', newEmail);
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
