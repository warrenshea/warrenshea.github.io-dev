'use strict';

let temp_string_storage = {};
temp_string_storage.code = "";

storm_eagle.module('draggable', () => {
  let self;
  let draggable_state = {};
  return {
    initialize: () => {
      self = storm_eagle['draggable'];
      document.querySelectorAll('[data-module="module.draggable"] [data-module="draggable.trigger"]').forEach((el) => {
        let draggable_id = el.getAttribute('id');
        draggable_state[menu_id] = {
          mid: el.getAttribute('data-module-id'),
        };
        self.add_trigger_event_listeners(draggable_id);
      });
    },
    add_trigger_event_listeners: (draggable_id) => {
      draggable_state[draggable_id].addEventListener('mouseover', async (event) => {
        temp_string_storage.code = await zero_system.component_library.render_module(draggable_state[draggable_id]["mid"]);
        temp_string_storage.code = storm_eagle.util.minify_html(temp_string_storage.code);
      });
      draggable_state[draggable_id].addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', temp_string_storage.code);
      });
    }
  };
});