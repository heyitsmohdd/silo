
import { useAuthStore } from '@/stores/useAuthStore';

interface AcademicLayoutProps {
    children: React.ReactNode;
}

const AcademicLayout = ({ children }: AcademicLayoutProps) => {
    const { user } = useAuthStore();

    return (
        <div className="w-full max-w-4xl mx-auto min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 bg-white dark:bg-black border-b-4 border-black dark:border-white pb-4 pt-10 mb-8">
                <div className="flex justify-between items-end">
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                        ACADEMIC_LOGS
                    </h1>
                    {user && (
                        <div className="text-right font-mono text-xs opacity-70">
                            BATCH_{user.year} :: {user.branch}
                        </div>
                    )}
                </div>
            </header>

            <main className="pb-20">
                {children}
            </main>
        </div>
    );
};

export default AcademicLayout;
