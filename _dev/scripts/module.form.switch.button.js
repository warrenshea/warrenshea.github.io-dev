'use strict';
storm_eagle.module('form_switch_button', () => {
  let self;
  let switch_button_state = {};
  return {
    initialize: () => {
      self = storm_eagle['form_switch_button'];
      document.querySelectorAll('[data-module="switch.button"]').forEach((el) => {
        let switch_button_id = el.getAttribute('id');
        switch_button_state[switch_button_id] = {
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
        }
        self.init_ui(switch_button_id);
        self.button_switch_listener(switch_button_id);
      });
      console.log(switch_button_state);
    },
    init_ui: (switch_button_id) => {
      switch_button_state[switch_button_id]["label"].setAttribute("for",switch_button_id);
      switch_button_state[switch_button_id]['slider'].classList.add(...switch_button_state[switch_button_id]['bg_inactive_classes']);
      switch_button_state[switch_button_id]['thumb'].classList.add(...switch_button_state[switch_button_id]['thumb_inactive_class']);
      switch_button_state[switch_button_id]['text'].classList.add(...switch_button_state[switch_button_id]['text_inactive_classes']);
    },
    button_switch_listener: (switch_button_id) => {
      document.querySelector(`#${switch_button_id}`).addEventListener("click", (event) => {
        let switch_active_state = event.currentTarget.getAttribute("aria-checked") === "true";
        if (switch_active_state) {
          switch_button_state[switch_button_id]['slider'].setAttribute("data-switch",'');
          switch_button_state[switch_button_id]['slider'].classList.remove(...switch_button_state[switch_button_id]['bg_active_classes']);
          switch_button_state[switch_button_id]['slider'].classList.add(...switch_button_state[switch_button_id]['bg_inactive_classes']);
          switch_button_state[switch_button_id]['thumb'].classList.remove(...switch_button_state[switch_button_id]['thumb_active_class']);
          switch_button_state[switch_button_id]['thumb'].classList.add(...switch_button_state[switch_button_id]['thumb_inactive_class']);
          switch_button_state[switch_button_id]['text'].classList.remove(...switch_button_state[switch_button_id]['text_active_classes']);
          switch_button_state[switch_button_id]['text'].classList.add(...switch_button_state[switch_button_id]['text_inactive_classes']);
        } else {
          switch_button_state[switch_button_id]['slider'].setAttribute("data-switch",'active');
          switch_button_state[switch_button_id]['slider'].classList.remove(...switch_button_state[switch_button_id]['bg_inactive_classes']);
          switch_button_state[switch_button_id]['slider'].classList.add(...switch_button_state[switch_button_id]['bg_active_classes']);
          switch_button_state[switch_button_id]['thumb'].classList.remove(...switch_button_state[switch_button_id]['thumb_inactive_class']);
          switch_button_state[switch_button_id]['thumb'].classList.add(...switch_button_state[switch_button_id]['thumb_active_class']);
          switch_button_state[switch_button_id]['text'].classList.remove(...switch_button_state[switch_button_id]['text_inactive_classes']);
          switch_button_state[switch_button_id]['text'].classList.add(...switch_button_state[switch_button_id]['text_active_classes']);
        }
        event.currentTarget.setAttribute("aria-checked", (!switch_active_state).toString());
      });
    },
  };
});