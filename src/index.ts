#!/usr/bin/env node

import { Command } from 'commander';
import { main } from './main.js';
import { displayWelcomeMessage, displayError } from './utils/display.js';
import type { CliOptions } from './types.js';

// Display the welcome message as soon as the CLI starts
displayWelcomeMessage();

const program = new Command();

program
  .name('codetxt')
  .description('Turn any Git repository into a prompt-friendly text ingest for LLMs.')
  .version('1.0.0');

program
  .argument('<source>', 'Repository URL or local directory path (e.g., ".")')
  .option('-o, --output <file>', "Output file path. Use '-' for stdout. Defaults to code.txt.")
  .option('-s, --max-size <bytes>', 'Maximum file size to process in bytes.', '10485760') // 10 MB
  .option('-b, --branch <name>', 'Branch to clone and ingest.')
  .option('--include-pattern <patterns...>', 'Shell-style patterns to include.')
  .option('--exclude-pattern <patterns...>', 'Shell-style patterns to exclude.')
  .option('--include-gitignored', 'Include files and directories matched by .gitignore.', false)
  .option('-t, --token <pat>', 'GitHub Personal Access Token (PAT). Reads GITHUB_TOKEN env var if not set.')
  .action(async (source: string, options: CliOptions) => {
    try {
      await main(source, options);
    } catch (error) {
      if (error instanceof Error) {
        // Use our new fancy error display
        displayError(error);
      } else {
        displayError(new Error('An unknown error occurred.'));
      }
      process.exit(1);
    }
  });

program.parse(process.argv);