'use strict';
/*
  @TODO: a11y keyboard functionality
  https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/
*/
storm_eagle.module('accordion', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.accordion;
      state = {};
      document.querySelectorAll('[data-module="accordion"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          all_headers: el.querySelectorAll(':scope > div > * > [data-module="accordion.header"],:scope > [data-module="accordion.header"]'),
          all_panels: el.querySelectorAll(':scope > div > [data-module="accordion.panel"],:scope > [data-module="accordion.panel"]'),
          active_setting: el.getAttribute('data-accordion-active'),
          initial_active: JSON.parse(el.getAttribute('data-accordion-initial')),
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
        self.ui.initialize_initial_active(id);
      });
    },
    ui: {
      initialize: (id) => {
        const { el, all_headers, all_panels } = state[id];
        all_headers.forEach((header, index) => {
          const panel = header.parentNode.nextElementSibling;
          header.setAttribute('tabindex', '-1');
          header.setAttribute('aria-expanded', 'false');
          header.setAttribute('aria-controls', panel.getAttribute('id'));
          panel.setAttribute('aria-labelledby', header.getAttribute('id'));
          if (index === 0) {
            header.setAttribute('tabindex', '0');
            header.removeEventListener('focusin', self.event_listeners.header_focus.add);
            header.addEventListener('focusin', self.event_listeners.header_focus.add);
            header.removeEventListener('focusout', self.event_listeners.header_focus.remove);
            header.addEventListener('focusout', self.event_listeners.header_focus.remove);
          }
        });
        all_panels.forEach((panel) => {
          panel.setAttribute("data-accordion-panel","hide");
        });
      },
      initialize_initial_active: (id) => {
        const { all_headers, initial_active } = state[id];
        all_headers.forEach((header,index) => {
          if (initial_active[index] === 1) {
            header.click();
          }
        });
      },
    },
    event_listeners: {
      initialize: (id) => {
        const { all_headers } = state[id];
        all_headers.forEach((header) => {
          header.removeEventListener('click', self.event_listeners.update_accordion_item);
          header.addEventListener('click', self.event_listeners.update_accordion_item);
        });
      },
      update_accordion_item: (event) => {
        const el = event.currentTarget;
        const module_id = storm_eagle.util.closest_parent(el,`[data-module='accordion']`).getAttribute("id");
        const { all_headers, active_setting } = state[module_id];
        if (active_setting === 'single') {
          all_headers.forEach((header) => {
            header.setAttribute('aria-expanded', 'false');
          });
          el.setAttribute('aria-expanded', 'true');
          self.open(el.getAttribute('aria-controls'),module_id);
        } else if (active_setting === 'multiple') {
          el.setAttribute('aria-expanded', el.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
          self.open(el.getAttribute('aria-controls'),module_id);
        }
      },
      header_focus: {
        add: (event) => {
          event.currentTarget.classList.add('focus');
        },
        remove: (event) => {
          event.currentTarget.classList.remove('focus');
        },
      }
    },
    open: (panel_id, module_id) => {
      const { active_setting, all_panels } = state[module_id];
      if (active_setting === 'single') {
        all_panels.forEach((panel) => {
          panel.setAttribute("data-accordion-panel","hide");
        });
        document.getElementById(panel_id).setAttribute("data-accordion-panel","");
        storm_eagle.equalize_heights.force_resize();
      } else if (active_setting === 'multiple') {
        const panel = document.getElementById(panel_id);
        panel.setAttribute("data-accordion-panel", panel.getAttribute("data-accordion-panel") === "hide" ? "" : "hide");
        storm_eagle.equalize_heights.force_resize();
      }
    },
  };
});
