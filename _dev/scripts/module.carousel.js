'use strict';
/**
 * Carousel Module
 *
 * Handles the functionality of carousels, including state management, UI updates, and event listeners.
 *
 * Methods Overview:
 * - carousel.initialize()
 * - carousel.setup()
 * - carousel.state.update()
 * - carousel.ui.update()
 * - carousel.ui.activate()
 * - carousel.ui.disable()
 * - carousel.event_listeners.initialize()
 * - carousel.a11y.focusable_elements.enable()
 * - carousel.a11y.focusable_elements.disable()
 */

storm_eagle.module('carousel', () => {
  let self;
  let state = {}; // Stores the state of each carousel instance

  return {
    /**
     * Initializes the carousel module.
     * Resets the state and sets up all carousels on the page.
     */
    initialize: () => {
      self = storm_eagle.carousel;
      state = {};
      self.setup();
    },

    /**
     * Sets up all carousels on the page.
     * Initializes state for each carousel and applies UI updates and event listeners.
     */
    setup: () => {
      document.querySelectorAll('[data-module="carousel"]').forEach((el) => {
        const id = el.getAttribute('id');
        state[id] = {
          el,
          item_group: el.querySelector('[data-module="carousel.item-group"]'),
          items: el.querySelectorAll('[data-module="carousel.item"]:not(.display\\:none)'),
          item_width: '',
          indicators_group: el.querySelector('[data-module="carousel.indicators-group"]'),
          indicators_group_controls: el.querySelectorAll('[data-module="carousel.indicators-group"] > [data-carousel-indicator-control]'),
          controls: el.querySelectorAll('[data-module="carousel.controls"]'),
          controls_prev: el.querySelector('[data-module="carousel.controls"][data-carousel-control-prev]'),
          controls_next: el.querySelector('[data-module="carousel.controls"][data-carousel-control-next]'),
          control_active_classes: el.getAttribute('data-carousel-control-active-classes') ? JSON.parse(el.getAttribute('data-carousel-control-active-classes')) : [],
          control_inactive_classes: el.getAttribute('data-carousel-control-inactive-classes') ? JSON.parse(el.getAttribute('data-carousel-control-inactive-classes')) : [],
          control_class_queryselector: el.getAttribute('data-carousel-control-class-selector') || '',
          breakpoint: el.getAttribute('data-carousel-breakpoint'),
          transition_duration_array: JSON.parse(el.getAttribute('data-carousel-transition-duration')),
          transition_duration: '',
          number_of_active_array: JSON.parse(el.getAttribute('data-carousel-number-active')),
          number_of_active: '',
          offset_left_array: JSON.parse(el.getAttribute('data-carousel-offset')),
          offset_left: '',
          current_active_carousel_item: parseInt(el.getAttribute('data-carousel-item-active')) || 0,
        };
        self.ui.update(id); // Update the UI for the carousel
        self.event_listeners.resize.initialize(id); // Add resize event listeners
      });
    },

    state: {
      /**
       * Updates the state of a carousel.
       * Reinitializes, calculates offsets, and sets other properties.
       * @param {string} id - The ID of the carousel instance.
       */
      update: (id) => {
        self.state.reinitiailize(id);
        self.state.set_offset_left(id);
        self.state.set_number_of_active(id);
        self.state.set_transition_duration(id);
        self.state.set_indicators(id);
        self.state.set_item_width(id);
      },

      /**
       * Reinitializes the state for a specific carousel.
       * Updates the list of items and recalculates arrays.
       * @param {string} id - The ID of the carousel instance.
       */
      reinitiailize: (id) => {
        const { el } = state[id];
        state[id].items = el.querySelectorAll('[data-module="carousel.item"]:not(.display\\:none)');
        state[id].transition_duration_array = JSON.parse(el.getAttribute('data-carousel-transition-duration'));
        state[id].number_of_active_array = JSON.parse(el.getAttribute('data-carousel-number-active'));
        state[id].offset_left_array = JSON.parse(el.getAttribute('data-carousel-offset'));
      },

      /**
       * Sets the breakpoint for responsive behavior.
       * @param {string} id - The ID of the carousel instance.
       */
      set_breakpoint: (id) => {
        const { el } = state[id];
        state[id].breakpoint = el.getAttribute('data-carousel-breakpoint');
      },

      /**
       * Sets the offset left value for carousel items.
       * This determines spacing for items based on the viewport size.
       * @param {string} id - The ID of the carousel instance.
       */
      set_offset_left: (id) => {
        const { el, offset_left_array } = state[id];
        /* if the value is > 1, then use a pixel value for the offset */
        /* if the value is > 0 and < 1, use the value as a percentage (e.g. 1/4 = .25) */
        const calculate_pixel_value = (offset_value) => {
          if (offset_value > 1) return offset_value;
          if (offset_value > 0 && offset_value < 1) return el.offsetWidth * offset_value;
          return 0;
        };
        if (storm_eagle.client.viewport.is_sm_only()) {
          state[id].offset_left = calculate_pixel_value(offset_left_array[0]);
        } else if (storm_eagle.client.viewport.is_md_only()) {
          state[id].offset_left = calculate_pixel_value(offset_left_array[1]);
        } else if (storm_eagle.client.viewport.is_lg_only()) {
          state[id].offset_left = calculate_pixel_value(offset_left_array[2]);
        } else if (storm_eagle.client.viewport.is_xl_up()) {
          state[id].offset_left = calculate_pixel_value(offset_left_array[3]);
        }
      },

      /**
       * Sets the number of active items for a carousel based on the viewport size.
       * @param {string} id - The ID of the carousel instance.
       */
      set_number_of_active: (id) => {
        const { number_of_active_array } = state[id];
        if (storm_eagle.client.viewport.is_sm_only()) {
          state[id].number_of_active = number_of_active_array[0];
        } else if (storm_eagle.client.viewport.is_md_only()) {
          state[id].number_of_active = number_of_active_array[1];
        } else if (storm_eagle.client.viewport.is_lg_only()) {
          state[id].number_of_active = number_of_active_array[2];
        } else if (storm_eagle.client.viewport.is_xl_up()) {
          state[id].number_of_active = number_of_active_array[3];
        }
      },

      /**
       * Sets the transition duration for carousel animations.
       * @param {string} id - The ID of the carousel instance.
       */
      set_transition_duration: (id) => {
        const { transition_duration_array } = state[id];
        if (storm_eagle.client.viewport.is_sm_only()) {
          state[id].transition_duration = transition_duration_array[0];
        } else if (storm_eagle.client.viewport.is_md_only()) {
          state[id].transition_duration = transition_duration_array[1];
        } else if (storm_eagle.client.viewport.is_lg_only()) {
          state[id].transition_duration = transition_duration_array[2];
        } else if (storm_eagle.client.viewport.is_xl_up()) {
          state[id].transition_duration = transition_duration_array[3];
        }
      },

      /**
       * Creates indicators for carousel navigation and updates their state.
       * @param {string} id - The ID of the carousel instance.
       */
      set_indicators: (id) => {
        const { el, items, indicators_group, number_of_active, current_active_carousel_item } = state[id];
        indicators_group.innerHTML = '';
        for (let i = 0; i <= items.length - number_of_active; i++) {
          indicators_group.innerHTML += `<button name="carousel-control-button" data-carousel-indicator-control class="cursor:pointer"><span class="show-for-sr">Go to slide #${i + 1}</button>`;
        }
        state[id].indicators_group_controls = el.querySelectorAll('[data-module="carousel.indicators-group"] > [data-carousel-indicator-control]');
        state[id].indicators_group_controls[current_active_carousel_item].setAttribute('data-carousel-indicator-active', 'true');
      },

      /**
       * Sets the width for carousel items based on the number of active items and offsets.
       * @param {string} id - The ID of the carousel instance.
       */
      set_item_width: (id) => {
        const { el, item_group, items, number_of_active, offset_left } = state[id];
        const item_width = (el.offsetWidth - 2 * offset_left) / number_of_active;
        state[id].item_width = item_width;
        items.forEach((item) => {
          item.style.width = `${item_width}px`;
        });
        item_group.style.width = `${offset_left + item_width * items.length}px`;
      },
    },

    ui: {
      /**
       * Checks if the carousel is active based on the breakpoint setting.
       * @param {string} id - The ID of the carousel instance.
       * @returns {boolean} True if active, otherwise false.
       */
      is_active: (id) => {
        self.state.set_breakpoint(id);
        const { breakpoint } = state[id];
        switch (breakpoint) {
          case '':
            return true;
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
            return false;
        }
      },

      /**
       * Updates the UI for a specific carousel instance.
       * Activates or disables the carousel based on its active state.
       * @param {string} id - The ID of the carousel instance.
       */
      update: (id) => {
        if (self.ui.is_active(id)) {
          self.state.update(id);
          self.ui.activate(id);
        } else {
          self.ui.disable(id);
        }
      },

      /**
       * Activates the carousel UI by enabling related elements and behaviors.
       * @param {string} id - The ID of the carousel instance.
       */
      activate: (id) => {
        self.event_listeners.initialize(id);
        self.ui.active_items.enable(id);
        self.ui.indicators_group.enable(id);
        self.ui.controls.enable(id);
        self.ui.item_group_position.enable(id);
        self.ui.transition.enable(id);
        self.a11y.focusable_elements.enable(id);
      },

      /**
       * Disables the carousel UI by disabling related elements and behaviors.
       * @param {string} id - The ID of the carousel instance.
       */
      disable: (id) => {
        self.ui.active_items.disable(id);
        self.ui.indicators_group.disable(id);
        self.ui.controls.disable(id);
        self.ui.item_group_position.disable(id);
        self.a11y.focusable_elements.disable(id);
      },

      active_items: {
        /**
         * Enables active carousel items by setting appropriate classes and attributes.
         * @param {string} id - The ID of the carousel instance.
         */
        enable: (id) => {
          const { el, items, indicators_group_controls, number_of_active, current_active_carousel_item } = state[id];
          el.setAttribute('data-carousel-active', 'true');
          /* resets the active classes on the carousel items and adds the proper active classes */
          items.forEach((item) => {
            item.setAttribute('data-carousel-item-active', '');
            item.setAttribute('data-carousel-item-secondary-active', 'false');
          });

          items[current_active_carousel_item].setAttribute('data-carousel-item-active', 'true');
          items[current_active_carousel_item].setAttribute('data-carousel-item-secondary-active', 'true');

          for (let i = 0; i < number_of_active; i++) {
            items[current_active_carousel_item + i].setAttribute('data-carousel-item-secondary-active', 'true');
          }

          /* resets the active classes on the carousel control and adds the proper active classes */
          indicators_group_controls.forEach((indicator_group_control) => {
            indicator_group_control.setAttribute('data-carousel-indicator-active', '');
          });

          indicators_group_controls[current_active_carousel_item].setAttribute('data-carousel-indicator-active', 'true');
        },

        /**
         * Disables active carousel items by resetting their classes and attributes.
         * @param {string} id - The ID of the carousel instance.
         */
        disable: (id) => {
          const { el } = state[id];
          el.setAttribute('data-carousel-active', '');
        },
      },

      indicators_group: {
        /**
         * Enables the indicators group for navigation (if needed).
         * Placeholder for functionality.
         * @param {string} id - The ID of the carousel instance.
         */
        enable: (id) => {},

        /**
         * Disables the indicators group for navigation (if needed).
         * Placeholder for functionality.
         * @param {string} id - The ID of the carousel instance.
         */
        disable: (id) => {},
      },

      controls: {
        /**
         * Enables carousel control buttons (previous and next).
         * Updates their states based on the current active item.
         * @param {string} id - The ID of the carousel instance.
         */
        enable: (id) => {
          const { items, controls_next, controls_prev, control_active_classes, control_inactive_classes, control_class_queryselector, current_active_carousel_item, number_of_active } = state[id];

          let temp_controls_prev, temp_controls_next;
          if (control_class_queryselector) {
            temp_controls_prev = controls_prev.querySelector(control_class_queryselector);
            temp_controls_next = controls_next.querySelector(control_class_queryselector);
          } else {
            temp_controls_prev = controls_prev;
            temp_controls_next = controls_next;
          }

          /* show both chevrons */
          if (items.length !== 1) {
            controls_prev.removeAttribute('disabled');
            controls_next.removeAttribute('disabled');
            temp_controls_prev.classList.remove(...control_inactive_classes);
            temp_controls_next.classList.remove(...control_inactive_classes);
            temp_controls_prev.classList.add(...control_active_classes);
            temp_controls_next.classList.add(...control_active_classes);
          }
          /* hide chevrons */
          if (current_active_carousel_item === 0) {
            controls_prev.setAttribute('disabled', '');
            temp_controls_prev.classList.add(...control_inactive_classes);
            temp_controls_prev.classList.remove(...control_active_classes);
          } else if (current_active_carousel_item === items.length - number_of_active) {
            controls_next.setAttribute('disabled', '');
            temp_controls_next.classList.add(...control_inactive_classes);
            temp_controls_next.classList.remove(...control_active_classes);
          }
        },

        /**
         * Disables carousel control buttons (previous and next).
         * Placeholder for functionality.
         * @param {string} id - The ID of the carousel instance.
         */
        disable: (id) => {},
      },

      item_group_position: {
        /**
         * Enables the positioning of the item group within the carousel.
         * Sets the left offset based on the current active item.
         * @param {string} id - The ID of the carousel instance.
         */
        enable: (id) => {
          const { item_group, item_width, offset_left, current_active_carousel_item } = state[id];
          item_group.style.left = `${offset_left - current_active_carousel_item * item_width}px`;
        },

        /**
         * Disables the positioning of the item group within the carousel.
         * Resets to default styles.
         * @param {string} id - The ID of the carousel instance.
         */
        disable: (id) => {
          const { item_group, items } = state[id];
          item_group.style.left = 0;
          item_group.style.width = '100%';
          item_group.style.height = 'auto';
          items.forEach((item) => {
            item.style.removeProperty('width');
          });
        },
      },

      transition: {
        /**
         * Enables transition effects for the carousel.
         * Applies a transition duration for smooth animations.
         * @param {string} id - The ID of the carousel instance.
         */
        enable: (id) => {
          const { item_group, transition_duration } = state[id];
          /* ensures there's no transition duration except when we want the transition to occcur */
          setTimeout(() => {
            item_group.style.transitionDuration = '0s';
          }, transition_duration * 1000);
        },
      },
    },

    event_listeners: {
      /**
       * Initializes all event listeners for a specific carousel instance.
       * @param {string} id - The ID of the carousel instance.
       */
      initialize: (id) => {
        self.event_listeners.indicator.initialize(id);
        self.event_listeners.control_buttons.initialize(id);
        self.event_listeners.swipe.initialize(id);
      },

      indicator: {
        /**
         * Initializes event listeners for carousel indicators.
         * @param {string} id - The ID of the carousel instance.
         */
        initialize: (id) => {
          const { indicators_group_controls } = state[id];
          indicators_group_controls.forEach((el) => {
            el.removeEventListener('click', self.event_listeners.indicator.handle_change);
            el.addEventListener('click', self.event_listeners.indicator.handle_change);
          });
        },

        /**
         * Handles changes triggered by indicator clicks.
         * Updates the current active item and triggers a UI update.
         * @param {Event} event - The click event.
         */
        handle_change: (event) => {
          event.preventDefault();
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { item_group, transition_duration } = state[id];
          item_group.style.transitionDuration = `${transition_duration}s`;
          state[id].current_active_carousel_item = storm_eagle.util.index_in_parent(event.currentTarget);
          self.ui.update(id);
        },
      },

      /**
       * Handles control button (previous/next) events.
       */
      control_buttons: {
        /**
         * Initializes event listeners for carousel control buttons (next and previous).
         * @param {string} id - The ID of the carousel instance.
         */
        initialize: (id) => {
          const { controls_prev, controls_next } = state[id];

          // Add event listener for the "Next" button
          controls_next.removeEventListener('click', self.event_listeners.control_buttons.handle_swipe_left);
          controls_next.addEventListener('click', self.event_listeners.control_buttons.handle_swipe_left);

          // Add event listener for the "Previous" button
          controls_prev.removeEventListener('click', self.event_listeners.control_buttons.handle_swipe_right);
          controls_prev.addEventListener('click', self.event_listeners.control_buttons.handle_swipe_right);
        },

        /**
         * Handles the swipe left action (triggered by the "Next" button).
         * @param {Event} event - The click event.
         */
        handle_swipe_left: (event) => {
          event.preventDefault();
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { item_group } = state[id];
          item_group.dispatchEvent(new Event('swiped-left'));
        },

        /**
         * Handles the swipe right action (triggered by the "Previous" button).
         * @param {Event} event - The click event.
         */
        handle_swipe_right: (event) => {
          event.preventDefault();
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { item_group } = state[id];
          item_group.dispatchEvent(new Event('swiped-right'));
        },
      },

      resize: {
        /**
         * Initializes a resize observer for the carousel.
         * Ensures the UI updates when the viewport size changes.
         * @param {string} id - The ID of the carousel instance.
         */
        initialize: (id) => {
          const { el } = state[id];
          const force_resize = () => {
            return self.ui.update(id);
          }
          storm_eagle.resize_observer(el, force_resize);
        },
      },

      swipe: {
        /**
         * Initializes swipe event listeners for the carousel.
         * Handles swiping left and right to navigate items.
         * @param {string} id - The ID of the carousel instance.
         */
        initialize: (id) => {
          const { item_group } = state[id];

          // Add swipe left listener
          item_group.removeEventListener('swiped-left', self.event_listeners.swipe.handle_swiped_left);
          item_group.addEventListener('swiped-left', self.event_listeners.swipe.handle_swiped_left);

          // Add swipe right listener
          item_group.removeEventListener('swiped-right', self.event_listeners.swipe.handle_swiped_right);
          item_group.addEventListener('swiped-right', self.event_listeners.swipe.handle_swiped_right);
        },

        /**
         * Handles the swipe left action for the carousel.
         * Moves to the next item if not at the end of the list.
         * @param {Event} event - The swipe event.
         */
        handle_swiped_left: (event) => {
          //console.log('go -> in the carousel');
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { item_group, items, transition_duration, number_of_active } = state[id];
          item_group.style.transitionDuration = `${transition_duration}s`;
          if (state[id].current_active_carousel_item !== items.length - number_of_active) {
            state[id].current_active_carousel_item++;
            self.ui.update(id);
          }
        },

        /**
         * Handles the swipe right action for the carousel.
         * Moves to the previous item if not at the beginning of the list.
         * @param {Event} event - The swipe event.
         */
        handle_swiped_right: (event) => {
          //console.log('go <- in the carousel');
          const id = storm_eagle.util.closest_parent(event.currentTarget, '[data-module="carousel"]').getAttribute('id');
          const { item_group, transition_duration } = state[id];
          item_group.style.transitionDuration = `${transition_duration}s`;
          if (state[id].current_active_carousel_item !== 0) {
            state[id].current_active_carousel_item--;
            self.ui.update(id);
          }
        },
      },
    },

    a11y: {
      focusable_elements: {
        /**
         * Enables focusable elements in active carousel items.
         * Disables focusable elements in inactive items.
         * @param {string} id - The ID of the carousel instance.
         */
        enable: (id) => {
          const { el } = state[id];
          /* ensures all elements in the carousel item with [data-carousel-item-secondary-active="false"] (partially visible) are not focusable */
          // Disable focusable elements in inactive items
          el.querySelectorAll('[data-carousel-item-secondary-active="false"]').forEach((item) => {
            item.querySelectorAll(focus_trap_selector).forEach((focusable_element) => {
              focusable_element.setAttribute('tabindex', '-1');
              focusable_element.setAttribute('disabled', 'true');
            });
          });
          /* resets the elements for carousel item with [data-carousel-item-secondary-active="true"] */
          // Enable focusable elements in active items
          el.querySelectorAll('[data-carousel-item-secondary-active="true"]').forEach((item) => {
            item.querySelectorAll('*').forEach((remove_disabled) => {
              if (remove_disabled.getAttribute('tabindex') === '-1') {
                remove_disabled.setAttribute('tabindex', '0');
              }
              remove_disabled.removeAttribute('disabled');
            });
          });
          /* removes and unwanted focus selectors (if applicable, usually there won't be */
          el.querySelectorAll('[data-carousel-item-secondary-active="true"]').forEach((item) => {
            item.querySelectorAll(remove_focus_selector).forEach((remove_focusable_element) => {
              remove_focusable_element.setAttribute('tabindex', '0');
              remove_focusable_element.removeAttribute('disabled');
            });
          });

          // Reinitialize focusable elements for dialogs, if applicable
          if (storm_eagle.dialog) storm_eagle.dialog.initialize();
        },

        /**
         * Disables focusable elements in all carousel items.
         * @param {string} id - The ID of the carousel instance.
         */
        disable: (id) => {
          const { items } = state[id];
          items.forEach((item) => {
            item.querySelectorAll(remove_focus_selector).forEach((remove_focusable_element) => {
              remove_focusable_element.setAttribute('tabindex', '0');
              remove_focusable_element.removeAttribute('disabled');
            });
          });
        },
      },
    },
  };
});