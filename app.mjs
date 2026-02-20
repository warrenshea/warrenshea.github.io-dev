import express from 'express';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '_dev'));

// Serve static files
app.use(express.static(path.join(__dirname, '_dev')));

const silent_paths = [
  'favicon.ico',
  '.well-known/appspecific/com.chrome.devtools.json'
];

const handle_route = (req, res) => {
  const full_path = req.path.slice(1) || ''; // Remove leading slash
  const ext = path.extname(full_path); // Get file extension

  // If requesting a .html file, check if a .ejs counterpart exists and render it
  if (ext === '.html') {
    const ejs_path = path.join(__dirname, '_dev', full_path.replace(/\.html$/, '.ejs'));
    if (fs.existsSync(ejs_path)) {
      return ejs.renderFile(ejs_path, { query: req.query, root: path.join(__dirname, '_dev') }, (error, html) => {
        if (error) {
          console.error(`[500] Template render error: ${ejs_path}\n`, error.message);
          res.status(500).send('500 - Error Rendering Template');
        } else {
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(html);
        }
      });
    }
  }

  // If it's any other direct file request (non-.html), serve it as static
  if (ext) {
    return res.sendFile(path.join(__dirname, '_dev', full_path), (err) => {
      if (err) {
        if (!silent_paths.includes(full_path)) console.error(`[404] Static file not found: ${full_path}`);
        res.status(404).send('404 - File Not Found');
      }
    });
  }

  // Otherwise, treat as directory and look for index.ejs (served as index.html)
  const template_path = path.join(__dirname, '_dev', full_path, 'index.ejs');
  console.log(template_path);

  ejs.renderFile(template_path, { query: req.query, root: path.join(__dirname, '_dev') }, (error, html) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error(`[404] Template not found: ${template_path}`);
        res.status(404).send('404 - Template Not Found');
      } else {
        console.error(`[500] Template render error: ${template_path}\n`, error.message);
        res.status(500).send('500 - Error Rendering Template');
      }
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    }
  });
};

app.get('/', handle_route);
app.get(/^\/.*/, handle_route); // Use regex instead

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});