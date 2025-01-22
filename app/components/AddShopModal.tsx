'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BggGame, CreateShopItem, ShopItem } from '@/types/boardgame';
import SearchBggGames from './SearchBggGames';
import toast from 'react-hot-toast';
import { CreateShopItem as createShopItem } from '../actions/userShop';
import { useGameDetail } from "../hooks/useBggQuery";

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameAdded?: (game: ShopItem) => void;
}

export default function AddShopModal({ isOpen, onClose, onGameAdded }: AddShopModalProps) {
  const { data: session } = useSession();
  const [selectedGame, setSelectedGame] = useState<BggGame | null>(null);
  const [price, setPrice] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
    const [gameId, setGameId] = useState<string>("");

    const { data: gameDetail, isLoading } = useGameDetail(gameId);

    useEffect(() => {
    if (gameDetail && !isLoading) {
      setSelectedGame({
        id: gameId,
        name: gameDetail.koreanName || gameDetail.primaryName,
        originalName: gameDetail.primaryName,
        weight: parseFloat(gameDetail.weight),
        minPlayers: parseInt(gameDetail.minPlayers),
        maxPlayers: parseInt(gameDetail.maxPlayers),
        thumbnailUrl: gameDetail.thumbnail,
        imageUrl: gameDetail.thumbnail,
        bestWith: gameDetail.bestWith?.toString() || '',
        recommendedWith: gameDetail.recommendedWith?.toString() || '',
      });
    }
  }, [gameDetail, isLoading, gameId]);

  const handleGameSelect = (selectedGameId: string) => {
    setGameId(selectedGameId);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrice('');
      return;
    }
    const numberValue = Number(value);
    setPrice(numberValue.toString());
  };

  const formatPrice = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedGame || !session?.user?.id) return;

    if (!price) {
      toast.error('가격을 입력해주세요.');
      return;
    }
    if(Number(price) > 500000) {
      toast.error('가격은 500,000원 이하로 설정해주세요.');
      return;
    }

    const submitData: CreateShopItem = {
      name: selectedGame?.name || '',
      originalName: selectedGame?.originalName || selectedGame?.name || '',
      thumbnailUrl: selectedGame?.thumbnailUrl,
      price: Number(price),
      ownerId: session?.user?.id || '',
      memo: memo
    };

    try {
      const response = await createShopItem(submitData);
      
      if (!response.success) {
        throw new Error('Failed to add shop item');
      }

      if (onGameAdded) {
        onGameAdded(submitData as ShopItem);
      }
      handleClose();
      toast.success('상품이 추가되었습니다.');
    } catch (error) {
      console.error('Error saving shop item:', error);
      toast.error('상품을 추가하는 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setSelectedGame(null);
    setPrice('');
    setMemo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl md:w-[480px] sm:w-full h-auto md:h-auto max-h-[90vh] overflow-y-auto">
        <div>
          <div className="relative h-16 border-b border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-800">중고 게임 추가</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="닫기"
              >
                <svg 
                  className="w-5 h-5 text-gray-500 hover:text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-6">
            <div className="space-y-2">
              <SearchBggGames onGameSelect={handleGameSelect} />
              {selectedGame ? (
                <div className="flex border rounded-xl  mx-auto max-w-[480px] min-h-[130px] p-2 items-center space-x-3">
                  <div className="w-[100px] h-[100px] relative">
                    <Image
                      src={selectedGame.thumbnailUrl || '/placeholder-game.png'}
                      alt={selectedGame.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <span>{selectedGame.name} </span>
                       <span className="text-sm text-gray-500">{selectedGame.originalName} </span>
                      <div className="flex space-x-2">
                        <div className="flex flex-col">
                            <span className={`text-sm
                                               ${selectedGame.weight >= 4.0 ? 'text-red-500' : 
                                                  selectedGame.weight >= 3.0 ? 'text-orange-500' :
                                                  selectedGame.weight >= 2.0 ? 'text-green-500' :
                                                  selectedGame.weight >= 1.0 ? 'text-blue-500' : 'text-purple-500'}
                                            `}>
                                                난이도 {selectedGame.weight.toFixed(1)}
                                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex border rounded-xl mx-auto max-w-[600px] min-h-[130px] p-2 items-center space-x-3 animate-pulse">
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded"></div>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}
         
            </div>
            <input 
              name="price" 
              value={formatPrice(price)}
              onChange={handlePriceChange}
              placeholder="가격을 입력해주세요. (상한선 50만원)" 
              className="flex items-center border mt-2 rounded-xl px-[18px] py-4 bg-white cursor-text outline-none w-full"
            />
            <input 
              name="memo" 
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력해주세요." 
              className="flex items-center border mt-2 rounded-xl px-[18px] py-4 bg-white cursor-text outline-none w-full"
            />
            <div className="flex items-center">
              
              <button
                type="submit"
                disabled={!selectedGame || price.length ===0 }
                className="mt-4 px-4 h-14 py-2 w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 rounded-xl focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                추가하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}