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
    // const [page, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setBoardgames(initialBoardgames);
    }, [initialBoardgames]);

    useEffect(() => {
        router.refresh();
    }, []);

    // const lastGameElementRef = useCallback((node: HTMLElement | null) => {
    //     if (isLoading) return;
    //     if (observer.current) observer.current.disconnect();
    //     observer.current = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             loadMore();
    //         }
    //     });
    //     if (node) observer.current.observe(node);
    // }, [isLoading, hasMore]);

    // const loadMore = async () => {
    //     if (isLoading) return;
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`/api/boardgames?page=${page + 1}&limit=4`);
    //         const data = await response.json();
    //         if (data.boardgames.length === 0) {
    //             setHasMore(false);
    //         } else {
    //             setBoardgames(prev => [...prev, ...data.boardgames]);
    //             setPage(prev => prev + 1);
    //         }
    //     } catch (error) {
    //         console.error('Error loading more boardgames:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleAddBoardGame = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
 
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddBoardGame}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        보드게임 추가
                    </button>
                </div>
            
            <h1 className="text-2xl font-bold">보드게임 목록</h1>
            <GameListContainer 
                boardgames={boardgames} 
            />
            { (
                <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}
            {isModalOpen && (
                <AddGameModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onGameAdded={(newGame) => {
                        setBoardgames([newGame, ...boardgames]);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
