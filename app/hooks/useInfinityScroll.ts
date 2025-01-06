import { useState, useCallback } from "react";

interface FetchResponse<T> {
  items: T[];
  hasMore: boolean;
  total: number;
}

interface UseInfinityScrollOptions<T> {
  initialData: T[];
  fetchData: (page: number, searchTerm: string) => Promise<FetchResponse<T>>;
}

export function useInfinityScroll<T>({
  initialData,
  fetchData,
}: UseInfinityScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetData = useCallback(
    async (page: number, searchTerm: string) => {
      try {
        const data = await fetchData(page, searchTerm);
        setItems(data.items);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다"
        );
      }
    },
    [fetchData]
  );

  const reset = useCallback(async () => {
    setPage(1);
    setLoading(true);
    await fetchAndSetData(1, searchTerm);
    setLoading(false);
  }, [fetchAndSetData, searchTerm]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const data = await fetchData(nextPage, searchTerm);

      if (data.items.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다"
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, searchTerm, fetchData]);

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      setPage(1);
      setLoading(true);
      setError(null);

      await fetchAndSetData(1, term);
      setLoading(false);
    },
    [fetchAndSetData]
  );

  return {
    items,
    hasMore,
    loading,
    error,
    loadMore,
    handleSearch,
    searchTerm,
    reset,
  };
}
