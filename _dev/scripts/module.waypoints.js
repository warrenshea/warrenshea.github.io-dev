storm_eagle.module('waypoint', () => {
  "use strict";

  let self;
  let waypoint_state = {};

  return {
    initialize: () => {
      self = storm_eagle["waypoint"];
      document.querySelectorAll("[data-module='waypoint']").forEach((el) =>{
        let waypoint_id = el.getAttribute("id");
        waypoint_state[waypoint_id] = {
          "element": el.getAttribute("data-waypoint-element"),
          "add_class": el.getAttribute("data-waypoint-add"),
          "remove_class": el.getAttribute("data-waypoint-remove"),
          "toggle_class": el.getAttribute("data-waypoint-toggle"),
          "delay": el.getAttribute("data-waypoint-delay"),
          "activate": el.getAttribute("data-waypoint-activate"),
          "new_waypoint_obj": {}
        };
        self.add_waypoint_listeners(waypoint_id);
      });
    },
    add_waypoint_listeners: (waypoint_id) => {
      waypoint_state[waypoint_id]["new_waypoint_obj"] = new Waypoint({
        element: ("this") ? document.getElementById(waypoint_id) : document.querySelector(waypoint_state[waypoint_id]["element"]),
        handler: () => {
          let delay = waypoint_state[waypoint_id]["delay"] || 0;
          setTimeout(() => {
            if (waypoint_state[waypoint_id]["remove_class"]) {
              document.getElementById(waypoint_id).classList.remove(...waypoint_state[waypoint_id]["remove_class"].split(/[,]+/));
            }
            if (waypoint_state[waypoint_id]["add_class"]) {
              document.getElementById(waypoint_id).classList.add(waypoint_state[waypoint_id]["add_class"]);
            }
            if (waypoint_state[waypoint_id]["toggle_class"]) {
              document.getElementById(waypoint_id).classList.toggle(waypoint_state[waypoint_id]["toggle_class"]);
            }
          }, delay);
        },
        offset: waypoint_state[waypoint_id]["activate"]
      })
    }
  }
});