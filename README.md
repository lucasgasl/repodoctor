# RepoDoctor

A professional CLI tool to analyze local software repositories for quality, documentation, and configuration issues.

## Introduction

RepoDoctor scans your local project directories to identify missing essential files, configuration smells, and potential security risks. It helps developers and maintainers ensure their repositories follow best practices for organization and documentation, making projects more accessible and professional.

The tool performs read-only analysis and provides actionable suggestions for each issue found.

## Features

### Documentation Checks
- **README**: Verifies the presence of a README file (common variations).
- **LICENSE**: Checks for a recognizable license file.

### Configuration & Quality
- **.gitignore**: Ensures a `.gitignore` file exists to prevent committing unnecessary files.
- **Large Files**: Identifies files exceeding a configurable size limit (default 2MB).

### Security
- **Possible Secrets**: Heuristic detection of potential API keys, tokens, or private keys.
  - *Note: This is a heuristic check and may produce false positives. It is not a replacement for professional security auditing tools.*

### Output & Integration
- **Multiple Formats**: Reports available in Terminal (colored), JSON, and Markdown.
- **CI Ready**: Returns stable exit codes to integrate with pipelines (fail on error/warning).
- **Customizable**: Support for ignoring specific directories and configuring rule thresholds.

## Requirements

- **Node.js**: LTS version (v18+ recommended)
- **npm**: Installed with Node.js

## Installation

As the package is not yet published to the npm registry, you can install and run it from source:

```bash
# Clone the repository
git clone https://github.com/[your-username]/repodoctor.git
cd repodoctor

# Install dependencies
npm install

# Build the project
npm run build

# Link the CLI globally for local testing
npm link
```

## Quick Start

### Analyze current directory
```bash
repodoctor check .
```

### Analyze a specific path
```bash
repodoctor check ./my-project
```

### Export as JSON
```bash
repodoctor check . --format json
```

### List all available rules
```bash
repodoctor rules
```

## Command Reference

| Command | Description | Options |
|---|---|---|
| `check <path>` | Analyzes the specified directory | `--format <terminal\|json\|markdown>`, `--max-file-size <MB>`, `--ignore <paths>`, `--fail-on <severity>` |
| `rules` | Lists all analysis rules | `--format <terminal\|json>` |
| `init` | Displays a sample configuration | (None) |

### Exit Codes
- `0`: No issues found or only issues below the failure threshold.
- `1`: Issues found that meet or exceed the failure threshold.
- `2`: Operational error (e.g., invalid path).

## Rule Reference

| ID | Category | Description | Default Severity |
|---|---|---|---|
| `README` | Documentation | Checks for README presence | Warning |
| `LICENSE` | Documentation | Checks for LICENSE presence | Info |
| `GITIGNORE` | Configuration | Checks for .gitignore presence | Error |
| `LARGE_FILE` | Files | Identifies files above size limit | Warning |
| `POSSIBLE_SECRET` | Security | Heuristic secret detection | Error |

## Architecture

RepoDoctor is built with a decoupled architecture for easy extensibility:
- **CLI**: Built with `commander` to handle user input and options.
- **Scanner**: Recursively traverses directories while respecting ignore patterns.
- **Rule Engine**: Orchestrates the execution of independent rule modules.
- **Diagnostics**: A standardized model (`ruleId`, `severity`, `message`, `suggestion`) used by all rules.
- **Reporters**: Pluggable output modules for different formats.

## Local Development

### Testing & Quality
```bash
# Run all tests
npm test

# Check types
npm run build # (tsup performs type checking)

# Format code
npm run format
```

### Building
```bash
npm run build
```

## Security & Privacy

- **Local Processing**: All analysis is performed locally. No data is sent to external services.
- **Read-Only**: The tool only reads files and does not modify any content in the analyzed repository.
- **Secret Handling**: When a possible secret is detected, the tool reports the file path and the pattern matched, but does not log the actual secret value.

## Limitations

- **Secret Detection**: Heuristic-based. It can miss some secrets or flag benign strings as secrets.
- **Config File**: The `init` command currently provides a template, but disk-based configuration loading is in the roadmap.

## Contributing

Contributions are welcome!
1. Fork the repository.
2. Create a feature branch.
3. Implement your rule or fix.
4. Add tests for your changes.
5. Submit a Pull Request with a clear description.

## License

Distributed under the MIT License. See `LICENSE` for more information.
