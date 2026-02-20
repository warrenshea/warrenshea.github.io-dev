import browserSync from 'browser-sync';

browserSync({
  proxy: 'localhost:3000',
  port: 3001,
  files: [
    '_dev/**/*.ejs',
    '_dev/**/*.css',
    '_dev/**/*.js',
    '_dev/**/*.html'
  ],
  open: true,
  notify: false,
  watchOptions: {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    }
  }
});