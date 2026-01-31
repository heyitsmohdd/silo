import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
      aria-hidden="true"
    />
  );
};

const CardSkeleton = () => {
  return (
    <div className="p-6 border border-border rounded-lg space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-4 w-20 flex-shrink-0" />
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

const ListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export { Skeleton, CardSkeleton, ListSkeleton };
