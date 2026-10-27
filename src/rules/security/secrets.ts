import { Rule, AnalysisContext, Diagnostic } from '../../core/rule-engine.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const POSSIBLE_SECRET_RULE: Rule = {
  metadata: {
    id: 'POSSIBLE_SECRET',
    name: 'Possible Secret Detection',
    description: 'Identifies potential secrets like API keys or tokens',
    category: 'security',
    defaultSeverity: 'error',
  },
  async execute(context: AnalysisContext): Promise<Diagnostic[]> {
    const secretsPatterns = [
      { id: 'GENERIC_SECRET', regex: /(?:key|secret|token|password|auth|pwd)["']?\s*[:=]\s*["']([a-zA-Z0-9_\-]{16,})["']/gi },
      { id: 'PRIVATE_KEY', regex: /-----BEGIN\s+RSA\s+PRIVATE\s+KEY-----/g },
    ];
    const diagnostics: Diagnostic[] = [];

    for (const file of context.files) {
      // Basic filter to avoid binary files and huge files
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.exe')) continue;

      try {
        const content = readFileSync(join(context.rootPath, file), 'utf8');
        for (const pattern of secretsPatterns) {
          if (pattern.regex.test(content)) {
            diagnostics.push({
              ruleId: 'POSSIBLE_SECRET',
              severity: 'error',
              filePath: file,
              message: `Possible secret detected (pattern: ${pattern.id}).`,
              suggestion: 'Remove the secret and use environment variables or a secret manager.',
            });
            break; // Only one secret per file for simplicity
          }
        }
      } catch (e) {
        // Read error
      }
    }
    return diagnostics;
  },
};
