'use strict';

var draggable_storage = {
  destination_type: "",
  code: "",
};

storm_eagle.module('draggable', () => {
  let self;
  let draggable_state = {};
  return {
    initialize: () => {
      self = storm_eagle['draggable'];
      document.querySelectorAll('[data-module="module.draggable"] [data-module="draggable.trigger"]').forEach((el) => {
        let draggable_id = el.getAttribute('id');
        draggable_state[draggable_id] = {
          source: el.getAttribute('data-draggable-source'),
          type: el.getAttribute('data-draggable-type'),
          destination_type: el.getAttribute('data-draggable-destination-type'),
        };
        self.add_trigger_event_listeners(draggable_id);
      });
      document.querySelectorAll('[data-module="module.draggable"] [data-module="draggable.droparea"]').forEach((el) => {
        self.add_destination_event_listeners(el);
      });
    },
    add_trigger_event_listeners: (draggable_id) => {

      document.getElementById(draggable_id).addEventListener('mouseover', async (event) => {
        draggable_storage.destination_type = draggable_state[draggable_id]["destination_type"];

        switch (draggable_state[draggable_id]["type"]) {
          case "async_function":
            //console.log("source type: async function");
            draggable_storage.code = await storm_eagle.util.run_str_func(draggable_state[draggable_id]["source"], {});
            break;
          case "function":
            //console.log("source type: function");
            storm_eagle.util.run_str_func(draggable_state[draggable_id]["source"], {})
              .then((result) => {
                draggable_storage.code = result;
              })
              .catch((error) => {
                console.error('Promise rejected:', error);
              });
            break;
          case "query_selector":
            //console.log("source type: query selector");
            draggable_storage.code = document.querySelector(draggable_state[draggable_id]["source"]).innerHTML;
            break;
          case "string":
            //console.log("source type: string");
            draggable_storage.code = draggable_state[draggable_id]["source"];
            break;
          default:
        }
      });

      document.getElementById(draggable_id).addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(draggable_storage));
      });
    },
    add_destination_event_listeners: (el) => {

      el.addEventListener('dragover', (event) => {
        event.preventDefault();
      });

      el.addEventListener('dragenter', (event) => {
        event.preventDefault();
      });

      el.addEventListener('drop', (event) => {
        event.preventDefault();
        const draggable_storage_temp = JSON.parse(event.dataTransfer.getData('text/plain'));
        if (draggable_storage_temp.destination_type === "child") {
          el.innerHTML = draggable_storage_temp.code;
        } else if (draggable_storage_temp.destination_type === "replace") {
          el.outerHTML = draggable_storage_temp.code;
        } else if (draggable_storage_temp.destination_type === "above") {
          el.insertAdjacentHTML('beforebegin', draggable_storage_temp.code);
        }
      });
    }

  };
});