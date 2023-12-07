'use strict';
/**
 * data-module=modal         the modal
 * data-module=modal.trigger the button that opens the modal
 */
storm_eagle.module('modal', () => {
  let self;
  let modal_state = {};
  let focus_placeholder;
  let modal_first_tab_stop;
  let modal_last_tab_stop;

  return {
    initialize: () => {
      self = storm_eagle.modal;
      document.querySelectorAll("[data-module='modal']").forEach((el) => {
        let id = el.getAttribute('id');
        modal_state[id] = {
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.get_modal_focusable_elements(id);
      });
    },
    event_listeners: {
      modal_mousedown_close: (event) => {
        //console.log(event.target.classList);
        if (event.target.classList.contains('modal-container') || event.target.classList.contains('modal-overlay')) {
          storm_eagle.modal.close();
        }
      },
      keyboard_modal_focus_trap: (event) => {
        if (event.keyCode === keyboard.keys.tab) {
          if (event.shiftKey) {
            if (document.activeElement === modal_first_tab_stop) {
              event.preventDefault();
              modal_last_tab_stop.focus();
            }
          } else {
            if (document.activeElement === modal_last_tab_stop) {
              event.preventDefault();
              modal_first_tab_stop.focus();
            }
          }
        }
        if (event.keyCode === keyboard.keys.esc || (event.keyCode === keyboard.keys.enter && document.activeElement.hasAttribute("[data-trigger='modal-close']"))) {
          storm_eagle.modal.close();
        }
      }
    },
    open: (modal_trigger, id) => {
      document.addEventListener('mousedown', self.event_listeners.modal_mousedown_close);

      /* updates modal visuals */
      document.querySelector('body').classList.add('overflow:hidden');
      if (modal_trigger) {
        modal_trigger.classList.add('active');
      }
      document.getElementById(id).classList.add('active');
      document.getElementById(id).querySelector('.modal-container').classList.add('active');

      /* removes focus from elements except in modal */
      modal_state[id]['focusable_elements'].forEach((el) => {
        el.setAttribute('tabindex', '0');
      });
      modal_state[id]['remove_focusable_elements'].forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });

      /* remove focusable elements from nodelist, e.g. popover inside modal */
      modal_state[id]['focusable_elements'] = [...modal_state[id]['focusable_elements']].filter((el) => {
        return ![...modal_state[id]['remove_focusable_elements']].includes(el);
      });

      /* saves item that opened modal for later */
      focus_placeholder = document.activeElement;
      modal_first_tab_stop = modal_state[id]['focusable_elements'][0];
      modal_last_tab_stop = modal_state[id]['focusable_elements'][modal_state[id]['focusable_elements'].length - 1];

      /* set focus to modal (but not the modal_first_tab_stop */
      setTimeout(() => {
        if (modal_first_tab_stop) {
          modal_first_tab_stop.focus();
        }
      }, 100);

      /* add keyboard event listener */
      document.getElementById(id).addEventListener('keydown', self.event_listeners.keyboard_modal_focus_trap);
    },
    close: () => {
      document.removeEventListener('mousedown', self.event_listeners.modal_mousedown_close);
      document.querySelector('body').classList.remove('overflow:hidden');

      /* updates modal visuals */
      document.querySelector("[data-module='modal'].active").setAttribute('tabIndex', '-1');
      document.querySelector("[data-module='modal'].active").setAttribute('aria-expanded', false);
      if (document.querySelector("[data-module='modal.trigger'].active")) {
        document.querySelector("[data-module='modal.trigger'].active").classList.remove('active');
      }
      document.querySelector("[data-module='modal'].active").querySelector('.modal-container').classList.remove('active');
      document.querySelector("[data-module='modal'].active").classList.remove('active');
      document.querySelectorAll("[data-module='modal']").forEach((modal, index) => {
        let id = modal.getAttribute('id');

        /* remove focus from modal elements */
        modal_state[id]['focusable_elements'].forEach((el) => {
          el.setAttribute('tabindex', '-1');
        });

        /* remove keyboard event listener */
        document.getElementById(id).removeEventListener('keydown', self.event_listeners.keyboard_modal_focus_trap);
      });
      document.querySelectorAll("[data-module='modal.trigger']").forEach((modal_trigger) => {
        modal_trigger.setAttribute('aria-expanded', false);
      });

      /* set focus to focus_placeholder */
      focus_placeholder.focus();
    },
    get_modal_focusable_elements: (id) => {
      modal_state[id]['focusable_elements'] = document.getElementById(id).querySelectorAll(focus_trap_selector);
      //console.log(modal_state[id]["focusable_elements"]);
      modal_state[id]['remove_focusable_elements'] = document.getElementById(id).querySelectorAll(remove_focus_selector);
      //console.log(modal_state[id]["remove_focusable_elements"]);
    },
  };
});
