export interface CliOptions {
  output?: string;
  maxSize: string;
  branch?: string;
  includePattern?: string[];
  excludePattern?: string[];
  includeGitignored: boolean;
  token?: string;
  force: boolean;
}

export interface IngestionQuery {
  isRemote: boolean;
  source: string;
  repoPath: string;
  tempDir?: string;
  options: CliOptions;
  outputPath: string;
}

export interface FileSystemNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemNode[];
  content?: string;
  size: number;
}