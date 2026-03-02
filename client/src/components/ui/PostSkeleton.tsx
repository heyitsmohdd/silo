import { Pulse } from './Skeleton';

export const PostSkeleton = () => {
    return (
        <div className="w-full bg-zinc-950/40 rounded-2xl border border-zinc-800/80 p-5 mb-3 flex flex-col sm:flex-row gap-4">

            {/* Desktop Left: Reaction Strip block layout */}
            <div className="hidden sm:flex flex-col items-center gap-2 pt-2 pr-2 border-r border-zinc-800/50 min-w-[50px]">
                <Pulse className="w-8 h-8 rounded-md bg-zinc-800/80" />
                <Pulse className="w-4 h-4 rounded bg-zinc-800" />
                <Pulse className="w-8 h-8 rounded-md bg-zinc-800/80 mt-1" />
            </div>

            <div className="flex-1 min-w-0">
                {/* Header (Avatar & Email) */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <Pulse className="w-10 h-10 rounded-full bg-zinc-800/80" />
                        <div className="space-y-1">
                            <Pulse className="h-4 w-32 rounded bg-zinc-800/80" />
                            <Pulse className="h-3 w-24 rounded bg-zinc-800/60" />
                        </div>
                    </div>
                    {/* Category pill */}
                    <Pulse className="h-5 w-16 rounded-full bg-zinc-800/60" />
                </div>

                {/* Body Content (Title & 3-line shape) */}
                <div className="space-y-4">
                    <Pulse className="w-11/12 h-6 rounded-md bg-zinc-800/90" />
                    <div className="space-y-2">
                        <Pulse className="w-full h-4 rounded bg-zinc-800/70" />
                        <Pulse className="w-[90%] h-4 rounded bg-zinc-800/70" />
                        <Pulse className="w-[75%] h-4 rounded bg-zinc-800/70" />
                    </div>
                </div>

                {/* Footer Labels (Tags & Comments) */}
                <div className="mt-5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Pulse className="h-5 w-16 rounded-md bg-zinc-800/60" />
                        <Pulse className="h-5 w-12 rounded-md bg-zinc-800/60" />
                    </div>
                    <Pulse className="h-4 w-28 rounded bg-zinc-800/60" />
                </div>

            </div>

            {/* Mobile Bottom Row */}
            <div className="flex sm:hidden justify-between items-center mt-2 pt-3 border-t border-zinc-800/50">
                <Pulse className="h-8 w-24 rounded bg-zinc-800/80" />
            </div>

        </div>
    );
};
