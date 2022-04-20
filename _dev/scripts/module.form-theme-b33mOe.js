storm_eagle.module('form_theme_b33mOe', () => {
  "use strict";
  let self;

  return {
    initialize: () => {
      self = storm_eagle["form_theme_b33mOe"];
      self.input_listener();
      self.textarea_autoexpand_listener();
    },
    ready: () => {
      document.querySelectorAll('.form\\:theme\\:b33mOe input, .form\\:theme\\:b33mOe select, .form\\:theme\\:b33mOe textarea').forEach( element => {
        if (element.type !== 'radio') {
          self.force_set_active_label(element);
        }
      });
      document.querySelectorAll(".form\\:theme\\:b33mOe textarea").forEach( element => {
        self.force_textarea_autoexpand(element);
      });
    },
    force_set_active_label: (element) => {
      element.nextElementSibling.classList[(element.value.length ? 'add' : 'remove')]('active-label');
    },
    input_listener: () => {
      document.querySelectorAll('.form\\:theme\\:b33mOe input, .form\\:theme\\:b33mOe select, .form\\:theme\\:b33mOe textarea').forEach( element => {

        if (element.type !== 'radio') {
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
      document.querySelectorAll(".form\\:theme\\:b33mOe textarea").forEach( element => {
        element.addEventListener('input', () => {
          self.force_textarea_autoexpand(element);
        });
      });
    }
  };
});

storm_eagle.module('form_parent_checkbox', () => {
  "use strict";
  let self;
  let parent_checkbox_state = {};

  function _is_checked(el) {
    if (typeof el.checked === 'boolean') {
      return el.checked;
    }
    // If ARIA checkbox widget
    return el.getAttribute('aria-checked') === 'true';
  }

  function _set_checked(key,value) {
    let el = document.getElementById(key);
    if (typeof el.checked === 'boolean') {
      switch (value.toString()) {
        case 'true':
          el.checked = true;
          break;
        case 'false':
          el.checked = false;
          break;
        default:
          break;
      }
    }
    // If ARIA checkbox widget
    //if (typeof el.getAttribute('aria-checked') === 'string') {
    switch (value.toString()) {
      case 'true':
      case 'false':
        el.ariaChecked = value;
        break;
      default:
        break;
    }
  }

  function _update_parent(parent_id) {
    let num_child_checkboxes_checked = 0;
    let num_checkboxes = 0;
    for (const [key,value] of Object.entries(parent_checkbox_state[parent_id])) {
      if (num_checkboxes > 0) {
        if (_is_checked(document.getElementById(key))) {
          num_child_checkboxes_checked += 1
        }
      }
      num_checkboxes += 1;
    }
    if (num_child_checkboxes_checked === 0) {
      document.getElementById(parent_id).setAttribute('aria-checked', 'false');
      document.getElementById(parent_id).checked = false;
    } else {
      if (num_child_checkboxes_checked === (num_checkboxes - 1)) {
        document.getElementById(parent_id).setAttribute('aria-checked', 'true');
        document.getElementById(parent_id).checked = true;
      } else {
        document.getElementById(parent_id).setAttribute('aria-checked', 'mixed');
        document.getElementById(parent_id).checked = true;
      }
    }
  }
  function _update_state(parent_id,id_clicked) {

    if (parent_id === id_clicked) {
      if (_is_checked(document.getElementById(parent_id)) === false) {

        for (const [key,value] of Object.entries(parent_checkbox_state[parent_id])) {
          parent_checkbox_state[parent_id][key] = false;
          _set_checked(key,false);
        }
      } else if (_is_checked(document.getElementById(parent_id)) === true) {
        for (const [key,value] of Object.entries(parent_checkbox_state[parent_id])) {
          parent_checkbox_state[parent_id][key] = true;
          _set_checked(key,true);
        }
      }
    } else {
      if (_is_checked(document.getElementById(id_clicked)) === true) {
        parent_checkbox_state[parent_id][id_clicked] = false;
        _set_checked(id_clicked,false);
      } else if (_is_checked(document.getElementById(id_clicked)) === false) {
        parent_checkbox_state[parent_id][id_clicked] = true;
        _set_checked(id_clicked,true);
      }
    }
    _update_parent(parent_id);
  }


  return {
    initialize: () => {
      self = storm_eagle["form_parent_checkbox"];
      document.querySelectorAll("[data-module='parent-checkbox']").forEach((el,num_child_checkboxes) => {
        let parent_checkbox_id = el.getAttribute("id");
        let checkbox_ids = el.getAttribute('aria-controls').split(' ');

        parent_checkbox_state[parent_checkbox_id] = {};
        parent_checkbox_state[parent_checkbox_id][parent_checkbox_id] = _is_checked(document.getElementById(parent_checkbox_id));

        self.add_parent_event_listeners(parent_checkbox_id);

        for (let i=0;i<checkbox_ids.length;i++) {
          parent_checkbox_state[parent_checkbox_id][checkbox_ids[i]] = _is_checked(document.getElementById(checkbox_ids[i]));
          self.add_child_event_listeners(parent_checkbox_id,document.getElementById(checkbox_ids[i]));
        }
      });
    },
    add_parent_event_listeners: (parent_checkbox_id) => {
      document.getElementById(parent_checkbox_id).addEventListener('keydown', function(event) {
        _update_state(parent_checkbox_id,parent_checkbox_id);
      });
      document.getElementById(parent_checkbox_id).addEventListener('click', function(event) {
        _update_state(parent_checkbox_id,parent_checkbox_id);
      });
    },
    add_child_event_listeners: (parent_checkbox_id,el) => {
      el.addEventListener('change', function(event) {
        _update_state(parent_checkbox_id,el.getAttribute("id"));
      });
      el.addEventListener('keydown', function(event) {
        _update_state(parent_checkbox_id,el.getAttribute("id"));
      });
      el.addEventListener('click', function(event) {
        _update_state(parent_checkbox_id,el.getAttribute("id"));
      });
    }
  };
});