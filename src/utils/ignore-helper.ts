import fs from 'fs/promises';
import path from 'path';
import ignore from 'ignore';
import type { Ignore } from 'ignore';

const DEFAULT_IGNORE = [
    // Git
    '.git',
    '.gitignore',
    '.gitattributes',
    '.gitmodules',
  
    // Package managers
    'node_modules/',
    'bower_components/',
    '.pnp/',
    '.pnp.js',
    '.npm/',
    '.yarn/',
    '.yarnrc.yml',
    '.rush/',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
  
    // Build tools and caches
    'dist/',
    'build/',
    'out/',
    'lib/',
    'es/',
    '.cache/',
    '.turbo/',
    '.nx/',
    '.changeset/',
    '.rollup.cache/',
    '.rpt2_cache/',
    '.esbuild/',
    '.vite/',
    '.docusaurus/',
    '.svelte-kit/',
    '.parcel-cache/',
    'lerna-debug.log',
  
    // JavaScript / TypeScript / Babel
    '*.tsbuildinfo',
    'tsconfig.tsbuildinfo',
    '.babelrc',
    '.babelrc.js',
    'babel.config.js',
  
    // Python
    '__pycache__/',
    '*.py[cod]',
    '*.pyo',
    '.mypy_cache/',
    '.pytest_cache/',
    '.venv/',
    'env/',
    'venv/',
  
    // PHP / Laravel
    'vendor/',
    '.phpunit.result.cache',
    'storage/*.key',
    '.env.testing',
    '.php_cs.cache',
    'composer.lock',
  
    // Ruby
    '.bundle/',
    'vendor/bundle/',
    'log/',
    'tmp/',
    '.ruby-version',
    '.rbenv-vars',
    'Gemfile.lock',
  
    // Java
    '*.class',
    '*.jar',
    '*.war',
    '*.ear',
    '.classpath',
    '.project',
    '.settings/',
    '.gradle/',
    'build/',
    'target/',
    '*.iml',
  
    // Kotlin / Android
    '*.apk',
    '*.aar',
    '.android/',
    'local.properties',
    '.idea/',
    '*.hprof',
  
    // Swift / Xcode / iOS
    'DerivedData/',
    '*.xcworkspace/',
    '*.xcodeproj/',
    '*.xcuserdata/',
    '*.xcuserstate',
    '*.hmap',
    '*.ipa',
    'Pods/',
    'Carthage/',
  
    // C / C++ / Rust
    '*.o',
    '*.obj',
    '*.exe',
    '*.dll',
    '*.so',
    '*.dylib',
    'target/',
    'Cargo.lock',
    'cmake-build*/',
    'build*/',
  
    // Go
    '*.test',
    '*.out',
    'bin/',
    'go.sum',
    'go.mod',
  
    // Dart / Flutter
    '.dart_tool/',
    '.flutter-plugins',
    '.flutter-plugins-dependencies',
    '.packages',
    'pubspec.lock',
    'build/',
    '.android/',
    '.ios/',
  
    // WebAssembly / AssemblyScript
    '*.wasm',
    'assembly/**/*.ts',
  
    // Configs / Dev settings
    '.editorconfig',
    '.npmrc',
    '.nvmrc',
    '.tool-versions',
    '.prettierrc*',
    '.stylelintrc*',
    '.eslintrc*',
    '.eslintcache',
    '.stylelintcache',
    '.prettierignore',
    '.vscode/',
    '.idea/',
    '*.sublime-*',
    '*.code-workspace',
    '.history/',
  
    // Test & coverage
    '.coverage',
    'coverage/',
    '.nyc_output/',
    'test-results/',
    'junit.xml',
    'reports/',
    'karma-coverage/',
    'coverage-final.json',
    '.mocharc.*',
  
    // CI/CD & deployment tools
    '.circleci/',
    '.github/',
    '.github/workflows/',
    '.gitlab-ci.yml',
    '.travis.yml',
    'Jenkinsfile',
    '.azure-pipelines.yml',
    'now.json',
    'vercel.json',
    '.vercel/',
    '.netlify/',
    'netlify.toml',
    '.replit/',
    '.codesandbox/',
    '.cloudflare/',
    '.codefresh/',
    '.buildkite/',
  
    // Container & Infrastructure
    'Dockerfile',
    'docker-compose.yml',
    '.dockerignore',
    '.devcontainer/',
    'Vagrantfile',
    '.vagrant/',
    '.terraform/',
    'docker-compose.override.yml',
  
    // Environment variables & secrets
    '.env',
    '.env.*',
    '.env.local',
    '.env.development',
    '.env.staging',
    '.env.production',
    '*.pem',
    '*.key',
    '*.crt',
    '*.cert',
    '*.p12',
    '*.jks',
    '*.keystore',
    '*.asc',
    '*.enc',
    '*.secrets.*',
    'secrets.*',
    '*.password',
  
    // Databases & local dev state
    '*.sqlite',
    '*.sqlite3',
    '*.db',
    '*.db3',
    '*.pid',
    '*.pid.lock',
    '*.seed',
    '*.dump',
    '*.log',
    'logs/',
    '*.sql',
    '*.bak',
  
    // OS and system files
    '.DS_Store',
    'Thumbs.db',
    'ehthumbs.db',
    'desktop.ini',
    'Icon\r',
    '.Trash-*',
    '~$*',
    '$RECYCLE.BIN/',
  
    // Backup, temp, lock, conflict, autosave
    '*~',
    '#*#',
    '.#*',
    '*.bak',
    '*.tmp',
    '*.temp',
    '*.swp',
    '*.swo',
    '*.old',
    '*.backup',
    '*.rej',
    '*.orig',
    '*.lock',
    '*.log.*',
    '*-backup.*',
  
    // Game development: Unity / Unreal / Godot
    'Library/',
    'Temp/',
    'Obj/',
    'Builds/',
    'Binaries/',
    'Intermediate/',
    '*.sln',
    '*.csproj',
    '*.user',
    '*.vcxproj',
    '*.uproject',
    '*.uasset',
    '*.umap',
    '.godot/',
    '.import/',
    '*.godot-imported',
  
    // Design files & assets
    '*.psd',
    '*.ai',
    '*.xd',
    '*.fig',
    '*.sketch',
    '*.xcf',
    '*.blend',
    '*.fbx',
    '*.glb',
    '*.svg~',
  
    // Archives and large files
    '*.zip',
    '*.tar.gz',
    '*.rar',
    '*.7z',
    '*.iso',
    '*.dmg',
    '*.gz',
    '*.tgz',
    '*.xz',
  
    // Documents & previews
    '*.html',
    '*.pdf',
    '*.docx',
    '*.pptx',
    '*.xlsx',
    '*.csv',
    '*.xls',
    '*.mdx',
    '*.doc',
    '*.ppt',
    '*.jsonl',
  
    // Static site generators
    'public/',
    'static/',
    '.vitepress/cache/',
    '.vuepress/dist/',
    'blog/.vuepress/dist/',
    '.astro/',
    'hugo_stats.json',
  ];
  

export async function createIgnoreFilter(basePath: string): Promise<Ignore> {
  const ig = ignore().add(DEFAULT_IGNORE);

  const gitignorePath = path.join(basePath, '.gitignore');
  try {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    ig.add(gitignoreContent);
  } catch {
    // .gitignore not found, which is fine
  }

  // You can extend this to find all .gitignore files recursively if needed
  // For now, we only check the root.

  return ig;
}