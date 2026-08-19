'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { BggGame, CreateBoardGame } from '@/types/boardgame';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { Modal } from '../common/Modal';
import SearchBggGames from '../searchBggGames/SearchBggGames';
import { useGameDetail } from '../../hooks/useBggQuery';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleCreateBoardGame: (gameData: CreateBoardGame) => Promise<void>;
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

export default function AddGameModal({
  isOpen,
  onClose,
  handleCreateBoardGame,
}: AddGameModalProps) {
  const { data: session } = useSession();
  const [selectedGame, setSelectedGame] = useState<BggGame | null>(null);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedGame || !session?.user?.id) return;

    try {
      const submitData: CreateBoardGame = {
        name: selectedGame.name,
        originalName: selectedGame.originalName,
        ownerId: session.user.id,
        bggId: gameId,
        weight: selectedGame.weight,
        bestWith: selectedGame.bestWith?.toString() || '',
        recommendedWith: JSON.stringify(
          selectedGame.recommendedWith?.split(',').map(Number) || ''
        ),
        minPlayers: selectedGame.minPlayers,
        maxPlayers: selectedGame.maxPlayers,
        thumbnailUrl: selectedGame.thumbnailUrl,
        imageUrl: selectedGame.imageUrl,
        inStorage: true,
      };

      await handleCreateBoardGame(submitData);
      handleClose();
    } catch (error) {
      console.error('Error creating board game:', error);
      toast.error('게임 생성 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setSelectedGame(null);
    setGameId('');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="보드게임 추가"
      contentTestId="add-game-modal"
      closeTestId="modal-close-button"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
                data-testid="weight"
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

        <Button
          type="submit"
          data-testid="modal-submit"
          disabled={!selectedGame}
          size="lg"
          className="h-12 w-full"
        >
          추가하기
        </Button>
      </form>
    </Modal>
  );
}
