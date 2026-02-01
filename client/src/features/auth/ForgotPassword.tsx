import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from './AuthLayout';
import axiosClient from '@/lib/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/auth/forgot-password', { email });
      
      setSuccess(true);
      
      // In development, show the token and URL
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Success Message */}
        {success ? (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-4">
              {error
                ? 'If an account exists with this email, you will receive a password reset link shortly.'
                : 'Password reset link sent to your email!'}
            </p>
            
            {/* Development Info */}
            {(resetToken || resetUrl) && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                  Development Mode - Reset Info:
                </p>
                {resetToken && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">Reset Token:</p>
                    <code className="text-xs bg-background px-2 py-1 rounded block break-all">
                      {resetToken}
                    </code>
                  </div>
                )}
                {resetUrl && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reset URL:</p>
                    <code className="text-xs bg-background px-2 py-1 rounded block break-all">
                      {resetUrl}
                    </code>
                  </div>
                )}
              </div>
            )}

            <Button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full mt-4"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <>
            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
              disabled={isLoading}
            />

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            {/* Login Link */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-foreground font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
