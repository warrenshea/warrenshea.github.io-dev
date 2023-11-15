'use strict';

storm_eagle.module('tabs-v.red', () => {
  let self;
  let tabs_state = {};
  return {
    initialize: () => {
      self = storm_eagle['tabs-v.red'];
      document.querySelectorAll('[data-module="tabs-v.red"]').forEach((el) => {
        let tabs_id = el.getAttribute('id');
        tabs_state[tabs_id] = {
          all_triggers: el.querySelectorAll('[data-module="tabs.trigger"]'),
          all_panels: el.querySelectorAll('[data-module="tabs.panel"]'),
          active_trigger_classes: el.getAttribute('data-tab-trigger-active-classes') ? el.getAttribute('data-tab-trigger-active-classes').split(',') : '',
          inactive_trigger_classes: el.getAttribute('data-tab-trigger-inactive-classes') ? el.getAttribute('data-tab-trigger-inactive-classes').split(',') : '',
          active_panel_classes: el.getAttribute('data-tab-panel-active-classes') ? el.getAttribute('data-tab-panel-active-classes').split(',') : '',
          inactive_panel_classes: el.getAttribute('data-tab-panel-inactive-classes') ? el.getAttribute('data-tab-panel-inactive-classes').split(',') : '',
          initial_active: JSON.parse(el.getAttribute('data-tabs-initial')),
        };
        self.add_event_listeners(tabs_id);
        self.init_ui(tabs_id);
      });
    },
    add_event_listeners: (tabs_id) => {
      tabs_state[tabs_id]['all_triggers'].forEach((el) => {
        el.addEventListener('click', () => {
          tabs_state[tabs_id]['all_triggers'].forEach((el) => {
            el.setAttribute('aria-selected', 'false');
            el.classList.add(...tabs_state[tabs_id]['inactive_trigger_classes']);
            el.classList.remove(...tabs_state[tabs_id]['active_trigger_classes']);
          });
          el.setAttribute('aria-selected', 'true');
          el.classList.add(...tabs_state[tabs_id]['active_trigger_classes']);
          el.classList.remove(...tabs_state[tabs_id]['inactive_trigger_classes']);
          self.open(tabs_id, el.getAttribute('aria-controls'));
        });
      });
    },
    init_ui: (tabs_id) => {
      tabs_state[tabs_id]['all_triggers'].forEach((el, index) => {
        el.removeAttribute("hidden");
        el.setAttribute('aria-selected', 'false');
        el.setAttribute('aria-controls', tabs_state[tabs_id]['all_panels'][index].getAttribute('id'));
        console.log(tabs_state[tabs_id]['all_panels'][index]);
        console.log(tabs_state[tabs_id]['all_panels'][index].querySelector(':scope > div.display\\:none'));
        tabs_state[tabs_id]['all_panels'][index].querySelector(':scope > div.display\\:none').innerHTML = el.innerHTML;
        tabs_state[tabs_id]['all_panels'][index].setAttribute('aria-labelledby', el.getAttribute('id'));
        if (index === 0) {
          el.addEventListener('focusin', () => {
            document.getElementById(tabs_id).classList.add('focus');
          });
          el.addEventListener('focusout', () => {
            document.getElementById(tabs_id).classList.remove('focus');
          });
        }
      });
      tabs_state[tabs_id]['all_panels'].forEach((el) => {
        el.classList.add(...tabs_state[tabs_id]['inactive_panel_classes']);
      });
      tabs_state[tabs_id]['all_triggers'].forEach((el, index) => {
        if (tabs_state[tabs_id]['initial_active'][index] === 1) {
          el.click();
        }
      });
    },
    open: (tabs_id, id) => {
      tabs_state[tabs_id]['all_panels'].forEach((el) => {
        el.classList.add(...tabs_state[tabs_id]['inactive_panel_classes']);
        el.classList.remove(...tabs_state[tabs_id]['active_panel_classes']);
      });
      document.getElementById(id).classList.add(...tabs_state[tabs_id]['active_panel_classes']);
      document.getElementById(id).classList.remove(...tabs_state[tabs_id]['inactive_panel_classes']);
    },
  };
});
