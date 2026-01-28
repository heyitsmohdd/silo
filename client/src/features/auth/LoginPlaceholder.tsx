import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const LoginPlaceholder = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Phase 2 - Connect to backend API
        // For now, this is a placeholder
        console.log('Login attempt:', { email, password });

        // Mock login for demonstration
        // Replace with actual API call in Phase 2
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiU1RVREVOVCJ9.mock';
        login(mockToken);
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 border-2 border-dark-border light:border-bright-border">
                <h1 className="text-3xl font-bold font-mono mb-8 text-center">
                    SILO
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@university.edu"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" className="w-full">
                        LOGIN
                    </Button>
                </form>

                <p className="mt-6 text-center text-xs font-mono text-dark-border light:text-bright-border">
                    Phase 1: Foundation Only
                </p>
            </div>
        </div>
    );
};

export default LoginPlaceholder;
