import { useEffect } from 'react';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { Crown, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WeeklyStarsWidgetProps {
    isMobile?: boolean; // added mobile prop
}

const WeeklyStarsWidget = ({ isMobile }: WeeklyStarsWidgetProps) => {
    const { topThree, isLoading, fetchLeaderboard } = useLeaderboardStore();

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    if (isLoading && topThree.length === 0) {
        return (
            <div className={`${isMobile ? 'p-4' : 'p-2 md:group-hover:p-4'} rounded-xl bg-zinc-900/40 border border-white/5 animate-pulse transition-all duration-300`}>
                <div className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200'} h-4 w-24 bg-zinc-800 rounded mb-4`}></div>
                <div className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200'} space-y-3`}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-zinc-800 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (topThree.length === 0) {
        return (
            <div className={`${isMobile ? 'p-4' : 'p-2 md:group-hover:p-4'} rounded-xl bg-zinc-900/40 border border-white/5 opacity-50 transition-all duration-300`}>
                <div className={`flex items-center ${isMobile ? 'justify-start gap-2' : 'justify-center md:group-hover:justify-start md:group-hover:gap-2'} text-zinc-500 mb-2 transition-all duration-300`}>
                    <Trophy className="w-5 h-5 flex-shrink-0" />
                    <h3 className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200 delay-75 whitespace-nowrap'} text-xs font-bold uppercase tracking-wider`}>Top Contributors</h3>
                </div>
                <div className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200 delay-75 whitespace-nowrap'} text-xs text-zinc-500 text-center py-2`}>
                    No contributors yet.
                </div>
            </div>
        );
    }

    return (
        <div className={`${isMobile ? 'p-4' : 'p-2 md:group-hover:p-4'} rounded-xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 relative overflow-hidden group/widget transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-600/5 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-500" />

            <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-center md:group-hover:justify-between'} mb-4 relative z-10 transition-all duration-300`}>
                <div className="flex items-center gap-2 text-amber-500">
                    <Trophy className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 md:group-hover:w-4 md:group-hover:h-4'} transition-all flex-shrink-0`} />
                    <h3 className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200 delay-75 whitespace-nowrap'} text-xs font-bold uppercase tracking-wider`}>Top Contributors</h3>
                </div>
                <Link
                    to="/leaderboard"
                    className={`${isMobile ? '' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-200 delay-75 whitespace-nowrap'} text-[10px] text-zinc-400 hover:text-white transition-colors`}
                >
                    View All
                </Link>
            </div>

            <div className={`${isMobile ? 'space-y-3' : 'space-y-0 md:group-hover:space-y-3'} relative z-10 transition-all duration-300`}>
                {topThree.slice(0, 1).map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                        <div className={`
              ${isMobile ? 'w-6 h-6' : 'w-0 h-0 opacity-0 overflow-hidden md:group-hover:w-6 md:group-hover:h-6 md:group-hover:opacity-100 md:group-hover:overflow-visible transition-all duration-200 delay-75'} rounded-full flex items-center justify-center text-xs font-bold
              bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-lg shadow-amber-500/20 flex-shrink-0
            `}>
                            {index + 1}
                        </div>

                        <div className={`${isMobile ? 'flex-1' : 'w-0 opacity-0 overflow-hidden md:group-hover:w-auto md:group-hover:flex-1 md:group-hover:opacity-100 transition-all duration-200 delay-75'} min-w-0`}>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-zinc-200 truncate">
                                    {user.username}
                                </span>
                                <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
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
