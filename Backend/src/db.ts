import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon / hosted Postgres with sslmode=require
  },
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
