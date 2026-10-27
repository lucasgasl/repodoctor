import { Rule, AnalysisContext, Diagnostic } from '../../core/rule-engine.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const LICENSE_RULE: Rule = {
  metadata: {
    id: 'LICENSE',
    name: 'License Check',
    description: 'Checks if the repository has a LICENSE file',
    category: 'documentation',
    defaultSeverity: 'info',
  },
  async execute(context: AnalysisContext): Promise<Diagnostic[]> {
    const commonNames = ['LICENSE', 'license', 'LICENSE.md', 'LICENSE.txt'];
    const hasLicense = commonNames.some(name => existsSync(join(context.rootPath, name)));

    if (!hasLicense) {
      return [{
        ruleId: 'LICENSE',
        severity: 'info',
        message: 'LICENSE file is missing. Consider adding a license for open source projects.',
        suggestion: 'Add a LICENSE file to the root directory.',
      }];
    }
    return [];
  },
};
