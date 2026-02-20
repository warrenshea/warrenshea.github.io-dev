import * as sass from 'sass';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const log = (label, status = 'Complete') => console.log(`${label.padEnd(20, ' ')}: ${status}`);

// Clean _dist directory
const clean = () => {
  if (fs.existsSync('./_dist')) {
    fs.rmSync('./_dist', { recursive: true, force: true });
  }
  log('Clean');
};

// Compile SCSS
const compile_sass = () => {
  const scss_dir = './_dev/stylesheets';
  const out_dir = './_dist/stylesheets';

  const compile_dir = (src, dest) => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    fs.readdirSync(src, { withFileTypes: true }).forEach(file => {
      const src_path = path.join(src, file.name);
      const dest_path = path.join(dest, file.name);

      if (file.isDirectory()) {
        if (!file.name.startsWith('_')) {
          compile_dir(src_path, dest_path);
        }
      } else if (file.name.endsWith('.scss')) {
        if (!file.name.startsWith('_')) {
          const result = sass.compile(src_path, { style: 'expanded' });
          fs.writeFileSync(dest_path.replace('.scss', '.css'), result.css);
        }
      } else {
        fs.copyFileSync(src_path, dest_path);
      }
    });
  };

  compile_dir(scss_dir, out_dir);
  log('SCSS Compilation');
};

// Copy JS files
const copy_js = () => {
  const js_dir = './_dev/scripts';
  const out_dir = './_dist/scripts';

  if (!fs.existsSync(out_dir)) fs.mkdirSync(out_dir, { recursive: true });

  const copy_dir = (src, dest) => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      const src_file = path.join(src, file);
      const dest_file = path.join(dest, file);
      if (fs.statSync(src_file).isDirectory()) {
        copy_dir(src_file, dest_file);
      } else {
        fs.copyFileSync(src_file, dest_file);
      }
    });
  };

  copy_dir(js_dir, out_dir);
  log('JS Files');
};

// Clean notes from dist
const clean_notes = () => {
  const notes_path = './_dist/notes';
  if (fs.existsSync(notes_path)) {
    fs.rmSync(notes_path, { recursive: true, force: true });
  }
  log('Clean Notes');
};

// Clean asset library
const clean_asset_library = () => {
  const paths = [
    './_dist/examples/font-awesome-5-icon-library/svgs',
    './_dist/assets/icon/light',
    './_dist/assets/icon/solid'
  ];

  paths.forEach(p => {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  });
  log('Clean Asset Library');
};

// Compile EJS files to HTML
const compile_ejs = async () => {
  const dev_dir = './_dev';
  const out_dir = './_dist';

  const render_ejs_files = async (src, dest) => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    fs.readdirSync(src, { withFileTypes: true }).forEach(async (file) => {
      const src_path = path.join(src, file.name);
      const dest_path = path.join(dest, file.name);

      if (file.isDirectory()) {
        // Skip _ prefixed directories and separately-handled directories
        if (file.name.startsWith('_') || ['stylesheets', 'scripts', 'assets', 'images'].includes(file.name)) {
          return;
        }
        await render_ejs_files(src_path, dest_path);
      } else if (file.name.endsWith('.ejs') && !file.name.startsWith('_')) {
        // Render EJS to HTML (skip files starting with _)
        try {
          const html = await ejs.renderFile(src_path, { 
            ...process.env,
            root: path.resolve('./_dev')
          });
          const html_path = dest_path.replace('.ejs', '.html');
          fs.writeFileSync(html_path, html);
          // console.log(`Compiled: ${src_path} -> ${html_path}`);
        } catch (error) {
          console.error(`Error compiling ${src_path}:`, error.message);
        }
      } else if (['.html', '.svg', '.json'].includes(path.extname(file.name))) {
        fs.copyFileSync(src_path, dest_path);
        // console.log(`Copied: ${src_path} -> ${dest_path}`);
      }
    });
  };

  await render_ejs_files(dev_dir, out_dir);
  log('EJS Compilation');
};

// Copy all files to parent repo
const copy_all_files = () => {
  try {
    const source = path.resolve('./_dist');
    const dest = path.resolve('../warrenshea.github.io');
    fs.cpSync(source, dest, { recursive: true });
    log('Copy to Repo');
  } catch (error) {
    console.error('Error copying files:', error.message);
  }
};

// Main build process
const build = async () => {
  try {
    clean();
    compile_sass();
    await compile_ejs();
    copy_js();
    clean_notes();
    clean_asset_library();
    copy_all_files();
    log('Build');
  } catch (error) {
    console.error('Build error:', error.message);
    process.exit(1);
  }
};

build();