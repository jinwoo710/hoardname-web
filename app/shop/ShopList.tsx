'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
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
                toast.error("회원 정보 -> 닉네임 등록 후 사용가능합니다");
                return;
            }

            if(!data.openKakaotalkUrl) {
                toast.error("회원 정보 -> 카카오톡 오픈채팅 링크 등록 후 사용가능합니다");
                return;
            }

            

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error:', error);
            toast.error("사용자 정보를 확인하는데 실패했습니다");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">중고 장터 목록</h1>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    중고 게임 추가
                </button>
            </div>
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <ul className='text-sm text-gray-600 space-y-1.5'>
                        <li>해당 게시판은 호드네임 인원들 간의 중고 거래를 돕기 위한 게시판입니다</li>
                        <li>중고 게임 등록은 <span className='font-bold text-blue-900'>닉네임</span>과 <span className='font-bold text-blue-900'>카카오톡 오픈채팅 링크</span> 설정을 해주셔야 등록이 가능합니다.</li>
                        <li>전문 업자, 되팔이등의 행위 발각시 사용이 불가능합니다.</li>
                        <li>거래간 문제 발생 시, 호드네임에서는 책임을 지지 않습니다</li>
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
