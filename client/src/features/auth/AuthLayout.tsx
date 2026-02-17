import ThemeToggle from '@/components/ui/ThemeToggle';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2 font-['Press_Start_2P']">
            Silo
          </h1>
          <p className="text-muted-foreground">
            {title}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-soft-lg p-8">
          {children}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Batch-Isolated Academic Vault
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
