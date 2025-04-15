import React from 'react';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const CardSkeleton = ({ count = 3, className }: CardSkeletonProps) => {
  return (
    <div className={cn("divide-y divide-perplexity-border", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start flex-1 min-w-0">
              <div className="h-5 w-5 rounded bg-gray-200 animate-pulse mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-5 w-3/4 sm:w-1/2 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded mb-1" />
                <div className="h-4 w-5/6 sm:w-3/4 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
            <div className="flex items-center ml-4 flex-shrink-0">
              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
