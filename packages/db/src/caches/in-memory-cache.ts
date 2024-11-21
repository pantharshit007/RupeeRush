import { CacheProps, CacheEntryProps } from "./cacheType";

export class InMemoryCache implements CacheProps {
  private inMemoryCache: Map<string, CacheEntryProps>;
  private static instance: InMemoryCache;

  private constructor() {
    this.inMemoryCache = new Map();
  }

  public static getInstance(): InMemoryCache {
    if (!InMemoryCache.instance) {
      InMemoryCache.instance = new InMemoryCache();
    }
    return InMemoryCache.instance;
  }

  async set(type: string, args: string[], value: any, expirySeconds: number): Promise<void> {
    const key = this.generateKey(type, args);
    const stringfyValue = JSON.stringify(value);
    const expiryTime = Date.now() + expirySeconds * 1000;
    const entry: CacheEntryProps = { value: stringfyValue, expiry: expiryTime };

    this.inMemoryCache.set(key, entry);
    return Promise.resolve();
  }

  async get(type: string, args: string[]): Promise<any> {
    const key = this.generateKey(type, args);
    const entry = this.inMemoryCache.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiry < Date.now()) {
      this.evict(type, args);
      return null;
    }
    return JSON.parse(entry.value);
  }

  async evict(type: string, args: string[]): Promise<null> {
    const key = this.generateKey(type, args);
    this.inMemoryCache.delete(key);
    return Promise.resolve(null);
  }

  private generateKey(type: string, args: string[]): string {
    return `${type}:${args.join(":")}`;
  }
}
