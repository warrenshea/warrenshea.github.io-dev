'use strict';
/*
  @TODO: a11y keyboard functionality
  https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/
  @TODO: fix event listener issue on reinitialize
*/
storm_eagle.module('accordion', () => {
  let self;
  let module_state = {};

  return {
    initialize: () => {
      self = storm_eagle['accordion'];
      module_state = {};
      document.querySelectorAll('[data-module="accordion"]').forEach((el) => {
        let id = el.getAttribute('id');
        module_state[id] = {
          id,
          all_headers: el.querySelectorAll(':scope > div > * > [data-module="accordion.header"],:scope > [data-module="accordion.header"]'),
          all_panels: el.querySelectorAll(':scope > div > [data-module="accordion.panel"],:scope > [data-module="accordion.panel"]'),
          active_setting: el.getAttribute('data-accordion-active'),
          initial_active: JSON.parse(el.getAttribute('data-accordion-initial')),
        };
        self.init_ui(module_state[id]);
        self.add_event_listeners(module_state[id]);
      });
    },
    add_event_listeners: (state) => {
      const { id, all_headers, active_setting } = state;
      const handle_click = (event) => {
        let el = event.currentTarget;
        if (active_setting === 'single') {
          all_headers.forEach((header) => {
            header.setAttribute('aria-expanded', 'false');
          });
          el.setAttribute('aria-expanded', 'true');
          self.open(state, el.getAttribute('aria-controls'));
        } else if (active_setting === 'multiple') {
          el.setAttribute('aria-expanded', el.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
          self.open(state, el.getAttribute('aria-controls'));
        }
      };
      all_headers.forEach((header) => {
        header.removeEventListener('click', handle_click);
        header.addEventListener('click', handle_click);
      });
    },
    init_ui: (state) => {
      const { id, all_headers, all_panels, initial_active } = state;
      all_headers.forEach((header, index) => {
        let panel = header.parentNode.nextElementSibling;
        header.setAttribute('tabindex', '-1');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', panel.getAttribute('id'));
        panel.setAttribute('aria-labelledby', header.getAttribute('id'));
        if (index === 0) {
          header.setAttribute('tabindex', '0');
          header.addEventListener('focusin', () => {
            document.getElementById(id).classList.add('focus');
          });
          header.addEventListener('focusout', () => {
            document.getElementById(id).classList.remove('focus');
          });
        }
      });
      all_panels.forEach((panel) => {
        panel.classList.add('display:none');
      });
      all_headers.forEach((header, index) => {
        if (initial_active[index] === 1) {
          header.click();
        }
      });
    },
    open: (state, panel_id) => {
      const { active_setting, all_panels } = state;
      if (active_setting === 'single') {
        all_panels.forEach((panel) => {
          panel.classList.add('display:none');
        });
        document.getElementById(panel_id).classList.remove('display:none');
        storm_eagle.equalize_heights.force_resize();
      } else if (active_setting === 'multiple') {
        document.getElementById(panel_id).classList.toggle('display:none');
        storm_eagle.equalize_heights.force_resize();
      }
    },
  };
});
