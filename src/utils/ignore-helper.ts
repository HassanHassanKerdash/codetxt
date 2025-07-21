import fs from 'fs/promises';
import path from 'path';
import ignore from 'ignore';
import type { Ignore } from 'ignore';
import { DEFAULT_IGNORE_PATTERNS } from './constants.js';

export async function createIgnoreFilter(basePath: string): Promise<Ignore> {
  // Start with our hardcoded default patterns
  const ig = ignore().add(DEFAULT_IGNORE_PATTERNS);
  
  const gitignorePath = path.join(basePath, '.gitignore');
  try {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    ig.add(gitignoreContent);
  } catch {
    // .gitignore not found, which is fine
  }
  
  return ig;
}