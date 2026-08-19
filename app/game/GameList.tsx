'use client';

import { useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Search, SlidersHorizontal } from 'lucide-react';

import { BoardGame } from '@/types/boardgame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import GameListContainer from '../components/GameListContainer';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';
import { ErrorState } from '../components/common/ErrorState';
import { Spinner } from '../components/common/Spinner';
import { fetchBoardgames } from '../actions/boardgames';

const selectClass =
  'h-11 w-full appearance-none rounded-lg border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

interface GameListProps {
  initialBoardgames: BoardGame[];
  limit: number;
}

export default function GameList({ initialBoardgames, limit }: GameListProps) {
  const {
    items: boardgames,
    loading,
    hasMore,
    loadMore,
    handleSearch,
    updateFilters,
    error,
  } = useInfinityScroll({
    initialData: initialBoardgames,
    fetchData: async (
      page: number,
      searchTerm: string,
      filters?: Record<string, string>
    ) => {
      const searchParams = new URLSearchParams();
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      if (searchTerm) searchParams.set('search', searchTerm);
      if (filters?.weightSort)
        searchParams.set('weightSort', filters.weightSort);
      if (filters?.bestWith) searchParams.set('bestWith', filters.bestWith);
      if (filters?.recommendedWith)
        searchParams.set('recommendedWith', filters.recommendedWith);
      if (filters?.playerCount)
        searchParams.set('playerCount', filters.playerCount);

      const result = await fetchBoardgames({
        page: page,
        limit: limit,
        search: searchTerm,
        weightSort: filters?.weightSort,
        bestWith: filters?.bestWith,
        playerCount: filters?.playerCount,
        recommendedWith: filters?.recommendedWith,
        inStorage: filters?.inStorage,
      });
      return {
        items: result.items,
        hasMore: result.hasMore,
        total: result.total,
      };
    },
  });

  const [searchTerm, setSearchTerm] = useState<string>('');

  // "적용된" 필터: 실제 조회에 반영된 값 (배지 카운트도 이 값 기준)
  const [weightSort, setWeightSort] = useState<string>('');
  const [bestWith, setBestWith] = useState<string>('');
  const [inStorage, setInStorage] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<string>('');
  const [recommendedWith, setRecommendedWith] = useState<string>('');

  // 시트 안에서 편집 중인 "임시" 필터: 적용 버튼을 눌러야 위 상태로 반영됨
  const [draftWeightSort, setDraftWeightSort] = useState<string>('');
  const [draftBestWith, setDraftBestWith] = useState<string>('');
  const [draftInStorage, setDraftInStorage] = useState<string>('');
  const [draftPlayerCount, setDraftPlayerCount] = useState<string>('');
  const [draftRecommendedWith, setDraftRecommendedWith] = useState<string>('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = [
    weightSort,
    bestWith,
    inStorage,
    playerCount,
    recommendedWith,
  ].filter(Boolean).length;

  const virtualizer = useWindowVirtualizer({
    count: boardgames.length,
    estimateSize: () => 174,
    overscan: 5,
  });

  const openFilterSheet = () => {
    setDraftWeightSort(weightSort);
    setDraftBestWith(bestWith);
    setDraftInStorage(inStorage);
    setDraftPlayerCount(playerCount);
    setDraftRecommendedWith(recommendedWith);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setWeightSort(draftWeightSort);
    setBestWith(draftBestWith);
    setInStorage(draftInStorage);
    setPlayerCount(draftPlayerCount);
    setRecommendedWith(draftRecommendedWith);

    const newFilters: Record<string, string> = {};
    if (draftWeightSort) newFilters.weightSort = draftWeightSort;
    if (draftBestWith) newFilters.bestWith = draftBestWith;
    if (draftInStorage) newFilters.inStorage = draftInStorage;
    if (draftPlayerCount) newFilters.playerCount = draftPlayerCount;
    if (draftRecommendedWith) newFilters.recommendedWith = draftRecommendedWith;

    updateFilters(newFilters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setDraftWeightSort('');
    setDraftBestWith('');
    setDraftInStorage('');
    setDraftPlayerCount('');
    setDraftRecommendedWith('');
    setWeightSort('');
    setBestWith('');
    setInStorage('');
    setPlayerCount('');
    setRecommendedWith('');
    updateFilters({});
    setIsFilterOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">보드게임 목록</h1>
      </div>
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>
            게임 등록은 <span className="font-bold text-primary">로그인</span>{' '}
            후 <span className="font-bold text-primary">My 게임</span>{' '}
            페이지에서 가능합니다.
          </li>
        </ul>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="게임 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="h-11 pl-9"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="relative h-11 shrink-0 gap-2"
          onClick={openFilterSheet}
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">필터</span>
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>필터</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="filter-playerCount">플레이어수</Label>
              <select
                id="filter-playerCount"
                className={selectClass}
                value={draftPlayerCount}
                onChange={(e) => setDraftPlayerCount(e.target.value)}
              >
                <option value="">전체</option>
                <option value="1">1인</option>
                <option value="2">2인</option>
                <option value="3">3인</option>
                <option value="4">4인</option>
                <option value="5">5인</option>
                <option value="6">6인</option>
                <option value="7">7인</option>
                <option value="8">8인</option>
                <option value="9">9인 이상</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-recommendedWith">추천 인원</Label>
              <select
                id="filter-recommendedWith"
                className={selectClass}
                value={draftRecommendedWith}
                onChange={(e) => setDraftRecommendedWith(e.target.value)}
              >
                <option value="">전체</option>
                <option value="1">1인</option>
                <option value="2">2인</option>
                <option value="3">3인</option>
                <option value="4">4인</option>
                <option value="5">5인 이상</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-bestWith">최적 인원</Label>
              <select
                id="filter-bestWith"
                className={selectClass}
                value={draftBestWith}
                onChange={(e) => setDraftBestWith(e.target.value)}
              >
                <option value="">전체</option>
                <option value="1">1인</option>
                <option value="2">2인</option>
                <option value="3">3인</option>
                <option value="4">4인</option>
                <option value="5">5인 이상</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-inStorage">보관 상태</Label>
              <select
                id="filter-inStorage"
                className={selectClass}
                value={draftInStorage}
                onChange={(e) => setDraftInStorage(e.target.value)}
              >
                <option value="">모두</option>
                <option value="true">아지트</option>
                <option value="false">외부</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="filter-weightSort">난이도 정렬</Label>
              <select
                id="filter-weightSort"
                className={selectClass}
                value={draftWeightSort}
                onChange={(e) => setDraftWeightSort(e.target.value)}
              >
                <option value="">기본순</option>
                <option value="asc">쉬운순</option>
                <option value="desc">어려운순</option>
              </select>
            </div>
          </div>
          <SheetFooter className="flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={resetFilters}
            >
              초기화
            </Button>
            <Button
              type="button"
              className="h-11 flex-1"
              onClick={applyFilters}
            >
              적용
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {error ? (
        <ErrorState message={error} onRetry={() => updateFilters({})} />
      ) : (
        <InfiniteScroll
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          className="space-y-4"
        >
          <GameListContainer
            boardgames={boardgames}
            virtualItems={virtualizer.getVirtualItems()}
            totalHeight={virtualizer.getTotalSize()}
          />
        </InfiniteScroll>
      )}
    </div>
  );
}
