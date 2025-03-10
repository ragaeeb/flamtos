#!/usr/bin/env bun
import welcome from 'cli-welcome';
import { parseArgs } from 'node:util';

import packageJson from '../package.json' assert { type: 'json' };
import { processDirectory } from './core/processDirectory.js';
import { showHelp } from './utils/help.js';

const main = async () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        clear: false,
        color: `#000000`,
        title: packageJson.name,
        version: packageJson.version,
    });

    const { positionals, values } = parseArgs({
        allowPositionals: true,
        options: {
            format: { default: 'MMDDYY', type: 'string' },
            help: { type: 'boolean' },
            locale: { default: 'en-US', type: 'string' },
            template: { default: '{name}_{date}{ext}', type: 'string' },
            updated: { type: 'boolean' },
            write: { type: 'boolean' },
        },
    });

    if (values.help) {
        showHelp();
        return;
    }

    if (!positionals?.length) {
        console.error('Error: You must specify at least one input directory.');
        showHelp();
        return;
    }

    for (const dir of positionals) {
        await processDirectory(dir, {
            dateFormat: values.format,
            doWrite: values.write === true,
            locale: values.locale,
            template: values.template,
            useModifiedTime: values.updated === true,
        });
        console.log(''); // Empty line between directories
    }
};

main();
