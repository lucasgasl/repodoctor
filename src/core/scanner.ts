import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { AnalysisContext } from './rule-engine.js';

export class Scanner {
  static scan(rootPath: string, ignorePaths: string[] = []): string[] {
    const files: string[] = [];

    const traverse = (currentPath: string) => {
      const entries = readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentPath, entry.name);
        const relPath = relative(rootPath, fullPath);

        if (ignorePaths.some(ignore => relPath.startsWith(ignore))) {
          continue;
        }

        if (entry.isDirectory()) {
          traverse(fullPath);
        } else {
          files.push(relPath);
        }
      }
    };

    traverse(rootPath);
    return files;
  }
}
