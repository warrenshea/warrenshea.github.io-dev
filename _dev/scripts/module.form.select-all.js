'use strict';
storm_eagle.module('form.select_all', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.form.select_all;
      state = {};
      self.setup();
    },
    ready: () => {
      document.querySelectorAll('[data-module="select-all"]').forEach((el) => {
        const id = el.getAttribute('id');
        self.ui.initialize(id);
      });
    },
    setup: () => {
      document.querySelectorAll('[data-module="select-all"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          type: el.getAttribute('data-select-all-type'),
          type_elements: (el.getAttribute('data-select-all-type') === "checkbox") ? el.querySelectorAll("input[type='checkbox']") : el.querySelectorAll("button[type='button']") ,
          select_all_radiobuttons_id: el.getAttribute('data-select-all-bind'),
          onupdate: el.getAttribute('data-select-all-onupdate-func') || false,
        };
        self.event_listeners.elements.initialize(id);
        self.event_listeners.select_all_radiobuttons.initialize(id);
      });
    },
    ui: {
      initialize: (id) => {
        self.ui.set_select_all_radio(id);
      },
      set_select_all_radio: (id) => {
        let count = 0;
        const { type, type_elements, select_all_radiobuttons_id, onupdate } = state[id];
        type_elements.forEach((el) => {
          if (type === 'checkbox') {
            if (storm_eagle.checkbox.is_checked(el)) {
              count++;
            }
          } else if (type === 'switch') {
            if (storm_eagle.button.is_checked(el)) {
              count++;
            }
          }
        });
        if (count === 0) {
          /* None */
          document.querySelectorAll(`#${select_all_radiobuttons_id} > input`)[1].checked = true;
        } else if (count === type_elements.length) {
          /* All */
          document.querySelectorAll(`#${select_all_radiobuttons_id} > input`)[0].checked = true;
        } else {
          /* Some */
          document.querySelectorAll(`#${select_all_radiobuttons_id} > input`)[2].checked = true;
        }
        if (onupdate) {
          storm_eagle.util.run_str_func( onupdate, { id } );
        }
      },
      set_all_elements: (id, value) => {
        const { type, type_elements, select_all_radiobuttons_id, onupdate } = state[id];
        type_elements.forEach((el) => {
          if (el.getAttribute("data-module") === "parent-checkbox") {
            storm_eagle.checkbox.set_aria_checked(el, value);
            storm_eagle.checkbox.set_checked(el, value);
          } else {
            if (type === 'checkbox') {
              storm_eagle.checkbox.set_checked(el, value);
            } else if (type === 'switch') {
              storm_eagle.button.set_checked(el, value);
            }
          }
        });
        if (onupdate) {
          storm_eagle.util.run_str_func( onupdate, { id } );
        }
      },
    },
    event_listeners: {
      elements: {
        initialize: (id) => {
          const { type_elements } = state[id];
          type_elements.forEach((el) => {
            el.addEventListener('click', (event) => {
              setTimeout(() => {
                self.ui.set_select_all_radio(id);
              }, 0);
            });
          });
        }
      },
      select_all_radiobuttons: {
        initialize: (id) => {
          const { select_all_radiobuttons_id } = state[id];
          document.querySelectorAll(`#${select_all_radiobuttons_id} > input`)[0].addEventListener('click', (event) => {
            self.ui.set_all_elements(id, true);
          });
          document.querySelectorAll(`#${select_all_radiobuttons_id} > input`)[1].addEventListener('click', (event) => {
            self.ui.set_all_elements(id, false);
          });
        }
      },
    },
  };
});
