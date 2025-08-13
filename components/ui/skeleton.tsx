import React from 'react';
import { cn } from '../../lib/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animated?: boolean;
}

export function Skeleton({ 
  className, 
  width, 
  height, 
  rounded = 'md',
  animated = true 
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        roundedClasses[rounded],
        animated && 'animate-pulse',
        className
      )}
      style={{
        width: width,
        height: height
      }}
      aria-hidden="true"
    />
  );
}

interface SkeletonIframeProps {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
  className?: string;
  animated?: boolean;
}

export function SkeletonIframe({ 
  aspectRatio = '16/9', 
  className,
  animated = true 
}: SkeletonIframeProps) {
  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]'
  };

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], className)}>
      <Skeleton 
        className="absolute inset-0 w-full h-full"
        animated={animated}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-500">
          <svg 
            className="w-8 h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" 
            />
          </svg>
          <span className="text-sm font-medium">Loading content...</span>
        </div>
      </div>
    </div>
  );
} 