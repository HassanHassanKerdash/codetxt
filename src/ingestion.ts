import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ignore from 'ignore';
import { createIgnoreFilter } from './utils/ignore-helper.js';
import { createPatternMatcher } from './utils/pattern-matcher.js';
import type { FileSystemNode, IngestionQuery } from './types.js';

export async function ingestDirectory(query: IngestionQuery): Promise<FileSystemNode> {
  const { repoPath, options } = query;
  
  const gitignoreFilter = options.includeGitignored ? ignore() : await createIgnoreFilter(repoPath);
  const includeMatcher = createPatternMatcher(options.includePattern);
  const excludeMatcher = createPatternMatcher(options.excludePattern);
  
  const maxSize = parseInt(options.maxSize, 10);

  async function walk(currentPath: string): Promise<FileSystemNode | null> {
    const relativePath = path.relative(repoPath, currentPath).replace(/\\/g, '/');

    if (relativePath) {
      if (gitignoreFilter.ignores(relativePath)) return null;
      if (excludeMatcher?.ignores(relativePath)) return null;
      // If include patterns are specified, a file MUST match one of them.
      // Directories are not filtered here to allow traversal.
      const stats = await fs.stat(currentPath);
      if (includeMatcher && stats.isFile() && !includeMatcher.ignores(relativePath)) {
          return null;
      }
    }

    const stats = await fs.stat(currentPath);
    const nodeName = path.basename(currentPath);

    if (stats.isDirectory()) {
      const childrenEntries = await fs.readdir(currentPath);
      const childrenNodes: FileSystemNode[] = [];
      
      for (const child of childrenEntries) {
        const childNode = await walk(path.join(currentPath, child));
        if (childNode) {
          childrenNodes.push(childNode);
        }
      }

      if (childrenNodes.length === 0) return null;

      return {
        name: nodeName,
        path: relativePath,
        type: 'directory',
        children: childrenNodes.sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          // Then alphabetically
          return a.name.localeCompare(b.name);
        }),
        size: childrenNodes.reduce((sum, child) => sum + child.size, 0)
      };
    } else if (stats.isFile()) {
      if (stats.size > maxSize) {
        console.warn(chalk.yellow(`Skipping large file: ${relativePath} (${stats.size} bytes)`));
        return null;
      }
      
      let content: string;
      try {
        content = await fs.readFile(currentPath, 'utf-8');
      } catch (e) {
        content = '[Binary file or unreadable content]';
      }

      return {
        name: nodeName,
        path: relativePath,
        type: 'file',
        content,
        size: stats.size,
      };
    }
    return null;
  }

  const rootNode = await walk(repoPath);
  if (!rootNode) throw new Error("The source directory is empty or all files were ignored.");
  rootNode.name = path.basename(query.source);
  return rootNode;
}