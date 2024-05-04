import LRUCache from '../index';

describe("Test LRU cache", () => {
  it("invalid capacity", () => {
    expect(() => new LRUCache()).toThrow();
    expect(() => new LRUCache(-1));
    expect(() => new LRUCache(Infinity));
  });

  it("small cache (size = 2)", () => {
    const cache = new LRUCache(1);

    // now the capacity is increasing by one
    cache.capacity++;

    cache.set(1, 1);
    cache.set(2, 2);

    expect(cache.get(1)).toBe(1);
    expect(cache.get(2)).toBe(2);

    // additional entries triggers cache rotate
    cache.set(3, 3);

    // then we should have a cache miss for the first entry added
    expect(cache.get(1)).toBe(null); // cache miss
    expect(cache.get(2)).toBe(2);
    expect(cache.get(3)).toBe(3);

    cache.set(4, 4);

    expect(cache.get(1)).toBe(null); // cache miss
    expect(cache.get(2)).toBe(null); // cache miss
    expect(cache.get(3)).toBe(3);
    expect(cache.get(4)).toBe(4);

    expect(cache.info).toEqual({
      misses: 3,
      hits: 6,
      capacity: 2,
      size: 2,
    });

    const json = '{"misses":3,"hits":6,"cache":{"3":3,"4":4}}';
    expect(cache.toString()).toBe(json);

    // parser with json
    cache.parser(json);

    // now the capacity decreasing by one
    cache.capacity--;

    expect(cache.info).toEqual({
      misses: 6,
      hits: 12,
      capacity: 1,
      size: 1,
    });
  });

  it("big cache (size = 100)", () => {
    const fibonacciCache = (n, cache = null) => {
      if (cache) {
        const value = cache.get(n);

        if (value !== null) {
          return value;
        }
      }

      if (n === 1 || n === 2) {
        return 1;
      }

      const result = fibonacciCache(n - 1, cache) + fibonacciCache(n - 2, cache);

      cache && cache.set(n, result);

      return result;
    };

    const cache = new LRUCache(100);

    for (let i = 1; i <= 10; i++) {
      fibonacciCache(i, cache);
    }
  });
});
