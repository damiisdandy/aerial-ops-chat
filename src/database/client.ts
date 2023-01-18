import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line vars-on-top, no-var, no-unused-vars
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;