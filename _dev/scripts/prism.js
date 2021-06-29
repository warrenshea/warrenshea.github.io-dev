storm_eagle.module('prism', function () {
  'use strict';

  return {
    initialize: function () {
      const self = this;
      if (document.querySelectorAll(`[data-code-reference]`).length > 0) {
        self.link_code_with_prism_snippet();
      }
    },
    link_code_with_prism_snippet: function () {
      document.querySelectorAll(`[data-code-reference]`).forEach((el) => {
        var $cleanse = el.cloneNode(true);
        document.querySelector(`code[data-code-snippet=${el.getAttribute("data-code-reference")}`).innerHTML = $cleanse.innerHTML;
      });
    },
    force_prism_reinit: function () {
      Prism.highlightAll();
    }
  };
});