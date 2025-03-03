'use client';

import Image from 'next/image';

import { BoardGame, UpdateBoardGame } from '@/types/boardgame';

interface UserGameListContainerProps {
  boardgames: BoardGame[];
  handleUpdateGame: (gameData: UpdateBoardGame) => Promise<void>;
  handleDeleteGame: (id: string) => Promise<void>;
}

export default function UserGameListContainer({
  boardgames,
  handleUpdateGame,
  handleDeleteGame,
}: UserGameListContainerProps) {
  const handleToggleInStorage = async (game: BoardGame) => {
    await handleUpdateGame({
      id: game.id,
      inStorage: !game.inStorage,
    });
  };

  return (
    <div className="space-y-4">
      {boardgames.length === 0 ? (
        <div className="text-center pt-[50px] lg:pt-[200px] text-lg text-gray-500">
          등록된 보드게임이 없습니다
        </div>
      ) : (
        boardgames.map((game) => (
          <div
            key={game.id.toString()}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {game.thumbnailUrl && (
                <div className="flex justify-center items-center w-16 h-16">
                  <Image
                    width={64}
                    height={64}
                    src={game.thumbnailUrl}
                    alt={game.name}
                    className="object-contain rounded"
                    style={{
                      maxWidth: '64px',
                      maxHeight: '64px',
                      width: 'auto',
                      height: 'auto',
                    }}
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{game.name}</h3>
                <p className="hidden md:block text-sm text-gray-500">
                  {game.originalName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleInStorage(game)}
                className={`w-[40px] h-[40px] md:w-[60px] flex justify-center items-center py-1 rounded ${
                  game.inStorage
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span className="text-[12px] font-bold mx-auto">
                  {game.inStorage ? '아지트' : '외부'}
                </span>
              </button>
              <button
                onClick={() => handleDeleteGame(game.id.toString())}
                className="w-[40px] h-[40px] px-3 py-1 rounded bg-red-100 text-red-800"
              >
                <svg
                  className="w-4 h-4 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
