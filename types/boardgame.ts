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

// BGG API 응답 기본 타입
export type BggGameResponse = {
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

export type BggGame = BggGameResponse & {
  id: string;
  thumbnailUrl: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  weight: number;
  bestWith: string;
  recommendedWith: string;
};

export type CreateBoardGame = Omit<BoardGame, "id" | "createdAt" | "imported">;
