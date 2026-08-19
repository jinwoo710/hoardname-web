'use client';
import { useRef, useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/app/components/common/Spinner';

import { useSearchGames } from '../../hooks/useBggQuery';
import htmlSpecialCharConverter from '../../components/htmlSpecialCharConverter';

interface SearchBggGamesProps {
  onGameSelect: (gameId: string) => void;
}

export default function SearchBggGames({ onGameSelect }: SearchBggGamesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [debouncedName, setDebouncedName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  const {
    data: games = [],
    isLoading,
    isError,
  } = useSearchGames(debouncedName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (!value.trim()) {
      setIsVisible(false);
      setDebouncedName(null);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      setDebouncedName(value.trim());
    }, 300);
  };

  const handleSelectGame = async (e: React.MouseEvent<HTMLLIElement>) => {
    const selectedGameId = e.currentTarget.getAttribute('data-id');
    if (selectedGameId) {
      setName('');
      setDebouncedName(null);
      setIsVisible(false);
      onGameSelect(selectedGameId);
    }
  };

  return (
    <div className="relative w-full space-y-1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          className="h-11 pl-9"
          placeholder="게임 이름을 검색해주세요"
          data-testid="search-input"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      {isVisible && (
        <div className="absolute left-0 z-10 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Spinner size="sm" />
              검색중...
            </div>
          ) : isError ? (
            <div className="flex flex-col py-4 text-center text-sm text-destructive">
              <span>검색 중 오류가 발생했습니다.</span>
              <span>잠시 후 다시 시도해주세요.</span>
            </div>
          ) : games.length > 0 ? (
            <ul className="max-h-[180px] overflow-y-auto py-1">
              {games.map((game, index) => (
                <li
                  key={`${index}-${game.id}`}
                  data-testid={game.id}
                  data-id={game.id}
                  className="mx-1 flex cursor-pointer space-x-2 rounded-md px-3 py-2.5 text-sm hover:bg-muted"
                  onClick={handleSelectGame}
                >
                  <div className="font-bold">
                    {htmlSpecialCharConverter(game.name)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({game.yearPublished})
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              찾으시는 게임이 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
