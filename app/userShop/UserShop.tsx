'use client';

import { useState} from 'react';
import { ShopItem } from '@/types/boardgame';

interface UserShopProps {
  initialShopItems: ShopItem[];
}

export default function UserShop({ initialShopItems }: UserShopProps) {

  const [boardgames, setBoardgames] = useState<ShopItem[]>(initialShopItems);
  const [filteredGames, setFilteredGames] = useState<ShopItem[]>(initialShopItems);
  const [searchTerm, setSearchTerm] = useState('');




  const handleToggleImported = async (gameId: string, currentState: boolean) => {
    try {
      const response = await fetch('/api/shop', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(gameId, 10),
          isDeleted: !currentState,
        }),
      });

      if (!response.ok) throw new Error('게임 상태 변경에 실패했습니다.');
      
       const { shopItem } = await response.json() as { shopItem: ShopItem };
    setBoardgames(prevGames => 
      prevGames.map(game => 
        game.id === shopItem.id ? shopItem : game // 업데이트된 shopItem으로 교체
      )
    );
    setFilteredGames(prevGames => 
      prevGames.map(game => 
        game.id === shopItem.id ? shopItem : game // 업데이트된 shopItem으로 교체
      )
    );
  } catch (error) {
    console.error('게임 상태 변경 실패:', error);
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
              {searchTerm ? '검색 결과가 없습니다' : '판매중인 보드게임이 없습니다'}
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
                    <p className="text-sm text-gray-500">메모: {game.memo}</p>
                       <p className="text-sm text-gray-500">가격: {game.price}원</p>
     
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleImported(game.id.toString(), game.isDeleted ?? false)}
                    className={`w-[40px] h-[40px] md:w-[60px] flex justify-center items-center py-1 rounded ${
                      game.isDeleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span className="text-[12px] font-bold mx-auto">{game.isDeleted ? '판매 완료' : '판매 중'}</span>
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
    
    </div>
  );
}
