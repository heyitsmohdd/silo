
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axiosClient from '@/lib/axios';

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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Fullscreen Background Video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
                >
                    <source src="/background-video.mp4" type="video/mp4" />
                    <source src="/background-video.webm" type="video/webm" />
                </video>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Join the Waitlist</h1>
                    <p className="text-zinc-400 text-sm">
                        Silo is currently in private beta. Enter your email to get early access.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Request Received!</h3>
                            <p className="text-zinc-400 mb-6">
                                {message || "We will review your application shortly."}
                            </p>
                            <Link to="/login">
                                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">
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

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-violet-500/50 focus:ring-violet-500/20"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black hover:bg-zinc-200 transition-all h-11 font-medium text-base shadow-lg shadow-white/5"
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

                {/* Footer */}
                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                        Already have an account? <span className="underline decoration-zinc-700 underline-offset-4">Log in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
