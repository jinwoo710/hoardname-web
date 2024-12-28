'use client';

import { useEffect } from "react";
import SideBar from "./Sidebar";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.history.pushState(null, '', window.location.href);
    }
    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  return (
    <>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-white z-50 
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="font-bold text-lg">메뉴</div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-64px)]">
     
          <SideBar onClose={onClose} />
        </div>
      </aside>
    </>
  );
}
