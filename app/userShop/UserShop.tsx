'use client';

import { useState } from 'react';
import { ShopItem } from '@/types/boardgame';
import InfiniteScroll from '../components/InfiniteScroll';
import AddShopModal from '../components/AddShopModal';
import { useSession } from 'next-auth/react';
import { UserCheckResponse } from '../shop/ShopList';
import toast from 'react-hot-toast';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import Image from 'next/image'

interface UserShopProps {
  initialShopItems: ShopItem[];
  userId: string;
  limit:number;
}

export default function UserShop({ initialShopItems, userId, limit }: UserShopProps) {

   const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean; gameId?: string; gameName?: string}>({ show: false });

    const {
        items: shopItems,
        loading,
        hasMore,
        loadMore,
        reset,
        handleSearch
    } = useInfinityScroll({
        initialData: initialShopItems,
        fetchData: async (page: number, searchTerm: string) => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (searchTerm) searchParams.set("search", searchTerm);

            const response = await fetch(
                `/api/shop?${searchParams.toString()}&ownerId=${userId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to fetch shop items');
            const data = await response.json() as { items: ShopItem[], hasMore: boolean, total: number };
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

            const data = (await response.json()) as UserCheckResponse;
            if (!data.hasNickname) {
                toast.error("회원 정보 - 닉네임 등록 후 사용가능합니다");
                return;
            }

            if(!data.openKakaotalkUrl) {
                toast.error("회원 정보 - 카카오톡 오픈채팅 링크 등록 후 사용가능합니다");
                return;
            }

            

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error:', error);
            toast.error("사용자 정보를 확인하는데 실패했습니다");
        }
    };

  const handleToggleOnSale = async (gameId: string, gameName: string, currentState: boolean) => {
 
        try {
          const response = await fetch('/api/shop', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: parseInt(gameId, 10),
              isOnSale: !currentState,
            }),
          });

          if (!response.ok) throw new Error('Failed to update game status');
          
          toast.success(`${gameName}의 상태가 변경되었습니다.`);
          await reset();
        } catch (error) {
          console.error('Error updating game status:', error);
          toast.error('상태 변경에 실패했습니다.');
        }
      };

      const handleDelete = async (gameId: string, gameName: string) => {
        try {
          const response = await fetch('/api/shop', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: parseInt(gameId, 10),
              isDeleted: true,
            }),
          });

          if (!response.ok) throw new Error('Failed to delete game');
          console.log(response)
          
          toast.success(`${gameName}이(가) 삭제되었습니다.`);
          await reset();
          setShowDeleteConfirm({ show: false });
        } catch (error) {
          console.error('Error deleting game:', error);
          toast.error('삭제에 실패했습니다.');
        }
      };

  return (
 <div className="container mx-auto px-4 py-8">
           <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">내 중고 장터 목록</h1>
            <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    중고 게임 추가
                </button>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <ul className='text-sm text-gray-600 space-y-1.5'>
                        <li>중고 게임 등록은 <span className='font-bold text-blue-900'>닉네임</span>과 <span className='font-bold text-blue-900'>카카오톡 오픈채팅 링크</span> 설정 후 이용 할 수 있습니다.</li>
          <li>게임이 판매되면, <span className='font-bold text-green-800'>판매 중</span>을 클릭하여 상태를 변경해주세요.</li>
                </ul>
                </div>
          <div className="relative w-full mb-2">
      <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="게임 이름으로 검색..."
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
        
            </div>
     <div className="space-y-4">
      
       <InfiniteScroll
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
                className="space-y-4"
            >
               <div className="space-y-4">
          {shopItems.length === 0 ? (
         <div className="text-center pt-[50px] lg:pt-[200px] text-lg text-gray-500">등록된 중고 게임이 없습니다</div>
          ) : (
            shopItems.map((game) => (
              <div
                key={game.id.toString()}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {game.thumbnailUrl && (
                    <Image width={64} height={64} src={game.thumbnailUrl} alt={game.name} className="object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-medium">{game.name}</h3>
                    <p className="text-sm text-gray-500">메모: {game.memo}</p>
                       <p className="text-sm text-gray-500">가격: {game.price}원</p>
     
                  </div>
                </div>
                <div className="flex items-center lg:space-x-3 flex-col lg:flex-row lg:space-y-0 space-y-3">
                      <button
                    onClick={() => handleToggleOnSale(game.id.toString(), game.name, game.isOnSale )}
                    className={`w-[60px] h-[40px] flex justify-center items-center py-1 ml-2 rounded shrink-0 ${
                      game.isOnSale 
                      ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800' 
                    }`}
                  >
                    <span className="text-[12px] font-bold mx-auto shrink-0">{game.isOnSale ? '판매 중' : '예약 중'}</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm({ show: true, gameId: game.id.toString(), gameName: game.name })}
                    className="w-[60px] h-[40px] flex text-[12px] font-bold justify-center items-center py-1 ml-2 rounded text-gray-600 shrink-0 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
            </InfiniteScroll>

           
      </div>
       <AddShopModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGameAdded={handleGameAdded}
      />
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">삭제 확인</h3>
            <p className="mb-6">{showDeleteConfirm.gameName}을(를) 정말 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm({ show: false })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                취소
              </button>
              <button
                onClick={() => showDeleteConfirm.gameId && handleDelete(showDeleteConfirm.gameId, showDeleteConfirm.gameName || '')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
