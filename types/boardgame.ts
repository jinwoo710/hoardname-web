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

export interface BoardGame {
  id: number;
  name: string;
  originalName: string | null;
  weight: number | null;
  bestWith: string | null;
  recommendedWith: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  imported: boolean | null;
  bggId: string | null;
  createdAt: Date | null;
  ownerId?: string;
  ownerNickname?: string;
}

export interface CreateBoardGame {
  name: string;
  originalName?: string;
  weight?: number;
  bestWith?: string;
  recommendedWith?: string;
  minPlayers?: number;
  maxPlayers?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  imported?: boolean;
  bggId?: string;
  ownerId?: string;
}
