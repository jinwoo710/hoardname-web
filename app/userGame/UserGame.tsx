'use client';

import { useState} from 'react';
import { BoardGame } from '@/types/boardgame';
import toast from 'react-hot-toast';

interface UserGameProps {
  initialBoardgames: BoardGame[];
}

export default function UserGame({ initialBoardgames }: UserGameProps) {

  const [boardgames, setBoardgames] = useState<BoardGame[]>(initialBoardgames);
  const [filteredGames, setFilteredGames] = useState<BoardGame[]>(initialBoardgames);
  const [searchTerm, setSearchTerm] = useState('');




  const handleToggleImported = async (gameId: string, currentImported: boolean) => {
    try {
      const response = await fetch('/api/boardgames', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(gameId, 10),
          imported: !currentImported,
        }),
      });

      if (!response.ok) throw new Error('게임 상태 변경에 실패했습니다.');
      
      const { boardgame } = await response.json() as { boardgame: BoardGame };
      setBoardgames(prevGames => 
        prevGames.map(game => 
          game.id === boardgame.id ? boardgame : game
        )
      );
      setFilteredGames(prevGames => 
        prevGames.map(game => 
          game.id === boardgame.id ? boardgame : game
        )
      );
    } catch (error) {
      console.error('게임 상태 변경 실패:', error);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('정말 이 게임을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/boardgames?id=${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('게임 삭제에 실패했습니다.');
      }
      
      const numericId = parseInt(gameId, 10);
      const updatedGames = boardgames.filter(game => game.id !== numericId);
      setBoardgames(updatedGames);
      setFilteredGames(filteredGames.filter(game => game.id !== numericId));
      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('게임 삭제 실패:', error);
      alert(error instanceof Error ? error.message : '게임 삭제에 실패했습니다.');
    }
  };

  const handleSearch = (term: string) => {
    const filtered = term
      ? boardgames.filter(game =>
          game.name.toLowerCase().includes(term.toLowerCase()) ||
          (game.originalName && game.originalName.toLowerCase().includes(term.toLowerCase()))
        )
      : boardgames;
    setFilteredGames(filtered);
    setSearchTerm(term);
  };

  return (
    <div className="container mx-auto px-4 py-8">

    
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">내 보드게임 목록</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="게임 이름 검색..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {searchTerm ? '검색 결과가 없습니다' : '보유한 보드게임이 없습니다'}
            </p>
          ) : (
            filteredGames.map((game) => (
              <div
                key={game.id.toString()}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {game.thumbnailUrl && (
                    <img src={game.thumbnailUrl} alt={game.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-medium">{game.name}</h3>
                    <p className="hidden md:block text-sm text-gray-500">{game.originalName}</p>
     
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleImported(game.id.toString(), game.imported ?? false)}
                    className={`w-[40px] h-[40px] md:w-[60px] flex justify-center items-center py-1 rounded ${
                      game.imported 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span className="text-[12px] font-bold mx-auto">{game.imported ? '아지트' : '외부'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.id.toString())}
                    className="w-[40px] h-[40px] px-3 py-1 rounded bg-red-100 text-red-800"
                  >
                    <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
}
