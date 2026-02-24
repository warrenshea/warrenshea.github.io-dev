import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const EXTENSIONS = ['.scss'];
const EXCLUDE_DIRS = ['node_modules', '.git', '_dist'];

const results = new Map();

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
      if (!EXCLUDE_DIRS.some(excluded => relativePath === excluded || entry.name === excluded)) walkDir(fullPath);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Match CSS property declarations with rem values or rem-calc() calls
  const pattern = /^\s*([\w-]+)\s*:\s*([^;{}\n]*(?:\d*\.?\d+rem|rem-calc\([^)]+\))[^;{}\n]*)/gm;

  let match;
  while ((match = pattern.exec(content)) !== null) {
    const declaration = `${match[1]}: ${match[2].trim()}`;
    results.set(declaration, (results.get(declaration) || 0) + 1);
  }
}

walkDir(ROOT_DIR);

const sorted = [...results.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const maxCount = Math.max(...sorted.map(([, count]) => count));
const padWidth = String(maxCount).length;

const lines = sorted.map(([c, count]) => `${String(count).padStart(padWidth)}: ${c}`);
fs.writeFileSync('scripts/find-rem.txt', lines.join('\n'), 'utf8');
console.log(`Found ${sorted.length} unique rem declarations.`);
console.log('Results saved to scripts/find-rem.txt');
