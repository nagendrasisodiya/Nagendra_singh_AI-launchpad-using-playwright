import fs from 'fs';
import path from 'path';

export function loadJsonData<T>(relativePath: string): T {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(fileContent) as T;
}

