'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { BggGame, CreateShopItem, ShopItem } from '@/types/boardgame';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { Modal } from '../common/Modal';
import SearchBggGames from '../searchBggGames/SearchBggGames';
import { CreateShopItem as createShopItem } from '../../actions/userShop';
import { useGameDetail } from '../../hooks/useBggQuery';

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameAdded?: (game: ShopItem) => void;
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

export default function AddShopModal({
  isOpen,
  onClose,
  onGameAdded,
}: AddShopModalProps) {
  const { data: session } = useSession();
  const [selectedGame, setSelectedGame] = useState<BggGame | null>(null);
  const [price, setPrice] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');

  const { data: gameDetail, isLoading } = useGameDetail(gameId);

  useEffect(() => {
    if (gameDetail && !isLoading) {
      setSelectedGame({
        id: gameId,
        name: gameDetail.koreanName || gameDetail.primaryName,
        originalName: gameDetail.primaryName,
        weight: parseFloat(gameDetail.weight),
        minPlayers: parseInt(gameDetail.minPlayers),
        maxPlayers: parseInt(gameDetail.maxPlayers),
        thumbnailUrl: gameDetail.thumbnail,
        imageUrl: gameDetail.thumbnail,
        bestWith: gameDetail.bestWith?.toString() || '',
        recommendedWith: gameDetail.recommendedWith?.toString() || '',
      });
    }
  }, [gameDetail, isLoading, gameId]);

  const handleGameSelect = (selectedGameId: string) => {
    setGameId(selectedGameId);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrice('');
      return;
    }
    const numberValue = Number(value);
    setPrice(numberValue.toString());
  };

  const formatPrice = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedGame || !session?.user?.id) return;

    if (!price) {
      toast.error('가격을 입력해주세요.');
      return;
    }
    if (Number(price) > 500000) {
      toast.error('가격은 500,000원 이하로 설정해주세요.');
      return;
    }

    const submitData: CreateShopItem = {
      name: selectedGame?.name || '',
      originalName: selectedGame?.originalName || selectedGame?.name || '',
      thumbnailUrl: selectedGame?.thumbnailUrl,
      price: Number(price),
      ownerId: session?.user?.id || '',
      memo: memo,
    };

    try {
      const response = await createShopItem(submitData);

      if (!response.success) {
        throw new Error('Failed to add shop item');
      }

      if (onGameAdded) {
        onGameAdded(submitData as ShopItem);
      }
      handleClose();
      toast.success('상품이 추가되었습니다.');
    } catch (error) {
      console.error('Error saving shop item:', error);
      toast.error('상품을 추가하는 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setSelectedGame(null);
    setGameId('');
    setPrice('');
    setMemo('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="중고 게임 추가"
      contentTestId="add-shop-modal"
      closeTestId="shop-modal-close-button"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <SearchBggGames onGameSelect={handleGameSelect} />
        {selectedGame && !isLoading ? (
          <div className="flex min-h-[130px] items-center space-x-3 rounded-lg border p-3">
            <div className="relative size-[88px] shrink-0">
              <Image
                src={selectedGame.thumbnailUrl || '/placeholder-game.png'}
                alt={selectedGame.name}
                fill
                className="rounded object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium">{selectedGame.name}</span>
              <span className="text-sm text-muted-foreground">
                {selectedGame.originalName}
              </span>
              <Badge
                variant="outline"
                className={cn('w-fit', weightColor(selectedGame.weight))}
              >
                난이도 {selectedGame.weight.toFixed(1)}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[130px] items-center space-x-3 rounded-lg border p-3">
            <Skeleton className="size-[88px] shrink-0 rounded" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        )}

        <Input
          name="price"
          value={formatPrice(price)}
          onChange={handlePriceChange}
          placeholder="가격을 입력해주세요. (상한선 50만원)"
          className="h-11"
        />
        <Input
          name="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력해주세요."
          className="h-11"
        />

        <Button
          type="submit"
          disabled={!selectedGame || price.length === 0}
          size="lg"
          className="h-12 w-full"
        >
          추가하기
        </Button>
      </form>
    </Modal>
  );
}
