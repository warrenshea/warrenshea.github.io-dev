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
          "item": el.querySelectorAll("[data-module='carousel.item']:not(.display\\:none)"),
          "total_children": el.querySelectorAll("[data-module='carousel.item']:not(.display\\:none)").length,
          "item_height_variable": el.getAttribute("data-carousel-item-height-variable"),
          "breakpoint": el.getAttribute("data-carousel-breakpoint"),
          "transition_duration_array": JSON.parse(el.getAttribute("data-carousel-transition-duration")),
          "transition_duration": "",
          "number_of_active_array": JSON.parse(el.getAttribute("data-carousel-number-active")),
          "number_of_active": "",
          "offset_left_array": JSON.parse(el.getAttribute("data-carousel-offset")),
          "offset_left": "",
          "carousel_item_width": "",
          "current_active_carousel_item": ""
        };
        self.init_ui(carousel_id);
        self.update_carousel_state(carousel_id);

        //self.add_tab_carousel_id_listener(carousel_id);
      });
    },
    ready : function() {
      const self = this;
      document.querySelectorAll("[data-module='carousel']").forEach(function (el,index) {
        let carousel_id = el.getAttribute("id");
        self.add_swipe_listener(carousel_id);
        self.add_carousel_control_buttons_listener(carousel_id);
        self.add_resize_listener(carousel_id);
      });
    },
    init_ui : function(carousel_id){
      const self = this;

      /* adds a carousel id attribute to the carousel for debugging only */
      //document.getElementById(carousel_id).setAttribute("data-carousel-id", carousel_id);

      /* set the active item state property based on which DOM element has the 'active-item' class */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']:not(.display\\:none)").forEach(function(el, index) {
        if (el.classList.contains("active-item")) {
          carousel_state[carousel_id]["current_active_carousel_item"] = index; //set current_active_carousel_item as the carousel item control set as "active" in the HTML code
        }
      });
    },
    update_carousel : function(carousel_id) {
      const self = this;

      function set_active_items (carousel_id) {
        /* resets the active classes on the carousel items and adds the proper active classes */
        document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']:not(.display\\:none)").forEach(el => {
          el.removeClass("active-item").removeClass("active");
        });
        document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']:not(.display\\:none)")[carousel_state[carousel_id]["current_active_carousel_item"]].addClass("active-item");
        for (let i=0;i<carousel_state[carousel_id]["number_of_active"];i++) {
          let temp = carousel_state[carousel_id]["current_active_carousel_item"];
          if (carousel_state[carousel_id]["number_of_active"] % 2 === 0) { //even # of slides
            document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']:not(.display\\:none)")[carousel_state[carousel_id]["current_active_carousel_item"] + i].addClass("active");
          } else { //odd # of slides
            if (temp >= (-1 * (parseInt(carousel_state[carousel_id]["current_active_carousel_item"]) - 1)/2)) {

               // && temp <= ([carousel_state[carousel_id]["current_active_carousel_item"] - 1)/2)

              document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']:not(.display\\:none)")[carousel_state[carousel_id]["current_active_carousel_item"]].addClass("active");
            }
          }
        }

        /* resets the active classes on the carousel control and adds the proper active classes */
        document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control").forEach((el) => {
          el.removeClass("active-item");
        });
        document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control")[carousel_state[carousel_id]["current_active_carousel_item"]].addClass("active-item");
      }

      function update_controls (carousel_id) {
        /* show both chevrons */
        if (carousel_state[carousel_id]["total_children"] !== 1) {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev").removeClass("display:none").addClass("display:block");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next").removeClass("display:none").addClass("display:block");
        }
        /* hide chevrons */
        if (carousel_state[carousel_id]["current_active_carousel_item"] === 0){
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev").addClass("display:none").removeClass("display:block");
        } else if (carousel_state[carousel_id]["current_active_carousel_item"] === carousel_state[carousel_id]["total_children"]){
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next").addClass("display:none").removeClass("display:block");
        }
      }

      set_active_items(carousel_id);
      update_controls(carousel_id);

      /* ensures only links in the active carousel or tab-able */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item-group'] .item a").forEach(el => { el.setAttribute("tabindex","-1"); });
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item-group'] .item.active-item a").forEach(el => { el.setAttribute("tabindex","0"); });

      /* changes the left offset */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.left = (carousel_state[carousel_id]["offset_left"] - (carousel_state[carousel_id]["current_active_carousel_item"] * carousel_state[carousel_id]["carousel_item_width"])) + "px";

      /* ensures there's no transition duration except when we want the transition to occcur */
      setTimeout(function(){
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = "0s";
      }, carousel_state[carousel_id]["transition_duration"] * 1000);
    },
    add_carousel_indicators_listener : function(carousel_id){
      const self = this;

      /* reset the listeners */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control").forEach(el => {
        el.removeEventListener("click", function(){});
      });

      /* if a carousel control button is clicked, update the carousel and change the active state */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control").forEach(el => {
        el.addEventListener("click", function(e){
          e.preventDefault();
          document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
          carousel_state[carousel_id]["current_active_carousel_item"] = storm_eagle.util.index_in_parent(this);
          self.update_carousel(carousel_id);
        });
      });

    },
    add_carousel_control_buttons_listener : function(carousel_id){
      const self = this;

      function swipe_left(event) {
        event.preventDefault();
        console.log("left");
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").dispatchEvent(new Event("swiped-left"));
      }

      function swipe_right(event) {
        event.preventDefault();
        console.log("right");
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").dispatchEvent(new Event("swiped-right"));
      }

      /* reset the listeners */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next").removeEventListener("click", swipe_left);
      document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev").removeEventListener("click", swipe_right);

      /* if a carousel chevron is clicked, swipe the carousel */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next").addEventListener("click", swipe_left);
      document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev").addEventListener("click", swipe_right);
    },
    add_swipe_listener : function(carousel_id) {
      const self = this;

      /* if a coursel is swiped left */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").addEventListener("swiped-left", function(e){ //go -> in the carousel
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
        if (carousel_state[carousel_id]["current_active_carousel_item"] !== carousel_state[carousel_id]["total_children"] - carousel_state[carousel_id]["number_of_active"]){
          carousel_state[carousel_id]["current_active_carousel_item"]++;
          self.update_carousel(carousel_id);
        }
      });

      /* if a coursel is swiped right */
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").addEventListener("swiped-right", function(e){ //go <- in the carousel
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
        if (carousel_state[carousel_id]["current_active_carousel_item"] !== 0){
          carousel_state[carousel_id]["current_active_carousel_item"]--;
          self.update_carousel(carousel_id);
        }
      });
    },
    // add_tab_carousel_id_listener: function(carousel_id) {
    //   const self = this;

    //   /* iterate through data-tabable and, on focus, move carousel */
    //   document.getElementById(carousel_id).querySelectorAll("[data-tabable]").forEach(function(el) {
    //     el.addEventListener("focus", function(e) {
    //       if (document.getElementById(carousel_id).classList.contains("carousel-is-active")) {
    //         document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.transitionDuration = carousel_state[carousel_id]["transition_duration"] + "s";
    //         carousel_state[carousel_id]["current_active_carousel_item"] = el;
    //         self.update_carousel(carousel_id);
    //       }
    //     });
    //   });
    // },
    add_resize_listener: function (carousel_id) {
      const self = this;

      function force_resize() {
        return self.force_resize(carousel_id);
      }
      storm_eagle.resize_observer(document.querySelector("body"), force_resize);
    },
    reinitialize_carousel: function (carousel_id) {
      const self = this;

      /* indicate that the carousel is currently active, rather than disabled */
      document.getElementById(carousel_id).addClass("carousel-is-active");

      /* dynamically create the control buttons */
      // document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.controls']").forEach(el => {
      //   el.remove();
      // });
      document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").innerHTML = "";
      for (let i=0;i<(carousel_state[carousel_id]["total_children"]);i++){
        document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").innerHTML += '<button name="carousel-control-button" class="control cursor:pointer" aria-hidden="true" tabindex="-1"><span class="show-for-sr">Go to slide #' + (i + 1) + '</button>';
      }
      self.add_carousel_indicators_listener(carousel_id);

      /* set the active item class on the control buttons */
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control")[carousel_state[carousel_id]["current_active_carousel_item"]].addClass("active-item");
      //console.log(document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.indicators-group'] .control"));
      //console.log([carousel_state[carousel_id]["current_active_carousel_item"]]);

      /* updates the carousel width state property and updates the carousel container */
      carousel_state[carousel_id]["carousel_item_width"] = (document.getElementById(carousel_id).offsetWidth - (2 * carousel_state[carousel_id]["offset_left"])) / carousel_state[carousel_id]["number_of_active"];
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']").forEach(el => {
        el.style.width = carousel_state[carousel_id]["carousel_item_width"] + "px";
      });
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.width = carousel_state[carousel_id]["offset_left"] + (carousel_state[carousel_id]["carousel_item_width"] * carousel_state[carousel_id]["total_children"] + carousel_state[carousel_id]["number_of_active"] + 1) + "px";

      /* if the carousel item height changes, a height needs to be set for the container */
      if (carousel_state[carousel_id]["item_height_variable"] === "true") {
        document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.height = document.getElementById(carousel_id).querySelector(".items-group .item.active-item").offsetHeight + parseInt(document.getElementById(carousel_id).style.paddingBottom || 0) + "px";
      }
      self.update_carousel(carousel_id);
    },
    disable_carousel: function (carousel_id) {

      /* re-enables all links to be tab-able */
      document.getElementById(carousel_id).querySelectorAll(".items-group .item a").forEach(el => {
        el.setAttribute("tabindex", "0");
      });

      /* disable the carousel at this viewport */
      document.getElementById(carousel_id).removeClass("carousel-is-active");
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.left = 0;
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.width = "100%";
      document.getElementById(carousel_id).querySelector("[data-module='carousel.item-group']").style.height = "auto";
      document.getElementById(carousel_id).querySelectorAll("[data-module='carousel.item']").forEach(el => {
        el.style.width = (100 / document.getElementById(carousel_id).querySelector("[data-module='carousel.item']").length) + "%";
      });
    },
    update_carousel_state: function (carousel_id) {
      const self = this;

      /* if the value is > 1, then use a pixel value for the offset */
      /* if the value is > 0 and < 1, use the value as a percentage (e.g. 1/4 = .25) */
      function calculate_pixel_value (carousel_id, offsetValue) {
        if (offsetValue > 1) {
          return offsetValue;
        } else if (offsetValue > 0 && offsetValue < 1) {
          return document.getElementById(carousel_id).offsetWidth * offsetValue;
        } else {
          return 0;
        }
      }

      if (storm_eagle.client.viewport.is_sm_only()) {
        carousel_state[carousel_id]["offset_left"] = calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][0]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][0];
        carousel_state[carousel_id]["transition_duration"] = carousel_state[carousel_id]["transition_duration_array"][0];
      } else if (storm_eagle.client.viewport.is_md_only()) {
        carousel_state[carousel_id]["offset_left"] = calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][1]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][1];
        carousel_state[carousel_id]["transition_duration"] = carousel_state[carousel_id]["transition_duration_array"][1];
      } else if (storm_eagle.client.viewport.is_lg_only()) {
        carousel_state[carousel_id]["offset_left"] = calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][2]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][2];
        carousel_state[carousel_id]["transition_duration"] = carousel_state[carousel_id]["transition_duration_array"][2];
      } else if (storm_eagle.client.viewport.is_xl_up()) {
        carousel_state[carousel_id]["offset_left"] = calculate_pixel_value(carousel_id, carousel_state[carousel_id]["offset_left_array"][3]);
        carousel_state[carousel_id]["number_of_active"] = carousel_state[carousel_id]["number_of_active_array"][3];
        carousel_state[carousel_id]["transition_duration"] = carousel_state[carousel_id]["transition_duration_array"][3];
      }
    },
    force_resize: function (carousel_id) {
      const self = this;

      self.update_carousel_state(carousel_id);
      if (carousel_state[carousel_id]["breakpoint"] === "sm-only") {
        if (storm_eagle.client.viewport.is_sm_only()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("md+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("md+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("md+:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "sm-up") {
        if (storm_eagle.client.viewport.is_sm_up()) {
          self.reinitialize_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "md-down") {
        if (storm_eagle.client.viewport.is_md_down()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("lg+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("lg+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("lg+:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "md-only") {
        if (storm_eagle.client.viewport.is_md_only()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("sm=:hide").addClass("lg+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("sm=:hide").addClass("lg+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("sm=:hide").addClass("lg+:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "md-up") {
        if (storm_eagle.client.viewport.is_md_up()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("sm=:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("sm=:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("sm=:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "lg-down") {
        if (storm_eagle.client.viewport.is_lg_down()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("xl+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("xl+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("xl+:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "lg-only") {
        if (storm_eagle.client.viewport.is_lg_only()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("md-:hide").addClass("xl+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("md-:hide").addClass("xl+:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("md-:hide").addClass("xl+:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "lg-up") {
        if (storm_eagle.client.viewport.is_lg_up()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("md-:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("md-:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("md-:hide");
          self.disable_carousel(carousel_id);
        }
      } else if (carousel_state[carousel_id]["breakpoint"] === "xl-up") {
        if (storm_eagle.client.viewport.is_xl_up()) {
          self.reinitialize_carousel(carousel_id);
        } else {
          document.getElementById(carousel_id).querySelector("[data-module='carousel.indicators-group']").addClass("lg-:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-prev']").addClass("lg-:hide");
          document.getElementById(carousel_id).querySelector("[data-module='carousel.controls-next']").addClass("lg-:hide");
          self.disable_carousel(carousel_id);
        }
      } else {
        self.reinitialize_carousel(carousel_id);
      }

    }
  };
});