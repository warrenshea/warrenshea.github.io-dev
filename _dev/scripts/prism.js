storm_eagle.module('prism', () => {
  'use strict';

  let self;
  return {
    initialize: () => {
      self = storm_eagle["prism"];
      if (document.querySelectorAll(`[data-code-reference]`).length > 0) {
        self.link_code_with_prism_snippet();
      }
    },
    link_code_with_prism_snippet: () => {
      document.querySelectorAll(`[data-code-reference]`).forEach(el => {
        let $cleanse = el.cloneNode(true);
        document.querySelector(`code[data-code-snippet=${el.getAttribute("data-code-reference")}`).innerHTML = $cleanse.innerHTML;
      });
    },
    force_prism_reinit: () => {
      Prism.highlightAll();
    }
  };
});