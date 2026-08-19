import Image from 'next/image';
import { VirtualItem } from '@tanstack/react-virtual';

import { ShopItem } from '@/types/boardgame';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { EmptyState } from './common/EmptyState';

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
    return <EmptyState title="등록된 중고 게임이 없습니다" />;
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
            <div className="flex w-full rounded-2xl border bg-card transition-all duration-200 hover:border-foreground/20 hover:shadow-sm">
              <div className="my-auto h-[140px] w-[140px] shrink-0 p-4 pr-0 md:h-[120px] md:w-[120px] lg:pr-4">
                {item.thumbnailUrl ? (
                  <Image
                    width={100}
                    height={0}
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="h-[100px] w-[100px] object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex flex-grow flex-col p-5">
                <div className="flex flex-col justify-between md:flex-row md:items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {item.name}
                    </h3>
                    {item.memo && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        메모: {item.memo}
                      </div>
                    )}
                    <div className="mt-1 text-sm font-bold lg:mt-2">
                      판매자 : {item.ownerNickname}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm font-bold lg:mt-2">
                      상태 :
                      <Badge
                        variant="outline"
                        className={
                          item.isOnSale
                            ? 'border-transparent bg-primary/10 text-primary'
                            : 'border-transparent bg-muted text-muted-foreground'
                        }
                      >
                        {item.isOnSale ? '판매 중' : '예약 중'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-row justify-between gap-4 md:mt-0 md:flex-col md:items-end lg:h-full lg:justify-center lg:py-4 lg:pl-9">
                    <div className="shrink-0 whitespace-nowrap text-xl font-bold leading-10">
                      {handleCheckSharing(item.price)}
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        if (item.openKakaoUrl)
                          window.open(item.openKakaoUrl, '_blank');
                      }}
                      disabled={!item.openKakaoUrl}
                      className="h-11 shrink-0 whitespace-nowrap bg-[#FEE500] font-bold text-black hover:bg-[#FADA00] disabled:bg-muted disabled:text-muted-foreground"
                    >
                      카톡
                    </Button>
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
