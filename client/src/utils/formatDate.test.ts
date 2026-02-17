import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
    it('formats a timestamp correctly', () => {
        const date = new Date('2023-01-01T12:00:00');
        // Note: The output format depends on the locale, defaulting to en-US here
        expect(formatDate(date)).toMatch(/Jan 1, 2023/);
    });

    it('handles string input', () => {
        expect(formatDate('2023-01-01T12:00:00')).toMatch(/Jan 1, 2023/);
    });

    it('handles number input', () => {
        const timestamp = new Date('2023-01-01T12:00:00').getTime();
        expect(formatDate(timestamp)).toMatch(/Jan 1, 2023/);
    });
});
