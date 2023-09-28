storm_eagle.module('responsive_emulation', () => {
  'use strict';
  let self;
  let responsive_emulation_state =  {};
  return {
    initialize: () => {
      self = storm_eagle["responsive_emulation"];
      document.querySelectorAll("[data-module='responsive-emulation']").forEach(el => {
        let responsive_emulation_id = el.getAttribute("id");
        responsive_emulation_state[responsive_emulation_id] = {
          "container": el.querySelector("[data-module='responsive-emulation.container']"),
          "width": el.querySelector("[data-module='responsive-emulation.container']").style.width
        }
        //self.resize_listener(responsive_emulation_id);
      });
    },
    update_container_width: (responsive_emulation_id,value) => {
      responsive_emulation_state[responsive_emulation_id]["container"].style.width = value + "px";
      responsive_emulation_state[responsive_emulation_id]["width"] = parseInt(value);
      self.add_emulate_class(responsive_emulation_id);
    },
    // resize_listener: (responsive_emulation_id) => {
    //   function force_resize() {
    //     // responsive_emulation_state[responsive_emulation_id]
    //     // responsive_emulation_state[responsive_emulation_id]["container_width"] = document.getElementById('table-container').style.width;
    //     // responsive_emulation_state[responsive_emulation_id]["container_width"] = responsive_emulation_state[responsive_emulation_id]["container_width"].replace("px","");
    //     // // console.log(responsive_emulation_state[responsive_emulation_id]["container_width"]);
    //     self.add_emulate_class(responsive_emulation_id);
    //   }
    //   storm_eagle.resize_observer(document.getElementById(responsive_emulation_id), force_resize);
    // },
    add_emulate_class: (responsive_emulation_id) => {
      responsive_emulation_state[responsive_emulation_id]["container"].classList.remove("emulate:sm=","emulate:sm+","emulate:md-","emulate:md=","emulate:md+","emulate:lg-","emulate:lg=","emulate:lg+","emulate:xl+");
      if (self.is_sm_only(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:sm=");
      }
      if (self.is_sm_up(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:sm+");
      }
      if (self.is_md_down(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:md-");
      }
      if (self.is_md_only(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:md=");
      }
      if (self.is_md_up(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:md+");
      }
      if (self.is_lg_down(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:lg-");
      }
      if (self.is_lg_only(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:lg=");
      }
      if (self.is_lg_up(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:lg+");
      }
      if (self.is_xl_up(responsive_emulation_id)) {
        responsive_emulation_state[responsive_emulation_id]["container"].classList.add("emulate:xl+");
      }
    },
    is_sm_only: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["sm_min"] && responsive_emulation_state[responsive_emulation_id]["width"] < breakpoints["md_min"]) ? true : false; },
    is_sm_up: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["sm_min"]) ? true : false; },
    is_md_down: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["sm_min"] && responsive_emulation_state[responsive_emulation_id]["width"] < breakpoints["lg_min"]) ? true : false; },
    is_md_only: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["md_min"] && responsive_emulation_state[responsive_emulation_id]["width"] < breakpoints["lg_min"]) ? true : false; },
    is_md_up: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["md_min"]) ? true : false; },
    is_lg_down: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["sm_min"] && responsive_emulation_state[responsive_emulation_id]["width"] < breakpoints["xl_min"]) ? true : false; },
    is_lg_only: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["lg_min"] && responsive_emulation_state[responsive_emulation_id]["width"] < breakpoints["xl_min"]) ? true : false; },
    is_lg_up: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["lg_min"]) ? true : false; },
    is_xl_up: (responsive_emulation_id) => { return (responsive_emulation_state[responsive_emulation_id]["width"] >= breakpoints["xl_min"]) ? true : false; },
  };
});