'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Search, Trash2 } from 'lucide-react';

import { ShopItem } from '@/types/boardgame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import InfiniteScroll from '../components/InfiniteScroll';
import AddShopModal from '../components/addShopModal/AddShopModal';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import { fetchUserShop, UpdateShopItem } from '../actions/userShop';
import { checkUser } from '../actions/users';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Spinner } from '../components/common/Spinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface UserShopProps {
  initialShopItems: ShopItem[];
  userId: string;
  limit: number;
}

export default function UserShop({
  initialShopItems,
  userId,
  limit,
}: UserShopProps) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    gameId?: string;
    gameName?: string;
  }>({ show: false });

  const {
    items: shopItems,
    loading,
    hasMore,
    loadMore,
    reset,
    handleSearch,
    error,
  } = useInfinityScroll({
    initialData: initialShopItems,
    fetchData: async (page: number, searchTerm: string) => {
      const response = await fetchUserShop({
        page: page,
        limit: limit,
        userId: userId,
        search: searchTerm,
      });
      return {
        items: response.items,
        hasMore: response.hasMore,
        total: response.total,
      };
    },
  });

  const handleGameAdded = async () => {
    await reset();
  };

  const handleAddClick = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await checkUser(session.user.id);
      if (!result.user?.nickname) {
        toast.error('닉네임 설정이 필요합니다.');
        return;
      }
      if (!result.user?.openKakaotalkUrl) {
        toast.error('카카오톡 오픈채팅 링크 설정이 필요합니다.');
        return;
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('사용자 정보를 확인하는 중 오류가 발생했습니다.');
    }
  }, [session]);

  const handleToggleOnSale = async (
    gameId: string,
    gameName: string,
    currentState: boolean
  ) => {
    try {
      const response = await UpdateShopItem({
        id: parseInt(gameId, 10),
        isOnSale: !currentState,
      });

      if (!response.success) throw new Error('Failed to update game status');

      toast.success(`${gameName}의 상태가 변경되었습니다.`);
      await reset();
    } catch (error) {
      console.error('Error updating game status:', error);
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (gameId: string, gameName: string) => {
    try {
      const response = await UpdateShopItem({
        id: parseInt(gameId, 10),
        isDeleted: true,
      });

      if (!response.success) throw new Error('Failed to delete game');

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
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          내 중고 장터 목록
        </h1>
        <Button onClick={handleAddClick} className="h-11">
          중고 게임 추가
        </Button>
      </div>
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>
            중고 게임 등록은{' '}
            <span className="font-bold text-primary">닉네임</span>과{' '}
            <span className="font-bold text-primary">
              카카오톡 오픈채팅 링크
            </span>{' '}
            설정 후 이용 할 수 있습니다.
          </li>
          <li>
            게임이 판매되면,{' '}
            <span className="font-bold text-primary">판매 중</span>을 클릭하여
            상태를 변경해주세요.
          </li>
        </ul>
      </div>
      <div className="relative mb-2 w-full">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="게임 이름으로 검색..."
            onChange={(e) => handleSearch(e.target.value)}
            className="h-11 pl-9"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>
      {error ? (
        <ErrorState message={error} onRetry={reset} />
      ) : (
        <div className="space-y-4">
          <InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
            className="space-y-4"
          >
            <div className="space-y-4">
              {shopItems.length === 0 ? (
                <EmptyState title="등록된 중고 게임이 없습니다" />
              ) : (
                shopItems.map((game) => (
                  <div
                    key={game.id.toString()}
                    className="flex items-center justify-between rounded-2xl border bg-card p-4"
                  >
                    <div className="flex items-center space-x-4">
                      {game.thumbnailUrl && (
                        <Image
                          width={64}
                          height={64}
                          src={game.thumbnailUrl}
                          alt={game.name}
                          className="rounded object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-foreground">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          메모: {game.memo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          가격: {game.price}원
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleToggleOnSale(
                            game.id.toString(),
                            game.name,
                            game.isOnSale
                          )
                        }
                        className={
                          game.isOnSale
                            ? 'h-11 shrink-0 border-transparent bg-primary/10 font-bold text-primary hover:bg-primary/15'
                            : 'h-11 shrink-0 border-transparent bg-muted font-bold text-muted-foreground hover:bg-muted/70'
                        }
                      >
                        {game.isOnSale ? '판매 중' : '예약 중'}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          setShowDeleteConfirm({
                            show: true,
                            gameId: game.id.toString(),
                            gameName: game.name,
                          })
                        }
                        className="size-11 shrink-0"
                        aria-label="삭제"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </InfiniteScroll>
        </div>
      )}
      <AddShopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGameAdded={handleGameAdded}
      />
      <ConfirmDialog
        open={showDeleteConfirm.show}
        onOpenChange={(open) => !open && setShowDeleteConfirm({ show: false })}
        title="삭제 확인"
        description={`${showDeleteConfirm.gameName ?? ''}을(를) 정말 삭제하시겠습니까?`}
        confirmLabel="삭제"
        variant="destructive"
        onConfirm={() =>
          showDeleteConfirm.gameId &&
          handleDelete(
            showDeleteConfirm.gameId,
            showDeleteConfirm.gameName || ''
          )
        }
      />
    </div>
  );
}
