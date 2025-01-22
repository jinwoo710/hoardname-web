import { useQuery } from "@tanstack/react-query";
import { searchGames, getGameDetail } from "@/app/api/bgg/bgg";

export function useSearchGames(name: string | null) {
  return useQuery({
    queryKey: ["bggSearch", name],
    queryFn: () => searchGames(name || ""),
    enabled: !!name,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}

export function useGameDetail(id: string | null) {
  return useQuery({
    queryKey: ["bggGame", id],
    queryFn: () => getGameDetail(id || ""),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}
