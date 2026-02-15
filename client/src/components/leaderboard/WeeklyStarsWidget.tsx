import { useEffect } from 'react';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { Crown, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const WeeklyStarsWidget = () => {
    const { topThree, isLoading, fetchLeaderboard } = useLeaderboardStore();

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    if (isLoading && topThree.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 animate-pulse">
                <div className="h-4 w-24 bg-zinc-800 rounded mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-zinc-800 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (topThree.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 opacity-50">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Trophy className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Top Contributors</h3>
                </div>
                <div className="text-xs text-zinc-500 text-center py-2">
                    No contributors yet.
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 text-amber-500">
                    <Trophy className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Top Contributors</h3>
                </div>
                <Link
                    to="/leaderboard"
                    className="text-[10px] text-zinc-400 hover:text-white transition-colors"
                >
                    View All
                </Link>
            </div>

            {/* List - Only Top 1 */}
            <div className="space-y-3 relative z-10">
                {topThree.slice(0, 1).map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-lg shadow-amber-500/20
            `}>
                            {index + 1}
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-zinc-200 truncate">
                                    {user.username}
                                </span>
                                <Crown className="w-3 h-3 text-amber-500" />
                            </div>
                            <div className="text-[10px] text-zinc-500">
                                {user.weeklyKarma} karma
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyStarsWidget;
