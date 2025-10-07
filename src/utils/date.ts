import type { DateFormat } from '@/types/index.js';

export const formatDate = (date: Date, format: DateFormat, locale: string): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const shortYear = date.getFullYear().toString().slice(2);
    const fullYear = date.getFullYear().toString();

    const monthNameShort = date.toLocaleString(locale, { month: 'short' });
    const monthNameLong = date.toLocaleString(locale, { month: 'long' });

    switch (format) {
        case 'DD_MMM_YYYY':
            return `${day}_${monthNameShort}_${fullYear}`;
        case 'DD_MMMM_YYYY':
            return `${day}_${monthNameLong}_${fullYear}`;
        case 'DDMMYY':
            return `${day}${month}${shortYear}`;
        case 'MMDDYY':
            return `${month}${day}${shortYear}`;
        case 'MMM_DD_YYYY':
            return `${monthNameShort}_${day}_${fullYear}`;
        case 'MMMM_DD_YYYY':
            return `${monthNameLong}_${day}_${fullYear}`;
        case 'YYMMDD':
            return `${shortYear}${month}${day}`;
        case 'YYYY_MM_DD':
            return `${fullYear}_${month}_${day}`;
        case 'YYYYMMDD':
            return `${fullYear}${month}${day}`;
        default:
            return `${month}${day}${shortYear}`;
    }
};
