storm_eagle.module('prism', () => {
  'use strict';
  let self;

  function htmlEncode(str) {
    var buf = [];
    for (var i=str.length-1;i>=0;i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
  }

  return {
    initialize: () => {
      self = storm_eagle["prism"];
      if (document.querySelectorAll(`[data-code-reference]`).length > 0) {
        self.link_code_with_prism_snippet();
      }
    },
    link_code_with_prism_snippet: () => {
      document.querySelectorAll(`[data-code-reference]`).forEach((el,index) => {
        document.querySelector(`code[data-code-snippet=${el.getAttribute("data-code-reference")}`).innerHTML = htmlEncode(el.value);
      });
    },
    force_prism_reinit: () => {
      Prism.highlightAll();
    }
  };
});