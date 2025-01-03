'use client';

import { ReactNode, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export default function InfiniteScroll({
  children,
  hasMore,
  loading,
  onLoadMore,
  className = '',
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className={className}>
      {children}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
        </div>
      )}
      <div ref={observerTarget} className="h-4" />
    </div>
  );
}