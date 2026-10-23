import { useEffect, useState } from 'react';
import { api, ApiError } from './api';

/** Minimal GET-with-loading-state hook. Refetches when `path` changes; pass null to skip. */
export function useFetch<T>(path: string | null) {
  const [state, setState] = useState<{ data: T | null; error: ApiError | null; loading: boolean }>({
    data: null,
    error: null,
    loading: Boolean(path),
  });
  useEffect(() => {
    if (!path) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    api<T>(path, { signal: ctrl.signal })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, loading: false });
      });
    return () => ctrl.abort();
  }, [path]);
  return state;
}
