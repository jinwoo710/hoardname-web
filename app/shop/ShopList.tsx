'use client';

import { useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';

import { ShopItem } from '@/types/boardgame';
import { Input } from '@/components/ui/input';

import ShopListContainer from '../components/ShopListContainer';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';
import { ErrorState } from '../components/common/ErrorState';
import { Spinner } from '../components/common/Spinner';
import { fetchShopItems } from '../actions/shop';

const selectClass =
  'h-11 w-fit shrink-0 appearance-none rounded-lg border border-input bg-background px-4 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-auto';

interface ShopListProps {
  initialShopItems: ShopItem[];
  limit: number;
}

export default function ShopList({ initialShopItems, limit }: ShopListProps) {
  const [priceSort, setPriceSort] = useState<string>('');
  const {
    items: shopItems,
    loading,
    hasMore,
    loadMore,
    updateFilters,
    handleSearch,
    error,
  } = useInfinityScroll({
    initialData: initialShopItems,
    fetchData: async (
      page: number,
      searchTerm: string,
      filters?: Record<string, string>
    ) => {
      const searchParams = new URLSearchParams();
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      searchParams.set('isDeleted', 'false');
      if (searchTerm) searchParams.set('search', searchTerm);
      if (filters?.priceSort) searchParams.set('priceSort', filters.priceSort);

      const response = await fetchShopItems({
        page: page,
        limit: limit,
        search: searchTerm,
        priceSort: filters?.priceSort,
      });
      return {
        items: response.items as ShopItem[],
        hasMore: response.hasMore,
        total: response.total,
      };
    },
  });

  const handleFilterChange = (value: string) => {
    setPriceSort(value);

    const newFilters: Record<string, string> = {};
    if (value) newFilters.priceSort = value;

    updateFilters(newFilters);
  };
  const virtualizer = useWindowVirtualizer({
    count: shopItems.length,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">중고 장터 목록</h1>
      </div>
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>
            중고 장터 등록은{' '}
            <span className="font-bold text-primary">로그인</span> 후{' '}
            <span className="font-bold text-primary">My 장터</span> 페이지에서
            가능합니다.
          </li>
          <li>전문 업자, 되팔이등의 행위 발각시 사용이 불가능합니다.</li>
          <li>거래간 문제 발생 시, 호드네임에서 책임을 지지 않습니다</li>
        </ul>
      </div>
      <div className="mb-6">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="게임 이름으로 검색..."
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 pl-9"
            />
          </div>
          <select
            className={selectClass}
            value={priceSort}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">가격 정렬</option>
            <option value="asc">낮은 가격순</option>
            <option value="desc">높은 가격순</option>
          </select>
          {loading && (
            <div className="absolute right-28 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>
      {error ? (
        <ErrorState message={error} onRetry={() => updateFilters({})} />
      ) : (
        <InfiniteScroll
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
          className="space-y-4"
        >
          <ShopListContainer
            boardgames={shopItems}
            virtualItems={virtualizer.getVirtualItems()}
            totalHeight={virtualizer.getTotalSize()}
            measureElement={virtualizer.measureElement}
          />
        </InfiniteScroll>
      )}
    </div>
  );
}
