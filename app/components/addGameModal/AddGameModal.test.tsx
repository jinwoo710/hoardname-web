import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';

import { queryClient } from '@/jest.setup';

import AddGameModal from './AddGameModal';

const mockHandleCreateBoardGame = jest.fn();
const mockOnClose = jest.fn();
const mockUseGameDetail = jest.fn();

const GaiaProjectInfo = {
  id: '1',
  koreanName: '가이아 프로젝트',
  primaryName: 'Gaia Project',
  description: '설명',
  yearPublished: '2023',
  playingTime: '120',
  weight: '5',
  minPlayers: '2',
  maxPlayers: '4',
  thumbnail: 'http://thumbnail',
  imageUrl: 'http://imageUrl',
  bestWith: '4',
  recommendedWith: '3,4',
  mechanics: [],
  categories: [],
};

jest.mock('../../hooks/useBggQuery', () => ({
  useGameDetail: () => mockUseGameDetail(),
  useSearchGamesWithFallback: () => ({
    data: [{ id: '1', name: '가이아 프로젝트', yearPublished: '2023' }],
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'user-id',
        name: 'user-name',
        nickname: 'user-nickname',
      },
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(),
    },
    status: 'authenticated',
  }),
}));

const renderWithQueryClient = (children: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('AddGameModal Component 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('open 테스트', async () => {
    mockUseGameDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(
      <AddGameModal
        isOpen={true}
        onClose={jest.fn()}
        handleCreateBoardGame={mockHandleCreateBoardGame}
      />
    );
    expect(screen.getByTestId('add-game-modal')).toBeInTheDocument();
  });

  it('close 테스트', async () => {
    mockUseGameDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    const onClose = jest.fn();
    renderWithQueryClient(
      <AddGameModal
        isOpen={false}
        onClose={onClose}
        handleCreateBoardGame={mockHandleCreateBoardGame}
      />
    );
    expect(screen.queryByTestId('add-game-modal')).not.toBeInTheDocument();
  });

  it('close button 테스트', async () => {
    mockUseGameDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(
      <AddGameModal
        isOpen={true}
        onClose={mockOnClose}
        handleCreateBoardGame={mockHandleCreateBoardGame}
      />
    );
    const closeButton = screen.getByTestId('modal-close-button');
    act(() => {
      fireEvent.click(closeButton);
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('보드게임 등록 테스트', async () => {
    mockUseGameDetail.mockReturnValue({
      data: GaiaProjectInfo,
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(
      <AddGameModal
        isOpen={true}
        onClose={mockOnClose}
        handleCreateBoardGame={mockHandleCreateBoardGame}
      />
    );
    const submitButton = screen.getByTestId('modal-submit');
    const input = screen.getByTestId('search-input');
    await act(async () => {
      fireEvent.change(input, { target: { value: '가이아 프로젝트' } });
    });
    await waitFor(() => {
      const searchResult = screen.getByTestId('1');
      fireEvent.click(searchResult);
    });

    await waitFor(() => {
      const weight = screen.getByTestId('weight');
      expect(weight).toHaveTextContent('5');
    });

    expect(submitButton).toBeEnabled();
    act(() => {
      fireEvent.click(submitButton);
    });
    expect(mockHandleCreateBoardGame).toHaveBeenCalled();
  });

  it('게임 선택 없이 제출 불가능', async () => {
    mockUseGameDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(
      <AddGameModal
        isOpen={true}
        onClose={mockOnClose}
        handleCreateBoardGame={mockHandleCreateBoardGame}
      />
    );

    const submitButton = screen.getByTestId('modal-submit');
    expect(submitButton).toBeDisabled();

    act(() => {
      fireEvent.click(submitButton);
    });
    expect(mockHandleCreateBoardGame).not.toHaveBeenCalled();
  });
});
