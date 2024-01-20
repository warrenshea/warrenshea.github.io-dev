'use strict';
storm_eagle.module('homepage', () => {
  return {
    initialize: () => {
      document.querySelectorAll('li.opacity\\:0\\%').forEach((el, index) => {
        setTimeout(() => {
          el.classList.replace('opacity:0%', 'opacity:100%');
        }, index * 45);
      });
      document.querySelectorAll('h2,.heading,.description-line,.description-notes-line').forEach((el, index) => {
        setTimeout(() => {
          el.classList.replace('opacity:0%', 'opacity:100%');
        }, index * 25);
      });
    },
  };
});
