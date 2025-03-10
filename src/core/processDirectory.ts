import { promises as fs } from 'node:fs';
import process from 'node:process';

import { DATE_FORMATS, type DateFormat, type DirectorySummary, type ProcessOptions } from '../types/index.js';
import { showHelp } from '../utils/help.js';
import { processFile } from './fileProcessor.js';

export const processDirectory = async (dirPath: string, options: ProcessOptions): Promise<DirectorySummary> => {
    try {
        const files = await fs.readdir(dirPath);

        if (!DATE_FORMATS[options.dateFormat as keyof typeof DATE_FORMATS]) {
            console.error(`Error: Unknown date format "${options.dateFormat}"`);
            showHelp();
            process.exit(1);
        }

        console.log(`Processing directory: ${dirPath}`);
        console.log(`Mode: ${options.doWrite ? 'Write' : 'Dry Run'}`);
        console.log(`Using: ${options.useModifiedTime ? 'Modified Time' : 'Creation Time'}`);
        console.log(
            `Format: ${options.dateFormat} (${DATE_FORMATS[options.dateFormat as keyof typeof DATE_FORMATS].example})`,
        );
        console.log(`Locale: ${options.locale}`);
        console.log(`Template: ${options.template}`);
        console.log('───────────────────────────────────────────────────────');

        const summary: DirectorySummary = {
            errors: 0,
            files: [],
            renamed: 0,
            skipped: 0,
        };

        // Process all files
        for (const file of files) {
            const result = await processFile(dirPath, file, {
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
            console.table(
                summary.files.map((file) => ({
                    Action: file.action,
                    NewName: file.newName,
                    Original: file.original,
                    Reason: file.reason || '-',
                })),
            );
        }

        console.log('───────────────────────────────────────────────────────');
        console.log(
            `Summary: ${summary.renamed} files ${options.doWrite ? 'renamed' : 'would be renamed'}, ` +
                `${summary.skipped} skipped, ${summary.errors} errors`,
        );

        return summary;
    } catch (error: unknown) {
        console.error(
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
