
import { useAuthStore } from '@/stores/useAuthStore';

interface AcademicLayoutProps {
    children: React.ReactNode;
}

const AcademicLayout = ({ children }: AcademicLayoutProps) => {
    const { user } = useAuthStore();

    return (
        <div className="w-full max-w-4xl mx-auto min-h-screen p-6">
            {/* User Info - Top Right */}
            {user && (
                <div className="flex justify-end mb-6">
                    <div className="text-sm text-zinc-400">
                        {user.year} • {user.branch}
                    </div>
                </div>
            )}

            <main className="pb-20">
                {children}
            </main>
        </div>
    );
};

export default AcademicLayout;
