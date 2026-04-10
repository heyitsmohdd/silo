import { Link } from 'react-router-dom';
import { FileText, HelpCircle, MessageSquare, PenSquare, Send, Trophy, Hash, Zap } from 'lucide-react';

const quickActions = [
    { to: '/qna', icon: HelpCircle, label: 'Ask a Question', desc: 'Get help from your batch', color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400', border: 'border-blue-500/10 hover:border-blue-500/20' },
    { to: '/write', icon: PenSquare, label: 'Write Article', desc: 'Share your thoughts', color: 'from-violet-500/20 to-violet-600/10', iconColor: 'text-violet-400', border: 'border-violet-500/10 hover:border-violet-500/20' },
    { to: '/notes', icon: FileText, label: 'Browse Notes', desc: 'Study materials & resources', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', border: 'border-emerald-500/10 hover:border-emerald-500/20' },
    { to: '/chat', icon: MessageSquare, label: 'Batch Chat', desc: 'Chat with your batch', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400', border: 'border-amber-500/10 hover:border-amber-500/20' },
    { to: '/messages', icon: Send, label: 'Messages', desc: 'Private conversations', color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400', border: 'border-cyan-500/10 hover:border-cyan-500/20' },
    { to: '/channels', icon: Hash, label: 'Channels', desc: 'Join group discussions', color: 'from-pink-500/20 to-pink-600/10', iconColor: 'text-pink-400', border: 'border-pink-500/10 hover:border-pink-500/20' },
];

const DashboardPlaceholder = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            {/* Hero section */}
            <div className="text-center max-w-2xl mb-10 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Your private campus space</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Welcome to{' '}
                    <span className="text-gradient-emerald">Silo</span>
                </h1>

                <p className="text-zinc-400 text-base leading-relaxed max-w-lg mx-auto">
                    Your batch's private corner of the internet. Ask questions anonymously,
                    share notes, chat freely, and just be yourself.
                </p>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
                {quickActions.map((action, index) => (
                    <Link
                        key={action.to}
                        to={action.to}
                        className={`group relative flex items-start gap-3.5 p-4 rounded-xl bg-gradient-to-br ${action.color} border ${action.border} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in`}
                        style={{ animationDelay: `${index * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-zinc-900/60 flex items-center justify-center ${action.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white group-hover:text-white/90">{action.label}</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">{action.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Leaderboard teaser */}
            <Link
                to="/leaderboard"
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-xs text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}
            >
                <Trophy className="w-3.5 h-3.5" />
                <span>Check the Leaderboard</span>
            </Link>
        </div>
    );
};

export default DashboardPlaceholder;
