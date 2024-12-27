'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameListContainer from "../components/GameListContainer";
import { BoardGame } from '@/types/boardgame';
import AddGameModal from '../components/AddGameModal';

interface GameListProps {
    initialBoardgames: BoardGame[];
}

export default function GameList({ initialBoardgames }: GameListProps) {
    const router = useRouter();
    const [boardgames, setBoardgames] = useState<BoardGame[]>(initialBoardgames);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setBoardgames(initialBoardgames);
    }, [initialBoardgames]);

    const handleGameAdded = (newGame: BoardGame) => {
        setBoardgames(prev => [newGame, ...prev]);
        console.log(newGame);
        console.log(boardgames);
        setIsModalOpen(false);
        // 서버 상태를 갱신하기 위해 페이지를 새로고침
        router.refresh();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">내 보드게임</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
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
