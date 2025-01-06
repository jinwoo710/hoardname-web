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
        <div className="w-full shrink-0 flex flex-col items-center p-4 space-y-2 ">
                <SideBarItem imageUrl="/search.svg" title="공지사항" href="/notice" onClose={onClose}/>
            <SideBarItem imageUrl="/search.svg" title="게임 리스트" href="/game" onClose={onClose}/>
            <SideBarItem imageUrl="/ticket.svg" title="중고 장터" href="/shop" onClose={onClose}/>
            {session && (
                <>
                    <SideBarItem imageUrl="/user.svg" title="회원 정보" href="/user" onClose={onClose} />
                    <SideBarItem imageUrl="/lock.svg" title="My 게임" href="/userGame" onClose={onClose}/>
                     <SideBarItem imageUrl="/lock.svg" title="My 장터" href="/userShop" onClose={onClose}/>
           
                </>
            )}
        </div>
    )
}