import { Diagnostic } from '../core/diagnostic.js';
import chalk from 'chalk';

export class TerminalReporter {
  static report(diagnostics: Diagnostic[], rootPath: string, duration: number) {
    console.log(chalk.bold('\n--- RepoDoctor Analysis Report ---'));
    console.log(`Analyzing: ${rootPath}`);
    console.log(`Duration: ${duration}ms\n`);

    const grouped = {
      error: diagnostics.filter(d => d.severity === 'error'),
      warning: diagnostics.filter(d => d.severity === 'warning'),
      info: diagnostics.filter(d => d.severity === 'info'),
    };

    const printGroup = (title: string, items: Diagnostic[], color: any) => {
      if (items.length === 0) return;
      console.log(color.bold(`${title}s (${items.length})`));
      items.forEach(d => {
        const path = d.filePath ? `[${d.filePath}] ` : '';
        console.log(`  ${color('•')} ${path}${d.message}`);
        if (d.suggestion) {
          console.log(`    ${chalk.dim('Suggestion: ' + d.suggestion)}`);
        }
      });
      console.log('');
    };

    printGroup('Error', grouped.error, chalk.red);
    printGroup('Warning', grouped.warning, chalk.yellow);
    printGroup('Info', grouped.info, chalk.blue);

    const total = diagnostics.length;
    console.log(chalk.bold(`Summary: ${grouped.error.length} errors, ${grouped.warning.length} warnings, ${grouped.info.length} info.`));
    if (total === 0) {
      console.log(chalk.green('✔ No issues found!'));
    }
  }
}
