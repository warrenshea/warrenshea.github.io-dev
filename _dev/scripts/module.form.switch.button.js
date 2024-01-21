'use strict';
storm_eagle.module('form_switch_button', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.form_switch_button;
      state = {};
      self.setup();
    },
    setup: () => {
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
        self.action.toggle(event.currentTarget.getAttribute('id'));
      },
    },
    action: {
      toggle: (id) => {
        self.action.set_state(id, state[id].el.getAttribute('aria-checked') !== 'true');
      },
      set_state: (id, is_active) => {
        const { el, slider, thumb, text, text_active_classes, text_inactive_classes, bg_active_classes, bg_inactive_classes, thumb_active_class, thumb_inactive_class } = state[id];

        // Remove classes for the current state
        slider.classList.remove(...is_active ? bg_inactive_classes : bg_active_classes);
        thumb?.classList.remove(...is_active ? thumb_inactive_class : thumb_active_class);
        text.classList.remove(...is_active ? text_inactive_classes : text_active_classes);

        // Add classes for the new state
        slider.classList.add(...is_active ? bg_active_classes : bg_inactive_classes);
        thumb?.classList.add(...is_active ? thumb_active_class : thumb_inactive_class);
        text.classList.add(...is_active ? text_active_classes : text_inactive_classes);

        // Update the aria-checked attribute
        el.setAttribute('aria-checked', is_active.toString());
      }
    }
  };
});
