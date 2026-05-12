import { useEffect } from 'react';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import { Crown, TrendingUp } from 'lucide-react';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

const getRankStyle = (index: number) => {
  switch (index) {
    case 0: return 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-lg shadow-amber-500/20';
    case 1: return 'bg-gradient-to-br from-zinc-300 to-zinc-500 text-black';
    case 2: return 'bg-gradient-to-br from-orange-300 to-orange-500 text-black';
    default: return 'bg-white/5 text-zinc-400';
  }
};

const LeaderboardPage = () => {
  const { leaderboard, isLoading, fetchLeaderboard } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-rise">
      {/* Header */}
      <div className="relative text-center space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[160px] rounded-full bg-amber-500/10 blur-[60px] pointer-events-none" />
        <h1
          className="text-4xl sm:text-5xl font-normal leading-[0.95] tracking-[-1.5px] text-white relative z-10"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Community{' '}
          <em className="not-italic text-amber-400">Leaderboard</em>
        </h1>
        <p className="text-sm max-w-md mx-auto leading-relaxed relative z-10" style={{ color: MUTED }}>
          Earn karma by getting upvotes on your questions and answers.
        </p>
      </div>

      {/* Table */}
      <div className="liquid-glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-16 text-center" style={{ color: MUTED }}>
            <TrendingUp className="w-10 h-10 mx-auto mb-4 opacity-40" />
            <p className="text-sm">No activity yet. Be the first to contribute.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center gap-5 px-6 py-4 hover:bg-white/5 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${getRankStyle(index)}`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white truncate">
                      {user.username}
                    </span>
                    {index === 0 && (
                      <Crown className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs" style={{ color: MUTED }}>
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Anonymous'}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {user.weeklyKarma}
                  </div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: MUTED }}>
                    karma
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
