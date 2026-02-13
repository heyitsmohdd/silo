import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import AuthLayout from './AuthLayout';
import { getAuthErrorMessage } from '@/utils/errorHelpers';

interface RegisterPayload {
  email: string;
  password: string;
  role: 'STUDENT' | 'PROFESSOR';
  year: number;
  branch: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'STUDENT' | 'PROFESSOR';
  };
}

const YEARS = [2022, 2023, 2024, 2025, 2026];
const BRANCHES = ['CS', 'MECH', 'CIVIL', 'EC'];
const ROLES = ['STUDENT', 'PROFESSOR'];

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'PROFESSOR'>('STUDENT');
  const [year, setYear] = useState(2026);
  const [branch, setBranch] = useState('CS');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const payload: RegisterPayload = {
        email,
        password,
        role,
        year: Number(year),
        branch,
      };

      const response = await axiosClient.post<RegisterResponse>(
        '/auth/register',
        payload
      );

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
    <AuthLayout title="Create New Account">
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

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
        />

        {/* Role */}
        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'STUDENT' | 'PROFESSOR')}
          options={ROLES.map((r) => ({ value: r, label: r }))}
          disabled={isLoading}
        />

        {/* Year */}
        <Select
          label="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          options={YEARS.map((y) => ({ value: y, label: y.toString() }))}
          disabled={isLoading}
        />

        {/* Branch */}
        <Select
          label="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          options={BRANCHES.map((b) => ({ value: b, label: b }))}
          disabled={isLoading}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        {/* Login Link */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
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

export default RegisterForm;
