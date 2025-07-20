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
npm install -g .
```

This command needs to be run from the root of the project after cloning it. It will build the TypeScript code and link the `codetxt` command to your system.

#### Option 2: Install from npm registry
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

### Options

-   `-o, --output <file>`: Specify an output file. Use `-` to print to standard output (stdout). (Default: `code.txt`)
-   `-s, --max-size <bytes>`: Skip files larger than this size in bytes. (Default: 10MB)
-   `-b, --branch <name>`: For remote repos, specify a branch to clone.
-   `--include-gitignored`: Process files that are normally ignored by `.gitignore`.
-   `--include-pattern <patterns...>`: Shell-style patterns to include. Only files matching these patterns will be processed.
-   `--exclude-pattern <patterns...>`: Shell-style patterns to exclude. Files matching these patterns will be skipped.

### Examples

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
codetxt . --include-gitignored -o all-code.txt
```

### Advanced Pattern Filtering

The tool supports powerful glob-style pattern filtering for fine-grained control over which files to include or exclude.

#### Exclude Patterns

**Exclude a specific directory:**

```bash
codetxt . --exclude-pattern "docs/"
```

*Result: Will analyze project-A and project-B, but skip the docs directory entirely.*

**Exclude multiple directories:**

```bash
codetxt . --exclude-pattern "project-A/" --exclude-pattern "docs/"
```

*Result: Will analyze only project-B.*

#### Include Patterns

**Include only a specific directory and its contents:**

```bash
codetxt . --include-pattern "project-A/**"
```

*Result: Will analyze only the contents of project-A. project-B and docs will be ignored as they don't match the include pattern.*

**Include only JavaScript files:**

```bash
codetxt . --include-pattern "*.js"
```

*Result: Will automatically include project-A/index.js and ignore everything else.*

#### Important Notes on Include Logic

When using `--include-pattern`, the tool assumes you want nothing except what matches this pattern:

- **For files**: The filename must match the pattern
- **For directories**: We allow traversal into directories in hopes of finding matching files inside. However, if no matching files are found inside a directory, the directory won't appear in the final output tree

This gives you complete control over what gets analyzed in your local paths.

## How to Set Up for Development

1.  Clone this repository.
2.  Install dependencies: `npm install`
3.  Build the project: `npm run build`
4.  Run directly using `ts-node`: `npm start .`