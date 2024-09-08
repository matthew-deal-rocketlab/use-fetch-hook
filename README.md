## Introduction

The `useFetch` hook is a powerful tool for managing data fetching and caching in React applications. This guide will walk you through how to use the hook effectively in your components.

## Installation

To install the `useFetch` hook, run the following command:

```bash
npm i @mattdealsy/use-fetch-hook
```

## Basic Usage

```typescript
import { useFetch } from "@mattdealsy/use-fetch-hook";

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
