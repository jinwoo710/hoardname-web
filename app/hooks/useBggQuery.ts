import { useQuery } from '@tanstack/react-query';

import { getGameDetailFromBgg, searchGamesFromBgg } from '@/app/api/bgg/bgg';

interface Game {
  id: string;
  name: string;
  yearPublished: string;
}

export function useSearchGames(name: string | null) {
  const query = useQuery<Game[]>({
    queryKey: ['bggSearch', name],
    queryFn: () => (name ? searchGamesFromBgg(name) : []),
    enabled: !!name,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGameDetail(id: string | null) {
  return useQuery({
    queryKey: ['bggGame', id],
    queryFn: () => getGameDetailFromBgg(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
