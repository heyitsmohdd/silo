import ThemeToggle from '@/components/ui/ThemeToggle';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            {/* Theme Toggle */}
            <div className="fixed top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-2">
                        Silo
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>
                </div>

                <div className="bg-background border border-border rounded-lg shadow-soft-lg p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
