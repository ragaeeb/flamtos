import { describe, expect, it } from 'bun:test';

import { applyTemplate } from './template';

describe('utils/template', () => {
    describe('applyTemplate', () => {
        it('should replace name, date, and ext in template', () => {
            const template = '{name}_{date}{ext}';
            const vars = {
                date: '012345',
                ext: '.mp3',
                name: 'file',
            };

            const result = applyTemplate(template, vars);
            expect(result).toBe('file_012345.mp3');
        });

        it('should handle date-first template', () => {
            const template = '{date}_{name}{ext}';
            const vars = {
                date: '012345',
                ext: '.mp3',
                name: 'file',
            };

            const result = applyTemplate(template, vars);
            expect(result).toBe('012345_file.mp3');
        });

        it('should handle templates with subdirectories', () => {
            const template = '{date}/{name}{ext}';
            const vars = {
                date: '012345',
                ext: '.mp3',
                name: 'file',
            };

            const result = applyTemplate(template, vars);
            expect(result).toBe('012345/file.mp3');
        });

        it('should handle templates with multiple occurrences of variables', () => {
            const template = '{name}_{date}_{name}{ext}';
            const vars = {
                date: '012345',
                ext: '.mp3',
                name: 'file',
            };

            const result = applyTemplate(template, vars);
            expect(result).toBe('file_012345_file.mp3');
        });

        it('should handle templates with brackets in filename', () => {
            const template = '{name} [{date}]{ext}';
            const vars = {
                date: '012345',
                ext: '.mp3',
                name: 'my song',
            };

            const result = applyTemplate(template, vars);
            expect(result).toBe('my song [012345].mp3');
        });

        it('should return unchanged template when no variables match', () => {
            const template = '{unknown}_{another}';
            const vars = {
                date: '012345',
                ext: '.mp3',
                name: 'file',
            };

            const result = applyTemplate(template, vars);
            expect(result).toBe('{unknown}_{another}');
        });
    });
});
