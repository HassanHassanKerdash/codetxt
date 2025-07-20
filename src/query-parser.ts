import path from 'path';
import type { CliOptions, IngestionQuery } from './types.js';

export function parseQuery(source: string, options: CliOptions): IngestionQuery {
  const isRemote = source.startsWith('http://') || source.startsWith('https://');

  if (isRemote) {
    // For remote URLs, repoPath will be set later after cloning.
    return {
      isRemote: true,
      source,
      repoPath: '', // Will be a temp directory
      options,
    };
  } else {
    // For local paths, resolve it immediately.
    const repoPath = path.resolve(source);
    return {
      isRemote: false,
      source: repoPath,
      repoPath,
      options,
    };
  }
}