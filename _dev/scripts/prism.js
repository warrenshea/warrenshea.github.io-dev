'use strict';
storm_eagle.module('prism', () => {
  let self;

  const html_encode = (str) => {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
  }

  return {
    initialize: () => {
      self = storm_eagle.prism;
      self.dependency.load_all().then(() => {
        self.setup();
      }).catch(error => {
        console.error('Error loading dependencies:', error);
      });
    },
    dependency: {
      load_all: () => {
        return Promise.all([
          self.dependency.load.prism_lib(),
        ]);
      },
      load: {
        prism_lib: () => {
          return storm_eagle.util.load_css("/stylesheets/libs/prism-v1.29.0.min.css");
          return storm_eagle.util.load_javascript("/scripts/libs/prism-v1.29.0.min.js");
        },
      },
    },
    setup: () => {
      if (document.querySelectorAll('[data-code-reference]').length > 0) {
        self.link_code_with_prism_snippet();
      }
    },
    link_code_with_prism_snippet: () => {
      document.querySelectorAll('[data-code-reference]').forEach((el, index) => {
        let query_selector = storm_eagle.util.escape_string(el.getAttribute('data-code-reference'));
        document.querySelector(`code[data-code-snippet=${query_selector}`).innerHTML = html_encode(el.value);
      });
    },
    force_prism_reinit: () => {
      Prism.highlightAll();
    },
  };
});
