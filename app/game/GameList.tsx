'use client';

import GameListContainer from "../components/GameListContainer";
import { BoardGame } from '@/types/boardgame';
import { useInfinityScroll,  } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';
import { useState } from "react";

interface GameListProps {
    initialBoardgames: BoardGame[];
    limit: number
}

export default function GameList({ initialBoardgames, limit }: GameListProps) {

    const {
        items: boardgames,
        loading,
        hasMore,
        loadMore,
        handleSearch,
        updateFilters
    } = useInfinityScroll({
        initialData: initialBoardgames,
        fetchData: async (page: number, searchTerm: string, filters?: Record<string, string>) => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (searchTerm) searchParams.set("search", searchTerm);
            if (filters?.weightSort) searchParams.set("weightSort", filters.weightSort);
            if (filters?.bestWith) searchParams.set("bestWith", filters.bestWith);

            const response = await fetch(
                `/api/boardgames?${searchParams.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to fetch games');
            const data = await response.json() as { items: BoardGame[], hasMore: boolean, total: number };
            return data;
        },
    });

    const [weightSort, setWeightSort] = useState<string>("");
    const [bestWith, setBestWith] = useState<string>("");

    const handleFilterChange = (type: "weightSort" | "bestWith", value: string) => {
        if (type === "weightSort") {
            setWeightSort(value);
        } else {
            setBestWith(value);
        }
        
        const newFilters: Record<string, string> = {};
        if (type === "weightSort") {
            if (value) newFilters.weightSort = value;
            if (bestWith) newFilters.bestWith = bestWith;
        } else {
            if (weightSort) newFilters.weightSort = weightSort;
            if (value) newFilters.bestWith = value;
        }
        
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
                    <ul className='text-sm text-gray-600 space-y-1.5'>
                        <li>게임 등록은 <span className='font-bold text-blue-900'>로그인</span> 후 <span className='font-bold text-blue-900'>My 게임</span> 페이지에서 가능합니다.</li>

                </ul>
                </div>

            <div className="flex gap-4 mb-4">
               
            </div>

            <div className="mb-6 flex lg:space-x-2 lg:flex-row flex-col-reverse">
                <input
                    type="text"
                    placeholder="게임 이름으로 검색..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2 mb-2 lg:mb-0">
                 <select 
                    className="border border-gray-200  rounded-xl px-5 py-2 w-full lg:w-auto"
                    value={weightSort}
                    onChange={(e) => handleFilterChange("weightSort", e.target.value)}
                >
                    <option value="">난이도 정렬</option>
                    <option value="asc">쉬운순</option>
                    <option value="desc">어려운순</option>
                </select>

                <select 
                    className="border border-gray-200  rounded-xl px-5 py-2 w-full lg:w-auto"
                    value={bestWith}
                    onChange={(e) => handleFilterChange("bestWith", e.target.value)}
                >
                    <option value="">최적 인원수</option>
                    <option value="1">1인</option>
                    <option value="2">2인</option>
                    <option value="3">3인</option>
                    <option value="4">4인</option>
                    <option value="5">5인 이상</option>
                </select>
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
