'use strict';
storm_eagle.module('form_theme_gl0b3x', () => {
  let self;

  return {
    initialize: () => {
      self = storm_eagle.form_theme_gl0b3x;
      self.input_listener();
      self.textarea_autoexpand_listener();
    },
    ready: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x input, .form\\:theme\\:gl0b3x select, .form\\:theme\\:gl0b3x textarea').forEach((element) => {
        if (element.type !== 'radio' && element.type !== 'range') {
          self.force_set_active_label(element);
        }
      });
      document.querySelectorAll('.form\\:theme\\:gl0b3x textarea').forEach((element) => {
        self.force_textarea_autoexpand(element);
      });
    },
    force_set_active_label: (element) => {
      element.nextElementSibling.classList[element.value.length ? 'add' : 'remove']('active-label');
    },
    input_listener: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x input, .form\\:theme\\:gl0b3x select, .form\\:theme\\:gl0b3x textarea').forEach((element) => {
        if (element.type !== 'radio' && element.type !== 'range') {
          element.addEventListener('change', () => {
            self.force_set_active_label(element);
          });
        }
      });
    },
    force_textarea_autoexpand: (element) => {
      element.style.height = 'inherit';
      element.style.height = `${element.scrollHeight}px`;
    },
    textarea_autoexpand_listener: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x textarea').forEach((element) => {
        element.addEventListener('input', () => {
          self.force_textarea_autoexpand(element);
        });
      });
    },
  };
});