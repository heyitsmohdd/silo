interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold font-mono tracking-tighter mb-2">
                        SILO
                    </h1>
                    <p className="text-sm font-mono uppercase tracking-wider text-dark-border light:text-bright-border">
                        {title}
                    </p>
                </div>

                {/* Form Container */}
                <div className="border-2 border-dark-border light:border-bright-border p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
