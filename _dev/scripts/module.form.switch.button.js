'use strict';
storm_eagle.module('form_switch_button', () => {
  let self;
  let module_state = {};

  return {
    initialize: () => {
      self = storm_eagle.form_switch_button;
      module_state = {};
      document.querySelectorAll('[data-module="switch.button"]').forEach((el) => {
        let id = el.getAttribute('id');
        module_state[id] = {
          id,
          el,
          slider: el.querySelector(':scope > [data-module="switch.slider"]'),
          thumb: el.querySelector(':scope > [data-module="switch.slider"] > [data-module="switch.thumb"]'),
          text: el.querySelector(':scope > [data-module="switch.slider"] > [data-module="switch.text"]'),
          label: el.nextElementSibling,
          text_active_classes: el.getAttribute('data-switch-text-active-classes') ? el.getAttribute('data-switch-text-active-classes').split(',') : '',
          text_inactive_classes: el.getAttribute('data-switch-text-inactive-classes') ? el.getAttribute('data-switch-text-inactive-classes').split(',') : '',
          bg_active_classes: el.getAttribute('data-switch-bg-active-classes') ? el.getAttribute('data-switch-bg-active-classes').split(',') : '',
          bg_inactive_classes: el.getAttribute('data-switch-bg-inactive-classes') ? el.getAttribute('data-switch-bg-inactive-classes').split(',') : '',
          thumb_active_class: el.getAttribute('data-switch-thumb-active-class') ? el.getAttribute('data-switch-thumb-active-class').split(',') : '',
          thumb_inactive_class: el.getAttribute('data-switch-thumb-inactive-class') ? el.getAttribute('data-switch-thumb-inactive-class').split(',') : '',
        };
        self.init_ui(id);
        self.add_event_listeners(id);
      });
    },
    init_ui: (id) => {
      const { el, label, slider, thumb, text, text_active_classes, text_inactive_classes, bg_active_classes, bg_inactive_classes, thumb_active_class, thumb_inactive_class } = module_state[id];

      label.setAttribute('for', id);
      if (el.getAttribute('aria-checked') === 'true') {
        slider.classList.add(...bg_active_classes);
        thumb.classList.add(...thumb_active_class);
        text.classList.add(...text_active_classes);
      } else {
        slider.classList.add(...bg_inactive_classes);
        thumb.classList.add(...thumb_inactive_class);
        text.classList.add(...text_inactive_classes);
      }
    },
    add_event_listeners: (id) => {
      const { el } = module_state[id];

      const handle_click = (event) => {
        const el = event.currentTarget;
        const { slider, thumb, text, text_active_classes, text_inactive_classes, bg_active_classes, bg_inactive_classes, thumb_active_class, thumb_inactive_class } = module_state[el.getAttribute('id')];

        let switch_active_module_state = el.getAttribute('aria-checked') === 'true';
        if (switch_active_module_state) {
          slider.classList.remove(...bg_active_classes);
          slider.classList.add(...bg_inactive_classes);
          thumb.classList.remove(...thumb_active_class);
          thumb.classList.add(...thumb_inactive_class);
          text.classList.remove(...text_active_classes);
          text.classList.add(...text_inactive_classes);
        } else {
          slider.classList.remove(...bg_inactive_classes);
          slider.classList.add(...bg_active_classes);
          thumb.classList.remove(...thumb_inactive_class);
          thumb.classList.add(...thumb_active_class);
          text.classList.remove(...text_inactive_classes);
          text.classList.add(...text_active_classes);
        }
        el.setAttribute('aria-checked', (!switch_active_module_state).toString());
      };

      el.removeEventListener('click', handle_click);
      el.addEventListener('click', handle_click);
    },
  };
});
