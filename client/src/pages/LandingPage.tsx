import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
    // Logo typewriter effect
    const [logoText, setLogoText] = useState('');
    const fullLogoText = 'Silo';

    useEffect(() => {
        let currentIndex = 0;
        let typingInterval: number;

        const startDelay = setTimeout(() => {
            typingInterval = setInterval(() => {
                if (currentIndex <= fullLogoText.length) {
                    setLogoText(fullLogoText.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 100);
        }, 2000);

        return () => {
            clearTimeout(startDelay);
            if (typingInterval) clearInterval(typingInterval);
        };
    }, []);

    // Hero typewriter effect
    const [typewriterText, setTypewriterText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const phrases = ['Succeed Together', 'Learn Together', 'Grow Together'];

    useEffect(() => {
        const handleType = () => {
            const i = loopNum % phrases.length;
            const fullText = phrases[i];

            setTypewriterText(
                isDeleting
                    ? fullText.substring(0, typewriterText.length - 1)
                    : fullText.substring(0, typewriterText.length + 1)
            );

            setTypingSpeed(isDeleting ? 75 : 150);

            if (!isDeleting && typewriterText === fullText) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && typewriterText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [typewriterText, isDeleting, loopNum, typingSpeed, phrases]);

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Green Radial Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/20 rounded-full blur-[150px]" />
            </div>

            {/* Header - Exact Velon Structure */}
            <header className="fixed top-0 w-full z-50 py-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between w-fit">

                        {/* Logo on the left */}
                        <Link
                            to="/"
                            className="text-xl font-bold tracking-tight hover:text-white/70 transition-all duration-300"
                        >
                            {logoText}
                            {logoText.length < fullLogoText.length && <span className="animate-pulse">|</span>}
                        </Link>

                        {/* About Us link and CTA */}
                        <div className="flex items-center gap-4 ml-8">
                            {/* About Us Link */}
                            <Link
                                to="/about"
                                className="text-sm text-white/70 hover:text-white transition-all duration-300"
                            >
                                About Us
                            </Link>

                            {/* CTA Button */}
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-all duration-300"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 pt-20">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Main Headline with Typewriter */}
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
                        Study Together,
                        <br />
                        <span className="inline-block min-w-[600px] text-left">
                            {typewriterText}
                            <span className="animate-pulse">|</span>
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-white/90 leading-[2] mb-8 max-w-2xl mx-auto">
                        Academic collaboration platform built for your batch
                    </p>

                    {/* Social Proof */}
                    <p className="text-xs text-white/50 mb-8">
                        Trusted by 100+ students
                    </p>

                    {/* CTA Button */}
                    <Link
                        to="/register"
                        className="inline-block px-10 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
