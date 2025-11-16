# flamtos

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/768b1cff-d2bb-40e8-ae88-17b6d0edea89.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/768b1cff-d2bb-40e8-ae88-17b6d0edea89)
[![codecov](https://codecov.io/gh/ragaeeb/flamtos/graph/badge.svg?token=EENNAX5OJR)](https://codecov.io/gh/ragaeeb/flamtos)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/ragaeeb/flamtos?utm_source=oss&utm_medium=github&utm_campaign=ragaeeb%2Fflamtos&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Node.js CI](https://github.com/ragaeeb/flamtos/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/flamtos/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/flamtos)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/flamtos)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)

A flexible CLI tool for renaming files based on their creation or modification date.

## Features

- Rename media files based on creation or modification date with a single command.
- Use one of nine built-in date formatting presets or supply your own locale for localized month names.
- Apply rich filename templates that support subdirectory creation and repeated variables.
- Preview changes with a dry-run mode before committing to disk writes.
- Programmatically access the renaming pipeline through exported helpers for custom workflows.
- Bundled with a lightweight `tsdown` build pipeline that outputs ready-to-publish ESM and declaration files.

## Installation

```bash
# Clone the repository
git clone https://github.com/ragaeeb/flamtos.git
cd flamtos

# Install dependencies
bun install

# Link the command globally (optional)
```

## Usage

```bash
npm install -g flamtos
```

Or

```bash
npx flamtos
```

Or

```bash
bunx flamtos
```

```bash
flamtos [options] <directory> [<directory2> ...]
```

### Options

- `--help` - Show help message
- `--write` - Actually rename the files (default: dry run)
- `--created` - Use file creation date (default)
- `--updated` - Use file modification date instead of creation date
- `--format <format>` - Date format to use (default: MMDDYY)
- `--locale <locale>` - Locale to use for date formatting (default: en-US)
- `--template <template>` - Template for output filename (default: {name}\_{date}{ext})

### Template Variables

- `{name}` - Original filename without extension
- `{date}` - Formatted date according to --format
- `{ext}` - File extension including the dot

### Available Date Formats

| Format       | Example         | Description                      |
| ------------ | --------------- | -------------------------------- |
| MMDDYY       | 011524          | Month-Day-Year (2 digits each)   |
| DDMMYY       | 150124          | Day-Month-Year (2 digits each)   |
| YYMMDD       | 240115          | Year-Month-Day (2 digits each)   |
| YYYYMMDD     | 20240115        | Full Year-Month-Day              |
| MMM_DD_YYYY  | Jan_15_2024     | Abbreviated month name           |
| MMMM_DD_YYYY | January_15_2024 | Full month name                  |
| YYYY_MM_DD   | 2024_01_15      | ISO-like format with underscores |
| DD_MMM_YYYY  | 15_Jan_2024     | Day with abbreviated month       |
| DD_MMMM_YYYY | 15_January_2024 | Day with full month              |

## Examples

### Dry Run with Default Settings

```bash
flamtos ./photos
```

This will show what files would be renamed without actually changing anything.

### Rename with Date First

```bash
flamtos --write --template "{date}_{name}{ext}" ./music
```

Renames files with date before the original name (e.g., `011524_song.mp3`).

### Use ISO-like Format

```bash
flamtos --format YYYY_MM_DD ./videos
```

Use four-digit year format (e.g., `video_2024_01_15.mp4`).

### Organize into Date-based Folders

```bash
flamtos --template "{date}/{name}{ext}" --write ./photos
```

Creates subdirectories named by date and moves files into them.

### Use Different Locale for Month Names

```bash
flamtos --format MMMM_DD_YYYY --locale fr-FR ./documents
```

Uses French month names (e.g., `document_janvier_15_2024.pdf`).

## Development

### Project Structure

```
src/
├── core/
│   ├── fileProcessor.ts     # Handles individual file processing
│   └── processDirectory.ts  # Processes all files in a directory
├── types/
│   └── index.ts             # Shared types and constants
├── utils/
│   ├── date.ts              # Date formatting utilities
│   ├── help.ts              # Help message display
│   └── template.ts          # Template processing functions
└── index.ts                 # Main entry point
```

## Library API

In addition to the CLI, `flamtos` exposes several utilities for scripting scenarios:

- `processDirectory(dir, options, overrides?)` &rarr; Traverse a directory, rename eligible files, and return a detailed summary.
- `processFile(dir, file, options)` &rarr; Generate the renamed filename for a single file and optionally write it.
- `formatDate(date, format, locale)` &rarr; Convert dates into one of the supported presets.
- `applyTemplate(template, vars)` &rarr; Interpolate template variables into a target filename.
- `showHelp()` &rarr; Print the CLI usage guide.

All related TypeScript interfaces (`ProcessOptions`, `DirectorySummary`, `FileSummary`, `TemplateVars`, and `DateFormat`) are exported from the package for convenience.

### Running Tests

```bash
# Run unit tests
bun test

# Build distributable output with tsdown
bun run build
```
