import type { TemplateVars } from '@/types/index.js';

export const applyTemplate = (template: string, vars: TemplateVars): string => {
    let result = template;

    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return result;
};
