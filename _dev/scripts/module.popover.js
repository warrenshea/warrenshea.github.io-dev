'use strict';
/**
 * data-module=popover         the popover
 * data-module=popover.overlay the full screen part behind the modal
 * data-module=popover.trigger the button that opens the popover
 */
storm_eagle.module('popover', () => {
  let self;
  let state = {};
  let overlay;

  return {
    initialize: () => {
      self = storm_eagle.popover;
      state = {};
      self.setup();
      self.event_listeners.initialize();
    },
    setup: () => {
      document.querySelectorAll("[data-module='popover']").forEach((el, index) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          focusable_elements: [],
          remove_focusable_elements: [],
        };
        self.a11y.get_focusable_elements(id);
      });
      self.ui.create_popover_overlay();
    },
    ui: {
      set_location: (id) => {
        const { el  } = state[id];
        let trigger = document.querySelector("[data-module='popover.trigger'][data-popover='active']");

        if (storm_eagle.client.viewport.is_md_down()) {
          el.style.top = 'initial';
          el.style.left = '0px';
          el.style.transform = `none`;
        } else if (storm_eagle.client.viewport.is_lg_up()) {
          el.style.transform = `translateY(-50%)`;
          el.style.left = `${trigger.getBoundingClientRect().width + 16}px`; //16 is the box arrow width
        }
      },
      create_popover_overlay: () => {
        document.body.insertAdjacentHTML('beforeend', '<div data-module="popover.overlay" class="popover-overlay"></div>');
        overlay = document.querySelector("[data-module='popover.overlay']");
      },
    },
    event_listeners: {
      initialize: (event) => {
        self.event_listeners.resize();
      },
      resize: () => {
        const force_resize = () => {
          if (document.querySelector("[data-module='popover'][data-popover='active']")) {
            self.ui.set_location(document.querySelector("[data-module='popover'][data-popover='active']").getAttribute('id'));
          }
        }
        storm_eagle.resize_observer(document.querySelector('body'), force_resize);
      },
      mousedown_close: (event) => {
        if (overlay && event.target.getAttribute("data-module") === 'popover.overlay') {
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
        if (event.keyCode === keyboard.keys.esc) {
          self.close();
        }
      },
    },
    open: (id, trigger) => {
      const { el, focusable_elements, remove_focusable_elements } = state[id];
      document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
      document.addEventListener('mousedown', self.event_listeners.mousedown_close);

      focusable_elements.forEach((focusable_element) => {
        focusable_element.setAttribute('tabindex', '0');
      });
      remove_focusable_elements.forEach((remove_focusable_element) => {
        remove_focusable_element.setAttribute('tabindex', '-1');
      });
      /* remove focusable elements from nodelist, e.g. popover inside dialog */
      state[id]['focusable_elements'] = [...focusable_elements].filter((focusable_element) => {
        return ![...remove_focusable_elements].includes(focusable_element);
      });

      /* saves item that opened popover for later */
      self.a11y.focus_placeholder = document.activeElement;
      self.a11y.first_tab_stop = state[id]['focusable_elements'][0];
      self.a11y.last_tab_stop = state[id]['focusable_elements'][state[id]['focusable_elements'].length - 1];

      /* updates popover visuals */
      el.setAttribute("data-popover","active");
      overlay.setAttribute("data-popover","active");
      trigger.setAttribute("data-popover","active");
      self.ui.set_location(id);

      /* set focus to popover (but not the self.a11y.first_tab_stop */
      setTimeout(() => {
        (self.a11y.first_tab_stop) && self.a11y.first_tab_stop.focus();
      }, 100);

      /* add keyboard event listener */
      el.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      el.addEventListener('keydown', self.event_listeners.keyboard_focus_trap);
    },
    close: () => {
      /* updates popover visuals */
      document.removeEventListener('mousedown', self.event_listeners.mousedown_close);
      document.querySelector("[data-module='popover'][data-popover='active']").setAttribute('tabIndex', '-1');
      document.querySelector("[data-module='popover'][data-popover='active']").setAttribute('aria-expanded', false);
      document.querySelectorAll("[data-popover='active']").forEach((el) => {
        el.setAttribute("data-popover","");
      });
      document.querySelectorAll("[data-target='popover']").forEach((popover, index) => {
        const id = popover.getAttribute('id');
        const { focusable_elements } = state[id];

        /* remove focus from popover elements */
        focusable_elements.forEach((focusable_element) => {
          focusable_element.setAttribute('tabindex', '-1');
        });

        /* remove keyboard event listener */
        popover.removeEventListener('keydown', self.event_listeners.keyboard_focus_trap);
      });
      document.querySelectorAll("[data-module='popover.trigger']").forEach((trigger) => {
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
        const { el } = state[id];
        state[id]['focusable_elements'] = el.querySelectorAll(focus_trap_selector);
        state[id]['remove_focusable_elements'] = el.querySelectorAll(remove_focus_selector);
      },
    },
  };
});
