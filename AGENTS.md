# flamtos Agent Guide

Welcome! This repository exposes a CLI plus a small helper library for renaming media files based on timestamp metadata.

## Project Layout
- `src/index.ts` wires the CLI entry point and re-exports the helper APIs for consumers.
- `src/core/` contains the heavier lifting logic (`processDirectory`, `fileProcessor`, etc.).
- `src/utils/` hosts leaf helpers (formatting, help text, date utilities) with colocated tests in `*.test.ts` files.
- The build output lives in `dist/` and is generated exclusively through tsdown (see Tooling below).
- Use the `@/` TypeScript path alias when importing across folders.

## Tooling & Commands
- **Build**: `bun run build` executes `tsdown --config tsdown.config.ts` and emits both JS and `.d.ts` files into `dist/`.
- **Tests**: `bun test` uses Bun's built-in test runner; add new suites under the closest `*.test.ts` module.
- **Formatting/Linting**: Run `bun run format` or `bun run lint` (Biome 2.3.5). Respect the configured 4-space indentation and single quotes.
- **Dependency updates**: Prefer `bun update --latest` to keep `bun.lock` in sync.

## Coding Conventions
- Every exported function should ship with an up-to-date JSDoc block that explains parameters, return values, and possible errors.
- Keep helper modules focused—avoid adding unrelated responsibilities to existing files; create new utilities when behavior grows.
- Tests should cover both the happy path and common edge cases (e.g., empty directories, invalid inputs) before touching integration code.
- Favor small, pure helpers over stateful globals; pass explicit dependencies to make unit testing straightforward.
- When editing CLI-facing strings (help text, README copy), ensure the README's API table stays synchronized.

Please keep this document updated if workflows or structure change.
