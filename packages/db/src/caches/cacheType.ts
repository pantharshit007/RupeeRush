export interface CacheProps {
  set(type: string, args: string[], value: any, expirySeconds?: number): Promise<void>;
  get(type: string, args: string[]): Promise<any>;
  evict(type: string, args: string[]): Promise<null>;
}

export interface CacheEntryProps {
  value: any;
  expiry: number;
}
