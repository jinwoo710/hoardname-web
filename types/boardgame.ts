export type BoardGame = {
  id: number;
  name: string;
  originalName: string;
  ownerId?: string;
  imported?: boolean;
  bggId?: string;
  weight?: number;
  bestWith?: string;
  recommendedWith?: string;
  minPlayers?: number;
  maxPlayers?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  createdAt?: Date;
};

export type BggGame = {
  id: string;
  name: string;
  originalName: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  minPlayers?: number;
  maxPlayers?: number;
  weight?: number;
  bestWith?: string;
  recommendedWith?: string;
};

export type CreateBoardGame = Omit<BoardGame, "id" | "createdAt" | "imported">;
