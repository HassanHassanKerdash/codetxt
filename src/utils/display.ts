import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

/**
 * Displays the main welcome message for the CLI.
 */
export function displayWelcomeMessage(): void {
  const title = figlet.textSync('CodeTxt', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });
  console.log(chalk.cyan(title));
  console.log(chalk.blue.bold('  Turn any Git repository into a prompt-friendly text ingest for LLMs.'));
  console.log(''); // New line for spacing
}

/**
 * Displays the final success message with a summary inside a box.
 * @param digestSummary - The summary part of the digest.
 * @param outputPath - The path where the file was saved.
 */
export function displaySuccessMessage(digestSummary: string, outputPath: string): void {
  const summaryBox = boxen(digestSummary.replace('--- SUMMARY ---\n', ''), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    title: 'Digest Summary',
    titleAlignment: 'center',
  });

  console.log(summaryBox);
  console.log(chalk.green(`✔ Digest successfully written to ${chalk.bold(outputPath)}`));
}

/**
 * Displays a formatted error message.
 * @param error - The error object.
 */
export function displayError(error: Error): void {
    const errorBox = boxen(error.message, {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'red',
        title: 'An Error Occurred',
        titleAlignment: 'center',
      });
    
    console.error(errorBox);
}