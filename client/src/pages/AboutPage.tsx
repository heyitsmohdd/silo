import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Ghost, MessageSquare, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Video Layer */}
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
                >
                    <source src="/background-video.mp4" type="video/mp4" />
                    <source src="/background-video.webm" type="video/webm" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </nav>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32">
                {/* Hero Section */}
                <div className="text-center mb-24 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                        Digital <span className="text-emerald-400">Freedom.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Silo is a sanctuary for your unfiltered thoughts. No names, no faces, just pure authentic connection.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                    <ValueCard
                        icon={<Ghost className="w-8 h-8 text-violet-400" />}
                        title="Complete Anonymity"
                        description="Your identity is protected by design. We don't track who you are, only what you say."
                    />
                    <ValueCard
                        icon={<Shield className="w-8 h-8 text-emerald-400" />}
                        title="Safe Space"
                        description="A community built on trust. Express yourself without fear of judgment or social repercussions."
                    />
                    <ValueCard
                        icon={<MessageSquare className="w-8 h-8 text-blue-400" />}
                        title="Open Dialogue"
                        description="Connect with peers on topics that matter. From campus confessions to deep intellectual debates."
                    />
                    <ValueCard
                        icon={<Heart className="w-8 h-8 text-rose-400" />}
                        title="Authentic Connection"
                        description="Strip away the social status. Here, only your words and ideas carry weight."
                    />
                </div>

                {/* Mission Statement */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center mb-24 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <h2 className="text-3xl font-bold mb-6 relative z-10">Our Mission</h2>
                    <p className="text-lg text-zinc-300 leading-relaxed mb-8 relative z-10">
                        We built Silo because we believe the modern internet has lost its way.
                        Social media has become a performance, not a connection.
                        We're bringing back the raw, honest, and exciting early days of the web.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link to="/request-access">
                            <Button className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg rounded-full">
                                Join the Movement
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Legal / Safety Disclaimer */}
                <div className="border-t border-white/10 pt-12 mb-12">
                    <h3 className="text-2xl font-bold mb-4 text-zinc-200">Safety & Terms</h3>
                    <p className="text-zinc-500 max-w-2xl leading-relaxed">
                        <span className="text-zinc-300 font-medium">This is a student project, not Big Tech.</span>{' '}
                        We are currently in public beta. To ensure the safety of our community, we reserve the right to
                        suspend or ban any account for any reason, at our sole discretion.
                        By using Silo, you agree to these terms.
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center text-zinc-600 text-sm flex flex-col items-center gap-2">
                    <p>&copy; {new Date().getFullYear()} Silo. Built for students, by students.</p>
                    <Link to="/legal" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors underline">
                        Legal & Safety
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ValueCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:bg-zinc-900/50 transition-colors duration-300 group">
        <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-zinc-100">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">
            {description}
        </p>
    </div>
);

export default AboutPage;
