'use strict';
storm_eagle.module('form_theme_gl0b3x', () => {
  let self;

  return {
    initialize: () => {
      self = storm_eagle['form_theme_gl0b3x'];
      self.input_listener();
      self.textarea_autoexpand_listener();
    },
    ready: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x input, .form\\:theme\\:gl0b3x select, .form\\:theme\\:gl0b3x textarea').forEach((element) => {
        if (element.type !== 'radio' || element.type !== 'range') {
          self.force_set_active_label(element);
        }
      });
      document.querySelectorAll('.form\\:theme\\:gl0b3x textarea').forEach((element) => {
        self.force_textarea_autoexpand(element);
      });
    },
    force_set_active_label: (element) => {
      element.nextElementSibling.classList[element.value.length ? 'add' : 'remove']('active-label');
    },
    input_listener: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x input, .form\\:theme\\:gl0b3x select, .form\\:theme\\:gl0b3x textarea').forEach((element) => {
        if (element.type !== 'radio' || element.type !== 'range') {
          element.addEventListener('change', () => {
            self.force_set_active_label(element);
          });
        }
      });
    },
    force_textarea_autoexpand: (element) => {
      element.style.height = 'inherit';
      element.style.height = element.scrollHeight + 'px';
    },
    textarea_autoexpand_listener: () => {
      document.querySelectorAll('.form\\:theme\\:gl0b3x textarea').forEach((element) => {
        element.addEventListener('input', () => {
          self.force_textarea_autoexpand(element);
        });
      });
    },
  };
});

storm_eagle.module('form_parent_checkbox', () => {
  let self;
  let parent_checkbox_state = {};

  function _update_parent(parent_id) {
    let num_child_checkboxes_checked = 0;
    let num_checkboxes = 0;
    for (const [key, value] of Object.entries(parent_checkbox_state[parent_id])) {
      if (num_checkboxes > 0) {
        if (storm_eagle.checkbox.is_checked(document.getElementById(key))) {
          num_child_checkboxes_checked += 1;
        }
      }
      num_checkboxes += 1;
    }
    if (num_child_checkboxes_checked === 0) {
      document.getElementById(parent_id).setAttribute('aria-checked', 'false');
      document.getElementById(parent_id).checked = false;
    } else {
      if (num_child_checkboxes_checked === num_checkboxes - 1) {
        document.getElementById(parent_id).setAttribute('aria-checked', 'true');
        document.getElementById(parent_id).checked = true;
      } else {
        document.getElementById(parent_id).setAttribute('aria-checked', 'mixed');
        document.getElementById(parent_id).checked = true;
      }
    }
  }
  function _update_state(parent_id, id_clicked) {
    if (parent_id === id_clicked) {
      if (storm_eagle.checkbox.is_checked(document.getElementById(parent_id)) === false) {
        for (const [key, value] of Object.entries(parent_checkbox_state[parent_id])) {
          parent_checkbox_state[parent_id][key] = false;
          storm_eagle.checkbox.set_checked(document.getElementById(key), false);
        }
      } else if (storm_eagle.checkbox.is_checked(document.getElementById(parent_id)) === true) {
        for (const [key, value] of Object.entries(parent_checkbox_state[parent_id])) {
          parent_checkbox_state[parent_id][key] = true;
          storm_eagle.checkbox.set_checked(document.getElementById(key), true);
        }
      }
    } else {
      if (storm_eagle.checkbox.is_checked(document.getElementById(id_clicked)) === true) {
        parent_checkbox_state[parent_id][id_clicked] = false;
        storm_eagle.checkbox.set_checked(document.getElementById(id_clicked), false);
      } else if (storm_eagle.checkbox.is_checked(document.getElementById(id_clicked)) === false) {
        parent_checkbox_state[parent_id][id_clicked] = true;
        storm_eagle.checkbox.set_checked(document.getElementById(id_clicked), true);
      }
    }
    _update_parent(parent_id);
  }

  return {
    initialize: () => {
      self = storm_eagle['form_parent_checkbox'];
      document.querySelectorAll("[data-module='parent-checkbox']").forEach((el, num_child_checkboxes) => {
        let parent_checkbox_id = el.getAttribute('id');
        let checkbox_ids = el.getAttribute('aria-controls').split(' ');

        parent_checkbox_state[parent_checkbox_id] = {};
        parent_checkbox_state[parent_checkbox_id][parent_checkbox_id] = storm_eagle.checkbox.is_checked(document.getElementById(parent_checkbox_id));

        self.add_parent_event_listeners(parent_checkbox_id);

        for (let i = 0; i < checkbox_ids.length; i++) {
          parent_checkbox_state[parent_checkbox_id][checkbox_ids[i]] = storm_eagle.checkbox.is_checked(document.getElementById(checkbox_ids[i]));
          self.add_child_event_listeners(parent_checkbox_id, document.getElementById(checkbox_ids[i]));
        }
      });
    },
    add_parent_event_listeners: (parent_checkbox_id) => {
      document.getElementById(parent_checkbox_id).addEventListener('keydown', function (event) {
        _update_state(parent_checkbox_id, parent_checkbox_id);
      });
      document.getElementById(parent_checkbox_id).addEventListener('click', function (event) {
        _update_state(parent_checkbox_id, parent_checkbox_id);
      });
    },
    add_child_event_listeners: (parent_checkbox_id, el) => {
      el.addEventListener('change', function (event) {
        _update_state(parent_checkbox_id, el.getAttribute('id'));
      });
      el.addEventListener('keydown', function (event) {
        _update_state(parent_checkbox_id, el.getAttribute('id'));
      });
      el.addEventListener('click', function (event) {
        _update_state(parent_checkbox_id, el.getAttribute('id'));
      });
    },
  };
});
