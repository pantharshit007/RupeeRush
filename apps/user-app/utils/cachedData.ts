import db, { SchemaTypes } from "@repo/db/client";

// Cache user data with a short TTL
const userCache = new Map<string, { data: SchemaTypes.User; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 SEC

/**
 * returns cached User Data with a `TTL:30sec`
 *
 * @param userId
 */

// TODO: remove this already did that in packages/db
export async function getCachedUserData(userId: string) {
  const cached = userCache.get(userId);
  const currentTime = Date.now();

  // return cached data if it's fresh
  if (cached && currentTime - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const userData = await db.user.findUnique({ where: { id: userId } });

  if (userData) {
    userCache.set(userId, { data: userData, timestamp: currentTime });
  }

  return userData;
}
