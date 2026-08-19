interface Game {
  id: string;
  name: string;
  yearPublished: string;
}

interface GameDetail {
  id: string;
  primaryName: string;
  koreanName: string;
  thumbnail: string;
  description: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
  playingTime: string;
  minAge: string;
  rating: string;
  weight: string;
  bestWith: number | null;
  recommendedWith: number[] | null;
}

export const searchGamesFromBgg = async (name: string): Promise<Game[]> => {
  const response = await fetch(
    `/api/bgg/search?name=${encodeURIComponent(name)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  const { games } = (await response.json()) as { games: Game[] };
  return games;
};

export const getGameDetailFromBgg = async (id: string): Promise<GameDetail> => {
  const response = await fetch(`/api/bgg/thing?id=${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game detail');
  }
  return (await response.json()) as GameDetail;
};
