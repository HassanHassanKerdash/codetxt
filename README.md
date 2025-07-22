# CodeTxt

A CLI tool to turn any Git repository into a prompt-friendly text ingest for LLMs.

Whether you're preparing codebases for AI analysis, training data, or static search indexing, CodeTxt helps you generate clean, filtered code dumps with ease.

## Installation

### Prerequisites

First, ensure you have Node.js (v18 or higher) installed on your system.

### Global Installation

You can install the CLI globally in one of two ways:

#### Option 1: Install from local project

```bash
# After cloning the repository
npm install -g .
```

This command needs to be run from the root of the project. It will build the TypeScript code and link the `codetxt` command to your system.

#### Option 2: Install from npm registry (when published)

```bash
npm install -g codetxt
```

After installation, you can use the `codetxt` command from anywhere in your terminal.

## Usage

The CLI is simple to use. You can point it to a remote Git repository or a local directory.

### From a Remote URL

```bash
codetxt https://github.com/facebook/react
```

### From a Local Directory

```bash
# Analyze the current directory
codetxt .

# Analyze a specific local path
codetxt /path/to/my/project
```

## Options

| Flag                       | Alias | Description                                                              | Default             |
| -------------------------- | ----- | ------------------------------------------------------------------------ | ------------------- |
| `--output <file>`          | `-o`  | Specify an output file. Use `-` for stdout.                              | `code.txt`          |
| `--max-size <bytes>`       | `-s`  | Skip files larger than this size in bytes.                               | `10MB`              |
| `--branch <name>`          | `-b`  | For remote repos, specify a branch to clone.                             | Default repo branch |
| `--include-pattern <glob>` |       | Only include files/directories matching the glob pattern(s).             | -                   |
| `--exclude-pattern <glob>` |       | Exclude files/directories matching the glob pattern(s).                  | -                   |
| `--include-gitignored`     |       | Process files and directories that are normally ignored by `.gitignore`. | `false`             |
| `--force`                  | `-f`  | Overwrite an existing output file without asking for confirmation.       | `false`             |
| `--token <pat>`            | `-t`  | GitHub Personal Access Token for private repositories.                   | -                   |

## Examples

### Basic Usage

**Write to a specific file:**

```bash
codetxt https://github.com/expressjs/express -o express-code.txt
```

**Pipe output to another command (e.g., `grep`):**

```bash
codetxt . -o - | grep "function"
```

**Analyze a specific branch and ignore large files:**

```bash
codetxt https://github.com/vuejs/core --branch main --max-size 50000
```

**Include files normally ignored by .gitignore:**

```bash
codetxt . --include-gitignored -o all-files.txt
```

### Advanced Pattern Filtering

The tool supports powerful glob-style pattern filtering for fine-grained control over which files to include or exclude. This is especially useful for monorepos or workspaces with multiple projects.

#### Exclude Patterns (`--exclude-pattern`)

Use this to skip specific files or entire directories.

**Exclude a specific directory (e.g., `docs/`):**

```bash
codetxt . --exclude-pattern "docs/"
```

_Result: Will analyze the entire project but skip the `docs` directory and all its contents._

**Exclude multiple directories and file types:**

```bash
codetxt . --exclude-pattern "project-A/" --exclude-pattern "tests/" --exclude-pattern "*.log"
```

_Result: Will skip `project-A`, the `tests` directory, and any file ending with `.log`._

#### Include Patterns (`--include-pattern`)

Use this to create a "whitelist" of what you want to analyze. Everything else will be ignored.

**Include only a specific directory and its contents:**

```bash
codetxt . --include-pattern "project-A/**"
```

_Result: Will analyze **only** the contents of `project-A`. All other files and directories will be ignored._

**Include only JavaScript and Markdown files from the entire project:**

```bash
codetxt . --include-pattern "**/*.js" --include-pattern "**/*.md"
```

_Result: The digest will only contain JavaScript and Markdown files._

#### Important Notes on Include Logic

When using `--include-pattern`, the tool assumes you want **nothing except** what matches the pattern:

- **For files**: The filename must match the pattern to be included.
- **For directories**: The tool will traverse all directories, but only those containing files that match the include pattern will appear in the final output tree.

This gives you complete control over what gets analyzed, which is perfect for focusing on specific parts of a large codebase.

## How to Set Up for Development

1.  Clone this repository.
2.  Install dependencies: `npm install`
3.  Build the project: `npm run build`
4.  Run directly using `ts-node`: `npm start .`
