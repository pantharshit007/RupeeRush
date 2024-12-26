import { CACHE_TYPES, CacheProps } from "./cacheType";
import { InMemoryCache } from "./in-memory-cache";
import { RedisCache } from "./redis-cache";

// TODO: turning off redis for now
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

class Cache implements CacheProps {
  private delegate: CacheProps;
  private static instance: Cache | null = null;
  private ttl: number = parseInt(process.env.CACHE_TTL || "86400"); // 24 hours

  private constructor(honoRedisUrl?: string, honoRedisToken?: string) {
    if ((url && token) || (honoRedisUrl && honoRedisToken)) {
      this.delegate = RedisCache.getInstance(url || honoRedisUrl!, token || honoRedisToken!);
    } else {
      this.delegate = InMemoryCache.getInstance();
    }
  }

  public static getInstance(honoRedisUrl?: string, honoRedisToken?: string): Cache {
    // If no instance exists, create a new one
    if (!this.instance) {
      this.instance = new Cache(honoRedisUrl, honoRedisToken);
      return this.instance;
    }

    // If Hono credentials are provided and current instance is in-memory
    const creds = honoRedisUrl && honoRedisToken;
    const isMemoryInstance = this.instance.delegate instanceof InMemoryCache;

    if (creds && isMemoryInstance) {
      this.instance = new Cache(honoRedisUrl, honoRedisToken);
    }

    return this.instance;
  }

  public set(
    type: string,
    args: string[],
    value: object,
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
export const honoCache = Cache;
export const cacheType = CACHE_TYPES;
