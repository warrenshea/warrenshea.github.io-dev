/*
  @TODO: a11y keyboard functionality
  https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/
*/
storm_eagle.module("menu_submenu", () => {
  "use strict";
  let self;
  let menu_state =  {};
  return {
    initialize: () => {
      self = storm_eagle["menu_submenu"];
      document.querySelectorAll('[data-module="menu"]').forEach(el => {
        let menu_id = el.getAttribute("id");
        menu_state[menu_id] = {
          "all_triggers": el.querySelectorAll(':scope > li > [data-module="menu.trigger"],:scope > [data-module="menu.trigger"]'),
          "all_submenus": el.querySelectorAll(':scope > li > [data-module="menu.submenu"],:scope > [data-module="menu.submenu"]'),
          "active_setting": el.getAttribute('data-menu-active'),
        }
        self.init_ui(menu_id);
        self.add_event_listeners(menu_id);
      });
    },
    init_ui: (menu_id) => {
      menu_state[menu_id]["all_triggers"].forEach((el,index) => {
        el.setAttribute("tabindex","-1");
        el.setAttribute("aria-expanded","false");
        el.setAttribute("aria-controls",el.nextElementSibling.getAttribute("id"));
        if (index === 0) {
          el.setAttribute("tabindex","0");
          el.addEventListener('focusin', () => { document.getElementById(menu_id).classList.add('focus')});
          el.addEventListener('focusout', () => { document.getElementById(menu_id).classList.remove('focus')});
        }
      });
      menu_state[menu_id]["all_submenus"].forEach((el) => {
        el.classList.add("display:none");
      });

    },
    add_event_listeners: (menu_id) => {
      menu_state[menu_id]["all_triggers"].forEach((el) => {
        el.addEventListener("click", () => {
          menu_state[menu_id]["all_triggers"].forEach((el) => {
            el.setAttribute("aria-expanded","false");
          });
          el.setAttribute("aria-expanded","true");
          self.open(menu_id,el.getAttribute("aria-controls"));
        });
      });
    },
    open: (menu_id,id) => {
      if (menu_state[menu_id]["active_setting"] === "single") {
        menu_state[menu_id]["all_submenus"].forEach((el) => {
          el.classList.add("display:none");
        });
        document.getElementById(id).classList.remove("display:none");
        storm_eagle.equalize_heights.force_resize();
      } else if (menu_state[menu_id]["active_setting"] === "multiple") {
        document.getElementById(id).classList.toggle("display:none");
        storm_eagle.equalize_heights.force_resize();
      }

    },
  };
});