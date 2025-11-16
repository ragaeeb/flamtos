import { defineConfig } from 'tsdown/config';

export default defineConfig({
    banner: {
        js: '#!/usr/bin/env node\n',
    },
    clean: true,
    entry: ['src/index.ts'],
    external: ['cli-welcome', 'music-metadata'],
    format: 'esm',
    minify: true,
    outDir: 'dist',
    sourcemap: true,
    target: 'node22',
});
