import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

const quickActions = [
  { to: '/qna', label: 'Ask a Question', desc: 'Get help from your batch' },
  { to: '/write', label: 'Write Article', desc: 'Share your thoughts' },
  { to: '/notes', label: 'Browse Notes', desc: 'Study materials & resources' },
  { to: '/chat', label: 'Batch Chat', desc: 'Chat with your batch' },
  { to: '/messages', label: 'Messages', desc: 'Private conversations' },
  { to: '/channels', label: 'Channels', desc: 'Join group discussions' },
];

const DashboardPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

    {/* Hero */}
    <div className="text-center max-w-2xl mb-16 animate-fade-rise relative z-10">
      <h1
        className="text-5xl sm:text-6xl font-normal leading-[0.95] tracking-[-2px] mb-5 text-white"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        Welcome to{' '}
        <em className="not-italic text-emerald-400">your space.</em>
      </h1>
      <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: MUTED }}>
        Your batch's private corner — notes, questions, and conversations in one place.
      </p>
    </div>

    {/* Pill links */}
    <div className="flex flex-col w-full max-w-lg animate-fade-rise-delay relative z-10">
      {quickActions.map((action, index) => (
        <Link
          key={action.to}
          to={action.to}
          className="group flex items-center justify-between py-4 border-b border-white/8 hover:border-white/20 transition-all duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs tabular-nums" style={{ color: MUTED }}>
              0{index + 1}
            </span>
            <span className="text-base font-medium text-white group-hover:text-emerald-400 transition-colors duration-200">
              {action.label}
            </span>
          </div>
          <ArrowRight
            className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
            style={{ color: 'hsl(160, 84%, 39%)' }}
          />
        </Link>
      ))}
    </div>

    {/* Leaderboard */}
    <Link
      to="/leaderboard"
      className="mt-10 flex items-center gap-2 text-xs transition-colors duration-200 animate-fade-rise-delay-2 relative z-10"
      style={{ color: MUTED }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
      onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
    >
      <Trophy className="w-3.5 h-3.5" />
      <span>Check the Leaderboard</span>
    </Link>
  </div>
);

export default DashboardPlaceholder;
