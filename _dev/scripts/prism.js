storm_eagle.module('prism', function () {
  'use strict';

  function htmlEncode(str) {
    var buf = [];
    for (var i=str.length-1;i>=0;i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
  }

  return {
    initialize: function () {
      var self = this;
      if (document.querySelectorAll(`[data-code-reference]`).length > 0) {
        self.linkCodeWithPrismSnippet();
      }
    },
    linkCodeWithPrismSnippet: function () {
      document.querySelectorAll(`[data-code-reference]`).forEach((el) => {
        var $cleanse = el.cloneNode(true);
        document.querySelector(`code[data-code-snippet=${el.getAttribute("data-code-reference")}`).innerHTML = htmlEncode($cleanse.innerHTML);
      });
    },
    forcePrismReinit: function () {
      Prism.highlightAll();
    }
  };
});