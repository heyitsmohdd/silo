import { useEffect } from 'react';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { Crown, Trophy, TrendingUp } from 'lucide-react';

const LeaderboardPage = () => {
    const { leaderboard, isLoading, fetchLeaderboard } = useLeaderboardStore();

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const getRankStyle = (index: number) => {
        switch (index) {
            case 0: return 'from-yellow-400 to-amber-600 shadow-amber-500/20 text-black';
            case 1: return 'from-zinc-300 to-zinc-500 text-black';
            case 2: return 'from-orange-300 to-orange-500 text-black';
            default: return 'bg-zinc-800 text-zinc-400';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 text-amber-500 mb-4">
                    <Trophy className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                    Community Leaderboard
                </h1>
                <p className="text-zinc-400 max-w-lg mx-auto">
                    Celebrating the most helpful members of our community. Earn karma by getting upvotes on your questions and answers.
                </p>
            </div>

            {/* Leaderboard Card */}
            <div className="glass-card overflow-hidden">
                {isLoading ? (
                    <div className="p-8 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-zinc-800/40 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No activity yet this week. Be the first to contribute!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {leaderboard.map((user, index) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-4 p-4 md:p-6 hover:bg-white/5 transition-colors group"
                            >
                                {/* Rank */}
                                <div className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0
                                ${index < 3 ? 'bg-gradient-to-br shadow-lg' : ''}
                                ${getRankStyle(index)}
                            `}>
                                    {index + 1}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-zinc-100 truncate text-base md:text-lg">
                                            {user.username}
                                        </h3>
                                        {index === 0 && (
                                            <Crown className="w-4 h-4 md:w-5 md:h-5 text-amber-500 animate-bounce" />
                                        )}
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Anonymous User'}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <div className="text-lg md:text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                                        {user.weeklyKarma}
                                    </div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">
                                        Karma
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
