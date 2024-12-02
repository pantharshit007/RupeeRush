import { CACHE_TYPES, CacheProps } from "./cacheType";
import { InMemoryCache } from "./in-memory-cache";
import { RedisCache } from "./redis-cache";

// TODO: turning off redis for now
const redisUrl = process.env.REDIS_URL;
class Cache implements CacheProps {
  private delegate: CacheProps;
  private static instance: Cache;
  private ttl: number = parseInt(process.env.CACHE_TTL || "86400"); // 24 hours

  private constructor() {
    if (redisUrl) {
      this.delegate = RedisCache.getInstance(redisUrl);
    } else {
      this.delegate = InMemoryCache.getInstance();
    }
  }

  public static getInstance(): CacheProps {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set(
    type: string,
    args: string[],
    value: any,
    expirySeconds: number = this.ttl
  ): Promise<void> {
    return this.delegate.set(type, args, value, expirySeconds);
  }

  public get(type: string, args: string[]): Promise<any> {
    return this.delegate.get(type, args);
  }

  public evict(type: string, args: string[]): Promise<null> {
    return this.delegate.evict(type, args);
  }
}

export const cache = Cache.getInstance();
export const cacheType = CACHE_TYPES;
