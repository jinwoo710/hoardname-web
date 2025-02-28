'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

import { BoardGame, CreateBoardGame, UpdateBoardGame } from '@/types/boardgame';

import AddGameModal from '../components/addGameModal/AddGameModal';
import InfiniteScroll from '../components/InfiniteScroll';
import { useInfinityScroll } from '../hooks/useInfinityScroll';
import UserGameListContainer from '../components/UserGameListContainer';
import {
  createUserGame,
  deleteUserGame,
  updateUserGame,
  fetchUserGames,
} from '../actions/userGames';
import { checkUser } from '../actions/users';

interface UserGameProps {
  initialBoardgames: BoardGame[];
  userId: string;
  limit: number;
}

export default function UserGame({
  initialBoardgames,
  userId,
  limit,
}: UserGameProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const {
    items: boardgames,
    loading,
    hasMore,
    loadMore,
    handleSearch,
    reset,
  } = useInfinityScroll({
    initialData: initialBoardgames,
    fetchData: async (page: number, searchTerm: string) => {
      const result = await fetchUserGames({
        page,
        limit,
        search: searchTerm,
        ownerId: userId,
      });

      return {
        items: result.items,
        hasMore: result.hasMore,
        total: result.total,
      };
    },
  });

  const handleAddClick = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      const result = await checkUser(session.user.id);
      if (!result.user?.nickname) {
        toast.error('닉네임 설정이 필요합니다.');
        return;
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('사용자 정보를 확인하는 중 오류가 발생했습니다.');
    }
  }, [session]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateBoardGame = async (gameData: CreateBoardGame) => {
    const result = await createUserGame({
      ...gameData,
      ownerId: userId,
    });

    if (result.success) {
      await reset();
      toast.success('게임이 추가되었습니다.');
    } else {
      toast.error(result.error || '게임을 추가에 실패하였습니다.');
    }
  };

  const handleUpdateGame = async (gameData: UpdateBoardGame) => {
    const result = await updateUserGame({
      ...gameData,
      ownerId: userId,
    });
    if (result.success) {
      await reset();
      toast.success('게임이 수정되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('정말 이 게임을 삭제하시겠습니까?')) return;

    const result = await deleteUserGame(gameId);
    if (result.success) {
      await reset();
      toast.success('삭제되었습니다.');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">내 보드게임 목록</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          보드게임 추가
        </button>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>
            게임 등록은 <span className="font-bold text-blue-900">닉네임</span>{' '}
            설정 후 이용 할 수 있습니다.
          </li>
          <li>
            게임을 외부로 가져갈 시,{' '}
            <span className="font-bold text-green-800">아지트</span>를 클릭하여
            게임 상태를 변경해주세요.
          </li>
          <li>국내만 출시된 게임은 검색되지 않습니다.</li>
          <li>
            검색 가능한 게임 목록은 BoardGameGeek 기준입니다. 검색한 보드게임이
            없을 경우 문의하기에 남겨주세요.
          </li>
        </ul>
      </div>
      <div className="relative w-full mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="게임 이름으로 검색..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <InfiniteScroll
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          className="space-y-4"
        >
          <UserGameListContainer
            boardgames={boardgames}
            handleDeleteGame={handleDeleteGame}
            handleUpdateGame={handleUpdateGame}
          />
        </InfiniteScroll>
      </div>
      <AddGameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCreateBoardGame={handleCreateBoardGame}
      />
    </div>
  );
}
