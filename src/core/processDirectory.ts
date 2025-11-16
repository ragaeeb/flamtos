import { promises as fs } from 'node:fs';
import process from 'node:process';

import { DATE_FORMATS, type DateFormat, type DirectorySummary, type ProcessOptions } from '../types/index.js';
import { showHelp } from '../utils/help.js';
import { processFile } from './fileProcessor.js';

export interface ProcessDirectoryDependencies {
    exit: typeof process.exit;
    log: typeof console.log;
    processFile: typeof processFile;
    readdir: typeof fs.readdir;
    showHelp: typeof showHelp;
    table: typeof console.table;
    error: typeof console.error;
}

const defaultDependencies: ProcessDirectoryDependencies = {
    exit: process.exit.bind(process),
    error: console.error.bind(console),
    log: console.log.bind(console),
    processFile,
    readdir: fs.readdir.bind(fs),
    showHelp,
    table: console.table.bind(console),
};

/**
 * Process all files within a directory by delegating to {@link processFile} and aggregating the
 * results into a {@link DirectorySummary}. The function also validates CLI options, prints
 * diagnostic output, and handles any unexpected errors gracefully.
 *
 * @param dirPath - Path of the directory to traverse.
 * @param options - Options controlling how files should be processed.
 * @param dependencies - Optional dependency overrides to facilitate testing.
 *
 * @returns A summary describing how many files were renamed, skipped, or encountered errors.
 */
export const processDirectory = async (
    dirPath: string,
    options: ProcessOptions,
    dependencies: Partial<ProcessDirectoryDependencies> = {},
): Promise<DirectorySummary> => {
    const { exit, log, processFile: processFileDependency, readdir, showHelp: showHelpDependency, table, error: logError } = {
        ...defaultDependencies,
        ...dependencies,
    } satisfies ProcessDirectoryDependencies;

    try {
        const files = await readdir(dirPath);

        if (!DATE_FORMATS[options.dateFormat as keyof typeof DATE_FORMATS]) {
            logError(`Error: Unknown date format "${options.dateFormat}"`);
            showHelpDependency();
            exit(1);
        }

        log(`Processing directory: ${dirPath}`);
        log(`Mode: ${options.doWrite ? 'Write' : 'Dry Run'}`);
        log(`Using: ${options.useModifiedTime ? 'Modified Time' : 'Creation Time'}`);
        log(
            `Format: ${options.dateFormat} (${DATE_FORMATS[options.dateFormat as keyof typeof DATE_FORMATS].example})`,
        );
        log(`Locale: ${options.locale}`);
        log(`Template: ${options.template}`);
        log('───────────────────────────────────────────────────────');

        const summary: DirectorySummary = {
            errors: 0,
            files: [],
            renamed: 0,
            skipped: 0,
        };

        // Process all files
        for (const file of files) {
            const result = await processFileDependency(dirPath, file, {
                dateFormat: options.dateFormat as DateFormat,
                doWrite: options.doWrite,
                locale: options.locale,
                template: options.template,
                useModifiedTime: options.useModifiedTime,
            });

            summary.files.push(result);

            // Update counts
            if (result.action === 'rename') {
                summary.renamed++;
            } else if (result.action === 'skip') {
                summary.skipped++;
            } else if (result.action === 'error') {
                summary.errors++;
            }
        }

        // Display the file processing results as a table
        if (summary.files.length > 0) {
            table(
                summary.files.map((file) => ({
                    Action: file.action,
                    NewName: file.newName,
                    Original: file.original,
                    Reason: file.reason || '-',
                })),
            );
        }

        log('───────────────────────────────────────────────────────');
        log(
            `Summary: ${summary.renamed} files ${options.doWrite ? 'renamed' : 'would be renamed'}, ` +
                `${summary.skipped} skipped, ${summary.errors} errors`,
        );

        return summary;
    } catch (error: unknown) {
        logError(
            `Error processing directory ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        return {
            errors: 1,
            files: [],
            renamed: 0,
            skipped: 0,
        };
    }
};
