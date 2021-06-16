// /* data-module: poopver         the modal
//    data-module: poopver-overlay the full screen part behind the modal
//    data-module: poopver-trigger the button that opens the modal */
// portfolio_health_check.module('popover', function () {
//   'use strict';

//   var focus_placeholder;
//   var popover_first_tab_stop;
//   var popover_last_tab_stop;
//   var popover_state = {};

//   function keyboard_popover_focus_trap(event) {
//     if (event.keyCode === keyboard.keys.tab) {
//       if (event.shiftKey) {
//         if (document.activeElement === popover_first_tab_stop) {
//           event.preventDefault();
//           popover_last_tab_stop.focus();
//         }
//       } else {
//         if (document.activeElement === popover_last_tab_stop) {
//           event.preventDefault();
//           popover_first_tab_stop.focus();
//         }
//       }
//     }

//     if (event.keyCode === keyboard.keys.esc || event.keyCode === keyboard.keys.enter && document.activeElement.hasAttribute("[data-module='popover.close']")) {
//       portfolio_health_check.popover.close();
//     }
//   }

//   return {
//     initialize: function initialize() {
//       var self = this;
//       document.querySelectorAll("[data-module='popover']").forEach(function (el, carousel_id) {
//         var popover_id = el.getAttribute("id");
//         popover_state[popover_id] = {
//           "focusable_elements": []
//         };
//         self.get_popover_focusable_elements(popover_id);
//       });
//       self.add_popover_resize_listener();
//       self.add_popover_overlay_close_listener();
//     },
//     open: function open(popover_trigger, popover_id) {
//       var self = this;
//       /* updates popover visuals */

//       document.querySelector("[data-module='popover.overlay']").classList.add('active');
//       popover_trigger.classList.add('active');
//       document.getElementById(popover_id).classList.add('active');
//       self.set_popover_location(popover_id);
//       /* removes focus from elements except in popover */

//       popover_state[popover_id]["focusable_elements"].forEach(function (el) {
//         el.setAttribute("tabindex", "0");
//       });
//       /* saves item that opened popover for later */

//       focus_placeholder = document.activeElement;
//       popover_first_tab_stop = popover_state[popover_id]["focusable_elements"][0];
//       popover_last_tab_stop = popover_state[popover_id]["focusable_elements"][popover_state[popover_id]["focusable_elements"].length - 1];
//       /* set focus to popover (but not the popover_first_tab_stop */

//       popover_first_tab_stop.focus();
//       /* add keyboard event listener */

//       document.getElementById(popover_id).addEventListener('keydown', keyboard_popover_focus_trap);
//     },
//     close: function close() {
//       var self = this;
//       /* updates popover visuals */

//       document.querySelector("[data-module='popover.overlay'].active").classList.remove('active');
//       document.querySelector("[data-module='popover'].active").setAttribute('tabindex', '-1');
//       document.querySelector("[data-module='popover'].active").setAttribute('aria-expanded', false);
//       document.querySelector("[data-module='popover'].active").classList.remove('active');
//       document.querySelector("[data-module='popover.trigger'].active").classList.remove('active');
//       document.querySelectorAll("[data-target='popover']").forEach(function (popover, carousel_id) {
//         var popover_id = popover.getAttribute("id");
//         /* remove focus from popover elements */

//         popover_state[popover_id]["focusable_elements"].forEach(function (el) {
//           el.setAttribute("tabindex", "-1");
//         });
//         /* remove keyboard event listener */

//         document.getElementById(popover_id).removeEventListener('keydown', keyboard_popover_focus_trap);
//       });
//       document.querySelectorAll("[data-module='popover.trigger']").forEach(function (popover_trigger) {
//         popover_trigger.setAttribute("aria-expanded", false);
//       });
//       /* set focus to focus_placeholder */

//       focus_placeholder.focus();
//     },
//     get_popover_focusable_elements: function get_popover_focusable_elements(popover_id) {
//       var self = this;
//       popover_state[popover_id]["focusable_elements"] = document.getElementById(popover_id).querySelectorAll(focus_trap_selector);
//     },
//     add_popover_overlay_close_listener: function add_popover_overlay_close_listener() {
//       var self = this;
//       document.querySelector("[data-module='popover.overlay']").addEventListener('click', function () {
//         self.close();
//       });
//     },
//     add_popover_resize_listener: function add_popover_resize_listener() {
//       var self = this;
//       window.addEventListener("resize", function (event) {
//         if (document.querySelector("[data-module='popover'].active")) {
//           self.set_popover_location(document.querySelector("[data-module='popover'].active").getAttribute("id"));
//         }
//       });
//     },
//     set_popover_location: function set_popover_location(popover_id) {
//       var popover_trigger = document.querySelector("[data-module='popover.trigger'].active");
//       var popover = document.getElementById(popover_id);

//       if (portfolio_health_check.client.viewport.is_small() || portfolio_health_check.client.viewport.is_medium()) {
//         popover.style.top = "initial";
//         popover.style.left = "0px";
//       } else if (portfolio_health_check.client.viewport.is_large() || portfolio_health_check.client.viewport.is_xlarge()) {
//         popover.style.top = popover_trigger.offsetTop + "px";
//         popover.style.left = popover_trigger.offsetLeft + 40 + "px";
//       }
//     }
//   };
// });

/* @TODO: Infinite Scroll */
/* @TODO: Autoplay */
storm_eagle.module("carousel", function () {
  "use strict";

  let carousel_state =  {};

  return {
    initialize : function(){
      const self = this;
      document.querySelectorAll("[data-module='carousel']").forEach(function (el) {
        let carousel_id = el.getAttribute("id");
        carousel_state[carousel_id] = {
          "item_group": el.querySelector("[data-module='carousel.item-group']"),
          "item": el.querySelectorAll("[data-module='carousel.item']"),
          "total_children": el.querySelectorAll("[data-module='carousel.item']").length,
          "item_height_variable": el.getAttribute("data-carousel-item-height-variable"),
          "breakpoint": el.getAttribute("data-carousel-breakpoint"),
          "transition_duration": parseInt(el.getAttribute("data-carousel-transition-duration")),
          "number_of_active_array": JSON.parse(el.getAttribute("data-carousel-number-active")),
          "offset_left_array": JSON.parse(el.getAttribute("data-carousel-offset")),
          "number_of_active": "",
          "carousel_item_offset_left": "",
          "carousel_item_width": "",
          "current_active_carousel_item": ""
        };
        console.log(carousel_state[carousel_id]);
        self.init_ui(carousel_id);
        self.add_resize_listener();
        self.add_swipe_listener(carousel_id);
        self.add_tab_carousel_id_listener(carousel_id);
        self.add_carousel_indicators_listener(carousel_id);
        self.update_carousel_state(carousel_id);
        self.reinitialize_carousel(carousel_id);
      });
    },
    ready : function() {
      const self = this;
      self.force_resize();
    },
    init_ui : function(carousel_id){
      const self = this;

      /* adds a carousel id attribute to the carousel for debugging only */
      document.getElementById(carousel_id).setAttribute("data-carousel-id", carousel_id);

      /* set the active item state property based on which DOM element has the 'active-item' class */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']").forEach(function(el, index) {
        if (el.classList.contains("active-item")) {
          carousel_state[carousel_id]["current_active_carousel_item"] = index; //set current_active_carousel_item as the carousel item control set as "active" in the HTML code
        }
      });
    },
    update_carousel : function(carousel_id) {
      const self = this;

      self.set_active_items(carousel_id);
      self.update_controls(carousel_id);

      /* ensures only links in the active carousel or tab-able */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").querySelectorAll(".item a").forEach(el => {
        el.attr("tabindex","-1");
      });
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").querySelectorAll(".item.active-item a").forEach(el => {
        el.attr("tabindex","0");
      });

      /* changes the left offset */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.left = (carousel_state[carousel_id]["carousel_item_offset_left"] - (carousel_state[carousel_id]["current_active_carousel_item"] * carousel_state[carousel_id]["carousel_item_width"])) + "px";

      /* ensures there's no transition duration except when we want the transition to occcur */
      setTimeout(function(){
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = "0s";
      }, carousel_state[carousel_id]["transition_duration"] * 1000);

      console.log(carousel_state[carousel_id]);
    },
    set_active_items : function(carousel_id) {

      /* resets the active classes on the carousel items and adds the proper active classes */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']").forEach(el => {
        el.classList.remove("active-item","active");
      });
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']")[carousel_state[carousel_id]["current_active_carousel_item"]].classList.add("active-item");
      for (let i=0;i<carousel_state[carousel_id]["number_of_active"];i++) {
        document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']")[carousel_state[carousel_id]["current_active_carousel_item"] + i].classList.add("active");
      }

      /* resets the active classes on the carousel control and adds the proper active classes */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.controls']").forEach((el, index) => {
        el.classList.remove("active-item");
      });
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.controls']")[carousel_state[carousel_id]["current_active_carousel_item"]].classList.add("active-item");
    },
    update_controls : function(carousel_id) {
      /* show both chevrons */
      if (carousel_state[carousel_id]["total_children"] !== 1) {
        if (document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev")) {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev").classList.remove("display:none");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev").classList.add("display:block");
        }
        if (document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next")) {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next").classList.remove("display:none");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next").classList.add("display:block");
        }
      }
      /* hide chevrons */
      if (carousel_state[carousel_id]["current_active_carousel_item"] === 0){
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev").classList.add("display:none");
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev").classList.remove("display:block");
      } else if (carousel_state[carousel_id]["current_active_carousel_item"] === carousel_state[carousel_id]["total_children"] - carousel_state[carousel_id]["number_of_active"]){
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next").classList.add("display:none");
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next").classList.remove("display:block");
      }
    },
    add_carousel_indicators_listener : function(carousel_id){
      const self = this;

      /* reset the listeners */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.controls']").forEach(el => {
        el.removeEventListener("click", function(){});
      });
      if (document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next")) {
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next").removeEventListener("click", function(){});
      }
      if (document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev")) {
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev").removeEventListener("click", function(){});
      }

      /* if a carousel control button is clicked, update the carousel and change the active state */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.controls']").forEach(el => {
        el.addEventListener("click", function(e){
          e.preventDefault();
          document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
          carousel_state[carousel_id]["current_active_carousel_item"] = storm_eagle.util.index_in_parent(this);
          self.update_carousel(carousel_id);
        });
      });

      /* if a carousel chevron is clicked, swipe the carousel */
      if (document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next")) {
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .next").addEventListener("click", function(e){
          e.preventDefault();
          document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").dispatchEvent(new Event("swiped-left"));
        });
      }

      if (document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev")) {
        document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group'] .prev").addEventListener("click", function(e){
          e.preventDefault();
          document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").dispatchEvent(new Event("swiped-right"));
        });
      }
    },
    add_swipe_listener : function(carousel_id) {
      const self = this;

      /* if a coursel is swiped left */
      document.getElementById(carousel_id).addEventListener("swiped-left", function(e){ //go -> in the carousel
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
        if (carousel_state[carousel_id]["current_active_carousel_item"] !== carousel_state[carousel_id]["total_children"] - carousel_state[carousel_id]["number_of_active"]){
          carousel_state[carousel_id]["current_active_carousel_item"]++;
          self.update_carousel(carousel_id);
        }
      });

      /* if a coursel is swiped right */
      document.getElementById(carousel_id).addEventListener("swiped-right", function(e){ //go <- in the carousel
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
        if (carousel_state[carousel_id]["current_active_carousel_item"] !== 0){
          carousel_state[carousel_id]["current_active_carousel_item"]--;
          self.update_carousel(carousel_id);
        }
      });
    },
    add_tab_carousel_id_listener: function(carousel_id) {
      const self = this;

      /* iterate through data-tabable and, on focus, move carousel */
      document.getElementById(carousel_id).querySelectorAll("[data-tabable]").forEach(function(el) {
        this.addEventListener("focus", function(e) {
          if (document.getElementById(carousel_id).classList.contains("carousel-is-active")) {
            document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
            carousel_state[carousel_id]["current_active_carousel_item"] = el;
            self.update_carousel(carousel_id);
          }
        });
      });
    },
    add_resize_listener: function () {
      const self = this;

      window.addEventListener("resize", (event) => {
        self.force_resize();
      })
    },
    reinitialize_carousel: function (carousel_id) {
      const self = this;

      /* indicate that the carousel is currently active, rather than disabled */
      document.getElementById(carousel_id).classList.add("carousel-is-active");

      /* dynamically create the control buttons */
      // document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.controls']").forEach(el => {
      //   el.remove();
      // });
      document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").innerHTML = "";
      for (let i=0;i<=(carousel_state[carousel_id]["total_children"] - carousel_state[carousel_id]["number_of_active"]);i++){
        document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").innerHTML += '<button name="carousel-control-button" class="control cursor:pointer" aria-hidden="true" tabindex="-1"><span class="show-for-sr">Go to slide #' + (i + 1) + '</button>';
      }
      self.add_carousel_indicators_listener(carousel_id);

      /* set the active item class on the control buttons */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control")[carousel_state[carousel_id]["current_active_carousel_item"]].classList.add("active-item");

      /* updates the carousel width state property and updates the carousel container */
      carousel_state[carousel_id]["carousel_item_width"] = (document.getElementById(carousel_id).offsetWidth - (2 * carousel_state[carousel_id]["carousel_item_offset_left"])) / carousel_state[carousel_id]["number_of_active"];
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']").forEach(el => {
        el.style.width = carousel_state[carousel_id]["carousel_item_width"] + "px";
      });
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.width = carousel_state[carousel_id]["carousel_item_offset_left"] + (carousel_state[carousel_id]["carousel_item_width"] * carousel_state[carousel_id]["total_children"]) + "px";

      /* if the carousel item height changes, a height needs to be set for the container */
      if (document.getElementById(carousel_id)["item_height_variable"] === true) {
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.height = document.getElementById(carousel_id).querySelector(".items-group .item.active-item").outerHeight() + parseInt(document.getElementById(carousel_id).style.paddingBottom) + "px";
      }
      self.update_carousel(carousel_id);
    },
    disable_carousel: function (carousel_id) {

      /* re-enables all links to be tab-able */
      document.getElementById(carousel_id).querySelectorAll(".items-group .item a").forEach(el => {
        el.setAttribute("tabindex", "0");
      });

      /* disable the carousel at this viewport */
      document.getElementById(carousel_id).classList.remove("carousel-is-active");
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.left = 0;
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.width = "100%";
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.height = "auto";
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']").forEach(el => {
        el.style.width = (100 / document.getElementById(carousel_id).querySelector("[data-module='carousel.item']").length) + "%";
      });
    },
    update_carousel_state: function (carousel_id) {
      const self = this;
      if (storm_eagle.client.viewport.is_small()) {
        carousel_state[carousel_id]["carousel_item_offset_left"] = self.calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][0]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][0];
      } else if (storm_eagle.client.viewport.is_medium()) {
        carousel_state[carousel_id]["carousel_item_offset_left"] = self.calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][1]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][1];
      } else if (storm_eagle.client.viewport.is_large()) {
        carousel_state[carousel_id]["carousel_item_offset_left"] = self.calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][2]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][2];
      } else if (storm_eagle.client.viewport.is_xlarge()) {
        carousel_state[carousel_id]["carousel_item_offset_left"] = self.calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][3]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][3];
      }
    },
    force_resize: function () {
      const self = this;

      document.querySelectorAll("[data-module='carousel']").forEach(function (el) {
        let carousel_id = el.getAttribute("id");
        self.update_carousel_state(carousel_id);
        if (carousel_state[carousel_id]["breakpoint"] === "small-only") {
          if (storm_eagle.client.viewport.is_small()) {
            self.reinitialize_carousel(carousel_id);
          } else {
            document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").classList.add("hide-for-md");
            document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group']").classList.add("hide-for-md");
            self.disable_carousel(carousel_id);
          }
        } else if (carousel_state[carousel_id]["breakpoint"] === "medium-down") {
          if (storm_eagle.client.viewport.is_small() || storm_eagle.client.viewport.is_medium()) {
            self.reinitialize_carousel(carousel_id);
          } else {
            document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").classList.add("hide-for-lg");
            document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-group']").classList.add("hide-for-lg");
            self.disable_carousel(carousel_id);
          }
        } else {
          self.reinitialize_carousel(carousel_id);
        }
      });
    },
    /* if the value is > 1, then use a pixel value for the offset */
    /* if the value is > 0 and < 1, use the value as a percentage (e.g. 1/4 = .25) */
    calculate_pixel_value: function (carousel_id, offsetValue) {

      if (offsetValue > 1) {
        return offsetValue;
      } else if (offsetValue > 0 && offsetValue < 1) {
        return document.getElementById(carousel_id).offsetWidth * offsetValue;
      } else {
        return 0;
      }
    }
  };
});