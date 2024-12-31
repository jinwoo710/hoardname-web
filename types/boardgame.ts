export type BggGameResponse = {
  name: string;
  originalName: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  minPlayers?: number;
  maxPlayers?: number;
  weight?: number;
  bestWith?: string;
  recommendedWith?: number[];
};

export type BggGame = BggGameResponse & {
  id: string;
  thumbnailUrl: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  weight: number;
  bestWith: string;
  recommendedWith: number[];
};

export interface BoardGame {
  id: number;
  name: string;
  originalName: string | null;
  weight: number | null;
  bestWith: string | null;
  recommendedWith: number[] | null;
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
  recommendedWith?: number[];
  minPlayers?: number;
  maxPlayers?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  bggId?: string;
  ownerId: string;
  imported?: boolean;
}

export interface UpdateBoardGame {
  id: number;
  name?: string;
  originalName?: string;
  weight?: number;
  bestWith?: string;
  recommendedWith?: number[];
  minPlayers?: number;
  maxPlayers?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  bggId?: string;
  ownerId?: string;
  imported?: boolean;
}
