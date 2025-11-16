import type { TemplateVars } from '@/types/index.js';

/**
 * Replace template placeholders in a filename template string with concrete values.
 *
 * @param template - Template string containing placeholder variables wrapped in curly braces.
 * @param vars - Variables that should be interpolated into the template.
 *
 * @returns The template string with all matching placeholders substituted.
 */
export const applyTemplate = (template: string, vars: TemplateVars): string => {
    let result = template;

    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return result;
};
