import { describe, expect, it } from 'bun:test';

import type { FileSummary, ProcessOptions } from '@/types/index.js';
import { processDirectory } from './processDirectory.js';

const baseOptions: ProcessOptions = {
    dateFormat: 'MMDDYY',
    doWrite: false,
    locale: 'en-US',
    template: '{name}_{date}{ext}',
    useModifiedTime: false,
};

describe('processDirectory', () => {
    it('summarises processing results across files', async () => {
        const logs: unknown[] = [];
        const tables: unknown[] = [];
        const processedFiles: string[] = [];

        const summary = await processDirectory('/tmp/music', baseOptions, {
            error: () => {},
            exit: ((code?: number) => {
                throw new Error(`unexpected exit ${code}`);
            }) as typeof process.exit,
            log: (message) => {
                logs.push(message);
            },
            processFile: (async (_dir, file) => {
                processedFiles.push(file);

                if (file === 'file-a.mp3') {
                    return {
                        action: 'rename',
                        newName: 'file-a_011524.mp3',
                        original: file,
                    } satisfies FileSummary;
                }

                return {
                    action: 'error',
                    newName: '',
                    original: file,
                    reason: 'disk full',
                } satisfies FileSummary;
            }) as unknown as typeof import('./fileProcessor.js').processFile,
            readdir: async () => ['file-a.mp3', 'file-b.mp3'],
            showHelp: () => {},
            table: (data) => {
                tables.push(data);
            },
        });

        expect(summary.renamed).toBe(1);
        expect(summary.errors).toBe(1);
        expect(summary.skipped).toBe(0);
        expect(summary.files).toHaveLength(2);
        expect(processedFiles).toEqual(['file-a.mp3', 'file-b.mp3']);
        expect(logs.length).toBeGreaterThan(0);
        expect(tables).toHaveLength(1);
    });

    it('shows help and exits when the format is unknown', async () => {
        let showHelpCalled = false;
        const exitCodes: Array<number | undefined> = [];
        const errors: unknown[] = [];

        const summary = await processDirectory('/tmp/music', { ...baseOptions, dateFormat: 'UNKNOWN' }, {
            error: (message) => {
                errors.push(message);
            },
            exit: ((code?: number) => {
                exitCodes.push(code);
                throw new Error('exit');
            }) as typeof process.exit,
            log: () => {},
            processFile: (async () => ({
                action: 'skip',
                newName: '',
                original: '',
            })) as unknown as typeof import('./fileProcessor.js').processFile,
            readdir: async () => ['file-a.mp3'],
            showHelp: () => {
                showHelpCalled = true;
            },
            table: () => {},
        });

        expect(showHelpCalled).toBe(true);
        expect(exitCodes[0]).toBe(1);
        expect(String(errors[0])).toContain('Unknown date format');
        expect(summary.errors).toBe(1);
    });

    it('handles directory access failures', async () => {
        const errors: unknown[] = [];

        const summary = await processDirectory('/restricted', baseOptions, {
            error: (message) => {
                errors.push(message);
            },
            exit: ((code?: number) => {
                throw new Error(`unexpected exit ${code}`);
            }) as typeof process.exit,
            log: () => {},
            processFile: (async () => ({
                action: 'skip',
                newName: '',
                original: '',
            })) as unknown as typeof import('./fileProcessor.js').processFile,
            readdir: async () => {
                throw new Error('permission denied');
            },
            showHelp: () => {},
            table: () => {},
        });

        expect(summary.errors).toBe(1);
        expect(summary.renamed).toBe(0);
        expect(summary.skipped).toBe(0);
        expect(String(errors[0])).toContain('permission denied');
    });
});
