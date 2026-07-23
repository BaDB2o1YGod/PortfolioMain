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
  const email = 'admin@showcase.local';
  const existingOwner = await prisma.owner.findUnique({ where: { email } });

  if (existingOwner) {
    console.log('Owner already exists:', existingOwner.email);
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = await prisma.owner.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Portfolio Owner',
      bio: 'Welcome to my portfolio.',
    },
  });

  console.log('Created default owner account:');
  console.log('Email:', owner.email);
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
