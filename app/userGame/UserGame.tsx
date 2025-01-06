'use client';

import { useState} from 'react';
import { BoardGame } from '@/types/boardgame';
import toast from 'react-hot-toast';
import AddGameModal from '../components/AddGameModal';
import InfiniteScroll from '../components/InfiniteScroll';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import UserGameListContainer from '../components/UserGameListContainer';


interface UserGameProps {
  initialBoardgames: BoardGame[];
  userId: string;
  limit: number;
}

export default function UserGame({ initialBoardgames, userId, limit }: UserGameProps) {

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
                `/api/boardgames?page=${page}&limit=${limit}${searchTerm ? `&search=${searchTerm}` : ''}&ownerId=${userId}`,
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
                toast.error("회원 정보 - 닉네임 등록 후 사용가능합니다");
                return;
            }

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error:', error);
            toast.error("사용자 정보를 확인하는데 실패했습니다");
        }
    };


  const handleToggleImported = async (gameId: string, gameName: string, currentImported: boolean) => {
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
      
      await reset();
      toast.success(`${gameName} 상태 변경 완료`);

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
      await reset();

      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('게임 삭제 실패:', error);
      alert(error instanceof Error ? error.message : '게임 삭제에 실패했습니다.');
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
           <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">내 보드게임 목록</h1>
            <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    보드게임 추가
                </button>
            </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <ul className='text-sm text-gray-600 space-y-1.5'>
                        <li>게임 등록은 <span className='font-bold text-blue-900'>닉네임</span> 설정 후 이용 할 수 있습니다.</li>
                        <li>게임을 외부로 가져갈 시, <span className='font-bold text-green-800'>아지트</span>를 클릭하여 게임 상태를 변경해주세요.</li>
                </ul>
                </div>
            <div className="relative w-full mb-2">
              <input
                type="text"
                placeholder="게임 이름 검색..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md"
              />
        
            </div>

        <div className="space-y-4">
      
            <InfiniteScroll
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                className="space-y-4"
            >
              <UserGameListContainer
                boardgames={boardgames}
                handleToggleImported={handleToggleImported}
                handleDeleteGame={handleDeleteGame}
              />
            </InfiniteScroll>
        
          
      </div>
       <AddGameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGameAdded={handleGameAdded}
            />
    </div>
     
  );
}
