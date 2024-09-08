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
