'use strict';
storm_eagle.module('form_switch_button', () => {
  let self;
  let state = {};

  const handle_click = (event) => {
    let el_state = state[event.currentTarget.getAttribute("id")];
    let switch_active_state = event.currentTarget.getAttribute("aria-checked") === "true";
    if (switch_active_state) {
      el_state['slider'].setAttribute("data-switch",'');
      el_state['slider'].classList.remove(...el_state['bg_active_classes']);
      el_state['slider'].classList.add(...el_state['bg_inactive_classes']);
      el_state['thumb'].classList.remove(...el_state['thumb_active_class']);
      el_state['thumb'].classList.add(...el_state['thumb_inactive_class']);
      el_state['text'].classList.remove(...el_state['text_active_classes']);
      el_state['text'].classList.add(...el_state['text_inactive_classes']);
    } else {
      el_state['slider'].setAttribute("data-switch",'active');
      el_state['slider'].classList.remove(...el_state['bg_inactive_classes']);
      el_state['slider'].classList.add(...el_state['bg_active_classes']);
      el_state['thumb'].classList.remove(...el_state['thumb_inactive_class']);
      el_state['thumb'].classList.add(...el_state['thumb_active_class']);
      el_state['text'].classList.remove(...el_state['text_inactive_classes']);
      el_state['text'].classList.add(...el_state['text_active_classes']);
    }
    event.currentTarget.setAttribute("aria-checked", (!switch_active_state).toString());
  };

  return {
    initialize: () => {
      self = storm_eagle['form_switch_button'];
      state = {};
      document.querySelectorAll('[data-module="switch.button"]').forEach((el) => {
        let id = el.getAttribute('id');
        state[id] = {
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
        self.init_ui(id);
        document.querySelector(`#${id}`).removeEventListener("click",handle_click);
        document.querySelector(`#${id}`).addEventListener("click", handle_click);
      });
    },
    init_ui: (id) => {
      state[id]["label"].setAttribute("for",id);
      state[id]['slider'].classList.add(...state[id]['bg_inactive_classes']);
      state[id]['thumb'].classList.add(...state[id]['thumb_inactive_class']);
      state[id]['text'].classList.add(...state[id]['text_inactive_classes']);
    },
  };
});