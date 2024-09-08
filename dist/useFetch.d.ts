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
export declare function useFetch<T>({ fetchKey, fetchFn, refetchInterval, cacheTTL, }: UseFetchOptions<T>): UseFetchResult<T>;
export {};
