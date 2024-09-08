import { useState, useEffect, useCallback, useRef } from "react";
import { queryCache } from "./cache";

const DEFAULT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Options for the useFetch hook
 * @template T The type of data returned by the fetch function
 */
interface UseFetchOptions<T> {
  /**
   * An array that uniquely identifies the query. This is used for caching and deduplication.
   */
  fetchKey: (string | number | object)[];

  /**
   * An async function that returns the data for the query.
   * @returns {Promise<T>} A promise that resolves to the fetched data
   */
  fetchFn: () => Promise<T>;

  /**
   * Optional. The interval in milliseconds to automatically refetch the data.
   * If not provided, the query will not automatically refetch.
   */
  refetchInterval?: number;

  /**
   * Optional. The time-to-live for the cache in milliseconds.
   * Defaults to 10 minutes if not provided.
   */
  cacheTTL?: number;
}

interface UseFetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidateQuery: () => void;
}

function hashQueryKey(fetchKey: (string | number | object)[]): string {
  return fetchKey
    .map((key) => (typeof key === "object" ? JSON.stringify(key) : String(key)))
    .join("|");
}

export function useFetch<T>({
  fetchKey,
  fetchFn,
  refetchInterval,
  cacheTTL = DEFAULT_CACHE_TTL,
}: UseFetchOptions<T>): UseFetchResult<T> {
  const cacheKey = hashQueryKey(fetchKey);

  const [data, setData] = useState<T | undefined>(() =>
    queryCache.get(cacheKey)
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    !queryCache.get(cacheKey)
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAttempts = useRef(0);
  const maxAttempts = 3;

  const fetchData = useCallback(async () => {
    if (fetchAttempts.current >= maxAttempts) {
      setError(new Error(`Failed after ${maxAttempts} attempts`));
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const result = await fetchFn();
      queryCache.set(cacheKey, result);
      setData(result);
      fetchAttempts.current = 0;
      setError(null);
    } catch (err) {
      fetchAttempts.current++;
      setError(err instanceof Error ? err : new Error("An error occurred"));
      setData(undefined);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [cacheKey, fetchFn]);

  useEffect(() => {
    const cachedTimestamp = queryCache.getTimestamp(cacheKey);
    const isCacheExpired =
      !cachedTimestamp || Date.now() - cachedTimestamp > cacheTTL;

    if (!isCacheExpired && queryCache.get(cacheKey)) {
      setData(queryCache.get(cacheKey));
      setIsLoading(false);
      setIsFetching(false);
    } else if (!isFetching) {
      fetchAttempts.current = 0;
      fetchData();
    }

    let intervalId: NodeJS.Timeout | null = null;
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(() => {
        if (!isFetching) {
          fetchAttempts.current = 0;
          fetchData();
        }
      }, refetchInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [cacheKey, fetchData, refetchInterval, cacheTTL, isFetching]);

  const refetch = useCallback(async () => {
    fetchAttempts.current = 0;
    await fetchData();
  }, [fetchData]);

  const invalidateQuery = useCallback(() => {
    queryCache.delete(cacheKey);
    setData(undefined);
    fetchAttempts.current = 0;
    fetchData();
  }, [cacheKey, fetchData]);

  return { data, isLoading, isFetching, error, refetch, invalidateQuery };
}
