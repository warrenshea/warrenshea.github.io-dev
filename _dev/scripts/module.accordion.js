'use strict';
/*
  @TODO: a11y keyboard functionality
  https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/
*/
storm_eagle.module('accordion', () => {
  let self;
  let module_state = {};

  const handle_header_click = (event) => {
    self.update_accordion_item(event.currentTarget.getAttribute('id'));
  };

  return {
    initialize: () => {
      self = storm_eagle.accordion;
      module_state = {};
      document.querySelectorAll('[data-module="accordion"]').forEach((el) => {
        let id = el.getAttribute('id');
        module_state[id] = {
          id,
          el,
          all_headers: el.querySelectorAll(':scope > div > * > [data-module="accordion.header"],:scope > [data-module="accordion.header"]'),
          all_panels: el.querySelectorAll(':scope > div > [data-module="accordion.panel"],:scope > [data-module="accordion.panel"]'),
          active_setting: el.getAttribute('data-accordion-active'),
          initial_active: JSON.parse(el.getAttribute('data-accordion-initial')),
        };
        self.manage_event_listeners(id);
        self.init_ui(id);
      });
    },
    manage_event_listeners: (id) => {
      const { all_headers } = module_state[id];
      all_headers.forEach((header) => {
        header.removeEventListener('click', handle_header_click);
        header.addEventListener('click', handle_header_click);
      });
    },
    update_accordion_item: (header_id) => {
      const el = document.getElementById(header_id);
      const module_id = storm_eagle.util.closest_parent(el,`[data-module='accordion']`).getAttribute("id");
      const { all_headers, active_setting } = module_state[module_id];
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
    open: (panel_id, module_id) => {
      const { active_setting, all_panels } = module_state[module_id];
      if (active_setting === 'single') {
        all_panels.forEach((panel) => {
          panel.setAttribute("data-accordion-panel","hide");
        });
        document.getElementById(panel_id).setAttribute("data-accordion-panel","");
        storm_eagle.equalize_heights.force_resize();
      } else if (active_setting === 'multiple') {
        const panel = document.getElementById(panel_id);
        const current_state = panel.getAttribute("data-accordion-panel");
        panel.setAttribute("data-accordion-panel", current_state === "hide" ? "" : "hide");
        storm_eagle.equalize_heights.force_resize();
      }
    },
    init_ui: (id) => {
      const { el, all_headers, all_panels, initial_active } = module_state[id];
      all_headers.forEach((header, index) => {
        let panel = header.parentNode.nextElementSibling;
        header.setAttribute('tabindex', '-1');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', panel.getAttribute('id'));
        panel.setAttribute('aria-labelledby', header.getAttribute('id'));
        if (index === 0) {
          header.setAttribute('tabindex', '0');
          header.addEventListener('focusin', () => {
            el.classList.add('focus');
          });
          header.addEventListener('focusout', () => {
            el.classList.remove('focus');
          });
        }
      });
      all_panels.forEach((panel) => {
        panel.setAttribute("data-accordion-panel","hide");
      });
      all_headers.forEach((header, index) => {
        if (initial_active[index] === 1) {
          header.click();
        }
      });
    },
  };
});
