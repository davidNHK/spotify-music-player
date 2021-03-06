import { expect } from '@jest/globals';
import path from 'path';

export function getCurrentTestPath() {
  const testPath: string = expect.getState().testPath!;
  return path.relative(process.cwd(), path.dirname(testPath));
}
