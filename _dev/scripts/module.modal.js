'use strict';
/**
 * data-module=modal         the modal
 * data-module=modal.trigger the button that opens the modal
 */
storm_eagle.module('modal', () => {
  let self;
  let module_state = {};
  let focus_placeholder;
  let modal_first_tab_stop;
  let modal_last_tab_stop;

  return {
    initialize: () => {
      self = storm_eagle.modal;
      module_state = {};
      document.querySelectorAll("[data-module='modal']").forEach((el) => {
        const id = el.getAttribute('id');
        module_state[id] = {
          el,
          id,
          container: el.querySelector(':scope > [data-module="modal.container"]'),
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.a11y.get_modal_focusable_elements(id);
      });
    },
    event_listeners: {
      modal_mousedown_close: (event) => {
        //console.log(event.target.classList);
        if (event.target.querySelector("[data-module='modal-container']") || event.target.getAttribute('data-module') === 'modal') {
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
        if (event.keyCode === keyboard.keys.esc || (event.keyCode === keyboard.keys.enter && document.activeElement.setAttribute("data-modal-trigger",""))) {
          storm_eagle.modal.close();
        }
      }
    },
    open: (modal_trigger, id) => {
      const { el, container, focusable_elements, remove_focusable_elements } = module_state[id];
      document.removeEventListener('mousedown', self.event_listeners.modal_mousedown_close);
      document.addEventListener('mousedown', self.event_listeners.modal_mousedown_close);

      /* updates modal visuals */
      document.querySelector('body').classList.add('overflow:hidden');
      if (modal_trigger) {
        modal_trigger.setAttribute("data-modal-trigger","active");
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
      module_state[id]['focusable_elements'] = [...focusable_elements].filter((el2) => {
        return ![...remove_focusable_elements].includes(el2);
      });

      /* saves item that opened modal for later */
      focus_placeholder = document.activeElement;
      modal_first_tab_stop = focusable_elements[0];
      modal_last_tab_stop = focusable_elements[focusable_elements.length - 1];

      /* set focus to modal (but not the modal_first_tab_stop */
      setTimeout(() => {
        if (modal_first_tab_stop) {
          modal_first_tab_stop.focus();
        }
      }, 100);

      /* add keyboard event listener */
      el.removeEventListener('keydown', self.event_listeners.keyboard_modal_focus_trap);
      el.addEventListener('keydown', self.event_listeners.keyboard_modal_focus_trap);
    },
    close: () => {
      document.removeEventListener('mousedown', self.event_listeners.modal_mousedown_close);
      document.querySelector('body').classList.remove('overflow:hidden');

      /* updates modal visuals */
      document.querySelector("[data-module='modal'][data-modal='active']").setAttribute('tabIndex', '-1');
      document.querySelector("[data-module='modal'][data-modal='active']").setAttribute('aria-expanded', false);
      document.querySelector("[data-module='modal.trigger'][data-modal-trigger='active']")?.setAttribute("data-modal-trigger","");
      document.querySelector("[data-module='modal'][data-modal='active'] > [data-module='modal.container']").setAttribute("data-modal-container","");
      document.querySelector("[data-module='modal'][data-modal='active']").setAttribute("data-modal","");
      document.querySelectorAll("[data-module='modal']").forEach((el, index) => {
        const id = el.getAttribute('id');
        const { focusable_elements } = module_state[id];

        /* remove focus from modal elements */
        focusable_elements.forEach((focusable_element) => {
          focusable_element.setAttribute('tabindex', '-1');
        });

        /* remove keyboard event listener */
        el.removeEventListener('keydown', self.event_listeners.keyboard_modal_focus_trap);
      });
      document.querySelectorAll("[data-module='modal.trigger']").forEach((modal_trigger) => {
        modal_trigger.setAttribute('aria-expanded', false);
      });

      /* set focus to focus_placeholder */
      focus_placeholder.focus();
    },
    a11y: {
      get_modal_focusable_elements: (id) => {
        const { el } = module_state[id];
        module_state[id]['focusable_elements'] = el.querySelectorAll(focus_trap_selector);
        module_state[id]['remove_focusable_elements'] = el.querySelectorAll(remove_focus_selector);
      },
    },
  };
});
