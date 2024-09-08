declare class QueryCache {
    private cache;
    set<T>(key: string, data: T): void;
    get<T>(key: string): T | undefined;
    getTimestamp(key: string): number | undefined;
    delete(key: string): void;
    clear(): void;
}
export declare const queryCache: QueryCache;
export {};
