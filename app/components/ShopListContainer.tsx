import Image from 'next/image';
import { VirtualItem } from '@tanstack/react-virtual';

import { ShopItem } from '@/types/boardgame';

interface ShopListContainerProps {
  boardgames: ShopItem[];
  virtualItems: VirtualItem[];
  totalHeight: number;
  measureElement: (el: HTMLElement | null) => void;
}

export default function ShopListContainer({
  boardgames,
  totalHeight,
  virtualItems,
  measureElement,
}: ShopListContainerProps) {
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
  };

  return (
    <div style={{ height: totalHeight, position: 'relative' }}>
      {virtualItems.map((virtualItem) => {
        const item = boardgames[virtualItem.index];
        return (
          <div
            key={`${item.id}-${virtualItem.key}`}
            ref={measureElement}
            data-index={virtualItem.index}
            className="pb-2"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="flex border border-gray-100 rounded-2xl w-full bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-200">
              <div className="w-[140px] md:w-[120px] md:h-[120px] h-[140px] flex-shrink-0 p-4 pr-0 lg:pr-4 my-auto">
                {item.thumbnailUrl ? (
                  <Image
                    width={100}
                    height={0}
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="object-contain w-[100px] h-[100px]"
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
                    <h3 className="font-bold text-xl text-gray-800">
                      {item.name}
                    </h3>
                    {item.memo && (
                      <div className="text-sm text-gray-500 mt-1">
                        메모: {item.memo}
                      </div>
                    )}
                    <div className="text-sm mt-1 lg:mt-2 font-bold ">
                      판매자 : {item.ownerNickname}
                    </div>
                    <div className="text-sm mt-1 lg:mt-2 font-bold ">
                      상태 :{' '}
                      <span
                        className={`${item.isOnSale ? 'text-green-700' : 'text-red-600'}`}
                      >
                        {item.isOnSale ? '판매 중' : '예약 중'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 mt-2 md:mt-0 lg:pl-9 lg:h-full lg:py-4 lg:justify-center">
                    <div className="text-xl font-bold shrink-0 whitespace-nowrap leading-10">
                      {handleCheckSharing(item.price)}
                    </div>
                    <button
                      onClick={() => {
                        if (item.openKakaoUrl)
                          window.open(item.openKakaoUrl, '_blank');
                      }}
                      disabled={!item.openKakaoUrl}
                      className="px-4 py-2 whitespace-nowrap bg-[#FEE500] font-bold text-black rounded-xl disabled:bg-gray-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 shrink-0 focus:ring-[#FEE500]"
                    >
                      카톡
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
