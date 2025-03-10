export const DATE_FORMATS = {
    DD_MMM_YYYY: { description: 'Day with abbreviated month', example: '15_Jan_2024' },
    DD_MMMM_YYYY: { description: 'Day with full month', example: '15_January_2024' },
    DDMMYY: { description: 'Day-Month-Year (2 digits each)', example: '150124' },
    MMDDYY: { description: 'Month-Day-Year (2 digits each)', example: '011524' },
    MMM_DD_YYYY: { description: 'Abbreviated month name', example: 'Jan_15_2024' },
    MMMM_DD_YYYY: { description: 'Full month name', example: 'January_15_2024' },
    YYMMDD: { description: 'Year-Month-Day (2 digits each)', example: '240115' },
    YYYY_MM_DD: { description: 'ISO-like format with underscores', example: '2024_01_15' },
    YYYYMMDD: { description: 'Full Year-Month-Day', example: '20240115' },
};

export type DateFormat = keyof typeof DATE_FORMATS;

export interface DirectorySummary {
    errors: number;
    files: FileSummary[];
    renamed: number;
    skipped: number;
}

export interface FileSummary {
    action: 'error' | 'rename' | 'skip';
    newName: string;
    original: string;
    reason?: string;
}

export interface ProcessOptions {
    dateFormat: string;
    doWrite: boolean;
    locale: string;
    template: string;
    useModifiedTime: boolean;
}

export interface TemplateVars {
    date: string;
    ext: string;
    name: string;
}
