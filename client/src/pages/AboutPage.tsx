import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Ghost, MessageSquare, Heart } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => (
  <div className="liquid-glass rounded-2xl p-8 hover:bg-white/5 transition-colors duration-300">
    <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="leading-relaxed text-sm" style={{ color: MUTED }}>{description}</p>
  </div>
);

const AboutPage = () => (
  <div className="min-h-screen bg-[hsl(201,100%,13%)] text-white relative overflow-hidden">
    <video
      src={VIDEO_URL}
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover z-0 opacity-50"
    />
    <div className="fixed inset-0 bg-gradient-to-t from-[hsl(201,100%,5%)] via-transparent to-transparent z-[1]" />

    {/* Nav */}
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
      <Link
        to="/welcome"
        className="flex items-center gap-2 transition-colors group"
        style={{ color: MUTED }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back</span>
      </Link>
      <span className="text-lg text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        Silo
      </span>
    </nav>

    {/* Content */}
    <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
      {/* Hero */}
      <div className="text-center mb-24 space-y-6 animate-fade-rise">
        <h1
          className="text-5xl md:text-7xl font-normal leading-[0.95] tracking-[-1.5px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Built for{' '}
          <em className="not-italic" style={{ color: MUTED }}>students.</em>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          Silo is your batch's shared space — for notes, questions, and conversations that actually matter.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 animate-fade-rise-delay">
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
          description="Connect with peers on topics that matter. From campus questions to deep intellectual debates."
        />
        <ValueCard
          icon={<Heart className="w-8 h-8 text-rose-400" />}
          title="Authentic Connection"
          description="Strip away the social status. Here, only your words and ideas carry weight."
        />
      </div>

      {/* Mission */}
      <div className="liquid-glass rounded-3xl p-8 md:p-12 text-center mb-24 animate-fade-rise-delay-2">
        <h2
          className="text-3xl font-normal mb-6"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Our Mission
        </h2>
        <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: MUTED }}>
          We built Silo because students deserve a focused space. No feed algorithms, no social performance — just your batch, your notes, and real conversations.
        </p>
        <Link
          to="/request-access"
          className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-full hover:scale-[1.03] hover:bg-white/90 transition-all"
        >
          Join the Movement
        </Link>
      </div>

      {/* Safety note */}
      <div className="border-t border-white/10 pt-12 mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white">Safety & Terms</h3>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: MUTED }}>
          <span className="text-white font-medium">This is a student project, not Big Tech.</span>{' '}
          We are currently in public beta. We reserve the right to suspend or ban any account for any reason, at our sole discretion. By using Silo, you agree to these terms.
        </p>
      </div>

      <div className="text-center text-sm flex flex-col items-center gap-2" style={{ color: MUTED }}>
        <p>&copy; {new Date().getFullYear()} Silo. Built for students, by students.</p>
        <Link to="/legal" className="text-xs hover:text-white transition-colors underline underline-offset-4">
          Legal & Safety
        </Link>
      </div>
    </div>
  </div>
);

export default AboutPage;
