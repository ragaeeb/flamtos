import { promises as fs } from 'node:fs';
import path from 'node:path';

import { DateFormat, FileSummary, TemplateVars } from '../types/index.js';
import { formatDate } from '../utils/date.js';
import { applyTemplate } from '../utils/template.js';

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

        const fileDate = options.useModifiedTime ? stats.mtime : stats.birthtime;
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
