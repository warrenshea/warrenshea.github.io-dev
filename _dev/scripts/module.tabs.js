'use strict';
storm_eagle.module('tabs', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.tabs;
      document.querySelectorAll('[data-module="tabs"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          all_triggers: el.querySelectorAll('[data-module="tabs.trigger"]'),
          all_panels: document.querySelectorAll('[data-module="tabs"] ~ [data-module="tabs.panel"]'),
          active_trigger_classes: el.getAttribute('data-tab-trigger-active-classes') ? el.getAttribute('data-tab-trigger-active-classes').split(',') : '',
          inactive_trigger_classes: el.getAttribute('data-tab-trigger-inactive-classes') ? el.getAttribute('data-tab-trigger-inactive-classes').split(',') : '',
          active_panel_classes: el.getAttribute('data-tab-panel-active-classes') ? el.getAttribute('data-tab-panel-active-classes').split(',') : '',
          inactive_panel_classes: el.getAttribute('data-tab-panel-inactive-classes') ? el.getAttribute('data-tab-panel-inactive-classes').split(',') : '',
          initial_active: JSON.parse(el.getAttribute('data-tabs-initial')),
        };
        self.ui.initialize(id);
        self.event_listeners.initialize(id);
        self.ui.initialize_initial_active(id);
      });
    },
    ui: {
      initialize: (id) => {
        const { all_triggers, all_panels, inactive_panel_classes } = state[id];
        state[id]['all_triggers'].forEach((trigger, index) => {
          trigger.removeAttribute("hidden");
          trigger.setAttribute('aria-controls', state[id]['all_panels'][index].getAttribute('id'));
          all_panels[index].querySelector(':scope > div.display\\:none').innerHTML = trigger.innerHTML;
          all_panels[index].setAttribute('aria-labelledby', trigger.getAttribute('id'));
          if (index === 0) {
            trigger.setAttribute('tabindex', '0');
            trigger.removeEventListener('focusin', self.event_listeners.trigger_focus.add);
            trigger.addEventListener('focusin', self.event_listeners.trigger_focus.add);
            trigger.removeEventListener('focusout', self.event_listeners.trigger_focus.remove);
            trigger.addEventListener('focusout', self.event_listeners.trigger_focus.remove);
          }
        });
        all_panels.forEach((panel) => {
          panel.classList.add(...inactive_panel_classes);
        });
      },
      initialize_initial_active: (id) => {
        const { all_triggers, initial_active } = state[id];
        all_triggers.forEach((trigger, index) => {
          if (initial_active[index] === 1) {
            trigger.click();
          }
        });
      },
    },
    event_listeners: {
      initialize: (id) => {
        const { all_triggers, active_trigger_classes, inactive_trigger_classes } = state[id];
        all_triggers.forEach((el) => {
          el.addEventListener('click', () => {
            all_triggers.forEach((el) => {
              el.classList.add(...inactive_trigger_classes);
              el.classList.remove(...active_trigger_classes);
            });
            el.classList.add(...active_trigger_classes);
            el.classList.remove(...inactive_trigger_classes);
            self.open(id, el.getAttribute('aria-controls'));
          });
        });
      },
      trigger_focus: {
        add: (event) => {
          event.currentTarget.classList.add('focus');
        },
        remove: (event) => {
          event.currentTarget.classList.remove('focus');
        },
      }
    },
    open: (id, panel_id) => {
      const { all_panels, active_panel_classes, inactive_panel_classes } = state[id];
      all_panels.forEach((el) => {
        el.classList.add(...inactive_panel_classes);
        el.classList.remove(...active_panel_classes);
      });
      document.getElementById(panel_id).classList.add(...active_panel_classes);
      document.getElementById(panel_id).classList.remove(...inactive_panel_classes);
    },
  };
});
