import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthLayout from './AuthLayout';
import { getAuthErrorMessage } from '@/utils/errorHelpers';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'STUDENT' | 'PROFESSOR';
  };
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      login(response.data.token);
      navigate('/');
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Global Error */}
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

        {/* Password */}
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Register Link */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-foreground font-medium hover:underline"
              >
                Register
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link
                to="/forgot-password"
                className="text-foreground font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;
