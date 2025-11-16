import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseFile } from 'music-metadata';
import type { DateFormat, FileSummary, TemplateVars } from '@/types/index.js';
import { formatDate } from '@/utils/date.js';
import { applyTemplate } from '@/utils/template.js';

/**
 * Process a single file in the provided directory and optionally rename it according to the
 * supplied template and date formatting preferences.
 *
 * @param dirPath - Absolute or relative path of the directory containing the file.
 * @param file - Name of the file to process.
 * @param options - Behavioural options for how the file should be processed.
 * @param options.dateFormat - Desired date format identifier.
 * @param options.doWrite - Whether to persist the rename operation to disk.
 * @param options.locale - Locale to use when formatting the date string.
 * @param options.template - Filename template that will be applied to the processed file.
 * @param options.useModifiedTime - Whether to use the file's modification timestamp instead of creation time.
 *
 * @returns A {@link FileSummary} describing the action that was taken for the file.
 */
export const processFile = async (
    dirPath: string,
    file: string,
    options: {
        dateFormat: DateFormat;
        doWrite: boolean;
        locale: string;
        template: string;
        useModifiedTime: boolean;
    },
): Promise<FileSummary> => {
    const filePath = path.join(dirPath, file);

    try {
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            return {
                action: 'skip',
                newName: file,
                original: file,
                reason: 'directory',
            };
        }

        const metadata = await parseFile(filePath);
        let fileDate = options.useModifiedTime ? metadata.format.modificationTime : metadata.format.creationTime;

        if (!fileDate) {
            fileDate = options.useModifiedTime ? stats.mtime : stats.birthtime;
        }

        const formattedDate = formatDate(fileDate, options.dateFormat, options.locale);

        const parsedPath = path.parse(filePath);

        const templateVars: TemplateVars = {
            date: formattedDate,
            ext: parsedPath.ext,
            name: parsedPath.name,
        };

        const newFileName = applyTemplate(options.template, templateVars);
        const newFilePath = path.join(dirPath, newFileName);

        // Handle the case where template includes subdirectories
        if (newFileName.includes('/')) {
            const newDirPath = path.dirname(path.join(dirPath, newFileName));

            if (options.doWrite) {
                await fs.mkdir(newDirPath, { recursive: true });
            }
        }

        if (file === newFileName) {
            return {
                action: 'skip',
                newName: newFileName,
                original: file,
                reason: 'already formatted',
            };
        }

        if (options.doWrite) {
            await fs.rename(filePath, newFilePath);
        }

        return {
            action: 'rename',
            newName: newFileName,
            original: file,
        };
    } catch (error: unknown) {
        return {
            action: 'error',
            newName: '',
            original: file,
            reason: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
