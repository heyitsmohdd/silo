import { Link } from 'react-router-dom';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';


export default function VelorahPage() {
  return (
    <div className="relative min-h-screen bg-[hsl(201,100%,13%)] text-white overflow-hidden">
      {/* Video background */}
      <video
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="w-full max-w-7xl mx-auto flex flex-row items-center justify-between px-8 py-6">
          <span className="text-2xl text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Silo
          </span>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-white">Home</a>
            {[
              { label: 'About', href: '/about' },
              { label: 'Legal', href: '/legal' },
              { label: 'Request Access', href: '/request-access' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm transition-colors"
                style={{ color: MUTED }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
              >
                {label}
              </a>
            ))}
          </div>

          <Link to="/request-access" className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white hover:scale-[1.03] transition-transform">
            Join Silo
          </Link>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-[90px] flex-1">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] font-normal text-white max-w-7xl animate-fade-rise"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: '-2.46px' }}
          >
            Where{' '}
            <em className="not-italic" style={{ color: MUTED }}>students</em>
            {' '}rise{' '}
            <em className="not-italic" style={{ color: MUTED }}>beyond the noise.</em>
          </h1>

          <p
            className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
            style={{ color: MUTED }}
          >
            The anonymous network for your campus.
          </p>

          <Link to="/register" className="bg-black/75 backdrop-blur-md border border-white/50 text-white font-semibold rounded-full px-14 py-5 text-base mt-12 hover:bg-black/90 hover:scale-[1.03] transition-all animate-fade-rise-delay-2">
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
}
