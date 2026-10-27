import { Diagnostic } from '../core/diagnostic.js';

export class MarkdownReporter {
  static report(diagnostics: Diagnostic[], rootPath: string, duration: number) {
    let output = `# RepoDoctor Analysis Report\n\n`;
    output += `- **Analyzed Path:** ${rootPath}\n`;
    output += `- **Date:** ${new Date().toISOString()}\n`;
    output += `- **Duration:** ${duration}ms\n\n`;

    const grouped = {
      error: diagnostics.filter(d => d.severity === 'error'),
      warning: diagnostics.filter(d => d.severity === 'warning'),
      info: diagnostics.filter(d => d.severity === 'info'),
    };

    for (const [severity, items] of Object.entries(grouped)) {
      if (items.length === 0) continue;
      output += `## ${severity.toUpperCase()}s\n\n`;
      items.forEach(d => {
        output += `- **${d.filePath || 'General'}**: ${d.message}\n`;
        if (d.suggestion) output += `  - *Suggestion*: ${d.suggestion}\n`;
      });
      output += `\n`;
    }

    output += `### Summary\n- Errors: ${grouped.error.length}\n- Warnings: ${grouped.warning.length}\n- Info: ${grouped.info.length}\n`;

    return output;
  }
}
