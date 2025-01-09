'use client';

import { useState} from 'react';
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



  const handleToggleImported = async (gameId: string, gameName: string, currentState: boolean) => {
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
      toast.success(`${gameName} 상태 변경 완료`);
      await reset();
    } catch (error) {
      toast.error(`${gameName} 상태 변경 실패`);
    console.error('게임 상태 변경 실패:', error);
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleImported(game.id.toString(), game.name, game.isDeleted ?? false)}
                    className={`w-[60px] h-[40px] flex justify-center items-center py-1 ml-2 rounded shrink-0 ${
                      game.isDeleted 
                        ? 'bg-red-100 text-red-800' 
                        :  'bg-green-100 text-green-800' 
                    }`}
                  >
                    <span className="text-[12px] font-bold mx-auto shrink-0">{game.isDeleted ? '판매 완료' : '판매 중'}</span>
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
       
    
    </div>
  );
}
