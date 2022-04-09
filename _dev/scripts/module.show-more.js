storm_eagle.module("show_more", function () {
  "use strict";

  let show_more_state = {};

  return {
    initialize: function() {
      const self = this;
      document.querySelectorAll("[data-module='show-more']").forEach(function(el){
        let show_more_id = el.getAttribute("id");
        show_more_state[show_more_id] = {
          "transition_duration": el.getAttribute("data-show-more-transition-duration"),
          "offset": el.getAttribute("data-show-more-offset"),
          "container": el.querySelector("[data-module='show-more.container']"),
          "container_height": "",
          "more_button": el.nextElementSibling.querySelector("[data-module='show-more.more']"),
          "less_button": el.nextElementSibling.querySelector("[data-module='show-more.less']")
        };
        self.init_ui(show_more_id);
        self.resize_listener(show_more_id);
        self.add_button_listener(show_more_id);
      });
    },
    init_ui: function(show_more_id) {
      const self = this;
      document.getElementById(show_more_id).style.transitionProperty = "height";
      document.getElementById(show_more_id).style.transitionTimingFunction = "ease";
    },
    update_container_height: function(show_more_id) {

      setTimeout(function () {
        document.getElementById(show_more_id).style.transitionDuration = "0s";
      }, show_more_state[show_more_id]["transition_duration"] * 1000);

      document.getElementById(show_more_id).style.height = show_more_state[show_more_id]["container_height"] - show_more_state[show_more_id]["offset"] + "px";
    },
    add_button_listener: function(show_more_id) {
      const self = this;

      show_more_state[show_more_id]["more_button"].addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById(show_more_id).style.transitionDuration = show_more_state[show_more_id]["transition_duration"] + "s";
        show_more_state[show_more_id]["more_button"].removeClass("display:inline").addClass("display:none");
        show_more_state[show_more_id]["less_button"].removeClass("display:none").addClass("display:inline");
        document.getElementById(show_more_id).addClass("active");
        self.force_resize(show_more_id);
      });

      show_more_state[show_more_id]["less_button"].addEventListener("click", function(e){
        e.preventDefault();
        document.getElementById(show_more_id).style.transitionDuration = show_more_state[show_more_id]["transition_duration"] + "s";
        show_more_state[show_more_id]["more_button"].removeClass("display:none").addClass("display:inline");
        show_more_state[show_more_id]["less_button"].removeClass("display:inline").addClass("display:none");
        document.getElementById(show_more_id).removeClass("active");
        self.force_resize(show_more_id);
      });
    },
    resize_listener: function (show_more_id) {
      const self = this;

      function force_resize() {
        return self.force_resize(show_more_id);
      }
      storm_eagle.resize_observer(document.querySelector("body"), force_resize);
    },
    force_resize(show_more_id) {
      const self = this;

      if (document.getElementById(show_more_id).classList.contains("active")) {
        show_more_state[show_more_id]["container_height"] = show_more_state[show_more_id]["container"].getBoundingClientRect().height;
      } else {
        show_more_state[show_more_id]["container_height"] = show_more_state[show_more_id]["container"].querySelector("[data-show-more-bottom]").offsetTop - show_more_state[show_more_id]["container"].querySelector("[data-show-more-top]").offsetTop;
      }
      self.update_container_height(show_more_id);
    }
  };
});