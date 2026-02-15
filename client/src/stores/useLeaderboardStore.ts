import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

interface LeaderboardUser {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string; // Optional for now
    weeklyKarma: number;
}

interface LeaderboardState {
    leaderboard: LeaderboardUser[];
    topThree: LeaderboardUser[];
    isLoading: boolean;
    error: string | null;
    fetchLeaderboard: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
    leaderboard: [],
    topThree: [],
    isLoading: false,
    error: null,

    fetchLeaderboard: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            if (!token) throw new Error('Not authenticated');

            const response = await axios.get(`${API_URL}/api/leaderboard/weekly`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const allUsers = response.data.leaderboard || [];

            // Separate top 3 for the widget
            const topThree = allUsers.slice(0, 3);

            set({
                leaderboard: allUsers,
                topThree,
                isLoading: false
            });
        } catch (error: any) {
            console.error('Failed to fetch leaderboard:', error);
            set({
                error: error.response?.data?.error || 'Failed to fetch leaderboard',
                isLoading: false
            });
        }
    },
}));
