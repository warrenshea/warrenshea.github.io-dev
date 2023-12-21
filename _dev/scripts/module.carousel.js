'use strict';

/* @TODO: Infinite Scroll */
storm_eagle.module('carousel', () => {
  let self;
  let module_state = {};

  return {
    initialize: () => {
      self = storm_eagle.carousel;
      module_state = {};
      document.querySelectorAll('[data-module="carousel"]').forEach((el) => {
        let id = el.getAttribute('id');
        module_state[id] = {
          id,
          el,
          item_group: el.querySelector('[data-module="carousel.item-group"]'),
          items: el.querySelectorAll('[data-module="carousel.item"]:not(.display\\:none)'),
          total_children: el.querySelectorAll('[data-module="carousel.item"]:not(.display\\:none)').length,
          indicators_group: el.querySelector('[data-module="carousel.indicators-group"]'),
          indicators_group_controls: el.querySelectorAll('[data-module="carousel.indicators-group"] > [data-carousel-indicator-control]'),
          controls: el.querySelectorAll('[data-module="carousel.controls"]'),
          controls_prev: el.querySelector('[data-module="carousel.controls"][data-carousel-control-prev]'),
          controls_next: el.querySelector('[data-module="carousel.controls"][data-carousel-control-next]'),
          control_active_classes: el.getAttribute('data-carousel-control-active-classes') ? el.getAttribute('data-carousel-control-active-classes').split(',') : '',
          control_inactive_classes: el.getAttribute('data-carousel-control-inactive-classes') ? el.getAttribute('data-carousel-control-inactive-classes').split(',') : '',
          control_class_queryselector: el.getAttribute('data-carousel-control-class-selector') || '',
          breakpoint: el.getAttribute('data-carousel-breakpoint'),
          transition_duration_array: JSON.parse(el.getAttribute('data-carousel-transition-duration')),
          transition_duration: '',
          number_of_active_array: JSON.parse(el.getAttribute('data-carousel-number-active')),
          number_of_active: '',
          offset_left_array: JSON.parse(el.getAttribute('data-carousel-offset')),
          offset_left: '',
          carousel_item_width: '',
          current_active_carousel_item: parseInt(el.getAttribute('data-carousel-item-active')) || 0,
        };
        self.ui.update(id);
        self.event_listeners.resize.initialize(id);
      });
    },
    state: {
      initialize: (id) => {
        //console.log("initialize");
        self.state.set_offset_left(id);
        self.state.set_number_of_active(id);
        self.state.set_transition_duration(id);
        self.state.set_indicators(id);
        self.state.set_carousel_item_width(id);
      },
      set_offset_left: (id) => {
        //console.log("set_offset_left");
        const { el, offset_left_array } = module_state[id];
        /* if the value is > 1, then use a pixel value for the offset */
        /* if the value is > 0 and < 1, use the value as a percentage (e.g. 1/4 = .25) */
        const calculate_pixel_value = (id, offset_value) => {
          if (offset_value > 1) {
            return offset_value;
          } else if (offset_value > 0 && offset_value < 1) {
            return el.offsetWidth * offset_value;
          } else {
            return 0;
          }
        }
        if (storm_eagle.client.viewport.is_sm_only()) {
          module_state[id]['offset_left'] = calculate_pixel_value(id, offset_left_array[0]);
        } else if (storm_eagle.client.viewport.is_md_only()) {
          module_state[id]['offset_left'] = calculate_pixel_value(id, offset_left_array[1]);
        } else if (storm_eagle.client.viewport.is_lg_only()) {
          module_state[id]['offset_left'] = calculate_pixel_value(id, offset_left_array[2]);
        } else if (storm_eagle.client.viewport.is_xl_up()) {
          module_state[id]['offset_left'] = calculate_pixel_value(id, offset_left_array[3]);
        }
      },
      set_number_of_active: (id) => {
        //console.log("set_number_of_active");
        const { number_of_active_array } = module_state[id];
        if (storm_eagle.client.viewport.is_sm_only()) {
          module_state[id]['number_of_active'] = number_of_active_array[0];
        } else if (storm_eagle.client.viewport.is_md_only()) {
          module_state[id]['number_of_active'] = number_of_active_array[1];
        } else if (storm_eagle.client.viewport.is_lg_only()) {
          module_state[id]['number_of_active'] = number_of_active_array[2];
        } else if (storm_eagle.client.viewport.is_xl_up()) {
          module_state[id]['number_of_active'] = number_of_active_array[3];
        }
      },
      set_transition_duration: (id) => {
        //console.log("set_transition_duration");
        const { transition_duration_array } = module_state[id];
        if (storm_eagle.client.viewport.is_sm_only()) {
          module_state[id]['transition_duration'] = transition_duration_array[0];
        } else if (storm_eagle.client.viewport.is_md_only()) {
          module_state[id]['transition_duration'] = transition_duration_array[1];
        } else if (storm_eagle.client.viewport.is_lg_only()) {
          module_state[id]['transition_duration'] = transition_duration_array[2];
        } else if (storm_eagle.client.viewport.is_xl_up()) {
          module_state[id]['transition_duration'] = transition_duration_array[3];
        }
      },
      set_indicators: (id) => {
        //console.log("set_indicators");
        const { el, indicators_group, total_children, number_of_active, current_active_carousel_item } = module_state[id];
        indicators_group.innerHTML = '';
        for (let i = 0; i <= total_children - number_of_active; i++) {
          indicators_group.innerHTML += `<button name="carousel-control-button" data-carousel-indicator-control class="cursor:pointer"><span class="show-for-sr">Go to slide #${i + 1}</button>`;
        }
        module_state[id]['indicators_group_controls'] = el.querySelectorAll('[data-module="carousel.indicators-group"] > [data-carousel-indicator-control]');
        module_state[id]['indicators_group_controls'][current_active_carousel_item].setAttribute("data-carousel-indicator-active","true");
      },
      set_carousel_item_width: (id) => {
        // console.log("set_carousel_item_width");
        const { el, item_group, items, total_children, offset_left, number_of_active } = module_state[id];
        const carousel_item_width = (el.offsetWidth - 2 * offset_left) / number_of_active;
        module_state[id]['carousel_item_width'] = carousel_item_width;
        items.forEach((item) => {
          item.style.width = `${carousel_item_width}px`;
        });
        item_group.style.width = `${offset_left + carousel_item_width * total_children}px`;
      },
    },
    ui: {
      is_active: (id) => {
        //console.log("is_active");
        const { breakpoint, indicators_group, controls_prev, controls_next } = module_state[id];
        switch (breakpoint) {
          case 'sm=':
            return storm_eagle.client.viewport.is_sm_only();
          case 'sm+':
            return storm_eagle.client.viewport.is_sm_up();
          case 'md-':
            return storm_eagle.client.viewport.is_md_down();
          case 'md=':
            return storm_eagle.client.viewport.is_md_only();
          case 'md+':
            return storm_eagle.client.viewport.is_md_up();
          case 'lg-':
            return storm_eagle.client.viewport.is_lg_down();
          case 'lg=':
            return storm_eagle.client.viewport.is_lg_only();
          case 'lg+':
            return storm_eagle.client.viewport.is_lg_up();
          case 'xl+':
            return storm_eagle.client.viewport.is_xl_up();
          default:
            return false; // Default case, handle as needed
        }
      },
      update: (id) => {
        if (self.ui.is_active(id)) {
          self.state.initialize(id);
          self.ui.activate(id);
        } else {
          self.ui.disable(id);
        }
      },
      activate: (id) => {
        self.event_listeners.initialize(id);
        self.ui.active_items.enable(id);
        self.ui.indicators_group.enable(id);
        self.ui.controls.enable(id);
        self.ui.focusable_elements.enable(id);
        self.ui.item_group_position.enable(id);
        self.ui.transition.enable(id);
      },
      disable: (id) => {
        self.ui.active_items.disable(id);
        self.ui.indicators_group.disable(id);
        self.ui.controls.disable(id);
        self.ui.focusable_elements.disable(id);
        self.ui.item_group_position.disable(id);
      },
      active_items: {
        enable: (id) => {
          const { el, item_group, items, total_children, indicators_group_controls, number_of_active, offset_left, carousel_item_width, current_active_carousel_item, transition_duration } = module_state[id];
          el.setAttribute("data-carousel-active","true");
          /* resets the active classes on the carousel items and adds the proper active classes */
          items.forEach((item) => {
            item.setAttribute("data-carousel-item-active","");
            item.setAttribute("data-carousel-item-secondary-active","");
          });
          items[current_active_carousel_item].setAttribute("data-carousel-item-active","true");
          items[current_active_carousel_item].setAttribute("data-carousel-item-secondary-active","true");
          for (let i = 0; i < number_of_active; i++) {
            items[current_active_carousel_item + i].setAttribute("data-carousel-item-secondary-active","true");
          }
          /* resets the active classes on the carousel control and adds the proper active classes */
          indicators_group_controls.forEach((indicator_group_control) => {
            indicator_group_control.setAttribute("data-carousel-indicator-active","");
          });
          indicators_group_controls[current_active_carousel_item].setAttribute("data-carousel-indicator-active","true");
        },
        disable: (id) => {
          const { el } = module_state[id];
          el.setAttribute("data-carousel-active","");
        },
      },
      indicators_group: {
        enable: (id) => {
        },
        disable: (id) => {
        }
      },
      controls: {
        enable: (id) => {
          const { controls_next, controls_prev, control_active_classes, total_children, control_inactive_classes, control_class_queryselector, breakpoint, current_active_carousel_item, number_of_active } = module_state[id];

          let temp_controls_prev, temp_controls_next;
          if (control_class_queryselector) {
            temp_controls_prev = controls_prev.querySelector(control_class_queryselector);
            temp_controls_next = controls_next.querySelector(control_class_queryselector);
          } else {
            temp_controls_prev = controls_prev;
            temp_controls_next = controls_next;
          }

          /* show both chevrons */
          if (total_children !== 1) {
            controls_prev.removeAttribute("disabled");
            controls_next.removeAttribute("disabled");
            temp_controls_prev.classList.remove(...control_inactive_classes);
            temp_controls_next.classList.remove(...control_inactive_classes);
            temp_controls_prev.classList.add(...control_active_classes);
            temp_controls_next.classList.add(...control_active_classes);
          }
          /* hide chevrons */
          if (current_active_carousel_item === 0) {
            controls_prev.setAttribute("disabled","");
            temp_controls_prev.classList.add(...control_inactive_classes);
            temp_controls_prev.classList.remove(...control_active_classes);
          } else if (current_active_carousel_item === total_children - number_of_active) {
            controls_next.setAttribute("disabled","");
            temp_controls_next.classList.add(...control_inactive_classes);
            temp_controls_next.classList.remove(...control_active_classes);
          }
        },
        disable: (id) => {
        },
      },
      focusable_elements: {
        enable: (id) => {
          const { el, items, focusable_element } = module_state[id];
          /* ensures only links in the active carousel or tab-able */
          items.forEach((item) => {
            item.querySelectorAll(focus_trap_selector).forEach((focusable_element) => {
              focusable_element.setAttribute('tabindex', '-1');
              //focusable_element.setAttribute('disabled',"true");
            });
          });
          el.querySelectorAll('[data-carousel-item-secondary-active="true"]').forEach((item) => {
            item.querySelectorAll(focus_trap_selector).forEach((focusable_element) => {
              focusable_element.setAttribute('tabindex', '0');
              focusable_element.removeAttribute('disabled');
            });
          });
        },
        disable: (id) => {
          const { items, focusable_element } = module_state[id];
          items.forEach((item) => {
            item.querySelectorAll(focus_trap_selector).forEach((focusable_element) => {
              focusable_element.setAttribute('tabindex', '0');
              focusable_element.removeAttribute('disabled');
            });
          });
        },
      },
      item_group_position: {
        enable: (id) => {
          const { item_group, offset_left, current_active_carousel_item, carousel_item_width } = module_state[id];
          /* changes the left offset */
          item_group.style.left = `${offset_left - current_active_carousel_item * carousel_item_width}px`;
        },
        disable: (id) => {
          const { item_group, items } = module_state[id];
          item_group.style.left = 0;
          item_group.style.width = '100%';
          item_group.style.height = 'auto';
          items.forEach((item) => {
            item.style.removeProperty("width");
          });
        },
      },
      transition: {
        enable: (id) => {
          const { item_group, transition_duration } = module_state[id];
          /* ensures there's no transition duration except when we want the transition to occcur */
          setTimeout(() => {
            item_group.style.transitionDuration = '0s';
          }, transition_duration * 1000);
        }
      },
    },
    event_listeners: {
      initialize: (id) => {
        //console.log("event_listners initialize");
        self.event_listeners.indicator.initialize(id);
        self.event_listeners.control_buttons.initialize(id);
        self.event_listeners.swipe.initialize(id);
      },
      indicator: {
        initialize: (id) => {
          //console.log("indicator initialize");
          const { indicators_group_controls } = module_state[id];
          indicators_group_controls.forEach((el) => {
            el.removeEventListener('click', self.event_listeners.indicator.handle_change);
            el.addEventListener('click', self.event_listeners.indicator.handle_change);
          });
        },
        handle_change: (event) => {
          // console.log("indicator change");
          event.preventDefault();
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { item_group, transition_duration } = module_state[id];
          item_group.style.transitionDuration = `${transition_duration}s`;
          module_state[id]['current_active_carousel_item'] = storm_eagle.util.index_in_parent(event.currentTarget);
          self.ui.update(id);
        },
      },
      control_buttons: {
        initialize: (id) => {
          //console.log("control_buttons initialize");
          const { el, controls_next, controls_prev } = module_state[id];
          controls_next.removeEventListener('click', self.event_listeners.control_buttons.handle_swipe_left);
          controls_next.addEventListener('click', self.event_listeners.control_buttons.handle_swipe_left);
          controls_prev.removeEventListener('click', self.event_listeners.control_buttons.handle_swipe_right);
          controls_prev.addEventListener('click', self.event_listeners.control_buttons.handle_swipe_right);
        },
        handle_swipe_left: (event) => {
          //console.log("handle_swipe_left");
          event.preventDefault();
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { el, item_group } = module_state[id];
          item_group.dispatchEvent(new Event('swiped-left'));
        },
        handle_swipe_right: (event) => {
          //console.log("handle_swipe_right");
          event.preventDefault();
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { el, item_group } = module_state[id];
          item_group.dispatchEvent(new Event('swiped-right'));
        },
      },
      resize: {
        initialize: (id) => {
          //console.log("resize initialize");
          const { el } = module_state[id];
          const force_resize = () => {
            return self.ui.update(id);
          }
          storm_eagle.resize_observer(el, force_resize);
        }
      },
      swipe: {
        initialize: (id) => {
          //console.log("swipe initialize");
          const { el, item_group } = module_state[id];
          item_group.removeEventListener('swiped-left', self.event_listeners.swipe.handle_swiped_left);
          item_group.addEventListener('swiped-left', self.event_listeners.swipe.handle_swiped_left);
          item_group.removeEventListener('swiped-right', self.event_listeners.swipe.handle_swiped_right);
          item_group.addEventListener('swiped-right', self.event_listeners.swipe.handle_swiped_right);
        },
        handle_swiped_left: (event) => {
          //console.log('go -> in the carousel');
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { el, item_group, total_children, transition_duration, number_of_active, current_active_carousel_item } = module_state[id];
          item_group.style.transitionDuration = `${transition_duration}s`;
          if (module_state[id]['current_active_carousel_item'] !== total_children - number_of_active) {
            module_state[id]['current_active_carousel_item']++;
            self.ui.update(id);
          }
        },
        handle_swiped_right: (event) => {
          //console.log('go <- in the carousel');
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { el, item_group, transition_duration } = module_state[id];
          item_group.style.transitionDuration = `${transition_duration}s`;
          if (module_state[id]['current_active_carousel_item'] !== 0) {
            module_state[id]['current_active_carousel_item']--;
            self.ui.update(id);
          }
        },
      },
    },

  };
});
