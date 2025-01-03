'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import GameListContainer from "../components/GameListContainer";
import { BoardGame } from '@/types/boardgame';
import AddGameModal from '../components/AddGameModal';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';

interface GameListProps {
    initialBoardgames: BoardGame[];
    limit: number
}

export default function GameList({ initialBoardgames, limit }: GameListProps) {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        items: boardgames,
        loading,
        hasMore,
        loadMore,
        handleSearch,
        reset
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

    const handleGameAdded = async () => {
        await reset(); 
    };

    const handleAddClick = async () => {
        if (!session) {
            toast.error("로그인 후 등록 가능합니다.");
            return;
        }

        try {
            const response = await fetch(`/api/user/check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('사용자 정보를 확인하는데 실패했습니다.');
            }

            const data = await response.json() as { hasNickname: boolean };
            if (!data.hasNickname) {
                toast.error("회원 정보 -> 닉네임 등록 후 사용가능합니다");
                return;
            }

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error:', error);
            toast.error("사용자 정보를 확인하는데 실패했습니다");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">보드게임 목록</h1>
                </div>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    보드게임 추가
                </button>
            </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <ul className='text-sm text-gray-600 space-y-1.5'>
                        <li>게임 등록은 <span className='font-bold text-blue-900'>닉네임</span> 설정을 해주셔야 등록이 가능합니다.</li>
                        <li>게임을 외부로 가져갈 시, 회원 정보에서 게임 상태를 변경할 수 있습니다.</li>
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

            <AddGameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGameAdded={handleGameAdded}
            />
        </div>
    );
}
