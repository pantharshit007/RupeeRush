import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  const useAdapter = process.env.USE_ADAPTER === "true";

  // conditionsally run the prisma adapter
  if (useAdapter) {
    neonConfig.poolQueryViaFetch = true;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    pool
      .connect()
      .then(() => {
        console.log("Successfully connected to pool");
      })
      .catch((err) => {
        console.error("Pool connection test failed:", err);
      });

    const adapter = new PrismaNeon(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    } as never);
  }
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prismaGlobal: PrismaClientSingleton | undefined;
}

/**
 * @initialize @param globalThis used during the development because of hot reloading in nextJS.
 * If we don't do that, it will always initialize a new PrismaClient
 * everytime it reloads that we have too may active prisma clients.
 * In production, we always initialize it like this:
 * @param export const @var db = new @function PrismaClient()
 */

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

// in order to avoid creating too many prisma instances in development.
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}

export default db;
export type * as SchemaTypes from "@prisma/client";
export { Prisma } from "@prisma/client";
