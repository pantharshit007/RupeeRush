import Redis from "ioredis";
import { CacheProps } from "./cacheType";

export class RedisCache implements CacheProps {
  private client: Redis;
  private static instance: RedisCache;

  private constructor(redisUrl: string) {
    this.client = new Redis(redisUrl);
  }

  static getInstance(redisUrl: string): RedisCache {
    if (!this.instance) {
      this.instance = new RedisCache(redisUrl);
    }
    return this.instance;
  }

  async set(type: string, args: string[], value: any, expirySeconds: number): Promise<void> {
    const key = this.generateKey(type, args);

    if (expirySeconds) {
      await this.client.set(key, JSON.stringify(value), "EX", expirySeconds);
    } else {
      await this.client.set(key, JSON.stringify(value)); // though it will never work: already assigned 1800 seconds
    }
    return Promise.resolve();
  }

  async get(type: string, args: string[]): Promise<any> {
    const key = this.generateKey(type, args);
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async evict(type: string, args: any[]): Promise<any> {
    const key = this.generateKey(type, args);
    await this.client.del(key);
    return null;
  }

  private generateKey(type: string, args: string[]): string {
    return `${type}:${args.join(":")}`;
  }
}
