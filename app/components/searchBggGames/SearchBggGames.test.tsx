import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/jest.setup';

import SearchBggGames from './SearchBggGames';

const mockOnGameSelect = jest.fn();
const mockUseSearchGamesWithFallback = jest.fn();

jest.mock('../../hooks/useBggQuery', () => ({
  useSearchGamesWithFallback: () => mockUseSearchGamesWithFallback(),
}));

const renderWithQueryClient = (children: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('SearchBggGames Component 테스트', () => {
  let input: HTMLElement;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseSearchGamesWithFallback.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(<SearchBggGames onGameSelect={mockOnGameSelect} />);
    input = screen.getByTestId('search-input');
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('검색 결과 표기', async () => {
    mockUseSearchGamesWithFallback.mockReturnValue({
      data: [{ id: '1', name: '가이아 프로젝트', yearPublished: '2023' }],
      isLoading: false,
      isError: null,
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: '가이아 프로젝트' } });
      jest.runAllTimers();
    });
    await waitFor(
      () => {
        expect(screen.getByText('가이아 프로젝트')).toBeInTheDocument();
        expect(screen.getByText('(2023)')).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('검색 결과가 없을 때', async () => {
    mockUseSearchGamesWithFallback.mockReturnValue({
      data: [],
      isLoading: false,
      isError: null,
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: '가이아 프로젝트' } });
      jest.runAllTimers();
    });
    await waitFor(
      () => {
        expect(
          screen.getByText('찾으시는 게임이 없습니다')
        ).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('검색 로딩 중', async () => {
    mockUseSearchGamesWithFallback.mockReturnValue({
      data: [],
      isLoading: true,
      isError: null,
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: '가이아 프로젝트' } });
      jest.runAllTimers();
    });
    await waitFor(
      () => {
        expect(screen.getByText('검색중...')).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('검색 중 오류 발생', async () => {
    mockUseSearchGamesWithFallback.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: '가이아 프로젝트' } });
      jest.runAllTimers();
    });
    await waitFor(
      () => {
        expect(
          screen.getByText('검색 중 오류가 발생했습니다.')
        ).toBeInTheDocument();
        expect(
          screen.getByText('잠시 후 다시 시도해주세요.')
        ).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
  it('게임 선택시 동작 확인', async () => {
    mockUseSearchGamesWithFallback.mockReturnValue({
      data: [{ id: '1', name: '가이아 프로젝트', yearPublished: '2023' }],
      isLoading: false,
      isError: false,
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: '가이아 프로젝트' } });
      jest.runAllTimers();
    });
    const gameItem = screen.getByTestId('1');
    fireEvent.click(gameItem);
    expect(input).toHaveValue('');
    expect(gameItem).not.toBeInTheDocument();
    expect(mockOnGameSelect).toHaveBeenCalledWith('1');
  });
});
