import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import AuthLayout from './AuthLayout';

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

        // Validate password match
        if (password !== confirmPassword) {
            setError('PASSWORDS DO NOT MATCH');
            return;
        }

        setIsLoading(true);

        try {
            const payload: RegisterPayload = {
                email,
                password,
                role,
                year: Number(year), // Explicit number conversion
                branch,
            };

            const response = await axiosClient.post<RegisterResponse>(
                '/auth/register',
                payload
            );

            // Auto-login with returned token
            login(response.data.token);

            // Redirect to dashboard
            navigate('/');
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'REGISTRATION FAILED. TRY AGAIN.';
            setError(errorMessage.toUpperCase());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create New Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Global Error */}
                {error && (
                    <div className="p-4 border-2 border-danger bg-transparent">
                        <p className="text-xs font-mono text-danger uppercase tracking-wider">
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
                    {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER'}
                </Button>

                {/* Login Link */}
                <div className="pt-4 border-t-2 border-dark-border light:border-bright-border">
                    <p className="text-xs font-mono text-center">
                        <span className="text-dark-border light:text-bright-border uppercase tracking-wider">
                            Have an Account?{' '}
                        </span>
                        <Link
                            to="/login"
                            className="underline hover:no-underline font-medium"
                        >
                            LOGIN
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterForm;
