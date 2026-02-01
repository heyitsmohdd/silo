import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from './AuthLayout';
import axiosClient from '@/lib/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (resetToken: string) => {
    try {
      await axiosClient.post('/auth/verify-reset-token', { token: resetToken });
      setIsTokenValid(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Invalid or expired reset token';
      setError(errorMessage);
      setIsTokenValid(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isTokenValid === null && token) {
    return (
      <AuthLayout title="Verify Reset Token">
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-muted border-border">
            <p className="text-sm text-muted-foreground animate-pulse">
              Verifying reset token...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Invalid token
  if (isTokenValid === false) {
    return (
      <AuthLayout title="Invalid Token">
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              {error || 'Invalid or expired reset token'}
            </p>
          </div>

          <Button
            onClick={() => navigate('/forgot-password')}
            className="w-full"
          >
            Request New Reset Link
          </Button>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              <Link
                to="/login"
                className="text-foreground font-medium hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (success) {
    return (
      <AuthLayout title="Password Reset Successful">
        <div className="space-y-5">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-4">
              Your password has been reset successfully! You can now log in with your new password.
            </p>

            <Button
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Reset password form
  return (
    <AuthLayout title="Create new password">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {/* New Password */}
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••••"
          required
          disabled={isLoading}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="•••••••••"
          required
          disabled={isLoading}
        />

        {/* Password Requirements */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <p className="text-sm font-medium text-foreground">
            Password Requirements:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Minimum 8 characters</li>
            <li>• Should be different from previous password</li>
          </ul>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
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
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
