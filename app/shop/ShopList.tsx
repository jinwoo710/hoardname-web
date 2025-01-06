'use client';

import { useState } from 'react';
import {  ShopItem } from '@/types/boardgame';
import ShopListContainer from '../components/ShopListContainer';
import AddShopModal from '../components/AddShopModal';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import InfiniteScroll from '../components/InfiniteScroll';

interface ShopListProps {
    initialShopItems: ShopItem[];
    limit: number;
}
export interface UserCheckResponse {
  hasNickname: boolean;
    nickname: string | null;
    openKakaotalkUrl: string | null;
}

export default function ShopList({ initialShopItems, limit }: ShopListProps) {

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
            searchParams.set("isDeleted", "false"); 
            if (searchTerm) searchParams.set("search", searchTerm);

            const response = await fetch(
                `/api/shop?${searchParams.toString()}`,
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


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">중고 장터 목록</h1>
            </div>
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <ul className='text-sm text-gray-600 space-y-1.5'>
                        <li>중고 장터 등록은 <span className='font-bold text-blue-900'>로그인</span> 후 <span className='font-bold text-blue-900'>My 장터</span> 페이지에서 가능합니다.</li>
                        <li>전문 업자, 되팔이등의 행위 발각시 사용이 불가능합니다.</li>
                    <li>거래간 문제 발생 시, 호드네임에서 책임을 지지 않습니다</li>
                </ul>
                </div>
  <div className="mb-6">
                <input
                    type="text"
                    placeholder="게임 이름으로 검색..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <InfiniteScroll
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
                className="space-y-4"
            >
                <ShopListContainer boardgames={shopItems} />
            </InfiniteScroll>

            <AddShopModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGameAdded={handleGameAdded}
            />
        </div>
    );
}
