'use client';

import { ShopItem } from "@/types/boardgame";
import Image from "next/image";

interface ShopListContainerProps {
    boardgames: ShopItem[];
}

export default function ShopListContainer({ boardgames }: ShopListContainerProps) {
    if (boardgames.length === 0) {
        return (
            <div className="text-center pt-[50px] lg:pt-[200px] text-lg text-gray-500">
                등록된 중고 게임이 없습니다.
            </div>
        );
    }

    const handleCheckSharing = (price: number | null) => {
        if (price === null || price === 0) {
            return '나눔';
        }
        
        return `${price.toLocaleString()}원`;
    }

    return (
        <div className="space-y-4">
            {boardgames.map((item) => (
                <div
                    key={item.id}
                    className="flex border border-gray-100 rounded-2xl w-full bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-200"
                >
                    <div className="w-[140px] md:w-[120px] md:h-[120px] h-[140px] flex-shrink-0 p-4 pr-0 lg:pr-4 my-auto">
                        {item.thumbnailUrl ? (
                            <Image 
                                width={100} 
                                height={100} 
                                src={item.thumbnailUrl} 
                                alt={item.name}
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="flex-grow p-5 flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800  line-clamp-1">
                                    {item.name}
                                </h3>
                                  {item.memo && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        메모: {item.memo}
                                    </div>
                                )}
                                <div className="text-sm  mt-2">
                                    판매자: {item.ownerNickname}
                                </div>
                                
                              
                            </div>
                            
                            <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 mt-2 md:mt-0 lg:pl-9 lg:h-full lg:py-4 lg:justify-center">
                                <div className="text-xl font-bold shrink-0 whitespace-nowrap">
                                    {handleCheckSharing(item.price)}
                                </div>
                                <button
                                    onClick={() => window.open(item.openKakaoUrl, '_blank')}
                                    disabled={!item.openKakaoUrl}
                                    className="px-4 py-2 whitespace-nowrap bg-yellow-400 text-black rounded-xl disabled:bg-gray-300 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 shrink-0 focus:ring-yellow-400 font-medium"
                                >
                                    카톡
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}