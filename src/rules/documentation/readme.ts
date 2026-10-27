import { Rule, RuleMetadata, AnalysisContext, Diagnostic } from '../core/rule-engine.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const README_RULE: Rule = {
  metadata: {
    id: 'README',
    name: 'README Check',
    description: 'Checks if the repository has a README file',
    category: 'documentation',
    defaultSeverity: 'warning',
  },
  async execute(context: AnalysisContext): Promise<Diagnostic[]> {
    const commonNames = ['README.md', 'readme.md', 'README.txt', 'readme.txt'];
    const hasReadme = commonNames.some(name => existsSync(join(context.rootPath, name)));

    if (!hasReadme) {
      return [{
        ruleId: 'README',
        severity: 'warning',
        message: 'README file is missing. A README is essential for project documentation.',
        suggestion: 'Create a README.md file in the root directory.',
      }];
    }
    return [];
  },
};
