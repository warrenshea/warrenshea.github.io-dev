'use strict';
require('dotenv').config();
const gulp = require('gulp');
const util = require('util');

//CSS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');

//JavaScript
const uglify = require('gulp-uglify');

//Helpers
const harp = require('harp');
const child = require('child_process');
const exec = util.promisify(child.exec);
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const argv = require('yargs').argv;
const del = require('del');

const browserSyncReload = (done) => {
  reload();
};

const clean = (done) => {
  if (process.env.NODE_ENV === 'production') {
    return del(['_dist/*', '_dist/**/*']);
  } else {
    done();
  }
};

const css = (done) => {
  let plugins = [autoprefixer({ browserlist: ['last 2 version', 'ie 11'] })];
  if (process.env.NODE_ENV === 'development') {
    return (
      gulp
        .src(['./_dev/stylesheets/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        /*.pipe(cleanCSS({
        //Remove comments and minify
        level: {
          1: {specialComments: 0}
        }}))*/
        .pipe(gulp.dest('./_dev/stylesheets'))
        .pipe(reload({ stream: true }))
    );
  } else {
    return (
      gulp
        .src(['./_dev/stylesheets/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        //.pipe(postcss(plugins))
        /*.pipe(autoprefixer('last 2 version', 'IE 11'))
      .pipe(cleanCSS({
        //Remove comments and minify
        level: {
          1: {specialComments: 0}
        }}))*/
        .pipe(gulp.dest('./_dist/stylesheets'))
    );
  }
};

const clean_notes = (done) => {
  if (process.env.NODE_ENV === 'production') {
    return del(['_dist/notes*']);
  } else {
    done();
  }
};

const clean_asset_library = (done) => {
  if (process.env.NODE_ENV === 'production') {
    return del(['_dist/examples/font-awesome-5-icon-library/svgs*', '_dist/assets/icon/light*', '_dist/assets/icon/solid*']);
  } else {
    done();
  }
};

const js = (done) => {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src(['./_dev/scripts/**/*.js']).pipe(reload({ stream: true }));
  } else {
    return (
      gulp
        .src(['./_dev/scripts/**/*.js'])
        //.pipe(babel({ presets: ['@babel/preset-env'] }))
        // .pipe(uglify()) //Minify
        .pipe(gulp.dest('./_dist/scripts'))
    );
  }
};

// const images = () => {
//   return gulp.src('./_dev/assets/images/**/*')
//     .pipe(gulp.dest('./_dist/assets/images/'))
//     .on('error', function(e){console.log("ERROR 2",e);});
// }

const html = (done) => {
  if (process.env.NODE_ENV === 'development') {
    browserSyncReload();
  }
  done();
};

const watchFiles = (done) => {
  gulp.watch(['./_dev/stylesheets/*.scss', './_dev/stylesheets/**/*.scss', './_dev/style-guide/**/*.css'], css);
  gulp.watch(['./_dev/scripts/*.js', './_dev/scripts/**/*.js', , './_dev/style-guide/**/*.js'], js);
  gulp.watch('./_dev/**/*.ejs', html);
  done();
};

const dev_set_env = (done) => {
  process.env.NODE_ENV = 'development';
  console.log('Environment: ', process.env.NODE_ENV);
  done();
};

const prod_set_env = (done) => {
  process.env.NODE_ENV = 'production';
  console.log('Environment: ', process.env.NODE_ENV);
  done();
};

const serve = (done) => {
  harp.server(
    __dirname + '/_dev',
    {
      port: 9100,
    },
    function (done) {
      browserSync({
        proxy: 'localhost:9100',
        open: true,
        startPath: '/',
      });
    },
  );
  done();
};

const copy_all_files = async (step) => {
  const copy_all_files_cmd = `cp -r ./_dist/* ../warrenshea.github.io`;

  try {
    await exec(copy_all_files_cmd);
    console.log(`Completed ${step}: Copying script files`);
  } catch (error) {
    console.error(`Error copying script files: ${error}`);
  }
};

/*******************************************************************************/
//1
const replace_codebase = async (find_text, replace_text, directory, step) => {
  const grep_and_replace = `grep -rli '${find_text}' '${directory}' | xargs -i@ sed -i 's#${find_text}#${replace_text}#g' @`;
  return new Promise(async (resolve, reject) => {
    try {
      const { stdout } = await exec(grep_and_replace);
      console.log(`Completed ${step}: Replaced '${find_text}' with '${replace_text}' in ${directory}`);
      resolve();
    } catch (error) {
      console.error(`Error replacing: ${error}`);
      reject(error);
    }
  });
};

const replace_codebase_once = async (find_text, replace_text, directory, step) => {
  const grep_and_replace = `grep -rl '${find_text}' '${directory}' | xargs -i@ sed -i 's#${find_text}#${replace_text}#g' @`;
  return new Promise(async (resolve, reject) => {
    try {
      const { stdout } = await exec(grep_and_replace);
      console.log(`Completed ${step}: Replaced '${find_text}' with '${replace_text}' in ${directory}`);
      resolve();
    } catch (error) {
      console.error(`Error replacing: ${error}`);
      reject(error);
    }
  });
};


//2
// const create_config_folder = async () => {
//   return new Promise(async (resolve, reject) => {
//     const make_config_folder = `mkdir ../dev.zero-system/cms/codebase/chill-penguin/style-guide/ui-design/stylesheet_source/_config/`;
//     try {
//       await exec(make_config_folder);
//       console.log('Completed: Config folder creation');
//       resolve();
//     } catch (error) {
//       console.error(`Error creating config folder: ${error}`);
//       reject(error);
//     }
//   });
// };

//3
// const create_global_folder = async () => {
//   return new Promise(async (resolve, reject) => {
//     const make_global_folder = `mkdir ../dev.zero-system/cms/codebase/chill-penguin/style-guide/ui-design/stylesheet_source/_global/`;
//     try {
//       await exec(make_global_folder);
//       console.log('Completed: Global folder creation');
//       resolve();
//     } catch (error) {
//       console.error(`Error creating global folder: ${error}`);
//       reject(error);
//     }
//   });
// };

//4
const copy_config_files = async (step) => {
  return new Promise(async (resolve, reject) => {
    const copy_config_files_cmd = `cp -f ./_dev/stylesheets/_config/* ../dev.zero-system/cms/codebase/chill-penguin/style-guide/ui-design/stylesheet_source/_config`;
    try {
      await exec(copy_config_files_cmd);
      console.log(`Completed ${step}: Copying config files`);
      resolve();
    } catch (error) {
      console.error(`Error copying config files: ${error}`);
      reject(error);
    }
  });
};

//5
const copy_global_files = async (step) => {
  return new Promise(async (resolve, reject) => {
    const copy_global_files_cmd = `cp -f ./_dev/stylesheets/_global/* ../dev.zero-system/cms/codebase/chill-penguin/style-guide/ui-design/stylesheet_source/_global`;
    try {
      await exec(copy_global_files_cmd);
      console.log(`Completed ${step}: Copying global files`);
      resolve();
    } catch (error) {
      console.error(`Error copying global files: ${error}`);
      reject(error);
    }
  });
};

//6
// const copy_component_files = async (step) => {
//   const files_to_copy = [
//     // './_dev/components/zero-system/*.ejs ../dev.zero-system/cms/codebase/zero-system/components/',
//     // './_dist/components/zero-system/*.css ../dev.zero-system/cms/codebase/zero-system/components/',
//     // './_dist/components/zero-system/*.js ../dev.zero-system/cms/codebase/zero-system/components/',
//     // './_dev/components/template/*.ejs ../dev.zero-system/cms/codebase/chill-penguin/components/template/',
//     // './_dist/components/template/*.css ../dev.zero-system/cms/codebase/chill-penguin/components/template/',
//     // './_dist/components/template/*.js ../dev.zero-system/cms/codebase/chill-penguin/components/template/',
//   ];
//   const promises = files_to_copy.map(async (file) => {
//     try {
//       await exec(`cp -f ${file}`);
//       console.log(`Copying ${step}: ${file}`);
//     } catch (error) {
//       console.error(`Error copying ${file}: ${error}`);
//     }
//   });
//   return Promise.all(promises.map(() => Promise.resolve()));
// };

//7
const copy_script_files = async (step) => {
  const copy_script_files_cmd = [
    `cp -f ./_dist/scripts/*.js ../dev.zero-system/dist/codebase/chill-penguin/scripts`,
    `cp -f ./_dist/scripts/libs/*.js ../dev.zero-system/dist/codebase/chill-penguin/scripts/libs`
  ];
  const promises = copy_script_files_cmd.map(async (path) => {
    try {
      await exec(path);
      console.log(`Completed ${step}: Copying script files`);
    } catch (error) {
      console.error(`Error copying script files: ${error}`);
    }
  });
  return Promise.all(promises.map(() => Promise.resolve()));
};

//8
const copy_stylesheet_files = async (step) => {
  const copy_stylesheet_files_cmd = [
    `cp -f ./_dist/stylesheets/*.css ../dev.zero-system/dist/codebase/chill-penguin/stylesheets`,
    `cp -f ./_dist/stylesheets/libs/*.css ../dev.zero-system/dist/codebase/chill-penguin/stylesheets/libs`
  ];
  const promises = copy_stylesheet_files_cmd.map(async (path) => {
    try {
      await exec(path);
      console.log(`Completed ${step}: Copying stylesheet files`);
    } catch (error) {
      console.error(`Error copying stylesheet files: ${error}`);
    }
  });
  return Promise.all(promises.map(() => Promise.resolve()));
};

//9
const remove_unneeded_files = async (step) => {
  const files_to_delete = [
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/home.js',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.calendar-event-builder.js',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.tinymce.js',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/libs/jquery-v1.12.4.min.js',
    '../dev.zero-system/dist/codebase/chill-penguin/stylesheets/home.css',
  ];
  const promises = files_to_delete.map(async (file) => {
    try {
      await exec(`rm ${file}`);
      console.log(`Copying ${step}: ${file}`);
    } catch (error) {
      console.error(`Error copying ${file}: ${error}`);
    }
  });
  return Promise.all(promises.map(() => Promise.resolve()));
};

//10
const move_scripts_to_cms_codebase = async (step) => {
  const files_to_move = [
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/prism.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/libs/prism-v1.29.0.min.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/libs/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/libs/isotope-v3.0.6.min.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/libs/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.clipboard.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.draggable.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.color-picker.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/',
    '../dev.zero-system/dist/codebase/chill-penguin/stylesheets/cms-and-module-editor.css ../dev.zero-system/cms/codebase/zero-system/stylesheets/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.grid-iframe-send-height.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.grid-overlay.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/',
    '../dev.zero-system/dist/codebase/chill-penguin/stylesheets/libs/prism-v1.29.0.min.css ../dev.zero-system/cms/codebase/chill-penguin/stylesheets/libs/',
    '../dev.zero-system/dist/codebase/chill-penguin/stylesheets/grid-iframe-example.css ../dev.zero-system/cms/codebase/chill-penguin/stylesheets/',
    '../dev.zero-system/dist/codebase/chill-penguin/stylesheets/grid-overlay.css ../dev.zero-system/cms/codebase/chill-penguin/stylesheets/',
    '../dev.zero-system/dist/codebase/chill-penguin/scripts/module.tinymce-custom.js ../dev.zero-system/cms/codebase/chill-penguin/scripts/module.tinymce.js',
  ];
  const promises = files_to_move.map(async (file) => {
    try {
      await exec(`mv ${file}`);
      console.log(`Moving ${step}: ${file}`);
    } catch (error) {
      console.error(`Error copying ${file}: ${error}`);
    }
  });
  return Promise.all(promises.map(() => Promise.resolve()));
};

//11
const rename_files_in_components_directory = async (step) => {
  const src_directory = '../dev.zero-system/cms/codebase/chill-penguin/components';
  const files_to_rename = await new Promise((resolve, reject) => {
    child.spawn('sh', ['-c', `
      src_dir="${src_directory}"

      find "\$src_dir" -type f -name '_*' -exec echo {} + | sort
    `], { stdio: 'pipe' })
      .stdout.on('data', (data) => {
        const fileArray = data.toString().trim().split('\n');
        resolve(fileArray);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  const promises = files_to_rename.map(async (file) => {
    try {
      const lastSlashIndex = file.lastIndexOf('/');
      const dir = file.substring(0, lastSlashIndex);
      const base = file.substring(lastSlashIndex + 1);
      const new_name = base.substring(1); // Remove leading underscore
      await exec(`mv "${file}" "${dir}/${new_name}"`);
      console.log(`Renaming ${step}: ${file}`);
    } catch (error) {
      console.error(`Error renaming ${file}: ${error}`);
    }
  });

  return Promise.all(promises.map(() => Promise.resolve()));
};

//12
const move_component_assets_to_dist = async (step) => {
  const js_files_to_move = '../dev.zero-system/cms/codebase/chill-penguin/components/**/*.js';
  const destination = '../dev.zero-system/dist/codebase/chill-penguin/scripts/';

  const condition = (file) => !file.endsWith('.editor-schema.js');

  const get_files_matching_condition = async (pattern, condition) => {
    try {
      const { stdout } = await exec(`find ${pattern} -type f`);
      const files = stdout.split('\n').filter(Boolean);
      return files.filter(condition);
    } catch (error) {
      throw error;
    }
  };

  const clean_empty_directories = async (directory) => {
    try {
      await exec(`find ${directory} -type d -empty -delete`);
    } catch (error) {
      console.error(`Error cleaning empty directories: ${error}`);
      throw error;
    }
  };

  try {
    const files = await get_files_matching_condition(js_files_to_move, condition);

    for (const file of files) {
      // Get the base name of the file without using path module
      const last_slash_index = file.lastIndexOf('/');
      const base_name = last_slash_index !== -1 ? file.substring(last_slash_index + 1) : file;
      // console.log(destination);
      // console.log(base_name);
      // Always use the same destination directory
      const dest = `${destination}`;
      // console.log(`mv "${file}" "${dest}"`);
      await exec(`mv "${file}" "${dest}"`);
      console.log(`Moving ${step}: ${file}`);
    }

    await clean_empty_directories('../dev.zero-system/cms/codebase/chill-penguin/components/');
  } catch (error) {
    console.error(`Error moving files: ${error}`);
    throw error;
  }
};

const copy_and_move_files_to_zero_system = async (done) => {
  try {
    await replace_codebase('storm-eagle', 'chill-penguin', './_dist',1);
    await replace_codebase('storm_eagle', 'chill_penguin', './_dist',2);
    await replace_codebase('..\/assets\/', '/dist/codebase/chill-penguin/assets/', './_dist/stylesheets', 2);
    await replace_codebase_once('\/scripts\/', '/dist/codebase/chill-penguin/scripts/', './_dist/scripts/module.autoloader.js', 2);
    await replace_codebase_once('\/scripts\/module.form.autocomplete.js', '/dist/codebase/chill-penguin/scripts/module.form.autocomplete.js', './_dist/scripts/module.isotope.js', 2);
    await replace_codebase_once('\/scripts\/module.form.select-all.js', '/dist/codebase/chill-penguin/scripts/module.form.select-all.js', './_dist/scripts/module.isotope.js', 2);
    await replace_codebase_once('\/scripts\/libs\/isotope-v3.0.6.min.js', '/cms/codebase/chill-penguin/scripts/libs/isotope-v3.0.6.min.js', './_dist/scripts/module.isotope.js', 2);
    await replace_codebase_once('\/stylesheets\/libs\/prism-v1.29.0.min.css', '/cms/codebase/chill-penguin/stylesheets/libs/prism-v1.29.0.min.css', './_dist/scripts/prism.js', 2);
    await replace_codebase_once('\/scripts\/libs\/prism-v1.29.0.min.js', '/cms/codebase/chill-penguin/scripts/libs/prism-v1.29.0.min.js', './_dist/scripts/prism.js', 2);
    // await create_config_folder();
    // await create_global_folder();
    await copy_config_files(3);
    await copy_global_files(4);
    // await copy_component_files(5);
    await copy_script_files(6);
    await copy_stylesheet_files(7);
    await remove_unneeded_files(8);
    await replace_codebase('storm_eagle', 'chill_penguin', '../dev.zero-system/cms/codebase/chill-penguin/components',9);
    await move_scripts_to_cms_codebase(10)
    // await rename_files_in_components_directory(11);
    await move_component_assets_to_dist(12);
    done();
  } catch (error) {
    console.error(error);
  }
};

const build = async (done) => {
  try {
    const { stdout, stderr } = await exec('npm run compile');
    console.log(stdout);
    console.log(stderr);

    css();
    js();
    await clean_notes();
    await clean_asset_library();

    // Await these tasks if they are asynchronous, otherwise, this will run immediately.
    await copy_all_files('Copy all files to warrenshea.github.io');
    console.log('All files copied successfully.');

    console.log('Build completed!');
  } catch (error) {
    console.error('An error occurred during the build process:', error);
  }

  done();
};

// const build = (done) => {
//   exec('npm run compile', function (err, stdout, stderr) {
//     console.log(stdout);
//     console.log(stderr);
//     css();
//     js();
//     clean_notes();
//     clean_asset_library();
//     (async () => {
//       try {
//         await copy_all_files('Copy all files to warrenshea.github.io');
//         console.log('All files copied successfully.');
//       } catch (error) {
//         console.error('An error occurred while copying files:', error);
//       }
//     })();
//     console.log('Build completed!');
//   });
//   done();
// };

const final_build = () => {
  try {
    if (argv.move === true) {
      return copy_and_move_files_to_zero_system;
    } else {
      if (argv.prod === true) {
        return defaultProd;
      } else {
        return defaultDev;
      }
    }
  } catch (err) {
    console.error(err);
  }
};


/* This won't work, build will override css and js. Moved CSS and JS to Callback of Build
This is unique to HarpJS and how the folder code is structured*/
//const defaultProd = gulp.series(prod_set_env, clean, build, css, js);
const defaultProd = gulp.series(prod_set_env, clean, build);

const defaultDev = gulp.series(dev_set_env, gulp.parallel(serve, css, js, html, watchFiles));

//exports.default = (argv.prod === true) ? defaultProd : defaultDev;
exports.default = final_build();
