import { Rule, AnalysisContext, Diagnostic } from '../../core/rule-engine.js';
import { statSync } from 'node:fs';
import { join } from 'node:path';

export const LARGE_FILE_RULE: Rule = {
  metadata: {
    id: 'LARGE_FILE',
    name: 'Large File Check',
    description: 'Identifies files that exceed the maximum allowed size',
    category: 'files',
    defaultSeverity: 'warning',
  },
  async execute(context: AnalysisContext): Promise<Diagnostic[]> {
    const maxSizeMB = context.options.maxSizeMB || 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const diagnostics: Diagnostic[] = [];

    for (const file of context.files) {
      try {
        const stats = statSync(join(context.rootPath, file));
        if (stats.size > maxSizeBytes) {
          diagnostics.push({
            ruleId: 'LARGE_FILE',
            severity: 'warning',
            filePath: file,
            message: `File is too large: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (limit: ${maxSizeMB} MB).`,
            suggestion: 'Consider using Git LFS or removing the large file.',
          });
        }
      } catch (e) {
        // File might have been deleted
      }
    }
    return diagnostics;
  },
};
