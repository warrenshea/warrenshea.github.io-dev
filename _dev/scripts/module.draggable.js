'use strict';
storm_eagle.module('draggable', () => {
  let self;
  let state = {};
  return {
    data: {
      destination_type: "",
      code: "",
      callback: ""
    },
    initialize: () => {
      self = storm_eagle.draggable;
      state = {};
      document.querySelectorAll('[data-module="module.draggable"] [data-module="draggable.trigger"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          source: el.getAttribute('data-draggable-source'),
          type: el.getAttribute('data-draggable-type'),
          destination_type: el.getAttribute('data-draggable-destination-type'),
          callback: el.getAttribute('data-draggable-callback') || "",
        };
        self.event_listeners.trigger.initialize(id);
      });
      document.querySelectorAll('[data-module="module.draggable"] [data-module="draggable.droparea"]').forEach((el) => {
        self.event_listeners.destination.initialize(el);
      });
    },
    event_listeners: {
      trigger: {
        initialize: (id) => {
          const { el } = state[id];
          el.removeEventListener('mouseover', self.event_listeners.trigger.handle_mouseover);
          el.addEventListener('mouseover', self.event_listeners.trigger.handle_mouseover);
          el.removeEventListener('dragstart', self.event_listeners.trigger.handle_dragstart);
          el.addEventListener('dragstart', self.event_listeners.trigger.handle_dragstart);
        },
        handle_mouseover: async (event) => {
          const id = event.currentTarget.getAttribute('id');
          const { source, type, destination_type, callback } = state[id];
          self.data.destination_type = destination_type;
          self.data.callback = callback;

          switch (type) {
            case "async_function":
              //console.log('source type: async function');
              self.data.code = await storm_eagle.util.run_str_func(source);
              break;
            case "function":
              //console.log('source type: function');
              storm_eagle.util.run_str_func(source)
                .then((result) => {
                  self.data.code = result;
                })
                .catch((error) => {
                  console.error('Promise rejected:', error);
                });
              break;
            case "query_selector":
              //console.log('source type: query selector');
              self.data.code = document.querySelector(source).innerHTML;
              break;
            case "string":
              //console.log('source type: string');
              self.data.code = source;
              break;
            default:
          }
        },
        handle_dragstart: (event) => {
          event.dataTransfer.setData('text/plain', JSON.stringify(self.data));
        },
      },
      destination: {
        initialize: (el) => {
          el.removeEventListener('dragover', self.event_listeners.destination.handle_dragover);
          el.addEventListener('dragover', self.event_listeners.destination.handle_dragover);
          el.removeEventListener('dragenter', self.event_listeners.destination.handle_dragenter);
          el.addEventListener('dragenter', self.event_listeners.destination.handle_dragenter);
          el.removeEventListener('drop', self.event_listeners.destination.handle_drop);
          el.addEventListener('drop', self.event_listeners.destination.handle_drop);
        },
        handle_dragover: (event) => {
          event.preventDefault();
        },
        handle_dragenter: (event) => {
          event.preventDefault();
        },
        handle_drop: (event) => {
          const el = event.currentTarget;
          event.preventDefault();
          const data_temp = JSON.parse(event.dataTransfer.getData('text/plain'));
          if (data_temp.destination_type === "child") {
            el.innerHTML = data_temp.code;
          } else if (data_temp.destination_type === "replace") {
            el.outerHTML = data_temp.code;
          } else if (data_temp.destination_type === "above") {
            el.insertAdjacentHTML('beforebegin', data_temp.code);
          }
        },
      },
    }
  };
});