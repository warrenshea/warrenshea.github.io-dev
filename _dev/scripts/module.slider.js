storm_eagle.module('slider', function () {
  "use strict";

  let slider_state =  {};

  return {
    initialize: function() {
      const self = this;
      document.querySelectorAll("[data-module='slider']").forEach(function (el) {
        let slider_id = el.getAttribute("id");
        slider_state[slider_id] = {
          "num_labels": document.getElementById(slider_id).querySelectorAll("[data-module='slider.labels'] > * ").length
        };
        self.add_slider_listener(slider_id);
        self.add_resize_listener(slider_id);
        self.update_slider_track(slider_id);
      });
    },
    ready: function() {
      const self = this;
      document.querySelectorAll("[data-module='slider']").forEach(function (el) {
        let slider_id = el.getAttribute("id");
        self.force_resize(slider_id);
      });
    },
    force_resize: function(slider_id) {
      let slider_thumb_width = 26;
      let container_width = document.getElementById(slider_id).querySelector("[data-module='slider.input-container']").offsetWidth;
      let new_label_width = container_width / (slider_state[slider_id]["num_labels"] - 1);
      container_width = container_width + new_label_width - slider_thumb_width;
      document.getElementById(slider_id).querySelector("[data-module='slider.labels']").style.width = container_width + "px";
      document.getElementById(slider_id).querySelector("[data-module='slider.labels']").style.left = (0 + (slider_thumb_width/2) - (new_label_width / 2)) +  "px";
    },
    add_slider_listener: function(slider_id) {
      var self = this;

      let el = document.getElementById(slider_id).querySelector("[data-module='slider.input']");
      el.addEventListener("input", function(e){
        self.update_slider_track(slider_id);
      });
    },
    update_slider_track: function(slider_id) {
      let el = document.getElementById(slider_id).querySelector("[data-module='slider.input']");
      var percentage = Math.round((el.value - el.getAttribute("min")) / (el.getAttribute("max") - el.getAttribute("min")) * 100);
      document.getElementById(slider_id).querySelector("[data-module='slider.fill']").style.width = percentage + "%";
    },
    add_resize_listener: function (slider_id) {
      const self = this;

      function force_resize() {
        return self.force_resize(slider_id);
      }
      storm_eagle.resize_observer(document.getElementById(slider_id), force_resize);
    },
  }
});