import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import GameList from './GameList';
import { BoardGame } from '@/types/boardgame';
import { fetchBoardgames } from '../actions/boardgames';

const mockFetchBoardgames = fetchBoardgames as jest.Mock;

jest.mock('../actions/boardgames', ()=>(
    {
        fetchBoardgames: jest.fn().mockImplementation(()=>{
            return Promise.resolve({
                items: [],
                hasMore: false,
                total: 100,
            })
        })
    }
));

describe('GameList', ()=>{
    const mockIntialBoardGames:BoardGame[]= [
        {
            id: 1,
            name: '아그리콜라',
            weight: 4.5,
            minPlayers: 2,
            maxPlayers: 5,
            thumbnailUrl: 'https://example.com/image.jpg',
            imageUrl: 'https://example.com/image.jpg',
            bestWith: '5',
            recommendedWith: '2,3,4',
            inStorage: true,
            originalName: 'Agricola',
            ownerId: '1',
            ownerNickname: 'jin',
            bggId: '456',
            createdAt: new Date(2020,1,1)
        },
        {
            id: 2,
            name: '테라포밍마스',
            weight: 2,
            minPlayers: 1,
            maxPlayers: 5,
            thumbnailUrl: 'https://example.com/image2.jpg',
            imageUrl: 'https://example.com/image2.jpg',
            bestWith: '3',
            recommendedWith: '2,3',
            inStorage: false,
            originalName: 'Terraforming Mars',
            ownerId: '2',
            ownerNickname: 'little',
            bggId: '466',
            createdAt: new Date(2020,2,1)
        }
    ]
    
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it('게임 리스트 랜더링', ()=>{
        render(<GameList initialBoardgames={mockIntialBoardGames} limit={10}/>)
    
        expect(screen.getByText('아그리콜라')).toBeInTheDocument();
        expect(screen.getByText('테라포밍마스')).toBeInTheDocument();
    })

    it('게임 검색', async ()=>{
      const mockSearchResults= [
        {
            id:3,
            name: '티츄',
            weight: 1.5,
            minPlayers: 4,
            maxPlayers: 4,
            thumbnailUrl: 'https://example.com/image3.jpg',
            imageUrl: 'https://example.com/image3.jpg',
            bestWith: '4',
            recommendedWith: '4',
            inStorage: true,
            originalName: 'Tichu',
            ownerId: '1',
            ownerNickname: 'jin',
            bggId: '4561',
            createdAt: new Date(2020,1,1)
        }
      ]  
      mockFetchBoardgames.mockResolvedValue({
        items: mockSearchResults,
        hasMore: false,
        total: mockSearchResults.length
    })

    render(<GameList initialBoardgames={mockIntialBoardGames} limit={10}/>)
    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, {target: {value: "티츄"}})

    await waitFor(()=>{
      expect(screen.getByText('티츄')).toBeInTheDocument();
    })
    })

    it('무한 스크롤링', async ()=>{
        const mockNextPageResult= [
            {
                id:3,
                name: '티츄',
                weight: 1.5,
                minPlayers: 4,
                maxPlayers: 4,
                thumbnailUrl: 'https://example.com/image3.jpg',
                imageUrl: 'https://example.com/image3.jpg',
                bestWith: '4',
                recommendedWith: '4',
                inStorage: true,
                originalName: 'Tichu',
                ownerId: '1',
                ownerNickname: 'jin',
                bggId: '4561',
                createdAt: new Date(2020,1,1)
            }
          ]  
      mockFetchBoardgames.mockResolvedValueOnce({
        items: mockNextPageResult,
        hasMore: false,
        total: mockNextPageResult.length + mockIntialBoardGames.length,
      }) 

        render(<GameList initialBoardgames={mockIntialBoardGames} limit={10}/>)
  
      
      await waitFor(async () => {
        expect(mockFetchBoardgames).toHaveBeenCalled();
    });

    // 렌더링 확인 - 중복 렌더링 검사 추가
    await waitFor(() => {
        const elements = screen.queryAllByText('티츄');
        expect(elements).toHaveLength(1);
    }, { timeout: 3000 });
   
    })
})
