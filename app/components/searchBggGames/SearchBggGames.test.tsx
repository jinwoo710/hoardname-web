import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import SearchBggGames from './SearchBggGames';
import { useSearchGamesWithFallback } from '@/app/hooks/useBggQuery';

jest.mock('@/app/hooks/useBggQuery');
const mockUseBggQuery = useSearchGamesWithFallback as jest.Mock;

describe('SearchBggGames', ()=>{
    const mockOnGameSelect = jest.fn();

    beforeEach(()=>{
        jest.clearAllMocks();
        mockUseBggQuery.mockReturnValue({
            data:[],
            isLoading: false,
            error: null,
        })
    })

    it('검색 입력창 랜더링', async ()=>{
        render(<SearchBggGames onGameSelect={mockOnGameSelect}/>)
        await waitFor(()=>{
            expect(screen.getByPlaceholderText('게임 이름을 검색해주세요')).toBeInTheDocument();
        })
    })

    it('게임 검색', async ()=>{
        render(<SearchBggGames onGameSelect={mockOnGameSelect}/>)
        const input = screen.getByPlaceholderText('게임 이름을 검색해주세요') as HTMLInputElement;
        fireEvent.change(input, {target:{value: '티츄'}})
        await waitFor(()=>{
            expect(mockUseBggQuery).toHaveBeenCalledWith('티츄')
            })
    })

    it('유의미한 검색 결과', async ()=>{
        render(<SearchBggGames onGameSelect={mockOnGameSelect}/>)
        const input = screen.getByPlaceholderText('게임 이름을 검색해주세요') as HTMLInputElement;
        fireEvent.change(input, {target:{value: '티츄'}})
        mockUseBggQuery.mockReturnValue({
            data:[
                {id:'1', name:'티츄', yearPublished:'2020'},
                {id:'2', name:'티츄-new', yearPublished:'2020'},
            ],
            isLoading: false,
            error: null
        })
        await waitFor(()=>{
            expect(screen.getByText('티츄')).toBeInTheDocument();
            expect(screen.getByText('티츄-new')).toBeInTheDocument();
        })
    })

    it('무의미한 검색 결과', async ()=>{ 
        render(<SearchBggGames onGameSelect={mockOnGameSelect}/>)
        const input = screen.getByPlaceholderText('게임 이름을 검색해주세요') as HTMLInputElement;
        fireEvent.change(input, {target:{value: '티츄'}})
        mockUseBggQuery.mockReturnValue({
            data:[],
            isLoading: false,
            error: null
        })
        await waitFor(()=>{
            expect(screen.getByText('찾으시는 게임이 없습니다')).toBeInTheDocument();
        })
    })

    it('로딩 중', async()=>{
        render(<SearchBggGames onGameSelect={mockOnGameSelect}/>)
        const input = screen.getByPlaceholderText('게임 이름을 검색해주세요') as HTMLInputElement;
        fireEvent.change(input, {target:{value: '티츄'}})
        mockUseBggQuery.mockReturnValue({
            data:[],
            isLoading: true,
            error: null
        })
        await waitFor(()=>{
            expect(screen.getByText('검색중...')).toBeInTheDocument();
        })
    })

    it('검색 중 오류 발생',async()=>{
        render(<SearchBggGames onGameSelect={mockOnGameSelect}/>)
        const input = screen.getByPlaceholderText('게임 이름을 검색해주세요') as HTMLInputElement;
        fireEvent.change(input, {target:{value: '티츄'}})
        mockUseBggQuery.mockReturnValue({
            data:[],
            isLoading: false,
            error: new Error('서버 오류가 발생했습니다'),
            isError: true
        })
        await waitFor(()=>{
            expect(screen.getByText('검색 중 오류가 발생했습니다.')).toBeInTheDocument();
            expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument();
        })
    })
})

   


