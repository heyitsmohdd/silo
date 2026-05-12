import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { AxiosError } from 'axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axiosClient from '@/lib/axios';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

const RequestAccess = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await axiosClient.post('/api/access/request', { email });
      setStatus('success');
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      {/* Form card */}
      <div className="w-full max-w-md relative z-10 animate-fade-rise">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-normal leading-tight mb-3"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Join the{' '}
            <em className="not-italic" style={{ color: MUTED }}>Waitlist</em>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            Silo is currently in private beta. Enter your email to get early access.
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-6 sm:p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Request Received!</h3>
              <p className="text-sm mb-6" style={{ color: MUTED }}>
                {message || 'We will review your application shortly.'}
              </p>
              <Link to="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/10">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-sm text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 transition-all h-11 font-semibold text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Join Waitlist <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm hover:text-white transition-colors"
            style={{ color: MUTED }}
          >
            Already have an account?{' '}
            <span className="underline underline-offset-4">Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
