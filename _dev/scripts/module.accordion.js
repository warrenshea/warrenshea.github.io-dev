storm_eagle.module("accordion", () => {
  "use strict";
  let self;
  let accordion_state = [];

  return {
    initialize: () => {
      self = storm_eagle["accordion"];
      document.querySelectorAll("[data-module='accordion']").forEach(el => {
        let accordion_id = el.getAttribute("id");
        accordion_state[accordion_id] = {
          "focusable_elements": []
        };
       self.get_accordion_focusable_elements(accordion_id);
      });
    },
    open: (accordion_id) => {
      /* updates accordion visuals */
      document.getElementById(accordion_id).classList.add('active');
      document.getElementById(accordion_id).classList.toggle('display:none');
      /* removes focus from elements except in accordion */
      accordion_state[accordion_id]["focusable_elements"].forEach(el => {
        el.setAttribute("tabindex","0");
      });
    },
    close: (accordion_id) => {
      /* updates accordion visuals */
      document.getElementById(accordion_id).setAttribute('tabIndex', '-1');
      document.getElementById(accordion_id).setAttribute('aria-expanded', false);
      document.getElementById(accordion_id).classList.remove('active');
      document.getElementById(accordion_id).classList.toggle('display:none');
      document.querySelectorAll("[data-target='accordion']").forEach((accordion,index) => {
        /* remove focus from accordion elements */
        accordion_state[accordion_id]["focusable_elements"].forEach(el => {
          el.setAttribute("tabindex","-1");
        });
      });
      document.querySelectorAll("[data-target='accordion-trigger']").forEach((accordion_trigger,index) => {
        accordion_trigger.setAttribute("aria-expanded",false);
      });
    },
    get_accordion_focusable_elements: (accordion_id) => {
      const accordion = document.getElementById(accordion_id);
      accordion_state[accordion_id]["focusable_elements"] = accordion.querySelectorAll(focus_trap_selector);
    },
    toggle: (accordion_trigger, accordion_id) => {
      accordion_trigger.querySelector(".accordion\\:show-more-button").classList.toggle("display:none");
      accordion_trigger.querySelector(".accordion\\:show-less-button").classList.toggle("display:none");

      if (document.getElementById(accordion_id).classList.contains("active")) {
        /* if the accordion is open */
        accordion_trigger.setAttribute("aria-expanded", false);
        accordion_trigger.classList.remove("active");
        self.close(accordion_id);
      } else {
        /* if the accordion is closed */
        accordion_trigger.setAttribute("aria-expanded", true);
        accordion_trigger.classList.add("active");
        self.open(accordion_id);
      }
    }
  }
});