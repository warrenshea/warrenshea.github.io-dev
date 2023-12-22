'use strict';
/**
 * data-module=modal         the modal
 * data-module=modal.trigger the button that opens the modal
 */
storm_eagle.module('modal', () => {
  let self;
  let module_state = {};

  return {
    initialize: () => {
      self = storm_eagle.modal;
      module_state = {};
      document.querySelectorAll("[data-module='modal']").forEach((el) => {
        const id = el.getAttribute('id');
        module_state[id] = {
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
        if (event.target.querySelector("[data-module='modal-container']") || event.target.getAttribute('data-module') === 'modal') {
          storm_eagle.modal.close();
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
        if (event.keyCode === keyboard.keys.esc || (event.keyCode === keyboard.keys.enter && document.activeElement.setAttribute("data-modal-trigger",""))) {
          storm_eagle.modal.close();
        }
      }
    },
    open: (trigger, id) => {
      const { el, container, focusable_elements, remove_focusable_elements } = module_state[id];
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
      module_state[id]['focusable_elements'] = [...focusable_elements].filter((focusable_element) => {
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
        const { el } = module_state[id];
        module_state[id]['focusable_elements'] = el.querySelectorAll(focus_trap_selector);
        module_state[id]['remove_focusable_elements'] = el.querySelectorAll(remove_focus_selector);
      },
    },
  };
});

storm_eagle.module('dialog', () => {
  let self;
  let module_state = {};

  return {
    initialize: () => {
      self = storm_eagle.dialog;
      module_state = {};
      document.querySelectorAll("[data-module='dialog']").forEach((el) => {
        const id = el.getAttribute('id');
        module_state[id] = {
          el,
          container: el.querySelector(':scope > [data-module="dialog.container"]'),
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.a11y.get_focusable_elements(id);
      });
    },
    event_listeners: {
      mousedown_close: (event) => {
        if (event.target.querySelector("[data-module='dialog'], [data-module='dialog'] > *")) {
          self.close();
        }
      },
      keyboard_focus_trap: (event) => {
        const id = event.currentTarget.getAttribute("id");
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
        if (event.keyCode === keyboard.keys.esc || (event.keyCode === keyboard.keys.enter && document.activeElement.setAttribute("data-dialog-trigger",""))) {
          self.close();
        }
      }
    },
    open: (trigger, id) => {
      const { el, container, focusable_elements, remove_focusable_elements } = module_state[id];
      document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
      document.addEventListener('mousedown', self.event_listeners.mousedown_close);

      /* removes focus from elements except in dialog */
      focusable_elements.forEach((focusable_element) => {
        focusable_element.setAttribute('tabindex', '0');
      });
      remove_focusable_elements.forEach((remove_focusable_element) => {
        remove_focusable_element.setAttribute('tabindex', '-1');
      });

      /* remove focusable elements from nodelist, e.g. popover inside dialog */
      module_state[id]['focusable_elements'] = [...focusable_elements].filter((focusable_element) => {
        return ![...remove_focusable_elements].includes(focusable_element);
      });

      /* saves item that opened dialog for later */
      self.a11y.focus_placeholder = document.activeElement;
      self.a11y.first_tab_stop = focusable_elements[0];
      self.a11y.last_tab_stop = focusable_elements[focusable_elements.length - 1];

      el.showModal();

      /* set focus to dialog (but not the first_tab_stop */
      setTimeout(() => {
        (self.a11y.first_tab_stop) && self.a11y.first_tab_stop.focus();
      }, 100);

      /* add keyboard event listener */
      el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      el.addEventListener('keydown', self.event_listeners.keyboard_focus_trap);
    },
    close: () => {
      document.removeEventListener('mousedown', self.event_listeners.mousedown_close);

      document.querySelectorAll("dialog").forEach((dialog) => {
        dialog.close();
      });

      /* updates dialog visuals */
      document.querySelectorAll("[data-module='dialog']").forEach((el, index) => {
        const id = el.getAttribute('id');
        const { focusable_elements } = module_state[id];

        /* remove focus from dialog elements */
        focusable_elements.forEach((focusable_element) => {
          focusable_element.setAttribute('tabindex', '-1');
        });

        /* remove keyboard event listener */
        el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      });
      document.querySelectorAll("[data-module='dialog.trigger']").forEach((trigger) => {
        trigger.setAttribute('aria-expanded', false);
      });

      /* set focus to self.a11y.focus_placeholder */
      self.a11y.focus_placeholder.focus();
    },
    a11y: {
      focus_placeholder: null,
      first_tab_stop: null,
      last_tab_stop: null,
      get_focusable_elements: (id) => {
        const { el } = module_state[id];
        module_state[id]['focusable_elements'] = el.querySelectorAll(focus_trap_selector);
        module_state[id]['remove_focusable_elements'] = el.querySelectorAll(remove_focus_selector);
      },
    },
  };
});
