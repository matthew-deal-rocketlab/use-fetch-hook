# useFetch Hook and QueryCache Technical Documentation

## Overview

This document provides a technical breakdown of the `useFetch` hook and the `QueryCache` system, explaining how each part works and interacts.

## QueryCache

The `QueryCache` is an in-memory caching system implemented using a JavaScript `Map`.

### Key Components:

- `CacheEntry<T>`: An interface defining the structure of each cache entry, containing:

  - `data: T`: The cached data
  - `timestamp: number`: When the data was cached

- `QueryCache` class:
  - `private cache: Map<string, CacheEntry<unknown>>`: Stores the cached data
  - `set<T>(key: string, data: T)`: Adds or updates a cache entry
  - `get<T>(key: string)`: Retrieves data from the cache
  - `getTimestamp(key: string)`: Gets the timestamp of a cache entry
  - `delete(key: string)`: Removes a specific entry from the cache
  - `clear()`: Removes all entries from the cache

The cache is stored in memory and is not persistent across page reloads or app restarts.

## useFetch Hook

The `useFetch` hook manages data fetching, caching, and state for queries in React components.

### Key Components:

1. **Interfaces**:

   - `UseFetchOptions<T>`: Defines the options for the hook, including `fetchKey`, `fetchFn`, `refetchInterval`, and `cacheTTL`
   - `UseFetchResult<T>`: Defines the structure of the hook's return value

2. **State Management**:

   - Uses `useState` for `data`, `isLoading`, `isFetching`, and `error` states
   - Uses `useRef` for tracking fetch attempts

3. **fetchData Function**:

   - Handles data fetching with retry logic and exponential backoff
   - Updates state and cache based on fetch results
   - Implements error handling for failed fetches and null/undefined results

4. **useEffect Hook**:

   - Checks cache validity using the provided `cacheTTL`
   - Initiates fetches if cache is expired or not available
   - Sets up refetch intervals if specified

5. **Utility Functions**:

   - `refetch`: Manually triggers a new fetch, resetting fetch attempts
   - `invalidateQuery`: Removes data from cache and triggers a refetch

6. **Cache Interaction**:
   - Uses `queryCache` for storing and retrieving data
   - Implements a configurable Time-To-Live (TTL) mechanism for cache invalidation

## Key Features:

- Configurable caching with TTL
- Automatic and manual refetching
- Error handling and retry logic with exponential backoff
- Loading and fetching state management
- Cache invalidation
- Configurable refetch intervals

This system provides an efficient and flexible way to manage API requests and data caching in React applications, reducing unnecessary network requests and improving performance.

# useFetch Hook Usage Guide

## Introduction

The `useFetch` hook is a powerful tool for managing data fetching and caching in React applications. This guide will walk you through how to use the hook effectively in your components.

## Basic Usage

```typescript
import { useFetch } from "./path-to-useFetch";

function MyComponent() {
  const { data, isLoading, isFetching, error, refetch, invalidateQuery } =
    useFetch({
      fetchKey: ["uniqueQueryIdentifier"],
      fetchFn: async () => {
        const response = await fetch("https://api.example.com/data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 5000, // Refetch every 5 seconds
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refetch</button>
      <button onClick={invalidateQuery}>Invalidate Cache</button>
    </div>
  );
}
```

## API Reference

### useFetch Options

- `fetchKey: (string | number | object)[]`
  An array that uniquely identifies the query. This is used for caching and deduplication.
- `fetchFn: () => Promise<T>`
  An async function that returns the data for the query.
- `refetchInterval?: number`
  (Optional) Interval in milliseconds to automatically refetch the data.
- `cacheTTL?: number`
  (Optional) Time-to-live for the cache in milliseconds. Defaults to 10 minutes.

### useFetch Return Value

- `data: T | undefined`
  The data returned from the fetchFn.
- `isLoading: boolean`
  True if the query is in its initial loading state.
- `isFetching: boolean`
  True if the query is currently fetching data.
- `error: Error | null`
  Any error that occurred during the most recent query.
- `refetch: () => Promise<void>`
  A function to manually trigger a refetch of the query.
- `invalidateQuery: () => void`
  A function to invalidate the current query cache and trigger a refetch.

## Advanced Usage

### Parameterized Queries

```typescript
const { data } = useFetch({
  fetchKey: ["user", userId],
  fetchFn: () => fetchUser(userId),
});
```

### Using Refetch Interval

```typescript
const { data } = useFetch({
  fetchKey: ["autoRefreshData"],
  fetchFn: fetchAutoRefreshData,
  refetchInterval: 5000, // Refetch every 5 seconds
});
```

### Custom Cache TTL

```typescript
const { data } = useFetch({
  fetchKey: ["customCacheTTL"],
  fetchFn: fetchCustomCacheTTL,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
});
```

### Manual Cache Invalidation

```typescript
const { invalidateQuery } = useFetch({
  fetchKey: ["userData"],
  fetchFn: fetchUserData,
});

// Later in your code
const handleUserUpdate = () => {
  // Update user data
  invalidateQuery(); // This will clear the cache and refetch
};
```

## Best Practices

1. Use consistent fetchKey arrays for the same data across your app.
2. Keep fetchFn functions pure and free of side effects.
3. Use the refetchInterval option judiciously to avoid unnecessary API calls.
4. Leverage the isLoading and isFetching states to show appropriate loading indicators.
5. Handle errors gracefully using the error object.

By following these guidelines and utilizing the full capabilities of the useFetch hook, you can efficiently manage data fetching and state in your React applications.
