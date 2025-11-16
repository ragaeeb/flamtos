import { describe, expect, it, spyOn } from 'bun:test';

import { showHelp } from './help.js';

describe('showHelp', () => {
    it('prints the CLI usage guide', () => {
        const logSpy = spyOn(console, 'log').mockImplementation(() => {});

        try {
            showHelp();
            expect(logSpy).toHaveBeenCalledTimes(1);
            const helpOutput = logSpy.mock.calls[0][0] as string;
            expect(helpOutput).toContain('Usage: flamtos');
            expect(helpOutput).toContain('Available date formats');
            expect(helpOutput).toContain('--template <template>');
        } finally {
            logSpy.mockRestore();
        }
    });
});
