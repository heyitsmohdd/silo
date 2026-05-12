import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Scale, FileText, AlertTriangle } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon, title, children }: SectionProps) => (
  <div className="liquid-glass rounded-2xl p-8 hover:bg-white/5 transition-colors duration-300">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const LegalPage = () => (
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
      <div className="mb-16 space-y-4 animate-fade-rise">
        <h1
          className="text-5xl md:text-6xl font-normal leading-[0.95] tracking-[-1.5px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Safety &{' '}
          <em className="not-italic" style={{ color: MUTED }}>Open Source Terms</em>
        </h1>
        <p className="text-lg max-w-2xl leading-relaxed" style={{ color: MUTED }}>
          Please read these terms carefully. Silo is a student-led educational project, not a commercial entity.
        </p>
      </div>

      <div className="space-y-6 animate-fade-rise-delay">
        <Section icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />} title="1. As-Is Clause & Warranty Disclaimer">
          <p className="leading-relaxed mb-4 text-sm" style={{ color: MUTED }}>
            Silo is provided "as is" and "as available" without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p className="leading-relaxed text-sm" style={{ color: MUTED }}>
            We do not warrant that the platform will be uninterrupted or error-free. Use Silo at your own risk.
          </p>
        </Section>

        <Section icon={<ShieldAlert className="w-6 h-6 text-rose-400" />} title="2. Student Project Disclaimer">
          <p className="leading-relaxed text-sm" style={{ color: MUTED }}>
            Silo is a non-profit, student-led open-source project created strictly for educational purposes. We are not a registered corporation or a commercial enterprise. The platform is not monetized.
          </p>
        </Section>

        <Section icon={<Scale className="w-6 h-6 text-blue-400" />} title="3. Content Moderation & Safe Harbor">
          <p className="leading-relaxed mb-4 text-sm" style={{ color: MUTED }}>
            We enforce a strict <strong className="text-emerald-400">zero-tolerance policy</strong> for:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-sm" style={{ color: MUTED }}>
            <li>Hate speech, harassment, or severe bullying</li>
            <li>Threats of violence or self-harm</li>
            <li>Doxxing or sharing private, personally identifiable information</li>
            <li>Any illegal content or activities</li>
          </ul>
          <p className="leading-relaxed text-sm" style={{ color: MUTED }}>
            We reserve the right to remove any content or suspend any user, at any time, for any reason, without prior notice.
          </p>
        </Section>

        <Section icon={<ShieldAlert className="w-6 h-6 text-violet-400" />} title="4. Law Enforcement Cooperation">
          <p className="leading-relaxed text-sm" style={{ color: MUTED }}>
            While Silo champions anonymity, we fully cooperate with valid legal requests when compelled by a court order, especially concerning imminent physical harm or illegal activities. Anonymity is not a shield for illegality.
          </p>
        </Section>

        <Section icon={<FileText className="w-6 h-6 text-emerald-400" />} title="5. MIT License">
          <div className="bg-white/5 p-6 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto" style={{ color: MUTED }}>
            <p>Copyright (c) {new Date().getFullYear()} Silo Developers</p>
            <br />
            <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.</p>
            <br />
            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.</p>
          </div>
        </Section>
      </div>

      <div className="mt-24 pt-8 border-t border-white/10 text-center">
        <p className="text-sm" style={{ color: MUTED }}>
          For inquiries contact us at{' '}
          <a href="mailto:siloedu00@gmail.com" className="text-emerald-400 hover:underline">
            siloedu00@gmail.com
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default LegalPage;
