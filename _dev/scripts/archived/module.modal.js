'use strict';
storm_eagle.module('modal', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.modal;
      state = {};
      document.querySelectorAll("[data-module='modal']").forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          container: el.querySelector(':scope > [data-module="modal.container"]'),
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.a11y.get_focusable_elements(id);
      });
    },
    event_listeners: {
      mousedown_close: (event) => {
        if (event.target.querySelector("[data-module='modal.container']") || event.target.getAttribute('data-module') === 'modal') {
          self.close();
        }
      },
      keyboard_focus_trap: (event) => {
        if (event.keyCode === keyboard.keys.tab) {
          if (event.shiftKey) {
            if (document.activeElement === self.a11y.first_tab_stop) {
              event.preventDefault();
              self.a11y.last_tab_stop.focus();
            }
          } else {
            if (document.activeElement === self.a11y.last_tab_stop) {
              event.preventDefault();
              self.a11y.first_tab_stop.focus();
            }
          }
        }
        (event.keyCode === keyboard.keys.esc) && self.close();
      }
    },
    open: (id, trigger) => {
      const { el, container, focusable_elements, remove_focusable_elements } = state[id];
      document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
      document.addEventListener('mousedown', self.event_listeners.mousedown_close);

      /* updates modal visuals */
      document.querySelector('body').classList.add('overflow:hidden');
      if (trigger) {
        trigger.setAttribute("data-modal-trigger","active");
      }
      el.setAttribute("data-modal","active");
      container.setAttribute("data-modal-container","active");

      /* removes focus from elements except in modal */
      focusable_elements.forEach((focusable_element) => {
        focusable_element.setAttribute('tabindex', '0');
      });
      remove_focusable_elements.forEach((remove_focusable_element) => {
        remove_focusable_element.setAttribute('tabindex', '-1');
      });

      /* remove focusable elements from nodelist, e.g. popover inside modal */
      state[id]['focusable_elements'] = [...focusable_elements].filter((focusable_element) => {
        return ![...remove_focusable_elements].includes(focusable_element);
      });

      /* saves item that opened modal for later */
      self.a11y.focus_placeholder = document.activeElement;
      self.a11y.first_tab_stop = focusable_elements[0];
      self.a11y.last_tab_stop = focusable_elements[focusable_elements.length - 1];

      /* set focus to modal (but not the first_tab_stop */
      setTimeout(() => {
        (self.a11y.first_tab_stop) && self.a11y.first_tab_stop.focus();
      }, 100);

      /* add keyboard event listener */
      el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      el.addEventListener('keydown', self.event_listeners.keyboard_focus_trap);
    },
    close: () => {
      document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
      document.querySelector('body').classList.remove('overflow:hidden');

      /* updates modal visuals */
      document.querySelector("[data-module='modal'][data-modal='active']").setAttribute('tabIndex', '-1');
      document.querySelector("[data-module='modal'][data-modal='active']").setAttribute('aria-expanded', false);
      document.querySelector("[data-module='modal.trigger'][data-modal-trigger='active']")?.removeAttribute("data-modal-trigger");
      document.querySelector("[data-module='modal'][data-modal='active'] > [data-module='modal.container']").removeAttribute("data-modal-container");
      document.querySelector("[data-module='modal'][data-modal='active']").removeAttribute("data-modal");
      document.querySelectorAll("[data-module='modal']").forEach((el, index) => {
        const id = el.getAttribute('id');
        const { focusable_elements } = state[id];

        /* remove focus from modal elements */
        focusable_elements.forEach((focusable_element) => {
          focusable_element.setAttribute('tabindex', '-1');
        });

        /* remove keyboard event listener */
        el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      });
      document.querySelectorAll("[data-module='modal.trigger']").forEach((trigger) => {
        trigger.setAttribute('aria-expanded', false);
      });

      /* set focus to focus_placeholder */
      self.a11y.focus_placeholder.focus();
    },
    a11y: {
      focus_placeholder: null,
      first_tab_stop: null,
      last_tab_stop: null,
      get_focusable_elements: (id) => {
        const { el } = state[id];
        state[id]['focusable_elements'] = el.querySelectorAll(focus_trap_selector);
        state[id]['remove_focusable_elements'] = el.querySelectorAll(remove_focus_selector);
      },
    },
  };
});