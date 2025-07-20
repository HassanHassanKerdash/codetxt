import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import ora from 'ora';
import { parseQuery } from './query-parser.js';
import { cloneRepo } from './clone.js';
import { ingestDirectory } from './ingestion.js';
import { formatOutput } from './output-formatter.js';
import type { CliOptions, IngestionQuery } from './types.js';
import { displaySuccessMessage } from './utils/display.js';

export async function main(source: string, options: CliOptions): Promise<void> {
  let query: IngestionQuery = parseQuery(source, options);
  const spinner = ora();

  try {
    if (query.isRemote) {
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codetxt-'));
      query.tempDir = tempDir;
      query.repoPath = tempDir;
      
      spinner.start(`Cloning repository from ${source}...`);
      await cloneRepo(query.source, query.repoPath, options.branch); // Pass URL, path and branch
      spinner.succeed('Repository cloned successfully.');
    }

    spinner.start(`Ingesting files from ${query.repoPath}...`);
    const rootNode = await ingestDirectory(query);
    spinner.succeed('Ingestion complete.');
    
    spinner.start('Formatting output and calculating tokens...');
    const { finalDigest, summary } = formatOutput(rootNode, query); // Get summary separately
    spinner.succeed('Output formatted.');
    
    const outputPath = options.output || 'code.txt';
    if (options.output === '-') {
      spinner.start('Printing to stdout...');
      process.stdout.write(finalDigest);
      spinner.succeed('Output sent to stdout.');
    } else {
      spinner.start(`Writing digest to ${outputPath}...`);
      await fs.writeFile(outputPath, finalDigest);
      spinner.succeed(); // Succeed without a message, as displaySuccessMessage will handle it
      // Use the new display function for the final message
      displaySuccessMessage(summary, outputPath);
    }

  } catch (error) {
    spinner.fail('An error occurred during the process.');
    // Re-throw to be caught by the main error handler
    throw error;
  } finally {
    if (query.tempDir) {
      // No spinner here, it's a background task.
      await fs.rm(query.tempDir, { recursive: true, force: true });
    }
  }
}