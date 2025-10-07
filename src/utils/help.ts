import { DATE_FORMATS } from '@/types/index.js';

export const showHelp = (): void => {
    console.log(`
Usage: flamtos [options] <directory> [<directory2> ...]

Rename files in directories based on their creation or modification date.

Options:
  --help                  Show this help message
  --write                 Actually rename the files (default: dry run)
  --created               Use file creation date (default)
  --updated               Use file modification date instead of creation date
  --format <format>       Date format to use (default: MMDDYY)
  --locale <locale>       Locale to use for date formatting (default: en-US)
  --template <template>   Template for output filename (default: {name}_{date}{ext})

Template variables:
  {name}                  Original filename without extension
  {date}                  Formatted date according to --format
  {ext}                   File extension including the dot

Available date formats:
${Object.entries(DATE_FORMATS)
    .map(([key, { description, example }]) => `  ${key.padEnd(20)} ${example.padEnd(20)} ${description}`)
    .join('\n')}

Examples:
  flamtos ./my_music_files                             Dry run on directory using defaults
  flamtos --write --template "{date}_{name}{ext}" ./   Date first, then original name
  flamtos --template "{date}/{name}{ext}" --write ./   Organize into date-named folders
  flamtos --format YYYY_MM_DD ./videos                 Use ISO-like date format
`);
};
