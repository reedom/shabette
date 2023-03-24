export namespace Memcache {
  const cache: { [key: string]: any } = {};
  const expires: { [key: string]: Date } = {};
  const defaultExpiration = 1000 * 60 * 60 * 3; // 3 hour

  export function get<T>(key: string): T | undefined {
    if (expires[key] && expires[key] < new Date()) {
      delete cache[key];
      delete expires[key];
      return undefined;
    }
    return cache[key];
  }

  export function set(key: string, value: any, expiration?: number) {
    cache[key] = value;
    expires[key] = new Date(Date.now() + (expiration || defaultExpiration));
  }
}
