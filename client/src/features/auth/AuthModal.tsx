import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosClient from '@/lib/axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';

interface AuthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface RegisterPayload {
    email: string;
    password: string;
    role: 'STUDENT' | 'PROFESSOR';
    year: number;
    branch: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: 'STUDENT' | 'PROFESSOR';
    };
}

const BRANCHES = [
    { value: 'CS', label: 'Computer Science' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'EC', label: 'Electronics & Communication' },
];

const YEARS = [2022, 2023, 2024, 2025, 2026];


export function AuthModal({ open, onOpenChange }: AuthModalProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'PROFESSOR'>('STUDENT');
    const [year, setYear] = useState(2026);
    const [branch, setBranch] = useState('CS');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('STUDENT');
        setYear(2026);
        setBranch('CS');
        setError('');
    };

    const handleModeChange = (newMode: 'signin' | 'signup') => {
        setMode(newMode);
        resetForm();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation for signup
        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'signin') {
                // Login
                const response = await axiosClient.post<AuthResponse>('/auth/login', {
                    email,
                    password,
                });

                login(response.data.token);
                onOpenChange(false);
                navigate('/');
            } else {
                // Register
                const payload: RegisterPayload = {
                    email: email.trim(),
                    password,
                    role,
                    year: Number(year),
                    branch,
                };

                const response = await axiosClient.post<AuthResponse>(
                    '/auth/register',
                    payload
                );

                login(response.data.token);
                onOpenChange(false);
                navigate('/');
            }

            resetForm();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                `${mode === 'signin' ? 'Login' : 'Registration'} failed. Please try again.`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    {/* Logo */}
                    <div className="mb-6">
                        <span className="font-bold text-2xl text-foreground font-['Press_Start_2P']">
                            Silo
                        </span>
                    </div>

                    <DialogTitle className="text-2xl">
                        {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {mode === 'signup'
                            ? "Join your batch to collaborate with classmates."
                            : "Sign in to access your batch's study space."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                    {/* Global Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Email */}
                    <Input
                        label="University email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@university.edu"
                        required
                        disabled={loading}
                    />

                    {/* Password */}
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        minLength={8}
                        disabled={loading}
                    />

                    {/* Confirm Password (Signup only) */}
                    {mode === 'signup' && (
                        <Input
                            label="Confirm password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            minLength={8}
                            disabled={loading}
                        />
                    )}

                    {/* Role (Signup only) - DISABLED FOR BETA */}
                    {/* {mode === 'signup' && (
                        <Select
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'STUDENT' | 'PROFESSOR')}
                            options={ROLES}
                            disabled={loading}
                        />
                    )} */}

                    {/* Year (Signup only) */}
                    {mode === 'signup' && (
                        <Select
                            label="Year"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            options={YEARS.map((y) => ({ value: y, label: `Class of ${y}` }))}
                            disabled={loading}
                        />
                    )}

                    {/* Branch (Signup only) */}
                    {mode === 'signup' && (
                        <Select
                            label="Branch"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            options={BRANCHES}
                            disabled={loading}
                        />
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading
                            ? 'Please wait...'
                            : mode === 'signup'
                                ? 'Create Account'
                                : 'Sign In'}
                    </Button>

                    {/* Forgot Password Link (Signin only) */}
                    {mode === 'signin' && (
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-primary hover:underline"
                                onClick={() => {
                                    onOpenChange(false);
                                    navigate('/forgot-password');
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}
                </form>

                {/* Mode Toggle */}
                <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    {mode === 'signup' ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="text-primary hover:underline font-medium"
                                onClick={() => handleModeChange('signin')}
                            >
                                Sign in
                            </button>
                        </>
                    ) : (
                        <>
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                className="text-primary hover:underline font-medium"
                                onClick={() => handleModeChange('signup')}
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
