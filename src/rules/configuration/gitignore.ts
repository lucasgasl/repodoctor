import { Rule, AnalysisContext, Diagnostic } from '../../core/rule-engine.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const GITIGNORE_RULE: Rule = {
  metadata: {
    id: 'GITIGNORE',
    name: '.gitignore Check',
    description: 'Checks if the repository has a .gitignore file',
    category: 'configuration',
    defaultSeverity: 'error',
  },
  async execute(context: AnalysisContext): Promise<Diagnostic[]> {
    if (!existsSync(join(context.rootPath, '.gitignore'))) {
      return [{
        ruleId: 'GITIGNORE',
        severity: 'error',
        message: '.gitignore file is missing. This can lead to sensitive or unnecessary files being committed.',
        suggestion: 'Create a .gitignore file in the root directory.',
      }];
    }
    return [];
  },
};
