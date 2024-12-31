'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import GameListContainer from "../components/GameListContainer";
import { BoardGame } from '@/types/boardgame';
import AddGameModal from '../components/AddGameModal';

interface GameListProps {
    initialBoardgames: BoardGame[];
}
export interface UserCheckResponse {
  hasNickname: boolean;
  nickname: string | null;
}

export default function GameList({ initialBoardgames }: GameListProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [boardgames, setBoardgames] = useState<BoardGame[]>(initialBoardgames);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setBoardgames(initialBoardgames);
    }, [initialBoardgames]);

    const handleGameAdded = (newGame: BoardGame) => {
        setBoardgames(prev => [newGame, ...prev]);
        setIsModalOpen(false);
        router.refresh();
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

            const data = (await response.json()) as UserCheckResponse;
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">보드게임 목록</h1>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    보드게임 추가
                </button>
            </div>

            <GameListContainer boardgames={boardgames} />

            <AddGameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGameAdded={handleGameAdded}
            />
        </div>
    );
}
