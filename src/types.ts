// Options parsed directly from the CLI
export interface CliOptions {
    output?: string;
    maxSize: string; // Commander provides it as a string
    branch?: string;
    includePattern?: string[];
    excludePattern?: string[];
    includeGitignored: boolean;
    token?: string;
  }
  
  // A structured representation of the user's request after parsing
  export interface IngestionQuery {
    isRemote: boolean;
    source: string;       // The original source string
    repoPath: string;     // The local path to process (either original or cloned)
    tempDir?: string;     // The temporary directory if cloned, for cleanup
    options: CliOptions;  // The original CLI options
  }
  
  // A node in the file system tree we build during ingestion
  export interface FileSystemNode {
    name: string;
    path: string; // Relative path
    type: 'file' | 'directory';
    children?: FileSystemNode[];
    content?: string;
    size: number;
  }