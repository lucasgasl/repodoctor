import { Diagnostic } from '../core/diagnostic.js';

export class JsonReporter {
  static report(diagnostics: Diagnostic[], rootPath: string, duration: number) {
    return JSON.stringify({
      version: '1.0.0',
      analyzedPath: rootPath,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      summary: {
        errors: diagnostics.filter(d => d.severity === 'error').length,
        warnings: diagnostics.filter(d => d.severity === 'warning').length,
        info: diagnostics.filter(d => d.severity === 'info').length,
      },
      diagnostics,
    }, null, 2);
  }
}
