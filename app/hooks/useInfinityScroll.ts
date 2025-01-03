import { useState, useCallback } from "react";

interface UseInfinityScrollProps<T> {
  initialData?: T[];
  fetchData: (
    page: number,
    searchTerm: string
  ) => Promise<{ data: T[]; hasMore: boolean }>;
}
export function useInfinityScroll<T>({
  initialData,
  fetchData,
}: UseInfinityScrollProps<T>) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const { data: newData, hasMore: newHasMore } = await fetchData(
        page + 1,
        searchTerm
      );
      setData((prevData) => [...prevData, ...newData]);
      setHasMore(newHasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 가져오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchData, hasMore, loading, page, searchTerm]);

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      setPage(1);
      setLoading(true);
      setError(null);
      try {
        const { data: newData, hasMore: newHasMore } = await fetchData(1, term);
        setData(newData);
        setHasMore(newHasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "검색에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  return {
    data,
    hasMore,
    loading,
    error,
    loadMore,
    handleSearch,
    searchTerm,
  };
}
