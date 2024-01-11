'use strict';
storm_eagle.module('form_switch_button', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.form_switch_button;
      state = {};
      document.querySelectorAll('[data-module="switch.button"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          slider: el.querySelector(':scope > [data-module="switch.slider"]'),
          thumb: el.querySelector(':scope > [data-module="switch.slider"] > [data-module="switch.thumb"]'),
          text: el.querySelector(':scope > [data-module="switch.slider"] > [data-module="switch.text"]'),
          label: (el.nextElementSibling?.tagName.toLowerCase() === "label") ? el.nextElementSibling : false,
          text_active_classes: el.getAttribute('data-switch-text-active-classes') ? el.getAttribute('data-switch-text-active-classes').split(',') : '',
          text_inactive_classes: el.getAttribute('data-switch-text-inactive-classes') ? el.getAttribute('data-switch-text-inactive-classes').split(',') : '',
          bg_active_classes: el.getAttribute('data-switch-bg-active-classes') ? el.getAttribute('data-switch-bg-active-classes').split(',') : '',
          bg_inactive_classes: el.getAttribute('data-switch-bg-inactive-classes') ? el.getAttribute('data-switch-bg-inactive-classes').split(',') : '',
          thumb_active_class: el.getAttribute('data-switch-thumb-active-class') ? el.getAttribute('data-switch-thumb-active-class').split(',') : '',
          thumb_inactive_class: el.getAttribute('data-switch-thumb-inactive-class') ? el.getAttribute('data-switch-thumb-inactive-class').split(',') : '',
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        const { el, label, slider, thumb, text, text_active_classes, text_inactive_classes, bg_active_classes, bg_inactive_classes, thumb_active_class, thumb_inactive_class } = state[id];

        label && label.setAttribute('for', id);
        if (el.getAttribute('aria-checked') === 'true') {
          slider.classList.add(...bg_active_classes);
          thumb?.classList.add(...thumb_active_class);
          text.classList.add(...text_active_classes);
        } else {
          slider.classList.add(...bg_inactive_classes);
          thumb?.classList.add(...thumb_inactive_class);
          text.classList.add(...text_inactive_classes);
        }
      }
    },
    event_listeners: {
      initialize: (id) => {
        const { el } = state[id];
        el.removeEventListener('click', self.event_listeners.handle_click);
        el.addEventListener('click', self.event_listeners.handle_click);
      },
      handle_click: (event) => {
        const id = event.currentTarget.getAttribute('id');
        const { el, slider, thumb, text, text_active_classes, text_inactive_classes, bg_active_classes, bg_inactive_classes, thumb_active_class, thumb_inactive_class } = state[id];
        let switch_active_state = el.getAttribute('aria-checked') === 'true';
        if (switch_active_state) {
          slider.classList.remove(...bg_active_classes);
          slider.classList.add(...bg_inactive_classes);
          thumb?.classList.remove(...thumb_active_class);
          thumb?.classList.add(...thumb_inactive_class);
          text.classList.remove(...text_active_classes);
          text.classList.add(...text_inactive_classes);
        } else {
          slider.classList.remove(...bg_inactive_classes);
          slider.classList.add(...bg_active_classes);
          thumb?.classList.remove(...thumb_inactive_class);
          thumb?.classList.add(...thumb_active_class);
          text.classList.remove(...text_inactive_classes);
          text.classList.add(...text_active_classes);
        }
        el.setAttribute('aria-checked', (!switch_active_state).toString());
      },
    },
  };
});
