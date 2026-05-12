import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => (
  <div className="min-h-screen bg-[hsl(201,100%,13%)] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
        className="flex items-center gap-2 text-sm transition-colors group"
        style={{ color: MUTED }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </Link>
      <span className="text-lg text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        Silo
      </span>
    </nav>

    {/* Card */}
    <div className="w-full max-w-md relative z-10 animate-fade-rise">
      <div className="text-center mb-8">
        <h1
          className="text-4xl font-normal leading-tight mb-2 text-white"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {title.split(' ').slice(0, -1).join(' ')}{' '}
          <em className="not-italic" style={{ color: MUTED }}>
            {title.split(' ').slice(-1)[0]}
          </em>
        </h1>
      </div>

      <div className="liquid-glass rounded-2xl p-6 sm:p-8">
        {children}
      </div>

      <p className="text-xs text-center mt-6" style={{ color: MUTED }}>
        Batch-Isolated Academic Vault
      </p>
    </div>
  </div>
);

export default AuthLayout;
