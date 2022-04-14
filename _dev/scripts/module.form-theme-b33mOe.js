storm_eagle.module('form_theme_b33mOe', () => {
  "use strict";
  let self;

  return {
    initialize: () => {
      self = storm_eagle["form_theme_b33mOe"];
      self.input_listener();
      self.textarea_autoexpand_listener();
    },
    ready: () => {
      document.querySelectorAll('.form\\:theme\\:b33mOe input, .form\\:theme\\:b33mOe select, .form\\:theme\\:b33mOe textarea').forEach( element => {
        if (element.type !== 'radio') {
          self.force_set_active_label(element);
        }
      });
      document.querySelectorAll(".form\\:theme\\:b33mOe textarea").forEach( element => {
        self.force_textarea_autoexpand(element);
      });
    },
    force_set_active_label: (element) => {
      element.nextElementSibling.classList[(element.value.length ? 'add' : 'remove')]('active-label');
    },
    input_listener: () => {
      document.querySelectorAll('.form\\:theme\\:b33mOe input, .form\\:theme\\:b33mOe select, .form\\:theme\\:b33mOe textarea').forEach( element => {

        if (element.type !== 'radio') {
          element.addEventListener('change', () => {
            self.force_set_active_label(element);
          });
        }
      });
    },
    force_textarea_autoexpand: (element) => {
      element.style.height = 'inherit';
      element.style.height = element.scrollHeight + 'px';
    },
    textarea_autoexpand_listener: () => {
      document.querySelectorAll(".form\\:theme\\:b33mOe textarea").forEach( element => {
        element.addEventListener('input', () => {
          self.force_textarea_autoexpand(element);
        });
      });
    }
  };
});