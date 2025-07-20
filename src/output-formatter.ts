import { get_encoding } from 'tiktoken';
import chalk from 'chalk';
import path from 'path';
import type { FileSystemNode, IngestionQuery } from './types.js';

/**
 * Formats bytes into a human-readable string (KB, MB, GB).
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Creates a beautiful, tree-like string representation of the directory structure.
 */
function generateTreeString(node: FileSystemNode, prefix = '', isRoot = true): string {
    if (isRoot) {
        let rootTree = `${node.name}/\n`;
        if (node.children) {
            node.children.forEach((child, index) => {
                const isLast = index === node.children!.length - 1;
                rootTree += generateTreeString(child, '', false);
            });
        }
        return rootTree;
    }

    const connector = prefix.slice(0, -4) + (prefix.endsWith('    ') ? '└── ' : '├── ');
    let tree = `${connector}${node.name}${node.type === 'directory' ? '/' : ''}\n`;
    
    if (node.type === 'directory' && node.children) {
        node.children.forEach((child, index) => {
            const isLast = index === node.children!.length - 1;
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            tree += generateTreeString(child, newPrefix, false);
        });
    }
    return tree;
}

/**
 * Traverses the node tree to gather all file contents and statistics.
 */
function gatherContentsAndStats(node: FileSystemNode): { fileCount: number; totalSize: number; content: string } {
  let fileCount = 0;
  let totalSize = 0;
  let fullContentString = '';
  const separator = '='.repeat(60);

  function traverse(node: FileSystemNode) {
    if (node.type === 'file' && node.content) {
      fileCount++;
      totalSize += node.size;
      const filePath = node.path.replace(/\\/g, '/');
      fullContentString += `${separator}\nFILE: ${filePath}\n${separator}\n${node.content}\n\n`;
    } else if (node.type === 'directory' && node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(node);
  return { fileCount, totalSize, content: fullContentString.trim() };
}

/**
 * The main function to format the entire output digest.
 */
export function formatOutput(rootNode: FileSystemNode, query: IngestionQuery): { finalDigest: string; summary: string } {
  // 1. Preamble
  const preamble = `The following is a digest of the repository "${path.basename(query.source)}".\nThis digest is designed to be easily parsed by Large Language Models.\n`;

  // 2. Gather contents and stats
  const { fileCount, totalSize, content: fileContents } = gatherContentsAndStats(rootNode);

  // 3. Generate Directory Structure
  const directoryTree = `--- DIRECTORY STRUCTURE ---\n${generateTreeString(rootNode)}\n`;
  
  // 4. Generate Summary
  const encoding = get_encoding("cl100k_base");
  const fullTextForTokenizing = directoryTree + fileContents;
  const tokens = encoding.encode(fullTextForTokenizing).length;
  encoding.free();

  let summary = `--- SUMMARY ---\n`;
  summary += `Repository: ${path.basename(query.source)}\n`;
  if (query.options.branch) {
      summary += `Branch: ${query.options.branch}\n`;
  }
  summary += `Files Analyzed: ${fileCount}\n`;
  summary += `Total Size: ${formatBytes(totalSize)}\n`;
  summary += `Estimated Tokens: ~${tokens.toLocaleString()}\n`;

  // 5. Combine all parts into the final string
  const finalDigest = [
    preamble,
    summary,
    directoryTree,
    `--- FILE CONTENTS ---\n${fileContents}`
  ].join('\n');
  
  return { finalDigest, summary };
}