#!/usr/bin/env node
// src/index.ts
import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { main } from './main.js';
import { displayWelcomeMessage, displayError } from './utils/display.js';
import type { CliOptions } from './types.js';

// --- 🔍 Read version from package.json ---
function getPackageVersion(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

// --- 🧠 Define CLI ---
const program = new Command();

program
  .name('codetxt')
  .description('⚡ Convert any Git repo or directory into prompt-friendly text for LLMs.')
  .version(getPackageVersion(), '-V, --version', '📦 Output the current version.')
  .argument('[source]', '📁 Repository URL or local directory path.')
  .option('-o, --output <file>', "📤 Output file path. Use '-' for stdout. Defaults to code.txt.")
  .option('-s, --max-size <bytes>', '📐 Max file size to include (in bytes). Default: 10MB.', '10485760')
  .option('-b, --branch <name>', '🌿 Branch name to use when cloning a remote repository.')
  .option('--include-pattern <patterns...>', '✅ Glob patterns to include specific files/folders.')
  .option('--exclude-pattern <patterns...>', '❌ Glob patterns to exclude specific files/folders.')
  .option('--include-gitignored', '🫥 Include files even if they are listed in .gitignore.', false)
  .option('-t, --token <pat>', '🔐 GitHub Personal Access Token. (Env: GITHUB_TOKEN)')
  .option('-f, --force', ' overwrite existing output file without confirmation.', false)
  .action(async (source: string | undefined, options: CliOptions) => {
    if (!source) {
      displayWelcomeMessage();
      console.log('\n' + chalk.bgRed.white.bold(' ERROR ') + ' ' + chalk.red('Missing required argument: <source>\n'));
      console.log(chalk.gray('ℹ️  Please specify a repository URL or a local directory path.'));
      console.log();
      console.log(program.helpInformation());
      process.exit(1);
    }

    try {
      displayWelcomeMessage();
      await main(source, options);
    } catch (error) {
      displayError(error instanceof Error ? error : new Error('An unknown error occurred.'));
      process.exit(1);
    }
  });

// --- 🖼️ Custom Help UI ---
program.helpInformation = () => {
  const divider = chalk.gray('──────────────────────────────────────────────────────────────');
  const section = (emoji: string, title: string) =>
    `${emoji}  ${chalk.bold.hex('#00ADB5')(title.toUpperCase())}`;

  const help = [
    divider,
    section('🚀', 'Usage'),
    `  ${chalk.cyan('codetxt')} ${chalk.magenta('<source>')} ${chalk.green('[options]')}`,
    divider,
    section('📝', 'Description'),
    `  ${chalk.white(program.description())}`,
    divider,
    section('📦', 'Arguments'),
    `  ${chalk.magenta('<source>')}  ${chalk.gray('Git URL or local path to analyze (e.g., ".", "https://...")')}`,
    divider,
    section('⚙️', 'Options'),
    program.options.map(opt => {
      const flags = chalk.green(opt.flags.padEnd(32)); // Increased padding for alignment
      const description = chalk.white(opt.description);
      return `  ${flags}${description}`;
    }).join('\n'),
    divider,
    section('💡', 'Examples'),
    '',
    chalk.bold.white('  1. Basic Local & Remote Analysis'),
    `    ${chalk.gray('› Analyze the current directory and save to default "code.txt"')}`,
    `    ${chalk.cyan('$ codetxt .')}`,
    '',
    `    ${chalk.gray('› Analyze a remote repository (e.g., Express.js)')}`,
    `    ${chalk.cyan('$ codetxt https://github.com/expressjs/express')}`,
    '',
    `    ${chalk.gray('› Analyze a remote repository (e.g., React)')}`,
    `    ${chalk.cyan('$ codetxt https://github.com/facebook/react')}`,
    '',
    `    ${chalk.gray('› Analyze a specific local path')}`,
    `    ${chalk.cyan('$ codetxt /path/to/my/project')}`,
    '',
    chalk.bold.white('  2. Output Control'),
    `    ${chalk.gray('› Save the output to a custom file name')}`,
    `    ${chalk.cyan('$ codetxt . -o my_project_digest.txt')}`,
    '',
    `    ${chalk.gray('› Write to a specific file')}`,
    `    ${chalk.cyan('$ codetxt https://github.com/expressjs/express -o express-code.txt')}`,
    '',
    `    ${chalk.gray('› Print the output directly to the console (stdout)')}`,
    `    ${chalk.cyan('$ codetxt . -o -')}`,
    '',
    `    ${chalk.gray('› Pipe output to another command (e.g., grep)')}`,
    `    ${chalk.cyan('$ codetxt . -o - | grep "function"')}`,
    '',
    chalk.bold.white('  3. Filtering by Size and Branch'),
    `    ${chalk.gray('› Analyze a specific branch of a remote repository')}`,
    `    ${chalk.cyan('$ codetxt https://github.com/vuejs/core -b main')}`,
    '',
    `    ${chalk.gray('› Analyze a specific branch and ignore large files')}`,
    `    ${chalk.cyan('$ codetxt https://github.com/vuejs/core --branch main --max-size 50000')}`,
    '',
    `    ${chalk.gray('› Only include files smaller than 50 KB (51200 bytes)')}`,
    `    ${chalk.cyan('$ codetxt . -s 51200')}`,
    '',
    chalk.bold.white('  4. Advanced Pattern Matching'),
    `    ${chalk.gray('› Include ONLY TypeScript and Markdown files')}`,
    `    ${chalk.cyan('$ codetxt . --include-pattern "**/*.ts" --include-pattern "**/*.md"')}`,
    '',
    `    ${chalk.gray('› Include ONLY JavaScript and Markdown files')}`,
    `    ${chalk.cyan('$ codetxt . --include-pattern "**/*.js" --include-pattern "**/*.md"')}`,
    '',
    `    ${chalk.gray('› Include only a specific directory and its contents')}`,
    `    ${chalk.cyan('$ codetxt . --include-pattern "project-A/**"')}`,
    '',
    `    ${chalk.gray('› Exclude the "node_modules" and "dist" folders completely')}`,
    `    ${chalk.cyan('$ codetxt . --exclude-pattern "node_modules/" --exclude-pattern "dist/"')}`,
    '',
    `    ${chalk.gray('› Exclude a specific directory (e.g., docs/)')}`,
    `    ${chalk.cyan('$ codetxt . --exclude-pattern "docs/"')}`,
    '',
    `    ${chalk.gray('› Exclude multiple directories and file types')}`,
    `    ${chalk.cyan('$ codetxt . --exclude-pattern "project-A/" --exclude-pattern "tests/" --exclude-pattern "*.log"')}`,
    '',
    `    ${chalk.gray('› Include files that are normally ignored by .gitignore')}`,
    `    ${chalk.cyan('$ codetxt . --include-gitignored')}`,
    '',
    `    ${chalk.gray('› Include files normally ignored by .gitignore and write to a file')}`,
    `    ${chalk.cyan('$ codetxt . --include-gitignored -o all-files.txt')}`,
    '',
    chalk.bold.white('  5. Power User: Combining Options'),
    `    ${chalk.gray('› Analyze the "dev" branch of a private repo, including only files')}`,
    `    ${chalk.gray('› in the "src" folder smaller than 20KB, and pipe the output.')}`,
    `    ${chalk.cyan('$ codetxt https://github.com/private/repo -b dev -t $GITHUB_TOKEN --include-pattern "src/**" -s 20480 -o -')}`,
    '',
    chalk.bold.white('  6. Overwrite Output File'),
    `    ${chalk.gray('› Overwrite the output file without confirmation (force)')}`,
    `    ${chalk.cyan('$ codetxt . -o code.txt --force')}`,
    '',
    `    ${chalk.gray('› Or using the short flag')}`,
    `    ${chalk.cyan('$ codetxt . -o code.txt -f')}`,
    '',
    divider,
    section('ℹ️', 'Project Info'),
    '',
    `  ${chalk.cyan('📦 GitHub')}   → ${chalk.underline('https://github.com/HassanHassanKerdash/codetxt')}`,
    `  ${chalk.cyan('👤 Author')}   → ${chalk.white('Hassan Kerdash')}`,
    '',
    `  ${chalk.gray('🚀 Built with passion to help developers and AI collaborate smarter.')}`,
    divider,
  ];

  return help.join('\n');
};

// --- 🎯 Start CLI ---
program.parse(process.argv);