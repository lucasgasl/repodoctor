import { Command } from 'commander';
import { Scanner } from '../core/scanner.js';
import { RuleEngine } from '../core/rule-engine.js';
import { README_RULE } from '../rules/documentation/readme.js';
import { LICENSE_RULE } from '../rules/documentation/license.js';
import { GITIGNORE_RULE } from '../rules/configuration/gitignore.js';
import { LARGE_FILE_RULE } from '../rules/files/large-file.js';
import { POSSIBLE_SECRET_RULE } from '../rules/security/secrets.js';
import { TerminalReporter } from '../reporters/terminal-reporter.js';
import { JsonReporter } from '../reporters/json-reporter.js';
import { MarkdownReporter } from '../reporters/markdown-reporter.js';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const program = new Command();

program
  .name('repodoctor')
  .description('CLI tool to analyze software repositories for quality and configuration issues')
  .version('1.0.0');

program
  .command('check <path>')
  .description('Analyze a repository at the given path')
  .option('-f, --format <format>', 'Output format (terminal, json, markdown)', 'terminal')
  .option('--max-file-size <size>', 'Max file size in MB', '2')
  .option('--ignore <paths>', 'Comma-separated list of paths to ignore', 'node_modules,dist,coverage')
  .option('--fail-on <severity>', 'Fail the command if issues of this severity or higher are found', 'error')
  .action(async (path, options) => {
    const rootPath = resolve(path);
    if (!existsSync(rootPath)) {
      console.error(`Error: Path ${rootPath} does not exist.`);
      process.exit(2);
    }

    const startTime = Date.now();
    const ignorePaths = options.ignore.split(',');

    const files = Scanner.scan(rootPath, ignorePaths);
    const engine = new RuleEngine();

    // Register all rules
    engine.registerRule(README_RULE);
    engine.registerRule(LICENSE_RULE);
    engine.registerRule(GITIGNORE_RULE);
    engine.registerRule(LARGE_FILE_RULE);
    engine.registerRule(POSSIBLE_SECRET_RULE);

    const context = {
      rootPath,
      files,
      options: {
        maxSizeMB: parseFloat(options.maxFileSize),
      },
      config: {},
    };

    const diagnostics = await engine.run(context);
    const duration = Date.now() - startTime;

    if (options.format === 'json') {
      console.log(JsonReporter.report(diagnostics, rootPath, duration));
    } else if (options.format === 'markdown') {
      console.log(MarkdownReporter.report(diagnostics, rootPath, duration));
    } else {
      TerminalReporter.report(diagnostics, rootPath, duration);
    }

    // Exit code logic
    const severities: Record<string, number> = { 'info': 0, 'warning': 1, 'error': 2 };
    const failThreshold = severities[options.failOn] || 2;
    const hasBlockingIssue = diagnostics.some(d => severities[d.severity] >= failThreshold);

    process.exit(hasBlockingIssue ? 1 : 0);
  });

program
  .command('rules')
  .description('List all available analysis rules')
  .option('-f, --format <format>', 'Output format (terminal, json)', 'terminal')
  .action((options) => {
    const engine = new RuleEngine();
    engine.registerRule(README_RULE);
    engine.registerRule(LICENSE_RULE);
    engine.registerRule(GITIGNORE_RULE);
    engine.registerRule(LARGE_FILE_RULE);
    engine.registerRule(POSSIBLE_SECRET_RULE);

    const rules = engine.getRegisteredRules();
    if (options.format === 'json') {
      console.log(JSON.stringify(rules, null, 2));
    } else {
      console.log('Available Rules:');
      rules.forEach(r => {
        console.log(`- ${r.id}: ${r.name} (${r.category}) - ${r.description} [${r.defaultSeverity}]`);
      });
    }
  });

program
  .command('init')
  .description('Initialize a default repodoctor.json configuration file')
  .action(() => {
    const defaultConfig = {
      rules: {
        README: 'warning',
        LICENSE: 'info',
        GITIGNORE: 'error',
        LARGE_FILE: ['warning', { maxSizeMB: 5 }],
        POSSIBLE_SECRET: 'error',
      },
      ignore: ['node_modules', 'dist', 'coverage'],
    };
    
    // For now, we just print it since we don't have the safe-write utility yet
    console.log('Suggested repodoctor.json:');
    console.log(JSON.stringify(defaultConfig, null, 2));
  });

program.parse();
