'use strict';
storm_eagle.module('waypoint', () => {
  let self;
  let module_state = {};

  return {
    initialize: () => {
      self = storm_eagle.waypoint;
      module_state = {};
      document.querySelectorAll("[data-module='waypoint']").forEach((el) => {
        const id = el.getAttribute('id');
        module_state[id] = {
          el,
          element: el.getAttribute('data-waypoint-element'),
          add_class: el.getAttribute('data-waypoint-add-classes') ? el.getAttribute('data-waypoint-add-classes').split(',') : '',
          remove_class: el.getAttribute('data-waypoint-remove-classes') ? el.getAttribute('data-waypoint-remove-classes').split(',') : '',
          toggle_class: el.getAttribute('data-waypoint-toggle-classes') ? el.getAttribute('data-waypoint-toggle-classes').split(',') : '',
          delay: el.getAttribute('data-waypoint-delay'),
          activate: el.getAttribute('data-waypoint-activate'),
          new_waypoint_obj: {},
        };
        self.event_listeners.initialize(id);
      });
    },
    event_listeners: {
      initialize: (id) => {
        const { element, add_class, remove_class, toggle_class, delay=0, activate } = module_state[id];
        module_state[id]['new_waypoint_obj'] = new Waypoint({
          element: 'this' ? document.getElementById(id) : document.querySelector(element),
          handler: () => {
            setTimeout(() => {
              (remove_class) && document.getElementById(id).classList.remove(...remove_class);
              (add_class) && document.getElementById(id).classList.add(...add_class);
              (toggle_class) && document.getElementById(id).classList.toggle(...toggle_class);
            }, delay);
          },
          offset: activate,
        });
      }
    },
  };
});
