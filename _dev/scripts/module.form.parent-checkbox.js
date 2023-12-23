'use strict';
storm_eagle.module('form_parent_checkbox', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.form_parent_checkbox;
      state = {};
      document.querySelectorAll("[data-module='parent-checkbox']").forEach((el) => {
        const id = el.getAttribute('id');
        const checkbox_ids = el.getAttribute('aria-controls').split(' ');

        state[id] = {};
        state[id][id] = storm_eagle.checkbox.is_checked(document.getElementById(id));

        self.event_listeners.parent.initialize(id);
        for (let i = 0; i < checkbox_ids.length; i++) {
          state[id][checkbox_ids[i]] = storm_eagle.checkbox.is_checked(document.getElementById(checkbox_ids[i]));
          self.event_listeners.child.initialize(id, document.getElementById(checkbox_ids[i]));
        }
      });
    },
    event_listeners: {
      parent: {
        initialize: (id) => {
          document.getElementById(id).removeEventListener('keydown', self.event_listeners.parent.update);
          document.getElementById(id).addEventListener('keydown', self.event_listeners.parent.update);
          document.getElementById(id).removeEventListener('click', self.event_listeners.parent.update);
          document.getElementById(id).addEventListener('click', self.event_listeners.parent.update);
        },
        update: (event) => {
          const id = event.currentTarget.getAttribute("id");
          self.state.update(id, id);
        },
      },
      child: {
        initialize: (id, el) => {
          el.removeEventListener('change', self.event_listeners.child.update);
          el.addEventListener('change', self.event_listeners.child.update);
          el.removeEventListener('keydown', self.event_listeners.child.update);
          el.addEventListener('keydown', self.event_listeners.child.update);
          el.removeEventListener('click', self.event_listeners.child.update);
          el.addEventListener('click', self.event_listeners.child.update);
        },
        update: (event) => {
          const el = event.currentTarget
          const parent_id = storm_eagle.util.closest_parent(el,`[data-module="parent-checkbox.container"]`).querySelector(`[data-module="parent-checkbox"]`).getAttribute("id");
          const id = el.getAttribute("id");
          self.state.update(parent_id, id);
        },
      }
    },
    state: {
      update: (id, id_clicked) => {
        if (id === id_clicked) {
          if (storm_eagle.checkbox.is_checked(document.getElementById(id)) === false) {
            for (const [key, value] of Object.entries(state[id])) {
              state[id][key] = false;
              storm_eagle.checkbox.set_checked(document.getElementById(key), false);
            }
          } else if (storm_eagle.checkbox.is_checked(document.getElementById(id)) === true) {
            for (const [key, value] of Object.entries(state[id])) {
              state[id][key] = true;
              storm_eagle.checkbox.set_checked(document.getElementById(key), true);
            }
          }
        } else {
          if (storm_eagle.checkbox.is_checked(document.getElementById(id_clicked)) === true) {
            state[id][id_clicked] = false;
            storm_eagle.checkbox.set_checked(document.getElementById(id_clicked), false);
          } else if (storm_eagle.checkbox.is_checked(document.getElementById(id_clicked)) === false) {
            state[id][id_clicked] = true;
            storm_eagle.checkbox.set_checked(document.getElementById(id_clicked), true);
          }
        }
        self.state.parent(id);
      },
      parent: (id) => {
        let num_child_checkboxes_checked = 0;
        let num_checkboxes = 0;
        for (const [key, value] of Object.entries(state[id])) {
          if (num_checkboxes > 0) {
            if (storm_eagle.checkbox.is_checked(document.getElementById(key))) {
              num_child_checkboxes_checked += 1;
            }
          }
          num_checkboxes += 1;
        }
        if (num_child_checkboxes_checked === 0) {
          document.getElementById(id).setAttribute('aria-checked', 'false');
          document.getElementById(id).checked = false;
        } else {
          if (num_child_checkboxes_checked === num_checkboxes - 1) {
            document.getElementById(id).setAttribute('aria-checked', 'true');
            document.getElementById(id).checked = true;
          } else {
            document.getElementById(id).setAttribute('aria-checked', 'mixed');
            document.getElementById(id).checked = true;
          }
        }
      }
    },
  };
});
