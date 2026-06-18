import fs from 'fs/promises';
import path from 'path';
import ignore from 'ignore';
import type { Ignore } from 'ignore';
import { DEFAULT_IGNORE_PATTERNS } from './constants.js';

/**
 * A filter that supports nested `.gitignore` files with proper
 * path-relative semantics, matching Git's behavior.
 *
 * Maintains a stack of `{dir, Ignore}` pairs. When checking if a path
 * should be ignored, each filter on the stack is tested with the path
 * relative to that filter's directory — exactly how Git resolves
 * nested `.gitignore` rules.
 *
 * Usage:
 *   const filter = new NestedIgnoreFilter(rootPath);
 *   await filter.loadRootGitignore(rootPath);
 *   // … during traversal …
 *   await filter.pushGitignoreIfExists(someDir);
 *   // … process children of someDir …
 *   filter.pop();
 */
export class NestedIgnoreFilter {
  private filters: Array<{ dir: string; ig: Ignore }> = [];

  constructor(basePath: string) {
    const ig = ignore().add(DEFAULT_IGNORE_PATTERNS);
    this.filters.push({ dir: basePath, ig });
  }

  /**
   * Load the repository-root `.gitignore` file if it exists.
   * Must be called once after construction.
   */
  async loadRootGitignore(basePath: string): Promise<void> {
    const gitignorePath = path.join(basePath, '.gitignore');
    try {
      const content = await fs.readFile(gitignorePath, 'utf-8');
      this.filters[0].ig.add(content);
    } catch {
      // .gitignore not found — fine
    }
  }

  /**
   * If `dir` contains a `.gitignore` file, load its rules and push
   * a new filter onto the stack. Returns `true` when a filter was pushed.
   *
   * Call this **before** recursing into children of `dir`, and match
   * with a corresponding `pop()` afterwards.
   */
  async pushGitignoreIfExists(dir: string): Promise<boolean> {
    const gitignorePath = path.join(dir, '.gitignore');
    try {
      const stat = await fs.stat(gitignorePath);
      if (!stat.isFile()) return false;
      const content = await fs.readFile(gitignorePath, 'utf-8');
      if (!content.trim()) return false;
      const ig = ignore().add(content);
      this.filters.push({ dir, ig });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Pop the most recently pushed filter from the stack.
   * The root (default-patterns) filter is never removed.
   */
  pop(): void {
    if (this.filters.length > 1) {
      this.filters.pop();
    }
  }

  /**
   * Check whether `absolutePath` should be ignored.
   *
   * Every filter on the stack is consulted using the path relative to
   * that filter's own directory, so a pattern `generated/` in a nested
   * `.gitignore` only affects paths under that directory.
   */
  ignores(absolutePath: string): boolean {
    for (const { dir, ig } of this.filters) {
      const relPath = path.relative(dir, absolutePath).replace(/\\/g, '/');
      // Skip empty results — we never want to match the filter dir itself
      if (relPath && ig.ignores(relPath)) {
        return true;
      }
    }
    return false;
  }
}