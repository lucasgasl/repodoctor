export type Severity = 'error' | 'warning' | 'info';

export interface Diagnostic {
  ruleId: string;
  severity: Severity;
  message: string;
  filePath?: string;
  line?: number;
  column?: number;
  suggestion?: string;
}
