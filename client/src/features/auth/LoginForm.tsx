import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthLayout from './AuthLayout';

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

            // Store token in auth store
            login(response.data.token);

            // Redirect to dashboard
            navigate('/');
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'LOGIN FAILED. CHECK CREDENTIALS.';
            setError(errorMessage.toUpperCase());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Batch-Isolated Academic Vault">
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

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
                </Button>

                {/* Register Link */}
                <div className="pt-4 border-t-2 border-dark-border light:border-bright-border">
                    <p className="text-xs font-mono text-center">
                        <span className="text-dark-border light:text-bright-border uppercase tracking-wider">
                            No Account?{' '}
                        </span>
                        <Link
                            to="/register"
                            className="underline hover:no-underline font-medium"
                        >
                            REGISTER
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginForm;
