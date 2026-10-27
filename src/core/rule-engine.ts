import { Rule, AnalysisContext, Diagnostic } from './rule-engine.js';

export class RuleEngine {
  private rules: Rule[] = [];

  registerRule(rule: Rule) {
    this.rules.push(rule);
  }

  async run(context: AnalysisContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];
    for (const rule of this.rules) {
      try {
        const result = await rule.execute(context);
        diagnostics.push(...result);
      } catch (error) {
        console.error(`Error executing rule ${rule.metadata.id}:`, error);
      }
    }
    return diagnostics;
  }

  getRegisteredRules() {
    return this.rules.map(r => r.metadata);
  }
}
