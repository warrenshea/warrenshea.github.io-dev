import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const EXTENSIONS = ['.ejs', '.html', '.njk'];
const EXCLUDE_DIRS = ['node_modules', '.git', '_dist', '_dev/notes'];

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
//   console.log(filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Match classes with colons in:
  // - HTML class attributes: class="foo bar:baz"
  // - SCSS/CSS: .foo:bar { or .foo:bar,
  const patterns = [
    /(?<![a-zA-Z-])class="(?=[^"]*:)([^"]+)"/g,           // HTML class attributes (double quotes)
    /(?<![a-zA-Z-])class='(?=[^']*:)([^']+)'/g,           // HTML class attributes (single quotes)
    /\.([\w-]+:[\w:%-]+)/g,                      // SCSS/CSS class selectors
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      match[1].split(/\s+/).filter(c => c.includes(':')).forEach(c => results.set(c, (results.get(c) || 0) + 1));
    }
  }
}

walkDir(ROOT_DIR);

const sorted = [...results.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const maxCount = Math.max(...sorted.map(([, count]) => count));
const padWidth = String(maxCount).length;

// console.log(`Found ${sorted.length} unique classes with colons:\n`);
// sorted.forEach(([c, count]) => console.log(`${String(count).padStart(padWidth)}: ${c}`));

// Optionally write to a file
const lines = sorted.map(([c, count]) => `${String(count).padStart(padWidth)}: ${c}`);
fs.writeFileSync('scripts/find-css-classes.txt', lines.join('\n'), 'utf8');
console.log('\nResults saved to scripts/find-css-classes.txt');