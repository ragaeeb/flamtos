import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { processFile } from './fileProcessor';

describe('fileProcessor', () => {
    // Create a temporary directory for test files
    const tempDir = path.join(os.tmpdir(), 'flamtos-tests-' + Date.now());

    beforeEach(async () => {
        // Create the test directory before each test
        await fs.mkdir(tempDir, { recursive: true });
    });

    afterEach(async () => {
        // Clean up test files after each test
        try {
            await fs.rm(tempDir, { force: true, recursive: true });
        } catch (error) {
            console.error('Error cleaning up:', error);
        }
    });

    it('should skip directories', async () => {
        // Create a subdirectory
        const subDir = path.join(tempDir, 'subdir');
        await fs.mkdir(subDir);

        const result = await processFile(tempDir, 'subdir', {
            dateFormat: 'MMDDYY',
            doWrite: false,
            locale: 'en-US',
            template: '{name}_{date}{ext}',
            useModifiedTime: false,
        });

        expect(result.action).toBe('skip');
        expect(result.reason).toBe('directory');

        // Verify the directory wasn't renamed
        const dirExists = await fileExists(subDir);
        expect(dirExists).toBe(true);
    });

    it('should process file with creation date in dry run mode', async () => {
        // Create a test file
        const filePath = path.join(tempDir, 'testfile.mp3');
        await fs.writeFile(filePath, 'test content');

        const result = await processFile(tempDir, 'testfile.mp3', {
            dateFormat: 'MMDDYY',
            doWrite: false,
            locale: 'en-US',
            template: '{name}_{date}{ext}',
            useModifiedTime: false,
        });

        expect(result.action).toBe('rename');
        expect(result.original).toBe('testfile.mp3');
        expect(result.newName).toMatch(/testfile_\d{6}\.mp3/); // Match date pattern

        // Verify the file wasn't actually renamed in dry run mode
        const originalExists = await fileExists(filePath);
        expect(originalExists).toBe(true);
    });

    it('should process file with modification date in write mode', async () => {
        // Create a test file
        const filePath = path.join(tempDir, 'testfile.mp3');
        await fs.writeFile(filePath, 'test content');

        const result = await processFile(tempDir, 'testfile.mp3', {
            dateFormat: 'MMDDYY',
            doWrite: true,
            locale: 'en-US',
            template: '{name}_{date}{ext}',
            useModifiedTime: true,
        });

        expect(result.action).toBe('rename');
        expect(result.original).toBe('testfile.mp3');
        expect(result.newName).toMatch(/testfile_\d{6}\.mp3/); // Match date pattern

        // Verify the file was renamed
        const originalExists = await fileExists(filePath);
        expect(originalExists).toBe(false);

        const newPath = path.join(tempDir, result.newName);
        const newExists = await fileExists(newPath);
        expect(newExists).toBe(true);
    });

    it('should create subdirectories when template includes path separators', async () => {
        // Create a test file
        const filePath = path.join(tempDir, 'testfile.mp3');
        await fs.writeFile(filePath, 'test content');

        const result = await processFile(tempDir, 'testfile.mp3', {
            dateFormat: 'MMDDYY',
            doWrite: true,
            locale: 'en-US',
            template: '{date}/{name}{ext}',
            useModifiedTime: false,
        });

        expect(result.action).toBe('rename');
        expect(result.newName).toMatch(/\d{6}\/testfile\.mp3/); // Match date/filename pattern

        // Verify the subdirectory was created and file was moved
        const dateDir = result.newName.split('/')[0];
        const newDirPath = path.join(tempDir, dateDir);
        const dirExists = await fileExists(newDirPath);
        expect(dirExists).toBe(true);

        const newFilePath = path.join(tempDir, result.newName);
        const newFileExists = await fileExists(newFilePath);
        expect(newFileExists).toBe(true);
    });
});

// Helper function to check if a file exists
async function fileExists(filepath: string): Promise<boolean> {
    try {
        await fs.access(filepath);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return false;
    }
}
