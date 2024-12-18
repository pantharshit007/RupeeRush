import { Redis } from "@upstash/redis";
import { CacheProps } from "./cacheType";

export class RedisCache implements CacheProps {
  private client: Redis;
  private static instance: RedisCache;

  private constructor(url: string, token: string) {
    this.client = new Redis({
      url: url,
      token: token,
    });
  }

  static getInstance(url: string, token: string): RedisCache {
    if (!this.instance) {
      this.instance = new RedisCache(url, token);
    }
    return this.instance;
  }

  async set(type: string, args: string[], value: any, expirySeconds: number): Promise<void> {
    const key = this.generateKey(type, args);
    await this.client.set(key, JSON.stringify(value), { ex: expirySeconds });
  }

  async get(type: string, args: string[]): Promise<any> {
    const key = this.generateKey(type, args);
    const value = await this.client.get(key);

    try {
      return value ? JSON.parse(value as string) : null;
    } catch (e) {
      return value;
    }
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
