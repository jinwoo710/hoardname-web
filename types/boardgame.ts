export type BggGame = {
  id: string;
  name: string;
  originalName: string;
  thumbnailUrl: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  weight: number;
  bestWith: string;
  recommendedWith: string;
};

export type ShopItem = {
  id: number;
  ownerId: string;
  ownerNickname: string | null;
  name: string;
  originalName: string;
  thumbnailUrl: string | null;
  price: number;
  openKakaoUrl: string | null;
  memo: string;
  isDeleted: boolean;
  isOnSale: boolean;
};

export interface CreateShopItem {
  name: string;
  originalName: string;
  thumbnailUrl: string | null;
  price: number;
  ownerId: string;
  memo: string;
}

export interface BoardGame {
  id: number;
  name: string;
  originalName: string;
  ownerId: string | null;
  ownerNickname: string | null;
  inStorage: boolean;
  bggId: string | null;
  weight: number | null;
  bestWith: string | null;
  recommendedWith: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
}

export interface CreateBoardGame {
  name: string;
  originalName: string;
  weight: number | null;
  bestWith: string | null;
  recommendedWith: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  bggId: string;
  ownerId: string;
  inStorage: boolean;
}

export interface UpdateBoardGame {
  id: number;
  name?: string;
  originalName?: string;
  weight?: number;
  bestWith?: string;
  recommendedWith?: string;
  minPlayers?: number;
  maxPlayers?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  bggId?: string;
  ownerId?: string;
  inStorage?: boolean;
}
