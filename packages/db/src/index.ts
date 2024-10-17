import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prismaGlobal: PrismaClientSingleton | undefined;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

// in order to avoid creating too many prisma instances in development.
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}

export { db as default, PrismaAdapter };
