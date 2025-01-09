'use client';

import { useState } from 'react';
import {  ShopItem } from '@/types/boardgame';
import ShopListContainer from '../components/ShopListContainer';
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
const [priceSort, setPriceSort] = useState<string>("");
    const {
        items: shopItems,
        loading,
        hasMore,
        loadMore,
        updateFilters,
        handleSearch
    } = useInfinityScroll({
        initialData: initialShopItems,
        fetchData: async (page: number, searchTerm: string, filters?: Record<string, string>) => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            searchParams.set("isDeleted", "false"); 
            if (searchTerm) searchParams.set("search", searchTerm);
            if (filters?.priceSort) searchParams.set("priceSort", filters.priceSort);

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

     const handleFilterChange = ( value: string) => {
        setPriceSort(value)
        
        const newFilters: Record<string, string> = {};
            if (value) newFilters.priceSort = value;
        
        updateFilters(newFilters);
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
                    <li>판매 완료 처리된 상품은 해당 페이지에서 확인이 불가능합니다.</li>
                </ul>
                </div>
  <div className="mb-6">
        <div className="relative flex space-x-2">
            
                    <input
                        type="text"
                        placeholder="게임 이름으로 검색..."
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                       <select 
                    className="border border-gray-200  rounded-xl px-5 py-2 w-fit lg:w-auto"
                    value={priceSort}
                    onChange={(e) => handleFilterChange( e.target.value)}
                >
                    <option value="">가격 정렬</option>
                    <option value="asc">낮은 가격순</option>
                    <option value="desc">높은 가격순</option>
                </select>
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
            </div>
            <InfiniteScroll
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
                className="space-y-4"
            >
                <ShopListContainer boardgames={shopItems} />
            </InfiniteScroll>
        </div>
    );
}