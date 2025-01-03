'use client'

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BggGame, BoardGame, CreateBoardGame, BggGameResponse } from '@/types/boardgame';
import SearchBggGames from './SearchBggGames';


interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameAdded?: (game: BoardGame) => void;
}



export default function AddGameModal({ isOpen, onClose, onGameAdded }: AddGameModalProps) {
  const { data: session } = useSession();
  const [selectedGame, setSelectedGame] = useState<BggGame | null>(null);
  const [gameId, setGameId] = useState<string>("");

  const handleGameSelect = async (gameId: string) => {
    try {
      setGameId(gameId);
      const response = await fetch(`/api/bgg?id=${gameId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch game data');
      }
      const gameData = await response.json() as BggGameResponse;

      const processedGameData: BggGame = {
        id: gameId,
        ...gameData,
        thumbnailUrl: gameData.thumbnailUrl || '',
        imageUrl: gameData.imageUrl || '',
        minPlayers: gameData.minPlayers || 0,
        maxPlayers: gameData.maxPlayers || 0,
        weight: gameData.weight || 0,
        bestWith: gameData.bestWith || '',
        recommendedWith: gameData.recommendedWith || [],
      };
      setSelectedGame(processedGameData);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setSelectedGame(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedGame || !session?.user?.id) return;

    const submitData: CreateBoardGame = {
      name: selectedGame.name,
      originalName: selectedGame.originalName,
      ownerId: session.user.id,
      bggId: gameId,
      weight: selectedGame.weight,
      bestWith: selectedGame.bestWith?.toString() || '',
      recommendedWith: selectedGame.recommendedWith || '',
      minPlayers: selectedGame.minPlayers,
      maxPlayers: selectedGame.maxPlayers,
      thumbnailUrl: selectedGame.thumbnailUrl,
      imageUrl: selectedGame.imageUrl,
    };

    try {
      const response = await fetch('/api/boardgames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to add boardgame');
      }

      const result = await response.json() as { boardgame: BoardGame };
      if (onGameAdded) {
        onGameAdded(result.boardgame);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const handleClose = () => {
    setSelectedGame(null);
    setGameId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl md:w-[480px] sm:w-full h-auto md:h-auto max-h-[90vh] overflow-y-auto" suppressHydrationWarning>
        <div>
          <div className="relative h-16 border-b border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-800">보드게임 추가</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="닫기"
              >
                <svg 
                  className="w-5 h-5 text-gray-500 hover:text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-6">
            <div className="space-y-2">
              <SearchBggGames onGameSelect={handleGameSelect} />
              {selectedGame ? (
                <div className="flex border rounded-xl  mx-auto max-w-[480px] min-h-[130px] p-2 items-center space-x-3">
                  <div className="w-[100px] h-[100px] relative">
                    <Image
                      src={selectedGame.thumbnailUrl || '/placeholder-game.png'}
                      alt={selectedGame.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <span>{selectedGame.name} </span>
                       <span className="text-sm text-gray-500">{selectedGame.originalName} </span>
                      <div className="flex space-x-2">
                        <div className="flex flex-col">
                            <span className={`text-sm
                                                ${selectedGame.weight > 4.0 ? 'text-red-500' : 
                                                  selectedGame.weight > 3.0 ? 'text-orange-500' :
                                                  selectedGame.weight > 2.0 ? 'text-green-500' :
                                                  selectedGame.weight > 1.0 ? 'text-blue-500' : 'text-purple-500'}
                                            `}>
                                                난이도 {selectedGame.weight.toFixed(1)}
                                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex border rounded-xl mx-auto max-w-[600px] min-h-[130px] p-2 items-center space-x-3 animate-pulse">
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded"></div>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}
         
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                disabled={!selectedGame }
                className="mt-10 px-4 h-14 py-2 w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 rounded-xl focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                추가하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}