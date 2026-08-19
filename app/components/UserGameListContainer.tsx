'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

import { BoardGame, UpdateBoardGame } from '@/types/boardgame';
import { Button } from '@/components/ui/button';

import { EmptyState } from './common/EmptyState';
import { ConfirmDialog } from './common/ConfirmDialog';

interface UserGameListContainerProps {
  boardgames: BoardGame[];
  handleUpdateGame: (gameData: UpdateBoardGame) => Promise<void>;
  handleDeleteGame: (id: string) => Promise<void>;
}

export default function UserGameListContainer({
  boardgames,
  handleUpdateGame,
  handleDeleteGame,
}: UserGameListContainerProps) {
  const [pendingDelete, setPendingDelete] = useState<BoardGame | null>(null);

  const handleToggleInStorage = async (game: BoardGame) => {
    await handleUpdateGame({
      id: game.id,
      inStorage: !game.inStorage,
    });
  };

  if (boardgames.length === 0) {
    return <EmptyState title="등록된 보드게임이 없습니다" />;
  }

  return (
    <div className="space-y-4">
      {boardgames.map((game) => (
        <div
          key={game.id.toString()}
          className="flex items-center justify-between rounded-2xl border bg-card p-4"
        >
          <div className="flex items-center space-x-4">
            {game.thumbnailUrl && (
              <div className="flex h-16 w-16 items-center justify-center">
                <Image
                  width={64}
                  height={64}
                  src={game.thumbnailUrl}
                  alt={game.name}
                  className="rounded object-contain"
                  style={{
                    maxWidth: '64px',
                    maxHeight: '64px',
                    width: 'auto',
                    height: 'auto',
                  }}
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-foreground">{game.name}</h3>
              <p className="hidden text-sm text-muted-foreground md:block">
                {game.originalName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleToggleInStorage(game)}
              className="h-11 border-transparent bg-primary/10 px-3 font-bold text-primary hover:bg-primary/20"
            >
              {game.inStorage ? '아지트' : '외부'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => setPendingDelete(game)}
              className="size-11"
              aria-label="삭제"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="게임 삭제"
        description={
          pendingDelete
            ? `${pendingDelete.name}을(를) 정말 삭제하시겠습니까?`
            : undefined
        }
        confirmLabel="삭제"
        variant="destructive"
        onConfirm={() => {
          if (pendingDelete) handleDeleteGame(pendingDelete.id.toString());
        }}
      />
    </div>
  );
}
