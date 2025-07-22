import path from "path";
import chalk from "chalk";
import ignore from "ignore";
import fs from "fs/promises";
import type { FileSystemNode, IngestionQuery } from "./types";
import { createPatternMatcher } from "@/utils/pattern-matcher";
import { createIgnoreFilter } from "@/utils/ignore-helper";
import { BINARY_FILE_EXTENSIONS } from "@/utils/constants";

const CHUNK_SIZE_FOR_DETECTION = 1024;

function isLikelyBinary(buffer: Buffer): boolean {
  return buffer.includes(0);
}

export async function ingestDirectory(
  query: IngestionQuery
): Promise<FileSystemNode> {
  const { repoPath, options, outputPath } = query;

  const gitignoreFilter = options.includeGitignored
    ? ignore()
    : await createIgnoreFilter(repoPath);
  const includeMatcher = createPatternMatcher(options.includePattern);
  const excludeMatcher = createPatternMatcher(options.excludePattern);
  const maxSize = parseInt(options.maxSize, 10);

  // Resolve the output path to an absolute path to ensure accurate comparison.
  // This is important because the user might provide a relative path like './output.txt'.
  const absoluteOutputPath = path.resolve(outputPath);

  async function walk(currentPath: string): Promise<FileSystemNode | null> {
    // --- DYNAMIC OUTPUT FILE CHECK ---
    // Compare the absolute path of the current file with the absolute path of the output file.
    if (path.resolve(currentPath) === absoluteOutputPath) {
      return null; // Explicitly ignore the output file itself.
    }

    const relativePath = path
      .relative(repoPath, currentPath)
      .replace(/\\/g, "/");
    const stats = await fs.stat(currentPath);

    if (relativePath) {
      if (gitignoreFilter.ignores(relativePath)) return null;
      if (excludeMatcher?.ignores(relativePath)) return null;
      if (
        includeMatcher &&
        stats.isFile() &&
        !includeMatcher.ignores(relativePath)
      ) {
        return null;
      }
    }

    const nodeName = path.basename(currentPath);

    if (stats.isDirectory()) {
      const childrenEntries = await fs.readdir(currentPath);
      const childrenNodes: FileSystemNode[] = [];
      for (const child of childrenEntries) {
        const childNode = await walk(path.join(currentPath, child));
        if (childNode) childrenNodes.push(childNode);
      }
      if (childrenNodes.length === 0) return null;
      return {
        name: nodeName,
        path: relativePath,
        type: "directory",
        children: childrenNodes.sort((a, b) =>
          (a.type + a.name).localeCompare(b.type + b.name)
        ),
        size: childrenNodes.reduce((sum, child) => sum + child.size, 0),
      };
    } else if (stats.isFile()) {
      if (stats.size > maxSize) {
        console.warn(
          chalk.yellow(
            `Skipping large file: ${relativePath} (${stats.size} bytes)`
          )
        );
        return null;
      }

      const fileExtension = path.extname(nodeName).toLowerCase();

      if (BINARY_FILE_EXTENSIONS.has(fileExtension)) {
        return {
          name: nodeName,
          path: relativePath,
          type: "file",
          content: "[binary]",
          size: stats.size,
        };
      }

      let content: string;
      try {
        if (stats.size === 0) {
          content = "";
        } else {
          const fileHandle = await fs.open(currentPath, "r");
          const buffer = Buffer.alloc(
            Math.min(stats.size, CHUNK_SIZE_FOR_DETECTION)
          );
          await fileHandle.read(buffer, 0, buffer.length, 0);
          await fileHandle.close();

          if (isLikelyBinary(buffer)) {
            content = "[binary]";
          } else {
            content = await fs.readFile(currentPath, "utf-8");
          }
        }
      } catch (e) {
        content = "[unreadable]";
      }

      return {
        name: nodeName,
        path: relativePath,
        type: "file",
        content,
        size: stats.size,
      };
    }
    return null;
  }

  const rootNode = await walk(repoPath);
  if (!rootNode)
    throw new Error("The source directory is empty or all files were ignored.");
  rootNode.name = path.basename(query.source);
  return rootNode;
}
