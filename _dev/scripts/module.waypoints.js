storm_eagle.module('waypoint', function () {
  "use strict";

  let waypoint_state = {};

  return {
    initialize: function () {
      const self = this;
      document.querySelectorAll("[data-module='waypoint']").forEach(function(el){
        let waypoint_id = el.getAttribute("id");
        waypoint_state[waypoint_id] = {
          "add_class": el.getAttribute("data-waypoint-add"),
          "remove_class": el.getAttribute("data-waypoint-remove").split(/[,]+/),
          "delay": el.getAttribute("data-waypoint-delay"),
          "activate": el.getAttribute("data-waypoint-activate"),
          "new_waypoint_obj": {}
        };
        self.add_waypoint_listeners(waypoint_id);
      });
    },
    add_waypoint_listeners: function (waypoint_id) {
      waypoint_state[waypoint_id]["new_waypoint_obj"] = new Waypoint({
        element: document.getElementById(waypoint_id),
        handler: function() {
          let delay = waypoint_state[waypoint_id]["delay"] || 0;
          setTimeout(function(){
            document.getElementById(waypoint_id).classList.remove(...waypoint_state[waypoint_id]["remove_class"]);
            document.getElementById(waypoint_id).classList.add(waypoint_state[waypoint_id]["add_class"]);
          }, delay);
        },
        offset: waypoint_state[waypoint_id]["activate"]
      })
    }
  }
});