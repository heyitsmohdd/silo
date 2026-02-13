import axios, { AxiosError } from 'axios';

export const getAuthErrorMessage = (error: unknown): string => {
    if (!error) return 'An unknown error occurred.';

    // 1. Handle Network / Timeout Issues
    if (
        typeof error === 'object' &&
        error !== null &&
        ('code' in error && (error as { code: string }).code === 'ECONNABORTED') ||
        ('message' in error && (error as { message: string }).message?.toLowerCase().includes('network error')) ||
        ('message' in error && (error as { message: string }).message?.toLowerCase().includes('timeout'))
    ) {
        return 'Connection slow. The server is waking up (it might take 10 seconds). Please retry.';
    }

    // 2. Handle Axios Errors (HTTP Status Codes)
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMessage = (error.response?.data as { message?: string })?.message;

        switch (status) {
            case 404:
                return 'Account not found. Please Sign Up first.';
            case 403:
                return 'Access Denied: You are not on the Waitlist yet. Please Request Access.';
            case 401:
                return 'Incorrect password. Please try again.';
            case 409:
                return 'This email is already registered. Please Log In.';
            case 500:
                return 'Server error. We are fixing it. Try again later.';
            case 400:
                // Handle Validation Errors
                if (serverMessage) {
                    // Return the specific message from server (e.g. Zod validation)
                    return serverMessage;
                }
                return 'Please check your input (Email format or Password length).';
            default:
                // Fallback for other status codes
                return serverMessage || 'Something went wrong. Please try again.';
        }
    }

    // Fallback for non-Axios errors
    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred.';
};
