import ignore from "ignore";
import type { Ignore } from "ignore";

export function createPatternMatcher(patterns?: string[]): Ignore | null {
  if (!patterns || patterns.length === 0) {
    return null;
  }
  return ignore().add(patterns);
}
