import Image from 'next/image';
import { VirtualItem } from '@tanstack/react-virtual';

import { BoardGame } from '@/types/boardgame';
import { Badge } from '@/components/ui/badge';

import { EmptyState } from './common/EmptyState';

interface GameListContainerProps {
  boardgames: BoardGame[];
  virtualItems: VirtualItem[];
  totalHeight: number;
}

const weightColor = (weight: number) =>
  weight >= 4.0
    ? 'text-red-500'
    : weight >= 3.0
      ? 'text-orange-500'
      : weight >= 2.0
        ? 'text-green-500'
        : weight >= 1.0
          ? 'text-blue-500'
          : 'text-purple-500';

export default function GameListContainer({
  boardgames,
  virtualItems,
  totalHeight,
}: GameListContainerProps) {
  const formatRecommendedWith = (recommendedWith: string | null) => {
    if (!recommendedWith) return null;
    try {
      const parsed = JSON.parse(recommendedWith);

      if (!Array.isArray(parsed) || parsed.length === 0) return null;
      if (parsed.length === 1) return parsed[0];
      return parsed[0] + '-' + parsed[parsed.length - 1];
    } catch {
      return null;
    }
  };

  if (boardgames.length === 0) {
    return <EmptyState title="보드게임이 없습니다" />;
  }

  return (
    <div style={{ height: totalHeight, position: 'relative' }}>
      {virtualItems.map((virtualItem) => {
        const item = boardgames[virtualItem.index];
        return (
          <div
            key={`${item.id}-${virtualItem.index}`}
            className="flex w-full rounded-2xl border bg-card transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="my-auto h-[120px] w-[120px] shrink-0 p-4 pr-0 lg:h-[160px] lg:w-[160px] lg:pr-4">
              {item.thumbnailUrl ? (
                <Image
                  width={140}
                  height={0}
                  src={item.thumbnailUrl}
                  alt="thumbnail"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="flex flex-grow flex-col p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 line-clamp-1 font-bold text-foreground lg:text-xl">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>
                      {item.minPlayers === item.maxPlayers
                        ? `${item.minPlayers}인`
                        : `${item.minPlayers}-${item.maxPlayers}인`}
                    </span>
                    {item.weight !== null ? (
                      <span className={weightColor(item.weight)}>
                        난이도 {item.weight.toFixed(1)}
                      </span>
                    ) : (
                      <span>난이도 없음</span>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.inStorage
                      ? 'ml-1 shrink-0 border-transparent bg-primary/10 text-primary'
                      : 'ml-1 shrink-0 border-transparent bg-muted text-muted-foreground'
                  }
                >
                  {item.inStorage ? '아지트' : '외부'}
                </Badge>
              </div>

              <div className="flex-grow">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    최적 {item.bestWith ? item.bestWith + '인' : '없음'}
                  </span>
                  <span>
                    추천{' '}
                    {formatRecommendedWith(item.recommendedWith) !== null
                      ? formatRecommendedWith(item.recommendedWith) + '인'
                      : '없음'}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end text-sm text-muted-foreground">
                <span className="font-medium">제공:</span>
                <span className="ml-2">{item.ownerNickname}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
