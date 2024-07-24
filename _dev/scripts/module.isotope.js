'use strict';

// // filter .property1 items
// $grid.isotope({ filter: '.property1' });

// // filter .property2 OR .property3 items
// $grid.isotope({ filter: '.property2, .property3' });

// // filter .property4 AND .property5 items
// $grid.isotope({ filter: '.property4.property5' });

// // show all items
// $grid.isotope({ filter: '*' });

storm_eagle.module('isotope', () => {
  let self;
  let state = {};
  return {
    initialize: () => {
      self = storm_eagle.isotope;
      state = {};
      self.setup();
    },
    ready: () => {
      document.querySelectorAll('[data-module="isotope"]').forEach((el) => {
        const id = el.getAttribute('id');
        self.ui.initialize(id);
      });
    },
    setup: () => {
      document.querySelectorAll('[data-module="isotope"]').forEach((el) => {
        const id = el.getAttribute('id');
        const filter_groups_ids = JSON.parse(el.getAttribute('data-isotope-filters-bind-ids')) || [];
        state[id] = {
          el,
          isotope_object: null,
          elements_container: el.querySelector("[data-module='isotope.elements-container']"),
          sort_data_config: el.getAttribute('data-isotope-sort-data'),
          sort_by_id: el.getAttribute('data-isotope-sortBy-bind-id') || null,
          sort_by_value: null,
          sort_ascending_id: el.getAttribute('data-isotope-sortAscending-bind-id') || null,
          sort_ascending_value: null,
          filter_values: [el.getAttribute('data-isotope-initial-filter')],
          initial_filter: el.getAttribute('data-isotope-initial-filter'), //* or .isotope-no-results
          filters: {},
          filter_groups_ids: JSON.parse(el.getAttribute('data-isotope-filters-bind-ids')) || [],
          filter_groups_key: filter_groups_ids.map(id => document.querySelector(`[data-isotope-filter-group][id="${id}"]`)?.getAttribute('data-isotope-filter-group') || null),
          filter_groups_types: filter_groups_ids.map(id => document.querySelector(`[data-isotope-filter-group][id="${id}"]`)?.getAttribute('data-isotope-filter-group-type') || null),
        };
        self.event_listeners.initialize(id);
      });
    },
    config: {
      state: {
        get: {
          sort_by: (id) => {
            return state[id].sort_by_value;
          },
          sort_ascending: (id) => {
            return state[id].sort_ascending_value;
          },
          filter: (id) => {
            return state[id].filter_values;
          },
        },
        set: {
          sort_by: (id) => {
            const { sort_by_id } = state[id];
            if (sort_by_id) {
              state[id].sort_by_value = storm_eagle.radiobutton.get_value(`#${sort_by_id} > input`);
            }
          },
          sort_ascending: (id) => {
            const { sort_ascending_id } = state[id];
            if (sort_ascending_id) {
              state[id].sort_ascending_value = JSON.parse(storm_eagle.radiobutton.get_value(`#${sort_ascending_id} > input`));
            }
          },
          filter: (id) => {
            const { initial_filter, filter_groups_ids, filter_groups_types } = state[id];
            if (filter_groups_ids.length > 0) {
              filter_groups_ids.forEach((filter_group_id, index) => {
                switch (filter_groups_types[index]) {
                  case "checkbox":
                    let filter_group_checkbox_values = storm_eagle.checkbox.get_values(`#${filter_group_id} > input`,'data-isotope-filter-value');
                    if (document.querySelector(`#${filter_group_id}`).hasAttribute("data-isotope-or-and-bind")) {
                      const or_and_value = storm_eagle.radiobutton.get_value(`#${document.querySelector(`#${filter_group_id}`).getAttribute("data-isotope-or-and-bind")} > input`);
                      filter_group_checkbox_values = (or_and_value === "and") ? [filter_group_checkbox_values.join('') || self.util.get_filter_type(id)] : filter_group_checkbox_values;
                    }
                    state[id].filters[filter_group_id] = filter_group_checkbox_values;
                    break;
                  case "radiobutton":
                    state[id].filters[filter_group_id] = storm_eagle.radiobutton.get_value(`#${filter_group_id} > input`);
                    break;
                  case "input_autocomplete":
                    if (document.querySelector(`#${filter_group_id}`).hasAttribute('data-autocomplete-values')) {
                      if (document.querySelector(`#${filter_group_id}`).getAttribute('data-autocomplete-values') === '[]') {
                        state[id].filters[filter_group_id] = initial_filter;
                      } else {
                        state[id].filters[filter_group_id] = (JSON.parse(document.querySelector(`#${filter_group_id}`).getAttribute('data-autocomplete-values')).map(str => str.toLowerCase()));
                      }
                    }
                    break;
                  default:
                    break;
                }
              });
              // console.log(state[id].filters);
              state[id].filter_values = storm_eagle.isotope.util.combine_obj_value(state[id].filters);
            }
          }
        },
      },
    },
    ui : {
      initialize: (id) => {
        const { initial_filter, sort_data_config, elements_container } = state[id];
        self.config.state.set.sort_by(id);
        self.config.state.set.sort_ascending(id);
        self.config.state.set.filter(id);
        state[id].isotope_object = new Isotope(elements_container, {
          itemSelector: '[data-module="isotope.element"]',
          layoutMode: 'masonry',
          getSortData: JSON.parse(sort_data_config),
          sortBy: self.config.state.get.sort_by(id),
          filter: initial_filter,
          sortAscending: self.config.state.get.sort_ascending(id),
        });
      },
      refresh: (id) => {
        const { initial_filter } = state[id];
        setTimeout(() => {
          const new_config = {
            sortBy: self.config.state.get.sort_by(id),
            filter: (self.config.state.get.filter(id).length > 0) ? self.config.state.get.filter(id) : self.util.get_filter_type(id),
            sortAscending: self.config.state.get.sort_ascending(id),
          };
          //console.log(new_config);
          state[id].isotope_object.arrange(new_config);
          setTimeout(() => {
            storm_eagle.equalize_heights.force_resize();
          },100);
        },100);
      },
      refresh_all: () => {
        document.querySelectorAll('[data-module="isotope"]').forEach((el) => {
          const id = el.getAttribute('id');
          self.config.state.set.filter(id);
          self.ui.refresh(id);
        });
      }
    },
    event_listeners : {
      initialize: (id) => {
        self.event_listeners.sort_by(id);
        self.event_listeners.sort_ascending(id);
        self.event_listeners.filters(id);
        self.event_listeners.select_all(id);
        self.event_listeners.or_and(id);
      },
      sort_by: (id) => {
        const { sort_by_id } = state[id];
        if (sort_by_id) {
          document.querySelectorAll(`#${sort_by_id} > input`).forEach((el) => {
            el.addEventListener('click', () => {
              self.config.state.set.sort_by(id);
              self.ui.refresh(id);
            });
          });
        }
      },
      sort_ascending: (id) => {
        const { sort_ascending_id } = state[id];
        if (sort_ascending_id) {
          document.querySelectorAll(`#${sort_ascending_id} > input`).forEach((el) => {
            el.addEventListener('click', () => {
              self.config.state.set.sort_ascending(id);
              self.ui.refresh(id);
            });
          });
        }
      },
      filters: (id) => {
        const { filter_groups_ids } = state[id];
        filter_groups_ids.forEach((filter_group_id) => {
          // if (document.querySelector(`#${filter_group_id}[data-module='autocomplete']`)) {
          //   document.querySelectorAll(`#${filter_group_id} > div > input`).forEach((el) => {
          //     el.addEventListener('focusout', () => {
          //       self.config.state.set.filter(id);
          //       self.ui.refresh(id);
          //     });
          //   });
          // } else {
            document.querySelectorAll(`#${filter_group_id} > input`).forEach((el) => {
              el.addEventListener('click', () => {
                self.config.state.set.filter(id);
                self.ui.refresh(id);
              });
            });
          //}
        });
      },
      select_all: (id) => {
        const { el } = state[id];
        el.querySelectorAll(`[data-module="select-all"]`).forEach((select_all_el) => {
          const select_all_radiobuttons_id = select_all_el.getAttribute('data-select-all-bind');
          el.querySelector(`#${select_all_radiobuttons_id} > [data-module='select-all.all']`).addEventListener('click', () => {
            self.config.state.set.filter(id);
            self.ui.refresh(id);
          });
          el.querySelector(`#${select_all_radiobuttons_id} > [data-module='select-all.none']`).addEventListener('click', () => {
            self.config.state.set.filter(id);
            self.ui.refresh(id);
          });
        });
      },
      or_and: (id) => {
        const { el } = state[id];
        el.querySelectorAll(`[data-module="select-all"]`).forEach((select_all_el) => {
          if (select_all_el.getAttribute('data-isotope-or-and-bind')) {
            const isotope_or_and_radiobuttons_id = select_all_el.getAttribute('data-isotope-or-and-bind');
            el.querySelector(`#${isotope_or_and_radiobuttons_id} > [data-module='isotope.or']`).addEventListener('click', () => {
              self.config.state.set.filter(id);
              self.ui.refresh(id);
            });
            el.querySelector(`#${isotope_or_and_radiobuttons_id} > [data-module='isotope.and']`).addEventListener('click', () => {
              self.config.state.set.filter(id);
              self.ui.refresh(id);
            });
          }
        });
      }
    },
    util: {
      get_filter_type: (id) => {
        const { initial_filter } = state[id];
        return (initial_filter === '*') ? '.isotope-no-results' : '*';
      },
      combine_obj_value: (obj) => {
        // Get an array of property values
        const values = Object.values(obj);

        // Use reduce to iterate through the arrays and combine values
        const combined_values = values.reduce((acc, current_value) => {
          // Ignore the current value if it is "*"
          if (current_value === "*") {
            return acc;
          }
          // Ensure that the current value is an array
          if (Array.isArray(current_value)) {
            // Combine each element of the current array with existing elements in acc
            return acc.flatMap((existing_value) =>
              current_value.map((current_element) => `${existing_value}${current_element}`)
            );
          }

          // If the current value is not an array, just concatenate it with existing elements in acc
          return acc.map((existing_value) => `${existing_value}${current_value}`);
        }, ['']); // Initialize with an array containing an empty string

        // Join the combined values with a comma and return
        return combined_values.join(",");
      },
    }
  };
});