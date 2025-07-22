import path from "path";
import type { CliOptions, IngestionQuery } from "./types";

export function parseQuery(
  source: string,
  options: CliOptions
): IngestionQuery {
  // Determine the final output path. If the user provides a relative path,
  // it will be resolved relative to the current working directory later.
  const outputPath = options.output || "code.txt";

  const isRemote =
    source.startsWith("http://") || source.startsWith("https://");

  if (isRemote) {
    return {
      isRemote: true,
      source,
      repoPath: "", // Will be a temp directory
      options,
      outputPath,
    };
  } else {
    const repoPath = path.resolve(source);
    return {
      isRemote: false,
      source: repoPath,
      repoPath,
      options,
      outputPath,
    };
  }
}
