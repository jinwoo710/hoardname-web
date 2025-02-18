import { useQuery } from '@tanstack/react-query';

import {
  searchGames,
  getGameDetail,
  searchGamesFromBgg,
} from '@/app/api/bgg/bgg';

interface Game {
  id: string;
  name: string;
  yearPublished: string;
}

export function useSearchGamesWithFallback(name: string | null) {
  const primaryQuery = useQuery<Game[]>({
    queryKey: ['bggSearch', name],
    queryFn: () => (name ? searchGamesFromBgg(name) : []),
    enabled: !!name,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const fallbackQuery = useQuery<Game[]>({
    queryKey: ['bggSearchFallback', name],
    queryFn: () => (name ? searchGames(name) : []),
    enabled: !!name && primaryQuery.isError,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    data: primaryQuery.isError ? fallbackQuery.data : primaryQuery.data,
    isLoading:
      primaryQuery.isLoading ||
      (primaryQuery.isError && fallbackQuery.isLoading),
    isError: primaryQuery.isError && fallbackQuery.isError,
  };
}

export function useGameDetail(id: string | null) {
  return useQuery({
    queryKey: ['bggGame', id],
    queryFn: () => getGameDetail(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
