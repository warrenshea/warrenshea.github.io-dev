storm_eagle.module('slider', function () {
  "use strict";

  let slider_state =  {};

  return {
    initialize: function initialize() {
      var self = this;
      document.querySelectorAll("[data-module='slider']").forEach(function (el) {
        let slider_id = el.getAttribute("id");
        slider_state[slider_id] = {

        };
        self.add_slider_listener(slider_id);
      });

    },
    add_slider_listener: function add_slider_listener(slider_id) {
      var self = this;
      document.getElementById(slider_id).querySelector("[data-module='slider.input']").addEventListener("input", function(e){
        self.update_slider_track(slider_id);
      });
    },
    update_slider_track: function update_slider_track(slider_id) {
      var percentage = Math.round((document.getElementById(slider_id).querySelector("[data-module='slider.input']").value - document.getElementById(slider_id).querySelector("[data-module='slider.input']").getAttribute("min")) / (document.getElementById(slider_id).querySelector("[data-module='slider.input']").getAttribute("max") - document.getElementById(slider_id).querySelector("[data-module='slider.input']").getAttribute("min")) * 100);
      document.getElementById(slider_id).querySelector("[data-module='slider.fill']").style.width = percentage + "%";
    }
  }
});