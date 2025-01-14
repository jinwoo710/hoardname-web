'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from "next-auth/react";

interface SideBarItemProps {
    imageUrl: string;
    title: string;
    href: string;
    onClose?: () => void;
}

function SideBarItem({ imageUrl, title, href, onClose }: SideBarItemProps) {
    return (
        <Link 
            href={href} 
            className="hover:bg-[#f8f8f8] w-full rounded-xl h-[48px] px-4 flex items-center space-x-2"
            onClick={onClose}
        >
            <Image width={24} height={24} src={imageUrl} alt={title}/> 
            <span>{title}</span>
        </Link>
    )
}

interface SideBarProps {
    onClose?: () => void;
}

export default function SideBar({ onClose }: SideBarProps) {
    const { data: session } = useSession();

    return (
        <div className="w-full shrink-0 flex flex-col items-center p-4 space-y-2 sticky  lg:h-[calc(100vh-60px)] overflow-y-auto">
                <SideBarItem imageUrl="/notice.svg" title="공지사항" href="/notice" onClose={onClose}/>
            <SideBarItem imageUrl="/search.svg" title="게임 리스트" href="/game" onClose={onClose}/>
            <SideBarItem imageUrl="/delivery.svg" title="중고 장터" href="/shop" onClose={onClose}/>
            {session && (
                <>
                    <SideBarItem imageUrl="/user.svg" title="회원 정보" href="/user" onClose={onClose} />
                    <SideBarItem imageUrl="/card.svg" title="My 게임" href="/userGame" onClose={onClose}/>
                     <SideBarItem imageUrl="/lock.svg" title="My 장터" href="/userShop" onClose={onClose}/>
           
                </>
            )}
            <SideBarItem imageUrl="/email.svg" title="버그/문의" href="/email" onClose={onClose} />
            <Link 
            href={"/patchNotes"} 
            className="hover:bg-[#f8f8f8] w-full rounded-xl h-[48px] px-4 text-gray-400 flex items-center"
            onClick={onClose}
        >
            <span className="ml-[28px]">패치 노트</span>
        </Link>
        </div>
    )
}