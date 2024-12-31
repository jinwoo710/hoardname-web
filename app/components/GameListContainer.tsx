'use client';

import { BoardGame } from "@/types/boardgame";
import Image from "next/image";

interface GameListContainerProps {
    boardgames: BoardGame[];
}

export default function GameListContainer({ boardgames }: GameListContainerProps) {
    return (
        <div className="space-y-4">
            {boardgames.map((item) => (
                
                <div
                    key={item.id}
                    className="flex border border-gray-100 rounded-2xl w-full bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-200"
                >
                    <div className="w-[160px] h-[160px] flex-shrink-0 p-4 my-auto">
                        {item.thumbnailUrl ? (
                            <Image 
                                width={140} 
                                height={140} 
                                src={item.thumbnailUrl} 
                                alt="thumbnail"
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="flex-grow p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800 mb-1 line-clamp-1">
                                    {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <span className="inline-block w-1 h-1 bg-gray-300 rounded-full mx-2"></span>
                                        <span>
                                            {item.minPlayers === item.maxPlayers 
                                                ? `${item.minPlayers}인`
                                                : `${item.minPlayers}-${item.maxPlayers}인`}
                                        </span>
                                    </div>
                                    {item.weight && (
                                        <div className="flex items-center">
                                            <span className="inline-block w-1 h-1 bg-gray-300 rounded-full mx-2"></span>
                                            <span className={`
                                                ${item.weight > 4.0 ? 'text-red-500' : 
                                                  item.weight > 3.0 ? 'text-orange-500' :
                                                  item.weight > 2.0 ? 'text-green-500' :
                                                  item.weight > 1.0 ? 'text-blue-500' : 'text-purple-500'}
                                            `}>
                                                난이도 {item.weight.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                                item.imported 
                                    ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20' 
                                    : 'bg-red-50 text-red-600 ring-1 ring-red-500/20'
                            }`}>
                                {item.imported ? '아지트' : '외부'}
                            </span>
                        </div>

                        <div className="flex-grow">
                            <div className="flex flex-wrap gap-2 text-sm">
                                {item.bestWith && (
                                    <div className="flex items-center bg-green-50 rounded-lg px-3 py-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                                        <span className="text-green-700">최적 {item.bestWith}인</span>
                                    </div>
                                )}
                                {item.recommendedWith && (
                                    <div className="flex items-center bg-yellow-50 rounded-lg px-3 py-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-2"></span>
                                        <span className="text-yellow-700">추천 {item.recommendedWith}인</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end text-sm text-gray-500 mt-3">
                            <span className="font-medium">제공:</span>
                            <span className="ml-2">{item.ownerNickname}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}