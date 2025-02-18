'use client';

import { useState } from 'react';

import { BoardGame } from '@/types/boardgame';

import GameListContainer from '../components/GameListContainer';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';
import { fetchBoardgames } from '../actions/boardgames';

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
  const [weightSort, setWeightSort] = useState<string>('');
  const [bestWith, setBestWith] = useState<string>('');
  const [inStorage, setInStorage] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<string>('');
  const [recommendedWith, setRecommendedWith] = useState<string>('');

  const resetFilters = () => {
    setWeightSort('');
    setBestWith('');
    setInStorage('');
    setPlayerCount('');
    setRecommendedWith('');
    setSearchTerm('');

    const searchInput = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }

    updateFilters({}, '');
  };

  const handleFilterChange = (
    type:
      | 'weightSort'
      | 'bestWith'
      | 'inStorage'
      | 'playerCount'
      | 'recommendedWith',
    value: string
  ) => {
    let newWeightSort = weightSort;
    let newBestWith = bestWith;
    let newInStorage = inStorage;
    let newPlayerCount = playerCount;
    let newRecommendedWith = recommendedWith;

    switch (type) {
      case 'weightSort':
        newWeightSort = value;
        setWeightSort(value);
        break;
      case 'bestWith':
        newBestWith = value;
        setBestWith(value);
        break;
      case 'inStorage':
        newInStorage = value;
        setInStorage(value);
        break;
      case 'playerCount':
        newPlayerCount = value;
        setPlayerCount(value);
        break;
      case 'recommendedWith':
        newRecommendedWith = value;
        setRecommendedWith(value);
        break;
    }

    const newFilters: Record<string, string> = {};
    if (newWeightSort) newFilters.weightSort = newWeightSort;
    if (newBestWith) newFilters.bestWith = newBestWith;
    if (newInStorage) newFilters.inStorage = newInStorage;
    if (newPlayerCount) newFilters.playerCount = newPlayerCount;
    if (newRecommendedWith) newFilters.recommendedWith = newRecommendedWith;

    updateFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">보드게임 목록</h1>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>
            게임 등록은 <span className="font-bold text-blue-900">로그인</span>{' '}
            후 <span className="font-bold text-blue-900">My 게임</span>{' '}
            페이지에서 가능합니다.
          </li>
        </ul>
      </div>

      <div className="mb-4 flex flex-col space-y-2">
        <div className="flex lg:space-x-2  flex-col lg:flex-row">
          <div className="flex space-x-2 mb-2 lg:mb-0">
            <select
              className="border border-gray-200 h-[42px] rounded-xl px-5 py-2 w-full lg:w-auto appearance-none text-center"
              value={playerCount}
              onChange={(e) =>
                handleFilterChange('playerCount', e.target.value)
              }
            >
              <option value="">플레이어수</option>
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
            <select
              className="border border-gray-200 h-[42px] rounded-xl px-5 py-2 w-full lg:w-auto appearance-none text-center"
              value={recommendedWith}
              onChange={(e) =>
                handleFilterChange('recommendedWith', e.target.value)
              }
            >
              <option value="">추천 인원</option>
              <option value="1">1인</option>
              <option value="2">2인</option>
              <option value="3">3인</option>
              <option value="4">4인</option>
              <option value="5">5인 이상</option>
            </select>
            <select
              className="border border-gray-200 h-[42px] rounded-xl px-5 py-2 w-full lg:w-auto appearance-none text-center"
              value={bestWith}
              onChange={(e) => handleFilterChange('bestWith', e.target.value)}
            >
              <option value="">최적 인원</option>
              <option value="1">1인</option>
              <option value="2">2인</option>
              <option value="3">3인</option>
              <option value="4">4인</option>
              <option value="5">5인 이상</option>
            </select>
          </div>
          <div className="flex space-x-2 mb-2 lg:mb-0">
            <select
              className="border border-gray-200 h-[42px] rounded-xl px-5 py-2 w-full lg:w-auto appearance-none text-center"
              value={inStorage}
              onChange={(e) => handleFilterChange('inStorage', e.target.value)}
            >
              <option value="">모두</option>
              <option value="true">아지트</option>
              <option value="false">외부</option>
            </select>
            <select
              className="border border-gray-200 h-[42px] rounded-xl px-5 py-2 w-full  lg:w-auto appearance-none text-center"
              value={weightSort}
              onChange={(e) => handleFilterChange('weightSort', e.target.value)}
            >
              <option value="">난이도 정렬</option>
              <option value="asc">쉬운순</option>
              <option value="desc">어려운순</option>
            </select>
            <button
              className="border border-gray-200 h-[42px] rounded-xl px-5 py-2 w-full lg:w-auto bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 font-bold"
              onClick={resetFilters}
            >
              필터 리셋
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="게임 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      <InfiniteScroll
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        className="space-y-4"
      >
        <GameListContainer boardgames={boardgames} />
      </InfiniteScroll>
    </div>
  );
}
