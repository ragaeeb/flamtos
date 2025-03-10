import { describe, expect, it } from 'vitest';

import { formatDate } from './date';

describe('utils/date', () => {
    describe('formatDate', () => {
        const testDate = new Date('2024-01-15T12:00:00Z');

        it('should format date as MMDDYY', () => {
            const result = formatDate(testDate, 'MMDDYY', 'en-US');
            expect(result).toBe('011524');
        });

        it('should format date as DDMMYY', () => {
            const result = formatDate(testDate, 'DDMMYY', 'en-US');
            expect(result).toBe('150124');
        });

        it('should format date as YYMMDD', () => {
            const result = formatDate(testDate, 'YYMMDD', 'en-US');
            expect(result).toBe('240115');
        });

        it('should format date as YYYYMMDD', () => {
            const result = formatDate(testDate, 'YYYYMMDD', 'en-US');
            expect(result).toBe('20240115');
        });

        it('should format date as MMM_DD_YYYY', () => {
            const result = formatDate(testDate, 'MMM_DD_YYYY', 'en-US');
            expect(result).toBe('Jan_15_2024');
        });

        it('should format date as MMMM_DD_YYYY', () => {
            const result = formatDate(testDate, 'MMMM_DD_YYYY', 'en-US');
            expect(result).toBe('January_15_2024');
        });

        it('should format date as YYYY_MM_DD', () => {
            const result = formatDate(testDate, 'YYYY_MM_DD', 'en-US');
            expect(result).toBe('2024_01_15');
        });

        it('should format date as DD_MMM_YYYY', () => {
            const result = formatDate(testDate, 'DD_MMM_YYYY', 'en-US');
            expect(result).toBe('15_Jan_2024');
        });

        it('should format date as DD_MMMM_YYYY', () => {
            const result = formatDate(testDate, 'DD_MMMM_YYYY', 'en-US');
            expect(result).toBe('15_January_2024');
        });

        it('should respect locale for month names', () => {
            const result = formatDate(testDate, 'MMM_DD_YYYY', 'fr-FR');
            expect(result).toBe('janv._15_2024');
        });

        it('should use default format (MMDDYY) for unknown format', () => {
            const result = formatDate(testDate, 'UNKNOWN' as any, 'en-US');
            expect(result).toBe('011524');
        });
    });
});
