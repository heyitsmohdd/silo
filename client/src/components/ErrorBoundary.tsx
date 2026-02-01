import { Component, type ReactNode, type ErrorInfo } from 'react';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-soft-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>

              <h1 className="text-2xl font-bold text-card-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">
                An unexpected error occurred. Please try again.
              </p>

              {this.state.error && import.meta.env.DEV && (
                <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
                  <p className="text-xs font-mono text-destructive break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                  }}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
