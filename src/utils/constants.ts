/**
 * A blacklist of common binary file extensions.
 * Files with these extensions are immediately classified as binary without reading content.
 * This is a fast path to avoid content sniffing for common binary types.
 */
export const BINARY_FILE_EXTENSIONS = new Set([
    // == Images ==
    '.png', '.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.bmp', '.dib', '.tiff', '.tif', '.webp', '.ico', '.cur',
    '.psd', '.xcf', '.ai', '.eps', '.svgz', '.indd', '.sketch', '.raw', '.cr2', '.nef', '.orf', '.sr2', '.raf', '.arw',

    // == Video ==
    '.mp4', '.mkv', '.mov', '.avi', '.wmv', '.flv', '.webm', '.3gp', '.3g2', '.m4v', '.mpg', '.mpeg', '.mp2', '.mts',
    '.ts', '.m2ts', '.rm', '.rmvb', '.vob', '.ogv', '.asf', '.amv', '.f4v', '.bik', '.drc', '.nsv',

    // == Audio ==
    '.mp3', '.wav', '.ogg', '.oga', '.flac', '.aac', '.m4a', '.wma', '.alac', '.aiff', '.au', '.mid', '.midi', '.amr', '.ra',
    '.opus', '.voc', '.snd', '.mod', '.xm', '.it', '.s3m',

    // == Fonts ==
    '.ttf', '.otf', '.woff', '.woff2', '.eot', '.fnt', '.fon', '.pfb', '.pfm', '.pfa', '.afm',

    // == Archives and Compression ==
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.lz', '.lzma', '.z', '.cab', '.arj', '.ace', '.sit', '.tgz', '.tbz2', '.txz', '.tar.gz', '.tar.bz2', '.tar.xz',
    '.uue', '.uu', '.cpgz', '.hqx', '.sea', '.arc', '.pak', '.apk', '.aab', '.xpi', '.crx',

    // == Documents (Binary or semi-binary) ==
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.vsd', '.pub', '.rtf', '.odt', '.ods', '.odp', '.djvu', '.pages', '.key', '.numbers',

    // == Executables and Libraries ==
    '.exe', '.dll', '.so', '.o', '.obj', '.a', '.lib', '.dylib', '.apk', '.bin', '.out', '.app', '.sys', '.msi', '.com', '.bat', '.cmd', '.scr', '.pif', '.jar', '.war', '.ear',
    '.pyc', '.pyd', '.nexe', '.dex', '.iso', '.img', '.elf', '.class',

    // == Disk Images, Backups, Virtual Disks ==
    '.iso', '.dmg', '.img', '.vdi', '.vmdk', '.vhd', '.vhdx', '.qcow2', '.sparseimage', '.toast', '.nrg', '.mdf', '.bin', '.cue', '.cdi',

    // == Databases and Data Files ==
    '.db', '.sqlite', '.sqlite3', '.db3', '.mdb', '.accdb', '.ndf', '.ldf', '.frm', '.ibd', '.myd', '.myi', '.parquet', '.feather', '.arrow', '.hdf5', '.h5', '.bson',
    '.dta', '.sav', '.sas7bdat', '.xpt', '.mat', '.fdb', '.gdb', '.tdb', '.cdb', '.pdb',

    // == Cache, Logs, Lock Files ==
    '.lock', '.log', '.bak', '.tmp', '.cache', '.swap', '.mem', '.dmp', '.core', '.out', '.trace',

    // == Games and Emulators ==
    '.sav', '.rom', '.nds', '.gba', '.gb', '.gci', '.srm', '.psv', '.bin', '.rpf', '.dat', '.pak', '.wad', '.wad2', '.wad3', '.bsp', '.vpk', '.arc', '.psarc',

    // == CAD, 3D Models, AR/VR ==
    '.stl', '.obj', '.fbx', '.dae', '.3ds', '.blend', '.max', '.c4d', '.glb', '.gltf', '.lwo', '.skp', '.igs', '.step', '.stp',

    // == Scientific and Technical ==
    '.h5', '.hdf', '.grib', '.nc', '.npz', '.npy', '.mat', '.sav', '.dcm', '.nii', '.mhd', '.img', '.hdr',

    // == Medical Imaging ==
    '.dcm', '.nii', '.ima', '.mhd', '.nrrd',

    // == Machine Learning, AI Models, Training Data ==
    '.pt', '.pth', '.ckpt', '.tflite', '.pb', '.onnx', '.joblib', '.pkl', '.sav', '.model', '.bin', '.weights',

    // == Certificates, Keys, Secure Files ==
    '.p12', '.pfx', '.cer', '.crt', '.key', '.pem', '.der', '.csr', '.jks', '.keystore', '.asc', '.gpg',

    // == Plugin / Extension Binaries ==
    '.vst', '.vst3', '.component', '.aax', '.dll', '.lv2', '.plugin', '.nks',

    // == Flash and Legacy Web ==
    '.swf', '.fla', '.flv', '.xap', '.cab',

    // == Map, GIS, and Navigation ==
    '.shp', '.shx', '.dbf', '.gdb', '.mxd', '.kml', '.kmz', '.osm', '.dem', '.sid', '.tpk',

    // == Miscellaneous ==
    '.enc', '.dat', '.res', '.cso', '.pkg', '.crdownload', '.part', '.swp', '.psb', '.xmind', '.sparsebundle',
    '.bbl', '.bblx', '.bblt', '.bbx', '.idx', '.toc', '.aux',

    // == Email & Office Internal ==
    '.pst', '.ost', '.eml', '.msg',

    // == Streaming and Media Index ==
    '.m3u', '.m3u8', '.pls', '.cue', '.asx',

    // == Digital Publishing ==
    '.epub', '.mobi', '.azw', '.azw3', '.kfx',

    // == Proprietary Formats ==
    '.sketch', '.fig', '.xd', '.drawio', '.visio', '.onepkg', '.one', '.note', '.snp',
]);

/**
 * Default patterns to ignore, such as version control directories and dependencies.
 */
export const DEFAULT_IGNORE_PATTERNS = [
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