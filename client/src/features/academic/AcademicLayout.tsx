
import { useAuthStore } from '@/stores/useAuthStore';

interface AcademicLayoutProps {
    children: React.ReactNode;
}

const AcademicLayout = ({ children }: AcademicLayoutProps) => {
    const { user } = useAuthStore();

    return (
        <div className="w-full max-w-4xl mx-auto min-h-screen p-6">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-900 pb-6 pt-4 mb-8">
                <div className="flex justify-between items-end">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
                        Academic Notes
                    </h1>
                    {user && (
                        <div className="text-right text-sm text-neutral-600 dark:text-neutral-400">
                            {user.year} • {user.branch}
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
