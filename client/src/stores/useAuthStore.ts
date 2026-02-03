import { create } from 'zustand';

// JWT payload structure
interface JWTPayload {
    userId: string;
    role: 'STUDENT' | 'PROFESSOR';
    year: number;
    branch: string;
    exp: number;
    iat: number;
}

// User type
export interface User {
    userId: string;
    role: 'STUDENT' | 'PROFESSOR';
    year: number;
    branch: string;
    firstName?: string | null;
    lastName?: string | null;
}

// Auth store state
interface AuthStore {
    token: string | null;
    user: User | null;

    // Computed
    isAuthenticated: boolean;
    isProfessor: boolean;
    isStudent: boolean;

    // Actions
    login: (token: string) => void;
    logout: () => void;

    // Internal
    _hydrate: () => void;
}

// Decode JWT without verification (server handles verification)
const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

// Check if token is expired
const isTokenExpired = (payload: JWTPayload): boolean => {
    const now = Date.now() / 1000;
    return payload.exp < now;
};

// Storage key
const TOKEN_KEY = 'silo_token';

export const useAuthStore = create<AuthStore>((set, get) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    isProfessor: false,
    isStudent: false,

    login: (token: string) => {
        const payload = decodeJWT(token);

        if (!payload || isTokenExpired(payload)) {
            // Invalid or expired token
            get().logout();
            return;
        }

        const user: User = {
            userId: payload.userId,
            role: payload.role,
            year: payload.year,
            branch: payload.branch,
        };

        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, token);

        // Update state
        set({
            token,
            user,
            isAuthenticated: true,
            isProfessor: payload.role === 'PROFESSOR',
            isStudent: payload.role === 'STUDENT',
        });
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({
            token: null,
            user: null,
            isAuthenticated: false,
            isProfessor: false,
            isStudent: false,
        });
    },

    _hydrate: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            get().login(token);
        }
    },
}));

// Hydrate on initialization
useAuthStore.getState()._hydrate();
