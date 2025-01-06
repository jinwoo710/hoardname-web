'use client';

import GameListContainer from "../components/GameListContainer";
import { BoardGame } from '@/types/boardgame';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';

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
    } = useInfinityScroll({
        initialData: initialBoardgames,
        fetchData: async (page: number, searchTerm: string) => {
            const response = await fetch(
                `/api/boardgames?page=${page}&limit=${limit}${searchTerm ? `&search=${searchTerm}` : ''}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to fetch games');
            const data = await response.json() as { items: BoardGame[], hasMore: boolean, total: number };
            return {
                items: data.items,
                hasMore: data.hasMore,
                total: data.total
            };
        },
    });


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

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="게임 이름으로 검색..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
