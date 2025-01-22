'use client'
import { useRef, useState } from "react"
import Image from 'next/image'
import { useSearchGames } from "../hooks/useBggQuery"

interface SearchBggGamesProps {
    onGameSelect: (gameId: string) => void;
}

export default function SearchBggGames({ onGameSelect }: SearchBggGamesProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState("");
    const [debouncedName, setDebouncedName] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const searchTimeoutRef = useRef<number | undefined>(undefined);

    const { data: games = [], isLoading  } = useSearchGames(debouncedName);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        
        if (!value.trim()) {
            setIsVisible(false);
            setDebouncedName(null);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = window.setTimeout(() => {
            setIsVisible(true);
            setDebouncedName(value.trim());
        }, 300);
    };

    const handleSelectGame = async (e: React.MouseEvent<HTMLLIElement>) => {
        const selectedGameId = e.currentTarget.getAttribute("data-id");
        if (selectedGameId) {
            setName("");
            setDebouncedName(null);
            setIsVisible(false);
            onGameSelect(selectedGameId);
        }
    }

    return (
        <div className="relative w-full space-y-1 ">
            <div
                className="flex items-center border rounded-xl px-[18px] py-4 bg-white cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex items-center flex-1 cursor-text">
                    <Image
                        src="/search.svg"
                        width={18}
                        height={18}
                        className="cursor-text"
                        alt=""
                    />
                    <input
                        ref={inputRef}
                        className="w-full outline-none border-none pl-2 text-base leading-5"
                        placeholder="게임 이름을 검색해주세요"
                        value={name}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            {isVisible && (
                <div className="absolute left-0 bg-white shadow-lg w-full border-[1px] rounded-xl overflow-hidden z-10">
                    {isLoading ? (
                        <div className="py-4 text-center text-gray-500 text-sm">
                            검색중...
                        </div>
                    ) : games.length > 0 ? (
                        <ul className="py-1 max-h-[180px] overflow-y-auto">
                            {games.map((game, index) => (
                                <li
                                    key={`${index}-${game.id}`}
                                    data-id={game.id}
                                    className="px-4 mx-1 rounded py-2.5 hover:bg-gray-100 cursor-pointer text-sm flex space-x-2"
                                    onClick={handleSelectGame}
                                >
                                    <div className="font-bold">{game.name}</div>
                                    <div className="text-sm text-gray-600">({game.yearPublished})</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-4 text-center text-gray-500 text-sm">
                            찾으시는 게임이 없습니다
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
