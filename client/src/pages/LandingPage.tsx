import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';

const phrases = ['Privacy', 'Authenticity', 'Freedom', 'Honest Opinions'];

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
    }, [typewriterText, isDeleting, loopNum, typingSpeed]);

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">

            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                >
                    <source src="/background-video.mp4" type="video/mp4" />
                    <source src="/background-video.webm" type="video/webm" />
                </video>

                <div className="absolute inset-0 bg-black/50" />
            </div>


            <header className="fixed top-0 w-full z-50 py-4 md:py-6">
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-center">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center gap-6 md:gap-12 w-fit max-w-full">


                        <Link
                            to="/"
                            className="font-bold text-xl text-white font-['Press_Start_2P'] hover:opacity-70 transition-opacity"
                        >
                            {logoText}
                            {logoText.length < fullLogoText.length && <span className="animate-pulse">|</span>}
                        </Link>


                        <a href="mailto:siloedu00@gmail.com" className="text-white/20 hover:text-white/80 transition-colors duration-300">
                            <Mail className="w-5 h-5 md:w-6 md:h-6" />
                        </a>


                        <div className="flex items-center">

                            <Link
                                to="/about"
                                className="px-4 md:px-6 py-1.5 md:py-2 bg-white text-black rounded-md text-xs md:text-sm font-medium hover:bg-white/90 transition-all duration-300 whitespace-nowrap"
                            >
                                About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </header>


            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 pt-20">
                <div className="max-w-5xl mx-auto text-center w-full">

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-4 md:mb-6">
                        Your space for{' '}
                        <span className="text-emerald-400">
                            {typewriterText}
                            <span className="animate-pulse">|</span>
                        </span>
                    </h1>



                    <p className="text-base md:text-lg text-white/90 leading-relaxed md:leading-[2] mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                        Speak freely, share openly, and connect without barriers.
                        <br className="hidden md:block" />
                        The anonymous network for your campus.
                    </p>


                    <p className="text-xs text-white/50 mb-6 md:mb-8">
                        Join 100+ students from your batch
                    </p>


                    <Link
                        to="/request-access"
                        className="inline-block px-8 md:px-10 py-3 md:py-4 bg-white text-black text-base md:text-lg font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>
            </main>


            <footer className="relative z-10 border-t border-white/10 bg-black py-8 md:py-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                    <div className="flex items-center gap-2">
                        <span className="font-['Press_Start_2P'] text-sm md:text-base">Silo</span>
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-500 text-sm">Built for students, by students.</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link
                            to="/legal"
                            className="text-zinc-400 hover:text-white text-sm transition-colors"
                        >
                            Legal & Safety
                        </Link>
                        <a
                            href="mailto:siloedu00@gmail.com"
                            className="text-zinc-400 hover:text-white text-sm transition-colors"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
