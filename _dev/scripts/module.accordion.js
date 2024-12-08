'use strict';
/**
 * Accordion Module
 *
 * A utility to manage collapsible panels on a page with support for single or multiple panels open at a time.
 *
 * Methods Overview:
 * - accordion.initialize()
 * - accordion.setup
 * - accordion.ui.initialize
 * - accordion.ui.animate_panel_open
 * - accordion.ui.animate_panel_close
 * - accordion.event_listeners.initialize
 * - accordion.event_listeners.header.click.update_accordion_item
 * - accordion.event_listeners.header.focus.focus_class.add
 * - accordion.event_listeners.header.focus.focus_class.remove
 * - accordion.action.toggle_accordion_item
 * - accordion.action.open
 */

storm_eagle.module('accordion', () => {
  let self;
  let state = {};

  return {
    /**
     * Initializes the accordion module.
     * Finds all accordions on the page and sets up their states and event listeners.
     */
    initialize: () => {
      self = storm_eagle.accordion;
      state = {};
      self.setup();
    },

    /**
     * Configures all accordion elements on the page.
     * Initializes their headers, panels, and initial states.
     */
    setup: () => {
      document.querySelectorAll('[data-module="accordion"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          all_headers: el.querySelectorAll(':scope > div > * > [data-module="accordion.header"],:scope > [data-module="accordion.header"]'),
          all_panels: el.querySelectorAll(':scope > div > [data-module="accordion.panel"],:scope > [data-module="accordion.panel"]'),
          active_mode: el.getAttribute('data-accordion-active-mode'),
          initial_active: JSON.parse(el.getAttribute('data-accordion-initial')),
          all_panel_collapse_allowed: el.getAttribute('data-accordion-collapse-allowed') === 'true',
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
      });
    },

    /**
     * UI-related functions for accordion.
     */
    ui: {
      /**
       * Initializes the accordion UI by setting up attributes and event listeners for headers and panels.
       * @param {string} id - The ID of the accordion instance.
       */
      initialize: (id) => {
        const { el, all_headers, all_panels, initial_active } = state[id];
        all_headers.forEach((header, index) => {
          const panel = header.parentNode.nextElementSibling;
          header.setAttribute('aria-expanded', 'false');
          header.setAttribute('aria-controls', panel.getAttribute('id'));
          panel.setAttribute('aria-labelledby', header.getAttribute('id'));
          if (index === 0) {
            header.removeEventListener('focusin', self.event_listeners.header.focus.focus_class.add);
            header.addEventListener('focusin', self.event_listeners.header.focus.focus_class.add);
            header.removeEventListener('focusout', self.event_listeners.header.focus.focus_class.remove);
            header.addEventListener('focusout', self.event_listeners.header.focus.focus_class.remove);
          }
          if (initial_active[index]) {
            header.setAttribute('aria-expanded', 'true');
          }
        });

        all_panels.forEach((panel, index) => {
          panel.style.height = '0px'; // Start all panels closed
          panel.setAttribute('data-accordion-panel', 'hide');

          if (initial_active[index]) {
            self.ui.animate_panel_open(panel, true); // Pass `true` if immediate animation is not required
          }
        });
      },

      /**
       * Animates the opening of a panel.
       * @param {HTMLElement} panel - The panel element to open.
       * @param {boolean} on_initialize - Whether this is during initialization.
       */
      animate_panel_open: (panel, on_initialize) => {
        panel.style.height = 'auto';
        //refactor when calc-size(auto) is supported
        if (!on_initialize) {
          const panel_height = panel.scrollHeight + 'px';
          panel.style.height = '0px';
          requestAnimationFrame(() => {
            panel.style.height = panel_height;
            setTimeout(() => {
              panel.style.height = 'auto';
            }, 250);
          });
        }
        panel.setAttribute('data-accordion-panel', '');
      },

      /**
       * Animates the closing of a panel.
       * @param {HTMLElement} panel - The panel element to close.
       */
      animate_panel_close: (panel) => {
        //refactor when calc-size(auto) is supported
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panel.style.height = '0px';
        });
        panel.setAttribute('data-accordion-panel', 'hide');
      },
    },

    /**
     * Event listener-related functions for accordion headers.
     */
    event_listeners: {
      /**
       * Initializes event listeners for the headers of a specific accordion instance.
       * @param {string} id - The ID of the accordion instance.
       */
      initialize: (id) => {
        const { all_headers } = state[id];
        all_headers.forEach((header) => {
          header.removeEventListener('click', self.event_listeners.header.click.update_accordion_item);
          header.addEventListener('click', self.event_listeners.header.click.update_accordion_item);
        });
      },

      header: {
        click: {
          /**
           * Handles click events for accordion headers.
           * @param {Event} event - The click event.
           */
          update_accordion_item: (event) => {
            const header = event.currentTarget;
            const id = storm_eagle.util.closest_parent(header, '[data-module="accordion"]').getAttribute('id');
            self.action.toggle_accordion_item(id, header);
          },
        },
        focus: {
          focus_class: {
            /**
             * Adds a focus class to the header.
             * @param {Event} event - The focusin event.
             */
            add: (event) => {
              event.currentTarget.classList.add('focus');
            },
            /**
             * Removes a focus class from the header.
             * @param {Event} event - The focusout event.
             */
            remove: (event) => {
              event.currentTarget.classList.remove('focus');
            },
          },
        },
      },
    },

    /**
     * Action-related functions to manage accordion behavior.
     */
    action: {
      /**
       * Toggles the state of an accordion item.
       * @param {string} id - The ID of the accordion instance.
       * @param {HTMLElement} header - The header element to toggle.
       */
      toggle_accordion_item: (id, header) => {
        const { all_headers, all_panels, all_panel_collapse_allowed, active_mode } = state[id];
        const is_expanded = header.getAttribute('aria-expanded') === 'true';
        const panel_id = header.getAttribute('aria-controls');
        const panel = document.getElementById(panel_id);

        // If collapsing is not allowed, ensure at least one panel stays open
        if (!all_panel_collapse_allowed) {
            const open_headers = Array.from(all_headers).filter(
                (h) => h.getAttribute('aria-expanded') === 'true'
            );

            // If only one panel is open and the user is trying to close it, exit early
            if (is_expanded && open_headers.length === 1) {
                return;
            }
        }

        // Adjusting all panels and headers if 'single' mode is active
        if (active_mode === 'single') {
          all_headers.forEach(h => h.setAttribute('aria-expanded', 'false'));
          all_panels.forEach(p => self.ui.animate_panel_close(p));
        }

        // Setting the current panel state
        header.setAttribute('aria-expanded', !is_expanded);
        if (!is_expanded) {
          self.ui.animate_panel_open(panel);
        } else {
          self.ui.animate_panel_close(panel);
        }

        storm_eagle.equalize_heights.force_resize();
      },

      /**
       * Opens a specific panel by ID.
       * @param {string} id - The ID of the accordion instance.
       * @param {string} panel_id - The ID of the panel to open.
       */
      open: (id, panel_id) => {
        if (state[id]) {
          const { active_mode, all_panels } = state[id];
          if (active_mode === 'single') {
            all_panels.forEach((panel) => {
              panel.setAttribute('data-accordion-panel', 'hide');
            });
            document.getElementById(panel_id).setAttribute('data-accordion-panel', '');
            storm_eagle.equalize_heights.force_resize();
          } else if (active_mode === 'multiple') {
            const panel = document.getElementById(panel_id);
            panel.setAttribute('data-accordion-panel', panel.getAttribute('data-accordion-panel') === 'hide' ? '' : 'hide');
            storm_eagle.equalize_heights.force_resize();
          }
        } else {
          console.error(`Accordion (id="${id}") does not exist`);
        }
      },
    },
  };
});