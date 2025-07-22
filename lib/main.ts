import os from "os";
import ora from "ora";
import path from "path";
import chalk from "chalk";
import fs from "fs/promises";
import inquirer from "inquirer";
import { ingestDirectory } from "./ingestion";
import { displaySuccessMessage } from "@/utils/display";
import type { CliOptions, IngestionQuery } from "./types";
import { formatOutput } from "./output-formatter";
import { parseQuery } from "./query-parser";
import { cloneRepo } from "./clone";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function main(source: string, options: CliOptions): Promise<void> {
  let query: IngestionQuery = parseQuery(source, options);
  const spinner = ora();

  try {
    if (query.isRemote) {
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "codetxt-"));
      query.tempDir = tempDir;
      query.repoPath = tempDir;

      spinner.start(`Cloning repository from ${source}...`);
      await cloneRepo(query.source, query.repoPath, options.branch);
      spinner.succeed("Repository cloned successfully.");
    }

    spinner.start(`Ingesting files from ${query.repoPath}...`);
    const rootNode = await ingestDirectory(query);
    spinner.succeed("Ingestion complete.");

    spinner.start("Formatting output and calculating tokens...");
    const { finalDigest, summary } = formatOutput(rootNode, query);
    spinner.succeed("Output formatted.");

    const outputPath = options.output || "code.txt";

    if (options.output === "-") {
      process.stdout.write(finalDigest);
      return;
    }

    const fileAlreadyExists = await fileExists(outputPath);
    let proceedToWrite = true;

    if (fileAlreadyExists && !options.force) {
      spinner.stop();

      const { confirmOverwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmOverwrite",
          message: `The file "${chalk.yellow(outputPath)}" already exists. Do you want to delete it and create a new one?`, // Updated message
          default: true,
        },
      ]);

      if (!confirmOverwrite) {
        proceedToWrite = false;
        console.log(chalk.red("\nOperation cancelled by user. Exiting."));
        process.exit(0);
      }
    }

    if (proceedToWrite) {
      spinner.start(`Preparing to write to ${outputPath}...`);

      try {
        if (fileAlreadyExists) {
          await fs.unlink(outputPath);
          spinner.text = `Old file "${outputPath}" deleted. Creating new file...`;
        }

        await fs.writeFile(outputPath, finalDigest, { encoding: "utf-8" });

        spinner.succeed();
        displaySuccessMessage(summary, outputPath);
      } catch (writeError) {
        spinner.fail(chalk.red(`Failed to write to file: ${outputPath}`));
        throw writeError;
      }
    }
  } catch (error) {
    if (spinner.isSpinning) {
      spinner.fail("An error occurred during the process.");
    }
    throw error;
  } finally {
    if (query.tempDir) {
      await fs.rm(query.tempDir, { recursive: true, force: true });
    }
  }
}
