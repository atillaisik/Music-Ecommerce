import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-square bg-secondary">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                </div>
            </div>
        </div>
    );
}
